import { type ValueOf } from "./types";

export const NOTIFICATION_TYPE = {
    /** Will only display title and no additional info */
    DEFAULT: "default",

    /** This is used for testing purpose. */
    LOGIN_WELCOME_BACK: "loginWelcomeBack",

    SIGNUP_WELCOME: "signupWelcome",

    RECEIVED_FRIEND_REQUEST: "receivedFriendRequest",
    ACCEPTED_FRIEND_REQUEST: "acceptedFriendRequest",
} as const;

export type NotificationType = ValueOf<typeof NOTIFICATION_TYPE>;
