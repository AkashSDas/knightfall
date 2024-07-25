import { createSlice } from "@reduxjs/toolkit";
import { CHESS_PIECES, CHESS_PIECE_COLOR } from "../../utils/chess";
import { v4 as uuid } from "uuid";
import { RootState } from "..";

type ChessPiece = {
    type: (typeof CHESS_PIECES)[keyof typeof CHESS_PIECES];
    color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR];
};

type ChessBlock = {
    id: string;
    piece: ChessPiece | null;
    color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR];
    selected: boolean;
    showPath: boolean;
    showExplosion: boolean;
};

function getInitialChessBoard(): ChessBlock[][] {
    const board: ChessBlock[][] = [];

    // Create a board with colors
    for (let i = 0; i < 8; i++) {
        board.push([]);
        for (let j = 0; j < 8; j++) {
            const color =
                (i + j) % 2 == 0
                    ? CHESS_PIECE_COLOR.BLACK
                    : CHESS_PIECE_COLOR.WHITE;

            board[i].push({
                id: uuid(),
                piece: null,
                selected: false,
                color: color,
                showPath: true,
                showExplosion: false,
            });
        }
    }

    // Add chess pieces
    board[0][0].piece = {
        type: CHESS_PIECES.ROOK,
        color: CHESS_PIECE_COLOR.BLACK,
    };
    board[0][1].piece = {
        type: CHESS_PIECES.KNIGHT,
        color: CHESS_PIECE_COLOR.BLACK,
    };
    board[0][2].piece = {
        type: CHESS_PIECES.BISHOP,
        color: CHESS_PIECE_COLOR.BLACK,
    };
    board[0][3].piece = {
        type: CHESS_PIECES.QUEEN,
        color: CHESS_PIECE_COLOR.BLACK,
    };
    board[0][4].piece = {
        type: CHESS_PIECES.KING,
        color: CHESS_PIECE_COLOR.BLACK,
    };
    board[0][5].piece = {
        type: CHESS_PIECES.BISHOP,
        color: CHESS_PIECE_COLOR.BLACK,
    };
    board[0][6].piece = {
        type: CHESS_PIECES.KNIGHT,
        color: CHESS_PIECE_COLOR.BLACK,
    };
    board[0][7].piece = {
        type: CHESS_PIECES.ROOK,
        color: CHESS_PIECE_COLOR.BLACK,
    };

    board[7][0].piece = {
        type: CHESS_PIECES.ROOK,
        color: CHESS_PIECE_COLOR.WHITE,
    };
    board[7][1].piece = {
        type: CHESS_PIECES.KNIGHT,
        color: CHESS_PIECE_COLOR.WHITE,
    };
    board[7][2].piece = {
        type: CHESS_PIECES.BISHOP,
        color: CHESS_PIECE_COLOR.WHITE,
    };
    board[7][3].piece = {
        type: CHESS_PIECES.QUEEN,
        color: CHESS_PIECE_COLOR.WHITE,
    };
    board[7][4].piece = {
        type: CHESS_PIECES.KING,
        color: CHESS_PIECE_COLOR.WHITE,
    };
    board[7][5].piece = {
        type: CHESS_PIECES.BISHOP,
        color: CHESS_PIECE_COLOR.WHITE,
    };
    board[7][6].piece = {
        type: CHESS_PIECES.KNIGHT,
        color: CHESS_PIECE_COLOR.WHITE,
    };
    board[7][7].piece = {
        type: CHESS_PIECES.ROOK,
        color: CHESS_PIECE_COLOR.WHITE,
    };

    // Add pawns
    for (let i = 0; i < 8; i++) {
        board[1][i].piece = {
            type: CHESS_PIECES.PAWN,
            color: CHESS_PIECE_COLOR.BLACK,
        };
        board[6][i].piece = {
            type: CHESS_PIECES.PAWN,
            color: CHESS_PIECE_COLOR.WHITE,
        };
    }

    return board;
}

export type MatchState = {
    board: ChessBlock[][];
    currentTurn: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR];
    startTimeInMs: number;
};

const initialState: MatchState = {
    board: getInitialChessBoard(),
    currentTurn: CHESS_PIECE_COLOR.BLACK,
    startTimeInMs: 1000 * 60 * 5,
};

export const matchSlice = createSlice({
    name: "match",
    initialState,
    reducers: {
        changeTurn: (state) => {
            state.currentTurn =
                state.currentTurn === CHESS_PIECE_COLOR.BLACK
                    ? CHESS_PIECE_COLOR.WHITE
                    : CHESS_PIECE_COLOR.BLACK;
        },
        selectPiece: (state, action) => {
            state.board.forEach((row) => {
                row.forEach((block) => {
                    block.selected = false;
                });
            });

            state.board[action.payload.rowIndex][
                action.payload.colIndex
            ].selected = true;
        },
    },
});

export const matchActions = matchSlice.actions;

export const matchSelectors = {
    board: (state: RootState) => state.match.board,
    currentTurn: (state: RootState) => state.match.currentTurn,
    startTimeInMs: (state: RootState) => state.match.startTimeInMs,
};
