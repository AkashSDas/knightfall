import { Types } from "mongoose";
import {
    Notification as AppNotification,
    NOTIFICATION_TYPE,
    Notification,
    NotificationDocument,
} from "../models/notification";
import { io } from "../websocket";

/** Default limit of notificiations to fetch in `getLoggedInUserNotificationsCtrl` */
export const GET_LOGGED_IN_USER_NOTIFICATIONS_LIMIT = 10;

/** Default offset of notificiations to fetch in `getLoggedInUserNotificationsCtrl` */
export const GET_LOGGED_IN_USER_NOTIFICATIONS_OFFSET = 0;

type DefaultNotification = {
    type: typeof NOTIFICATION_TYPE.DEFAULT;
    title: string;
    maxAge?: Date;
};

type LoginWelcomeBackNotification = {
    type: typeof NOTIFICATION_TYPE.LOGIN_WELCOME_BACK;
    title: string;
    maxAge: Date;
};

type SignupWelcomeNotification = {
    type: typeof NOTIFICATION_TYPE.SIGNUP_WELCOME;
    title: string;
};

type AppNotification =
    | DefaultNotification
    | LoginWelcomeBackNotification
    | SignupWelcomeNotification;

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
            throw new Error(
                "Notification payload is empty. First call 'sendNotification' on the instance",
            );
        }

        io.to(`notification_${this.userId}`).emit("notification", this.payload);
    }
}
