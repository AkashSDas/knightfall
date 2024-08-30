import type { Types } from "mongoose";

import {
    Notification,
    NOTIFICATION_TYPES,
    NotificationDocument,
} from "@/models/notification";
import { io } from "@/websocket";

import { logger } from "./logger";
import type { ValueOf } from "./types";

/** Default limit of notificiations to fetch in `getLoggedInUserNotificationsCtrl` */
export const GET_LOGGED_IN_USER_NOTIFICATIONS_LIMIT = 10;

/** Default offset of notificiations to fetch in `getLoggedInUserNotificationsCtrl` */
export const GET_LOGGED_IN_USER_NOTIFICATIONS_OFFSET = 0;

export type NotificationType = ValueOf<typeof NOTIFICATION_TYPES>;

type DefaultNotification = {
    type: typeof NOTIFICATION_TYPES.DEFAULT;
    title: string;
    maxAge?: Date;
};

type LoginWelcomeBackNotification = {
    type: typeof NOTIFICATION_TYPES.LOGIN_WELCOME_BACK;
    title: string;
    maxAge: Date;
};

type SignupWelcomeNotification = {
    type: typeof NOTIFICATION_TYPES.SIGNUP_WELCOME;
    title: string;
};

type ReceivedFriendRequestNotification = {
    type: typeof NOTIFICATION_TYPES.RECEIVED_FRIEND_REQUEST;
    title: string;
    metadata: {
        friendRequestId: string;
        userId: string;
        profilePicURL: string;
    };
};

type AcceptedFriendRequestNotification = {
    type: typeof NOTIFICATION_TYPES.ACCEPTED_FRIEND_REQUEST;
    title: string;
    metadata: {
        friendRequestId: string;
        userId: string;
        profilePicURL: string;
    };
};

type AppNotification =
    | DefaultNotification
    | LoginWelcomeBackNotification
    | SignupWelcomeNotification
    | ReceivedFriendRequestNotification
    | AcceptedFriendRequestNotification;

/**
 * Helper class to create and send notification via WebSockets.
 * Channel name is `notification_${this.userId}`
 **/
export class Notifiy {
    userId: Types.ObjectId;
    payload: NotificationDocument | null;

    constructor(userId: Types.ObjectId) {
        this.userId = userId;
        this.payload = null;
    }

    /** Save a notification in MongoDB and return `this` */
    async createNotification(payload: AppNotification) {
        this.payload = await Notification.create({
            ...payload,
            user: this.userId,
        });

        return this;
    }

    /**
     * Send notification to `this.userId` with `this.payload` which is set
     * by `this.createNotification` method.
     *
     * Notification is sent to channel `notification_${this.userId}`.
     **/
    sendNotification() {
        if (!this.payload) {
            throw new Error("Notification payload is empty");
        }

        const roomName = `notification_${this.userId}`;
        logger.info(`[👋 SEND notification]: ${roomName}`);
        io.to(roomName).emit("notification", this.payload);
    }
}
