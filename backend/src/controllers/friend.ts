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
        await Friend.updateOne(
            { fromUser: toUserId, toUser: user._id },
            { status: FRIEND_REQUEST_STATUS.ACCEPTED },
        );

        new Notifiy(new Types.ObjectId(toUserId))
            .createNotification({
                type: "acceptedFriendRequest",
                title: `${user.username} has accepted your friend request`,
                metadata: {
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
    } else {
        await Friend.create({ fromUser: user._id, toUser: toUserId });

        new Notifiy(new Types.ObjectId(toUserId))
            .createNotification({
                type: "receivedFriendRequest",
                title: `${user.username} sent you a friend request`,
                metadata: {
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
    const { requestStatus, type } = req.query;

    let typeQuery: Record<string, Types.ObjectId> = {
        toUser: (req.user as UserDocument)._id,
    };
    if (type === "from") {
        typeQuery = { fromUser: (req.user as UserDocument)._id };
    }

    const friends = Friend.find({ status: requestStatus, ...typeQuery })
        .populate("fromUser")
        .populate("toUser");

    return res.status(200).json({ friends });
}

export async function updateFriendRequestStatus(
    req: Request<unknown, unknown, schemas.UpdateFriendRequestStatus["body"]>,
    res: Response,
) {
    const { requestStatus, type } = req.body;

    let typeQuery: Record<string, Types.ObjectId> = {
        toUser: (req.user as UserDocument)._id,
    };
    if (type === "from") {
        typeQuery = { fromUser: (req.user as UserDocument)._id };
    }

    const friends = Friend.find({ status: requestStatus, ...typeQuery })
        .populate("fromUser")
        .populate("toUser");

    return res.status(200).json({ friends });
}
