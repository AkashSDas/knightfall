import {
    Ref,
    Severity,
    getModelForClass,
    modelOptions,
    prop,
} from "@typegoose/typegoose";
import { UserDocument } from "./user";
import { Types } from "mongoose";

export const FRIEND_REQUEST_STATUS = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
} as const;

@modelOptions({
    schemaOptions: {
        timestamps: true,
        toJSON: { virtuals: true },
        typeKey: "type",
    },
    options: { allowMixed: Severity.ALLOW, customName: "friend" },
})
export class FriendDocument {
    // =================================
    // Fields
    // =================================

    @prop({ ref: () => UserDocument, required: true })
    fromUser: Ref<UserDocument>;

    @prop({ ref: () => UserDocument, required: true })
    toUser: Ref<UserDocument>;

    @prop({
        type: String,
        enum: Object.values(FRIEND_REQUEST_STATUS),
        default: FRIEND_REQUEST_STATUS.PENDING,
        required: true,
    })
    status: (typeof FRIEND_REQUEST_STATUS)[keyof typeof FRIEND_REQUEST_STATUS];

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
export const Friend = getModelForClass(FriendDocument);
