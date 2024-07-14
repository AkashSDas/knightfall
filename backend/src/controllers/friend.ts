import { Request, Response } from "express";
import * as schemas from "../schema/friend";
import { FRIEND_REQUEST_STATUS, Friend } from "../models/friend";
import { User, UserDocument } from "../models/user";
import { BaseApiError } from "../utils/errors";
import { Types } from "mongoose";

export async function sendFriendRequest(
    req: Request<schemas.SendFriendRequest["query"]>,
    res: Response,
) {
    const exists = User.exists({ _id: req.query.toUserId });
    if (!exists) {
        throw new BaseApiError(
            400,
            "User with 'query.userId' does not exists.",
        );
    }

    const [fromExists, toExists] = await Promise.all([
        Friend.findOne(
            {
                fromUser: (req.user as UserDocument)._id,
                toUser: req.query.toUserId,
            },
            { status: 1 },
        ),
        Friend.findOne(
            {
                fromUser: req.query.toUserId,
                toUser: (req.user as UserDocument)._id,
            },
            { status: 1 },
        ),
    ]);

    if (fromExists) {
        return res
            .status(400)
            .json({ message: "Friend request already sent." });
    } else if (toExists) {
        await Friend.updateOne(
            {
                fromUser: req.query.toUserId,
                toUser: (req.user as UserDocument)._id,
            },
            { status: FRIEND_REQUEST_STATUS.ACCEPTED },
        );

        return res.status(200).json({
            message: "You had a friend request. It has been accepted.",
            acceptedPending: true,
        });
    } else {
        await Friend.create({
            fromUser: (req.user as UserDocument)._id,
            toUser: req.query.toUserId,
        });

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
