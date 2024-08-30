import type { ChessPieceSubDocument } from "@/models/match";

import type { ValueOf } from "./types";

// ====================================
// Constants
// ====================================

/** Chess game status. */
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

export const CHESS_PIECE_COLORS = {
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

export type MatchStatus = ValueOf<typeof MATCH_STATUS>;
export type ChessColor = ValueOf<typeof CHESS_PIECE_COLORS>;
export type ChessPiece = ValueOf<typeof CHESS_PIECES>;

// ====================================
// Helpers
// ====================================

/** Create a chessboard with piece in place. */
export function getInitialChessBoard(): ChessPieceSubDocument[][] {
    const board: ChessPieceSubDocument[][] = [];

    // Create a board
    for (let i = 0; i < 8; i++) {
        board.push([]);
        for (let j = 0; j < 8; j++) {
            board[i].push({ type: null, color: null });
        }
    }

    // Add chess pieces
    board[0][0] = {
        type: CHESS_PIECES.ROOK,
        color: CHESS_PIECE_COLORS.BLACK,
    };
    board[0][1] = {
        type: CHESS_PIECES.KNIGHT,
        color: CHESS_PIECE_COLORS.BLACK,
    };
    board[0][2] = {
        type: CHESS_PIECES.BISHOP,
        color: CHESS_PIECE_COLORS.BLACK,
    };
    board[0][3] = {
        type: CHESS_PIECES.QUEEN,
        color: CHESS_PIECE_COLORS.BLACK,
    };
    board[0][4] = {
        type: CHESS_PIECES.KING,
        color: CHESS_PIECE_COLORS.BLACK,
    };
    board[0][5] = {
        type: CHESS_PIECES.BISHOP,
        color: CHESS_PIECE_COLORS.BLACK,
    };
    board[0][6] = {
        type: CHESS_PIECES.KNIGHT,
        color: CHESS_PIECE_COLORS.BLACK,
    };
    board[0][7] = {
        type: CHESS_PIECES.ROOK,
        color: CHESS_PIECE_COLORS.BLACK,
    };

    board[7][0] = {
        type: CHESS_PIECES.ROOK,
        color: CHESS_PIECE_COLORS.WHITE,
    };
    board[7][1] = {
        type: CHESS_PIECES.KNIGHT,
        color: CHESS_PIECE_COLORS.WHITE,
    };
    board[7][2] = {
        type: CHESS_PIECES.BISHOP,
        color: CHESS_PIECE_COLORS.WHITE,
    };
    board[7][3] = {
        type: CHESS_PIECES.QUEEN,
        color: CHESS_PIECE_COLORS.WHITE,
    };
    board[7][4] = {
        type: CHESS_PIECES.KING,
        color: CHESS_PIECE_COLORS.WHITE,
    };
    board[7][5] = {
        type: CHESS_PIECES.BISHOP,
        color: CHESS_PIECE_COLORS.WHITE,
    };
    board[7][6] = {
        type: CHESS_PIECES.KNIGHT,
        color: CHESS_PIECE_COLORS.WHITE,
    };
    board[7][7] = {
        type: CHESS_PIECES.ROOK,
        color: CHESS_PIECE_COLORS.WHITE,
    };

    // Add pawns
    for (let i = 0; i < 8; i++) {
        board[1][i] = {
            type: CHESS_PIECES.PAWN,
            color: CHESS_PIECE_COLORS.BLACK,
        };
        board[6][i] = {
            type: CHESS_PIECES.PAWN,
            color: CHESS_PIECE_COLORS.WHITE,
        };
    }

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            console.log(i, j, board[i][j]);
        }
    }

    return board;
}
