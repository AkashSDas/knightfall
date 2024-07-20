import {
    PropType,
    Ref,
    Severity,
    getModelForClass,
    modelOptions,
    prop,
} from "@typegoose/typegoose";
import { FriendDocument } from "./friend";
import { UserDocument } from "./user";
import { Types } from "mongoose";

export const MESSAGE_REACT_TYPE = {
    LIKE: "like",
    DISLIKE: "dislike",
    LAUGH: "laugh",
    SAD: "sad",
    ANGRY: "angry",
} as const;

@modelOptions({ schemaOptions: { timestamps: true } })
export class ReactionSubDocument {
    @prop({
        type: String,
        enum: Object.values(MESSAGE_REACT_TYPE),
        required: true,
    })
    type: (typeof MESSAGE_REACT_TYPE)[keyof typeof MESSAGE_REACT_TYPE];

    @prop({ ref: () => UserDocument, required: true })
    user: Ref<UserDocument>;
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class MessageSubDocument {
    // Other ideas:
    // - reply
    // - pin
    // - seen
    // - is edit
    // - is deleted

    @prop({ type: String, required: true })
    text: string;

    @prop(
        { type: () => [ReactionSubDocument], required: true, default: [] },
        PropType.ARRAY,
    )
    reactions: ReactionSubDocument[];

    @prop({ ref: () => UserDocument, required: true })
    user: Ref<UserDocument>;
}

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

/** User Typegoose Model */
export const DirectMessage = getModelForClass(DirectMessageDocument);
export const Message = getModelForClass(MessageSubDocument);
