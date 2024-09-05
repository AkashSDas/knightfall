import * as z from "zod";

import { NOTIFICATION_TYPE } from "./notification";

// ===================================
// Schemas
// ===================================

// =========== User ===========

/** This represents a user info from backend. */
export const UserSchema = z.object({
    id: z.string(),
    username: z.string().optional(),
    email: z.string(),
    isBanned: z.boolean(),
    profilePic: z.object({ URL: z.string(), id: z.string().optional() }),
    oauthProviders: z.array(
        z.object({ sid: z.string(), provider: z.string() })
    ),
    winPoints: z.number().min(0),
    achievements: z.array(z.string()),
    createdAt: z.string().transform((v) => new Date(v)),
    updatedAt: z.string().transform((v) => new Date(v)),
});

// =========== Notification ===========

const NotificationBaseSchema = z.object({
    id: z.string(),
    user: z.string(),
    title: z.string(),
    seen: z.boolean(),
    createdAt: z.string().transform((val) => new Date(val)),
});

const DefaultNotificationSchema = z
    .object({ type: z.literal(NOTIFICATION_TYPE.DEFAULT) })
    .merge(NotificationBaseSchema);

const LoginWelcomeBackNotificationSchema = z
    .object({ type: z.literal(NOTIFICATION_TYPE.LOGIN_WELCOME_BACK) })
    .merge(NotificationBaseSchema);

const SignupWelcomeNotificationSchema = z
    .object({ type: z.literal(NOTIFICATION_TYPE.SIGNUP_WELCOME) })
    .merge(NotificationBaseSchema);

const ReceivedFriendRequestNotificationSchema = z
    .object({
        type: z.literal(NOTIFICATION_TYPE.RECEIVED_FRIEND_REQUEST),
        metadata: z.object({
            friendRequestId: z.string(),
            userId: z.string(),
            profilePicURL: z.string(),
        }),
    })
    .merge(NotificationBaseSchema);

const AcceptedFriendRequestNotificationSchema = z
    .object({
        type: z.literal(NOTIFICATION_TYPE.ACCEPTED_FRIEND_REQUEST),
        metadata: z.object({
            friendRequestId: z.string(),
            userId: z.string(),
            profilePicURL: z.string(),
        }),
    })
    .merge(NotificationBaseSchema);

export const NotificationSchema = z.union([
    DefaultNotificationSchema,
    LoginWelcomeBackNotificationSchema,
    SignupWelcomeNotificationSchema,
    ReceivedFriendRequestNotificationSchema,
    AcceptedFriendRequestNotificationSchema,
]);

// =========== Direct Message ===========

const MessageReaction = z.any();

const Message = z.object({
    _id: z.string(),
    user: z.string(),
    text: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    reactions: z.array(MessageReaction),
});

export const DirectMessage = z.object({
    id: z.string(),
    friend: z.string(),
    previousMessage: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    messages: z.array(Message),
});

// ===================================
// Schemas
// ===================================

export type User = z.infer<typeof UserSchema>;

export type Notification = z.infer<typeof NotificationSchema>;

export type DirectMessage = z.infer<typeof DirectMessage>;
export type Message = z.infer<typeof Message>;
export type MessageRection = z.infer<typeof MessageReaction>;
