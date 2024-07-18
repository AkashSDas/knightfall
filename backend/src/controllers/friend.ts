import { Request, Response } from "express";
import * as schemas from "../schema/friend";
import { FRIEND_REQUEST_STATUS, Friend } from "../models/friend";
import { User, UserDocument } from "../models/user";
import { BaseApiError } from "../utils/errors";
import { Types } from "mongoose";
import { Notifiy } from "../utils/notification";
import { logger } from "../utils/logger";

export async function sendFriendRequest(
    req: Request<unknown, unknown, schemas.SendFriendRequest["body"]>,
    res: Response,
) {
    const user = req.user as UserDocument;
    const { toUserId } = req.body;

    const exists = User.exists({ _id: toUserId });
    if (!exists) {
        throw new BaseApiError(400, "User with 'body.userId' does not exists.");
    }

    const [fromExists, toExists] = await Promise.all([
        Friend.findOne({ fromUser: user._id, toUser: toUserId }, { status: 1 }),
        Friend.findOne({ fromUser: toUserId, toUser: user._id }, { status: 1 }),
    ]);

    if (fromExists) {
        return res
            .status(400)
            .json({ message: "Friend request already sent." });
    } else if (toExists) {
        const friend = await Friend.findOneAndUpdate(
            { fromUser: toUserId, toUser: user._id },
            { status: FRIEND_REQUEST_STATUS.ACCEPTED },
        );

        if (friend) {
            new Notifiy(new Types.ObjectId(toUserId))
                .createNotification({
                    type: "acceptedFriendRequest",
                    title: `${user.username} has accepted your friend request`,
                    metadata: {
                        friendRequestId: friend._id.toString(),
                        userId: user._id.toString(),
                        profilePicURL: user.profilePic.URL,
                    },
                })
                .then((instance) => instance.sendNotification())
                .catch((e) => logger.error(`[👋 FAILED notification]: ${e}`));

            return res.status(200).json({
                message: "You had a friend request. It has been accepted.",
                acceptedPending: true,
            });
        }

        throw new BaseApiError(400, "No friend request found.");
    } else {
        const friend = await Friend.create({
            fromUser: user._id,
            toUser: toUserId,
        });

        new Notifiy(new Types.ObjectId(toUserId))
            .createNotification({
                type: "receivedFriendRequest",
                title: `${user.username} sent you a friend request`,
                metadata: {
                    friendRequestId: friend._id.toString(),
                    userId: user._id.toString(),
                    profilePicURL: user.profilePic.URL,
                },
            })
            .then((instance) => instance.sendNotification())
            .catch((e) => logger.error(`[👋 FAILED notification]: ${e}`));

        return res.status(200).json({ message: "Friend request sent." });
    }
}

export async function getLoggedInUserFriends(
    req: Request<schemas.GetLoggedInUserFriends["query"]>,
    res: Response,
) {
    // Get friend requests
    // 1. Where the `status` is accepted. There it doesn't matter whether
    // `type` is "from" or "to" as the `status` is accepted.
    // 2. `type` as "from" means where the request is FROM the logged in user
    // 3. `type` as "to" means where the request is TO the logged in user
    // 4. With the combination of `type` and `requestStatus` like pending, rejected
    // we can get request other requests like requests that the user
    // has received or has sent, or like requests that user has rejected

    const { requestStatus, type } = req.query;

    if (requestStatus === FRIEND_REQUEST_STATUS.ACCEPTED) {
        const friends = await Friend.find({ status: requestStatus })
            .populate("fromUser")
            .populate("toUser");

        return res.status(200).json({ friends });
    } else {
        let typeQuery: Record<string, Types.ObjectId> = {
            toUser: (req.user as UserDocument)._id,
        };
        if (type === "from") {
            typeQuery = { fromUser: (req.user as UserDocument)._id };
        }

        const friends = await Friend.find({
            status: requestStatus,
            ...typeQuery,
        })
            .populate("fromUser")
            .populate("toUser");

        return res.status(200).json({ friends });
    }
}

export async function updateFriendRequestStatus(
    req: Request<unknown, unknown, schemas.UpdateFriendRequestStatus["body"]>,
    res: Response,
) {
    const { requestStatus, friendId } = req.body;

    const friend = await Friend.findOneAndUpdate(
        { _id: friendId },
        { status: requestStatus },
    );

    if (!friend) {
        throw new BaseApiError(400, "Friend request does not exists.");
    }

    if (friend.status === FRIEND_REQUEST_STATUS.ACCEPTED) {
        new Notifiy(new Types.ObjectId(friend.fromUser as unknown as string))
            .createNotification({
                type: "acceptedFriendRequest",
                title: `${(req.user as UserDocument).username} has accepted your friend request`,
                metadata: {
                    friendRequestId: friend._id.toString(),
                    userId: (req.user as UserDocument)._id.toString(),
                    profilePicURL: (req.user as UserDocument).profilePic.URL,
                },
            })
            .then((instance) => instance.sendNotification())
            .catch((e) => logger.error(`[👋 FAILED notification]: ${e}`));
    }

    return res.status(200).json({ message: "Friend request updated." });
}

export async function searchFriendByUsernameOrUserIdCtrl(
    req: Request<
        unknown,
        unknown,
        unknown,
        schemas.SearchFriendByUsernameOrUserId["query"]
    >,
    res: Response,
) {
    const { queryText } = req.query;

    if (Types.ObjectId.isValid(queryText)) {
        const friends = await Friend.find({
            $or: [
                { toUser: new Types.ObjectId(queryText) },
                { fromUesr: new Types.ObjectId(queryText) },
            ],
            status: FRIEND_REQUEST_STATUS.ACCEPTED,
        });

        return res.status(200).json({ friends });
    } else {
        const friends = await Friend.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "fromUser",
                    foreignField: "_id",
                    as: "fromUser",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "toUser",
                    foreignField: "_id",
                    as: "toUser",
                },
            },
            {
                $match: {
                    $or: [
                        {
                            "fromUser.username": {
                                $regex: queryText,
                                $options: "i",
                            },
                        },
                        {
                            "toUser.username": {
                                $regex: queryText,
                                $options: "i",
                            },
                        },
                    ],
                    status: FRIEND_REQUEST_STATUS.ACCEPTED,
                },
            },
            {
                $project: {
                    fromUser: { $arrayElemAt: ["$fromUser", 0] },
                    toUser: { $arrayElemAt: ["$toUser", 0] },
                    id: "$_id",
                    status: "$status",
                    createdAt: "$createdAt",
                },
            },
            // add id field as _id in fromUser and toUser
            {
                $addFields: {
                    "fromUser.id": "$fromUser._id",
                    "toUser.id": "$toUser._id",
                },
            },
            { $sort: { createdAt: -1 } },
        ]);

        return res.status(200).json({ friends });
    }
}
