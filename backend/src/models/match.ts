import { type Types } from "mongoose";

import {
    CHESS_PIECE_COLORS,
    CHESS_PIECES,
    type ChessColor,
    type ChessPiece as ChessPieceType,
    MATCH_STATUS,
    type MatchStatus,
} from "@/utils/match";
import {
    getModelForClass,
    modelOptions,
    prop,
    PropType,
    Ref,
    Severity,
} from "@typegoose/typegoose";

import { UserDocument } from "./user";

/** This sub-document represents box in the chess board. */
@modelOptions({
    schemaOptions: { timestamps: true },
    options: { allowMixed: Severity.ALLOW, customName: "chessPiece" },
})
export class ChessPieceSubDocument {
    /** Color of chess piece. */
    @prop({
        type: String,
        enum: Object.values(CHESS_PIECE_COLORS),
        default: null,
    })
    color?: ChessColor | null;

    @prop({
        type: String,
        enum: Object.values(CHESS_PIECES),
        default: null,
    })
    type?: ChessPieceType | null;
}

/**
 * This sub-document represents a move which has turn of the player and state
 * of the board after move was made.
 **/
@modelOptions({
    schemaOptions: { timestamps: true },
    options: { allowMixed: Severity.ALLOW, customName: "matchMove" },
})
export class MatchMoveDocument {
    @prop({
        type: String,
        enum: Object.values(CHESS_PIECE_COLORS),
        required: true,
    })
    turn: ChessColor;

    /** This represent the chess board state after the move was made. */
    @prop(
        { type: ChessPieceSubDocument, required: true, dim: 2 },
        PropType.ARRAY,
    )
    board: ChessPieceSubDocument[][];
}

/** This document indicates a chess game between 2 players. */
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
        enum: Object.values(CHESS_PIECE_COLORS),
        required: true,
    })
    player1Color: ChessColor;

    @prop({
        type: String,
        enum: Object.values(CHESS_PIECE_COLORS),
        required: true,
    })
    player2Color: ChessColor;

    @prop({
        type: String,
        enum: Object.values(MATCH_STATUS),
        default: MATCH_STATUS.PENDING,
    })
    status: MatchStatus;

    @prop(
        { type: () => [MatchMoveDocument], required: true, default: [] },
        PropType.ARRAY,
    )
    moves: MatchMoveDocument[];

    @prop({ type: String, enum: Object.values(CHESS_PIECE_COLORS) })
    winner?: ChessColor;

    @prop({ type: Date })
    startedAt?: Date;

    // =================================
    // Virtuals
    // =================================

    _id!: Types.ObjectId;

    /** Get transformed MongoDB `_id` */
    get id() {
        return this._id.toHexString();
    }
}

/** This document indicates a chess game between 2 players. */
export const Match = getModelForClass(MatchDocument);

/**
 * This sub-document represents a move which has turn of the player and state
 * of the board after move was made.
 **/
export const MatchMove = getModelForClass(MatchMoveDocument);

/** This sub-document represents box in the chess board. */
export const ChessPiece = getModelForClass(ChessPieceSubDocument);
