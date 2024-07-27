import {
    Ref,
    Severity,
    getModelForClass,
    modelOptions,
    prop,
    PropType,
} from "@typegoose/typegoose";
import { UserDocument } from "./user";
import { Types } from "mongoose";

export const MATCH_STATUS = {
    PENDING: "pending",
    IN_PROGRESS: "inProgress",
    FINISHED: "finished",
    CANCELLED: "cancelled",
    TIMEOUT: "timeout",
    CHECKMATE: "checkmate",
    STALEMATE: "stalemate",
    DRAW: "draw",
} as const;

export const CHESS_PIECE_COLOR = {
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
export class ChessPieceDocument {
    /** Color of chess piece */
    @prop({
        type: String,
        enum: Object.values(CHESS_PIECE_COLOR),
        default: null,
    })
    color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR] | null;

    @prop({ type: String, enum: Object.values(CHESS_PIECES), default: null })
    type: (typeof CHESS_PIECES)[keyof typeof CHESS_PIECES] | null;
}

@modelOptions({
    schemaOptions: { timestamps: true },
    options: { allowMixed: Severity.ALLOW, customName: "matchMove" },
})
export class MatchMoveDocument {
    @prop({
        type: String,
        enum: Object.values(CHESS_PIECE_COLOR),
        required: true,
    })
    turn: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR];

    @prop({ type: ChessPieceDocument, required: true, dim: 2 }, PropType.ARRAY)
    board: ChessPieceDocument[][];
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

    @prop({
        type: String,
        enum: Object.values(CHESS_PIECE_COLOR),
        required: true,
    })
    player1Color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR];

    @prop({
        type: String,
        enum: Object.values(CHESS_PIECE_COLOR),
        required: true,
    })
    player2Color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR];

    @prop({
        type: String,
        enum: Object.values(MATCH_STATUS),
        default: MATCH_STATUS.PENDING,
    })
    status: (typeof MATCH_STATUS)[keyof typeof MATCH_STATUS];

    @prop(
        { type: () => [MatchMoveDocument], required: true, default: [] },
        PropType.ARRAY,
    )
    moves: MatchMoveDocument[];

    @prop({ type: String, enum: Object.values(CHESS_PIECE_COLOR) })
    winner?: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR];

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

export const Match = getModelForClass(MatchDocument);
export const MatchMove = getModelForClass(MatchMoveDocument);
export const ChessPiece = getModelForClass(ChessPieceDocument);

export function getInitialChessBoard() {
    // const board: {
    //     piece: null | {
    //         type: (typeof CHESS_PIECES)[keyof typeof CHESS_PIECES];
    //         color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR];
    //     };
    //     color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR];
    // }[][] = [];

    const board: ChessPieceDocument[][] = [];

    // Create a board with colors
    for (let i = 0; i < 8; i++) {
        board.push([]);
        for (let j = 0; j < 8; j++) {
            board[i].push({ type: null, color: null });
        }
    }

    // Add chess pieces
    board[0][0] = new ChessPiece({
        type: CHESS_PIECES.ROOK,
        color: CHESS_PIECE_COLOR.BLACK,
    });
    board[0][1] = new ChessPiece({
        type: CHESS_PIECES.KNIGHT,
        color: CHESS_PIECE_COLOR.BLACK,
    });
    board[0][2] = new ChessPiece({
        type: CHESS_PIECES.BISHOP,
        color: CHESS_PIECE_COLOR.BLACK,
    });
    board[0][3] = new ChessPiece({
        type: CHESS_PIECES.QUEEN,
        color: CHESS_PIECE_COLOR.BLACK,
    });
    board[0][4] = new ChessPiece({
        type: CHESS_PIECES.KING,
        color: CHESS_PIECE_COLOR.BLACK,
    });
    board[0][5] = new ChessPiece({
        type: CHESS_PIECES.BISHOP,
        color: CHESS_PIECE_COLOR.BLACK,
    });
    board[0][6] = new ChessPiece({
        type: CHESS_PIECES.KNIGHT,
        color: CHESS_PIECE_COLOR.BLACK,
    });
    board[0][7] = new ChessPiece({
        type: CHESS_PIECES.ROOK,
        color: CHESS_PIECE_COLOR.BLACK,
    });

    board[7][0] = new ChessPiece({
        type: CHESS_PIECES.ROOK,
        color: CHESS_PIECE_COLOR.WHITE,
    });
    board[7][1] = new ChessPiece({
        type: CHESS_PIECES.KNIGHT,
        color: CHESS_PIECE_COLOR.WHITE,
    });
    board[7][2] = new ChessPiece({
        type: CHESS_PIECES.BISHOP,
        color: CHESS_PIECE_COLOR.WHITE,
    });
    board[7][3] = new ChessPiece({
        type: CHESS_PIECES.QUEEN,
        color: CHESS_PIECE_COLOR.WHITE,
    });
    board[7][4] = new ChessPiece({
        type: CHESS_PIECES.KING,
        color: CHESS_PIECE_COLOR.WHITE,
    });
    board[7][5] = new ChessPiece({
        type: CHESS_PIECES.BISHOP,
        color: CHESS_PIECE_COLOR.WHITE,
    });
    board[7][6] = new ChessPiece({
        type: CHESS_PIECES.KNIGHT,
        color: CHESS_PIECE_COLOR.WHITE,
    });
    board[7][7] = new ChessPiece({
        type: CHESS_PIECES.ROOK,
        color: CHESS_PIECE_COLOR.WHITE,
    });

    // Add pawns
    for (let i = 0; i < 8; i++) {
        board[1][i] = new ChessPiece({
            type: CHESS_PIECES.PAWN,
            color: CHESS_PIECE_COLOR.BLACK,
        });
        board[6][i] = new ChessPiece({
            type: CHESS_PIECES.PAWN,
            color: CHESS_PIECE_COLOR.WHITE,
        });
    }

    return board;
}
