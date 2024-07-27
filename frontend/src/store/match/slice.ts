import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
    CHESS_PIECES,
    CHESS_PIECE_COLOR,
    MATCH_STATUS,
    checkGameOver,
    getInitialChessBoard,
    getValidMovesForPiece,
} from "../../utils/chess";
import { RootState } from "..";

export type ChessPiece = {
    type: (typeof CHESS_PIECES)[keyof typeof CHESS_PIECES];
    color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR];
};

export type ChessBlock = {
    id: string;
    piece: ChessPiece | null;
    color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR];
    selected: boolean;
    showPath: boolean;
    showExplosion: boolean;
    showKingDangerPath: boolean;
};

export type MatchState = {
    board: ChessBlock[][];
    currentTurn: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR];
    startTimeInMs: number;
    winner: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR] | null;
    status: (typeof MATCH_STATUS)[keyof typeof MATCH_STATUS];
    matchEndedMetadata?: {
        reason: string;
        byPlayer?: { username: string; id: string } | undefined;
    };
};

const initialState: MatchState = {
    board: getInitialChessBoard(),

    // Initialize with white's turn
    currentTurn: CHESS_PIECE_COLOR.WHITE,

    startTimeInMs: 1000 * 60 * 5,

    winner: null,

    status: MATCH_STATUS.PENDING,
};

export const matchSlice = createSlice({
    name: "match",
    initialState,
    reducers: {
        changeTime: (state, action: PayloadAction<number>) => {
            state.startTimeInMs = action.payload;
        },
        changeMatchEndedMetadata: (
            state,
            action: PayloadAction<{
                reason: string;
                byPlayer?: { username: string; id: string } | undefined;
            }>
        ) => {
            state.matchEndedMetadata = action.payload;
        },
        changeMatchStatus: (
            state,
            action: PayloadAction<
                (typeof MATCH_STATUS)[keyof typeof MATCH_STATUS]
            >
        ) => {
            state.status = action.payload;
        },
        changeTurn: (
            state,
            action: PayloadAction<
                | (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR]
                | undefined
            >
        ) => {
            if (action.payload) {
                state.currentTurn = action.payload;
            } else {
                state.currentTurn =
                    state.currentTurn === CHESS_PIECE_COLOR.BLACK
                        ? CHESS_PIECE_COLOR.WHITE
                        : CHESS_PIECE_COLOR.BLACK;
            }
        },
        changeBoard: (state, action: PayloadAction<ChessBlock[][]>) => {
            const newBoard = action.payload;

            // Clear previous showKingInDangerPath states
            newBoard.forEach((row) =>
                row.forEach((block) => (block.showKingDangerPath = false))
            );

            // Check for danger paths for the current player's king
            const currentTurn = state.currentTurn;
            newBoard.forEach((row, rowIndex) => {
                row.forEach((block, colIndex) => {
                    if (block.piece && block.piece.color === currentTurn) {
                        const moves = getValidMovesForPiece(
                            newBoard,
                            rowIndex,
                            colIndex,
                            currentTurn,
                            true
                        );
                        moves.forEach((move) => {
                            if (move.danger) {
                                newBoard[move.row][
                                    move.col
                                ].showKingDangerPath = true;
                            }
                        });
                    }
                });
            });

            state.board = newBoard;

            // Check for game over conditions after the move
            const { result, winner } = checkGameOver(
                state.board,
                state.currentTurn
            );
            state.status = result;
            state.winner = winner;
        },
        selectPiece: (
            state,
            action: PayloadAction<{ rowIndex: number; colIndex: number }>
        ) => {
            const { rowIndex, colIndex } = action.payload;
            const piece = state.board[rowIndex][colIndex].piece;

            // Check if selected piece color and turn are the same
            if (piece?.color === state.currentTurn) {
                // In this case user is selecting a new piece

                state.board.forEach((row) => {
                    row.forEach((block) => {
                        block.selected = false;
                        block.showPath = false;
                        block.showExplosion = false;
                    });
                });

                state.board[rowIndex][colIndex].selected = true;

                // Highlight valid moves

                const moves = getValidMovesForPiece(
                    state.board,
                    rowIndex,
                    colIndex,
                    state.currentTurn,
                    true
                );

                moves.forEach((move) => {
                    state.board[move.row][move.col].showPath = move.danger
                        ? false
                        : true;
                });
            } else {
                let row: number | null = null;
                let col: number | null = null;

                const selectedBlock = state.board
                    .find((rowBlock, rowIdx) => {
                        return (
                            rowBlock.find((block, colIdx) => {
                                if (block.selected) {
                                    row = rowIdx;
                                    col = colIdx;
                                    return true;
                                }
                            }) !== undefined
                        );
                    })
                    ?.find((block) => block.selected);

                if (
                    selectedBlock &&
                    row !== null &&
                    col !== null &&
                    selectedBlock.piece?.color === state.currentTurn
                ) {
                    const move = getValidMovesForPiece(
                        state.board,
                        row,
                        col,
                        state.currentTurn,
                        true
                    );

                    const validMove = move.find((m) => {
                        return (
                            m.row === rowIndex &&
                            m.col === colIndex &&
                            !m.danger
                        );
                    });

                    if (validMove) {
                        state.board.forEach((row) => {
                            row.forEach((block) => {
                                block.selected = false;
                                block.showPath = false;
                                block.showExplosion = false;
                            });
                        });
                        state.board[rowIndex][colIndex].showExplosion = true;
                        state.board[rowIndex][colIndex].piece =
                            state.board[row][col].piece;

                        // Handle pawn promotion
                        if (
                            state.board[rowIndex][colIndex].piece?.type ===
                                CHESS_PIECES.PAWN &&
                            ((state.board[rowIndex][colIndex].piece?.color ===
                                CHESS_PIECE_COLOR.WHITE &&
                                rowIndex === 0) ||
                                (state.board[rowIndex][colIndex].piece
                                    ?.color === CHESS_PIECE_COLOR.BLACK &&
                                    rowIndex === 7))
                        ) {
                            state.board[rowIndex][colIndex].piece!.type =
                                CHESS_PIECES.QUEEN;
                        }

                        state.board[row][col].piece = null;

                        // Check for game over conditions after the move
                        const { result, winner } = checkGameOver(
                            state.board,
                            state.currentTurn
                        );
                        state.status = result;
                        state.winner = winner;

                        state.currentTurn =
                            state.currentTurn === CHESS_PIECE_COLOR.WHITE
                                ? CHESS_PIECE_COLOR.BLACK
                                : CHESS_PIECE_COLOR.WHITE;
                    }
                }
            }
        },
    },
});

export const matchActions = matchSlice.actions;

export const matchSelectors = {
    board: (state: RootState) => state.match.board,
    currentTurn: (state: RootState) => state.match.currentTurn,
    startTimeInMs: (state: RootState) => state.match.startTimeInMs,
    status: (state: RootState) => state.match.status,
    winner: (state: RootState) => state.match.winner,
    matchEndedMetadata: (state: RootState) => state.match.matchEndedMetadata,
};
