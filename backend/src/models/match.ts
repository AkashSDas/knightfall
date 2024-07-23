import {
    Ref,
    Severity,
    getModelForClass,
    modelOptions,
    prop,
} from "@typegoose/typegoose";
import { UserDocument } from "./user";
import { Types } from "mongoose";

export const MATCH_STATUS = {
    PENDING: "pending",
    IN_PROGRESS: "inProgress",
    FINISHED: "finished",
    CANCELLED: "cancelled",
} as const;

@modelOptions({
    schemaOptions: {
        timestamps: true,
        toJSON: { virtuals: true },
        typeKey: "type",
    },
    options: { allowMixed: Severity.ALLOW, customName: "match" },
})
export class MatchDocument {
    // =================================
    // Fields
    // =================================

    @prop({ ref: () => UserDocument, required: true })
    player1: Ref<UserDocument>;

    @prop({ ref: () => UserDocument, required: true })
    player2: Ref<UserDocument>;

    @prop({
        type: String,
        enum: Object.values(MATCH_STATUS),
        default: MATCH_STATUS.PENDING,
    })
    status: (typeof MATCH_STATUS)[keyof typeof MATCH_STATUS];

    // =================================
    // Virtuals
    // =================================

    _id!: Types.ObjectId;

    /** Get transformed MongoDB `_id` */
    get id() {
        return this._id.toHexString();
    }
}

export const Match = getModelForClass(MatchDocument);
