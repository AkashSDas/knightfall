import {
    Ref,
    Severity,
    getModelForClass,
    modelOptions,
    prop,
} from "@typegoose/typegoose";
import { SchemaTypes, type Types } from "mongoose";

import { type NotificationType } from "@/utils/notification";

import { UserDocument } from "./user";

/**
 * Types of notification supported.
 * It's kept here to avoid circular dependency issue between utils/notification.ts
 * and models/notification.ts
 **/
export const NOTIFICATION_TYPES = {
    /** Will only display title and no additional info */
    DEFAULT: "default",

    /** This is used for testing purpose. */
    LOGIN_WELCOME_BACK: "loginWelcomeBack",

    SIGNUP_WELCOME: "signupWelcome",

    RECEIVED_FRIEND_REQUEST: "receivedFriendRequest",
    ACCEPTED_FRIEND_REQUEST: "acceptedFriendRequest",
} as const;

@modelOptions({
    schemaOptions: {
        timestamps: true,
        toJSON: { virtuals: true },
        typeKey: "type",
    },
    options: { allowMixed: Severity.ALLOW, customName: "notification" },
})
export class NotificationDocument {
    // =================================
    // Fields
    // =================================

    @prop({ ref: () => UserDocument, required: true })
    user: Ref<UserDocument>;

    @prop({
        type: String,
        trim: true,
        maxlength: [256, "Title must be less than 256 characters long"],
        minlength: [2, "Title must be more than 2 characters long"],
        required: true,
    })
    title: string;

    @prop({ type: Boolean, default: false, required: true })
    seen: boolean;

    @prop({
        type: String,
        required: true,
        default: NOTIFICATION_TYPES.DEFAULT,
        enum: Object.values(NOTIFICATION_TYPES),
    })
    type: NotificationType;

    @prop({ type: SchemaTypes.Mixed, required: true, default: {} })
    metadata: Record<string, unknown>;

    @prop({ type: Date })
    maxAge: Date;

    // =================================
    // Static methods
    // =================================

    // =================================
    // Virtuals
    // =================================

    _id!: Types.ObjectId;

    /** Get transformed MongoDB `_id` */
    get id() {
        return this._id.toHexString();
    }
}

/** User Typegoose Model */
export const Notification = getModelForClass(NotificationDocument);
