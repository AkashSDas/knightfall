import {
    PropType,
    Ref,
    Severity,
    getModelForClass,
    modelOptions,
    prop,
} from "@typegoose/typegoose";
import { Types } from "mongoose";

import {
    MESSAGE_REACT_TYPE,
    type MessageReactType,
} from "@/utils/direct-message";

import { FriendDocument } from "./friend";
import { UserDocument } from "./user";

/** This is a sub-document for a reaction on a message. */
@modelOptions({
    schemaOptions: { timestamps: true, toJSON: { virtuals: true } },
})
export class ReactionSubDocument {
    @prop({
        type: String,
        enum: Object.values(MESSAGE_REACT_TYPE),
        required: true,
    })
    type: MessageReactType;

    @prop({ ref: () => UserDocument, required: true })
    user: Ref<UserDocument>;

    // =================================
    // Virtuals
    // =================================

    _id!: Types.ObjectId;

    /** Get transformed MongoDB `_id` */
    get id() {
        return this._id.toHexString();
    }
}

/** This is a sub-document which contains message between 2 users. */
@modelOptions({
    schemaOptions: { timestamps: true, toJSON: { virtuals: true } },
})
export class MessageSubDocument {
    // Other fields that can be added are:
    // - reply
    // - pin
    // - seen
    // - is edit
    // - is deleted

    @prop({
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1024,
        trim: true,
    })
    text: string;

    @prop(
        { type: () => [ReactionSubDocument], required: true, default: [] },
        PropType.ARRAY,
    )
    reactions: ReactionSubDocument[];

    @prop({ ref: () => UserDocument, required: true })
    user: Ref<UserDocument>;
}

/**
 * Direct message is a document which contains at most `n` number of messages between
 * 2 users. It also has reference to previous DM document (if any). This helps us
 * contain more messages in a single document and fetch older ones as needed using
 * previous DMs ref.
 *
 * This structure increases the amount of messages we can read at a given time.
 **/
@modelOptions({
    schemaOptions: {
        timestamps: true,
        toJSON: { virtuals: true },
        typeKey: "type",
    },
    options: { allowMixed: Severity.ALLOW, customName: "directMessage" },
})
export class DirectMessageDocument {
    // =================================
    // Fields
    // =================================

    @prop({ ref: () => FriendDocument, required: true })
    friend: Ref<FriendDocument>;

    @prop(
        { type: () => [MessageSubDocument], required: true, default: [] },
        PropType.ARRAY,
    )
    messages: MessageSubDocument[];

    /**
     * Messages between 2 users are divided into many `DirectMessage` documents.
     * The latest `createdAt` will be the latest set of messages. Each `DirectMessage`
     * be have a reference to its previous message section (`previousMessage`).
     *
     * So we get the latest messages (`DirectMessage`) then using its `previousMessage`
     * (if exists) we get previous (`DirectMessage`) and so on and on
     *
     * Whenever inserting message inside a `DirectMessage` we check a "condition". If
     * this condition matches then we create a new `DirectMessage` and insert messages
     * there and else we add that message in the latest `DirectMessage`.
     *
     */
    @prop({ ref: () => DirectMessageDocument })
    previousMessage: Ref<DirectMessageDocument>;

    // =================================
    // Virtuals
    // =================================

    _id!: Types.ObjectId;

    /** Get transformed MongoDB `_id` */
    get id() {
        return this._id.toHexString();
    }
}

/** A document which contains `n` number of messages between 2 users. */
export const DirectMessage = getModelForClass(DirectMessageDocument);

/** A single message between 2 users. */
export const Message = getModelForClass(MessageSubDocument);
