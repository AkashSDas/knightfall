import {
    Ref,
    Severity,
    getModelForClass,
    modelOptions,
    prop,
} from "@typegoose/typegoose";
import { type Types } from "mongoose";

import {
    FRIEND_REQUEST_STATUS,
    type FriendRequestStatus,
} from "@/utils/friend";

import { UserDocument } from "./user";

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
    status: FriendRequestStatus;

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
