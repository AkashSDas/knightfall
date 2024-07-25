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

export const CHESS_COLOR = {
    WHITE: "white",
    BLACK: "black",
} as const;

export const CHESS_PIECES = {
    BISHOP: "bishop",
    KING: "king",
    KNIGHT: "knight",
    PAWN: "pawn",
    QUEEN: "queen",
    ROOK: "rook",
} as const;

@modelOptions({
    schemaOptions: { timestamps: true },
    options: { allowMixed: Severity.ALLOW, customName: "chessBoardBlock" },
})
export class ChessBoardBlockDocument {
    /** Color of chess piece */
    @prop({ type: String, enum: Object.values(CHESS_COLOR), required: true })
    color: (typeof CHESS_COLOR)[keyof typeof CHESS_COLOR];

    @prop({ type: String, enum: Object.values(CHESS_PIECES), required: true })
    piece: (typeof CHESS_PIECES)[keyof typeof CHESS_PIECES];
}

@modelOptions({
    schemaOptions: { timestamps: true },
    options: { allowMixed: Severity.ALLOW, customName: "matchMove" },
})
export class MatchMoveDocument {
    @prop({ type: String, enum: Object.values(CHESS_COLOR), required: true })
    turn: (typeof CHESS_COLOR)[keyof typeof CHESS_COLOR];

    @prop({ type: ChessBoardBlockDocument, required: true, dim: 2 })
    board: ChessBoardBlockDocument[][];
}

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

    @prop({ type: String, enum: Object.values(CHESS_COLOR), required: true })
    player1Color: (typeof CHESS_COLOR)[keyof typeof CHESS_COLOR];

    @prop({ type: String, enum: Object.values(CHESS_COLOR), required: true })
    player2Color: (typeof CHESS_COLOR)[keyof typeof CHESS_COLOR];

    @prop({
        type: String,
        enum: Object.values(MATCH_STATUS),
        default: MATCH_STATUS.PENDING,
    })
    status: (typeof MATCH_STATUS)[keyof typeof MATCH_STATUS];

    @prop({ type: () => [MatchMoveDocument], required: true })
    moves: MatchMoveDocument;

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
export const MatchMove = getModelForClass(MatchMoveDocument);
export const ChessBoardBlock = getModelForClass(ChessBoardBlockDocument);
