import { Request, Response } from "express";
import * as schemas from "../schema/notification";
import { UserDocument } from "../models/user";
import { Notification } from "../models/notification";
import {
    GET_LOGGED_IN_USER_NOTIFICATIONS_LIMIT,
    GET_LOGGED_IN_USER_NOTIFICATIONS_OFFSET,
} from "../utils/notification";

/**
 * Get notifications of logged in user from latest to oldest in a paginated fashion
 **/
export async function getLoggedInUserNotificationsCtrl(
    req: Request<
        unknown,
        unknown,
        unknown,
        schemas.GetLoggedInUserNotificationsSchema["query"]
    >,
    res: Response,
) {
    const { limit, offset } = req.query;
    const userId = (req.user as UserDocument)._id;

    const now = new Date();

    const filter = {
        user: userId,
        $or: [{ maxAge: { $exists: false } }, { maxAge: { $gt: now } }],
    };

    const [totalCount, notifications] = await Promise.all([
        Notification.countDocuments(filter),
        Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(offset ?? GET_LOGGED_IN_USER_NOTIFICATIONS_OFFSET)
            .limit(limit ?? GET_LOGGED_IN_USER_NOTIFICATIONS_LIMIT),
    ]);

    // Setting the X-Total-Count header
    res.set("X-Total-Count", totalCount.toString());

    return res
        .status(200)
        .json({ notifications, totalCount, nextPageOffset: offset + limit });
}

export async function markNotificationsAsSeenCtrl(
    req: Request<
        unknown,
        unknown,
        unknown,
        schemas.MarkNotificationsAsSeenSchema["query"]
    >,
    res: Response,
) {
    const userId = (req.user as UserDocument)._id;
    const { markAll, ids } = req.query;

    if (markAll === "true") {
        await Notification.updateMany(
            { user: userId, seen: false },
            { seen: true },
        );
    } else {
        await Notification.updateMany(
            { _id: { $in: ids }, user: userId, seen: false },
            { seen: true },
        );
    }

    return res.status(204).end();
}
