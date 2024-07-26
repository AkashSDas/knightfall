import GameRoom_Bishop_Black from "../assets/pieces/gameroom-bishop-black.png";
import GameRoom_Bishop_White from "../assets/pieces/gameroom-bishop-white.png";
import GameRoom_King_Black from "../assets/pieces/gameroom-king-black.png";
import GameRoom_King_White from "../assets/pieces/gameroom-king-white.png";
import GameRoom_Knight_Black from "../assets/pieces/gameroom-knight-black.png";
import GameRoom_Knight_White from "../assets/pieces/gameroom-knight-white.png";
import GameRoom_Pawn_Black from "../assets/pieces/gameroom-pawn-black.png";
import GameRoom_Pawn_White from "../assets/pieces/gameroom-pawn-white.png";
import GameRoom_Queen_Black from "../assets/pieces/gameroom-queen-black.png";
import GameRoom_Queen_White from "../assets/pieces/gameroom-queen-white.png";
import GameRoom_Rook_Black from "../assets/pieces/gameroom-rook-black.png";
import GameRoom_Rook_White from "../assets/pieces/gameroom-rook-white.png";
import Glass_Bishop_Black from "../assets/pieces/glass-bishop-black.png";
import Glass_Bishop_White from "../assets/pieces/glass-bishop-white.png";
import Glass_King_Black from "../assets/pieces/glass-king-black.png";
import Glass_King_White from "../assets/pieces/glass-king-white.png";
import Glass_Knight_Black from "../assets/pieces/glass-knight-black.png";
import Glass_Knight_White from "../assets/pieces/glass-knight-white.png";
import Glass_Pawn_Black from "../assets/pieces/glass-pawn-black.png";
import Glass_Pawn_White from "../assets/pieces/glass-pawn-white.png";
import Glass_Queen_Black from "../assets/pieces/glass-queen-black.png";
import Glass_Queen_White from "../assets/pieces/glass-queen-white.png";
import Glass_Rook_Black from "../assets/pieces/glass-rook-black.png";
import Glass_Rook_White from "../assets/pieces/glass-rook-white.png";
import Neo_Bishop_Black from "../assets/pieces/neo-bishop-black.png";
import Neo_Bishop_White from "../assets/pieces/neo-bishop-white.png";
import Neo_King_Black from "../assets/pieces/neo-king-black.png";
import Neo_King_White from "../assets/pieces/neo-king-white.png";
import Neo_Knight_Black from "../assets/pieces/neo-knight-black.png";
import Neo_Knight_White from "../assets/pieces/neo-knight-white.png";
import Neo_Pawn_Black from "../assets/pieces/neo-pawn-black.png";
import Neo_Pawn_White from "../assets/pieces/neo-pawn-white.png";
import Neo_Queen_Black from "../assets/pieces/neo-queen-black.png";
import Neo_Queen_White from "../assets/pieces/neo-queen-white.png";
import Neo_Rook_Black from "../assets/pieces/neo-rook-black.png";
import Neo_Rook_White from "../assets/pieces/neo-rook-white.png";
import Wood_Bishop_Black from "../assets/pieces/wood-bishop-black.png";
import Wood_Bishop_White from "../assets/pieces/wood-bishop-white.png";
import Wood_King_Black from "../assets/pieces/wood-king-black.png";
import Wood_King_White from "../assets/pieces/wood-king-white.png";
import Wood_Knight_Black from "../assets/pieces/wood-knight-black.png";
import Wood_Knight_White from "../assets/pieces/wood-knight-white.png";
import Wood_Pawn_Black from "../assets/pieces/wood-pawn-black.png";
import Wood_Pawn_White from "../assets/pieces/wood-pawn-white.png";
import Wood_Queen_Black from "../assets/pieces/wood-queen-black.png";
import Wood_Queen_White from "../assets/pieces/wood-queen-white.png";
import Wood_Rook_Black from "../assets/pieces/wood-rook-black.png";
import Wood_Rook_White from "../assets/pieces/wood-rook-white.png";
import { ChessBlock, MatchState } from "../store/match/slice";

import { v4 as uuid } from "uuid";

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

export const CHESS_PIECES = {
    BISHOP: "bishop",
    KING: "king",
    KNIGHT: "knight",
    PAWN: "pawn",
    QUEEN: "queen",
    ROOK: "rook",
} as const;

export const CHESS_BOARD_TYPE = {
    GAMEROOM: "gameroom",
    GLASS: "glass",
    NEO: "neo",
    WOOD: "wood",
} as const;

export const CHESS_PIECE_COLOR = {
    BLACK: "black",
    WHITE: "white",
} as const;

export function getImageForChessPiece(
    boardType: (typeof CHESS_BOARD_TYPE)[keyof typeof CHESS_BOARD_TYPE],
    piece: (typeof CHESS_PIECES)[keyof typeof CHESS_PIECES]
): {
    black: string;
    white: string;
} {
    switch (boardType) {
        case CHESS_BOARD_TYPE.GAMEROOM:
            switch (piece) {
                case CHESS_PIECES.ROOK:
                    return {
                        black: GameRoom_Rook_Black,
                        white: GameRoom_Rook_White,
                    };
                case CHESS_PIECES.KNIGHT:
                    return {
                        black: GameRoom_Knight_Black,
                        white: GameRoom_Knight_White,
                    };
                case CHESS_PIECES.BISHOP:
                    return {
                        black: GameRoom_Bishop_Black,
                        white: GameRoom_Bishop_White,
                    };
                case CHESS_PIECES.QUEEN:
                    return {
                        black: GameRoom_Queen_Black,
                        white: GameRoom_Queen_White,
                    };
                case CHESS_PIECES.KING:
                    return {
                        black: GameRoom_King_Black,
                        white: GameRoom_King_White,
                    };
                case CHESS_PIECES.PAWN:
                    return {
                        black: GameRoom_Pawn_Black,
                        white: GameRoom_Pawn_White,
                    };
            }
            break;
        case CHESS_BOARD_TYPE.GLASS:
            switch (piece) {
                case CHESS_PIECES.ROOK:
                    return {
                        black: Glass_Rook_Black,
                        white: Glass_Rook_White,
                    };
                case CHESS_PIECES.KNIGHT:
                    return {
                        black: Glass_Knight_Black,
                        white: Glass_Knight_White,
                    };
                case CHESS_PIECES.BISHOP:
                    return {
                        black: Glass_Bishop_Black,
                        white: Glass_Bishop_White,
                    };
                case CHESS_PIECES.QUEEN:
                    return {
                        black: Glass_Queen_Black,
                        white: Glass_Queen_White,
                    };
                case CHESS_PIECES.KING:
                    return {
                        black: Glass_King_Black,
                        white: Glass_King_White,
                    };
                case CHESS_PIECES.PAWN:
                    return {
                        black: Glass_Pawn_Black,
                        white: Glass_Pawn_White,
                    };
            }
            break;
        case CHESS_BOARD_TYPE.NEO:
            switch (piece) {
                case CHESS_PIECES.ROOK:
                    return {
                        black: Neo_Rook_Black,
                        white: Neo_Rook_White,
                    };
                case CHESS_PIECES.KNIGHT:
                    return {
                        black: Neo_Knight_Black,
                        white: Neo_Knight_White,
                    };
                case CHESS_PIECES.BISHOP:
                    return {
                        black: Neo_Bishop_Black,
                        white: Neo_Bishop_White,
                    };
                case CHESS_PIECES.QUEEN:
                    return {
                        black: Neo_Queen_Black,
                        white: Neo_Queen_White,
                    };
                case CHESS_PIECES.KING:
                    return {
                        black: Neo_King_Black,
                        white: Neo_King_White,
                    };
                case CHESS_PIECES.PAWN:
                    return {
                        black: Neo_Pawn_Black,
                        white: Neo_Pawn_White,
                    };
            }
            break;
        case CHESS_BOARD_TYPE.WOOD:
            switch (piece) {
                case CHESS_PIECES.ROOK:
                    return {
                        black: Wood_Rook_Black,
                        white: Wood_Rook_White,
                    };
                case CHESS_PIECES.KNIGHT:
                    return {
                        black: Wood_Knight_Black,
                        white: Wood_Knight_White,
                    };
                case CHESS_PIECES.BISHOP:
                    return {
                        black: Wood_Bishop_Black,
                        white: Wood_Bishop_White,
                    };
                case CHESS_PIECES.QUEEN:
                    return {
                        black: Wood_Queen_Black,
                        white: Wood_Queen_White,
                    };
                case CHESS_PIECES.KING:
                    return {
                        black: Wood_King_Black,
                        white: Wood_King_White,
                    };
                case CHESS_PIECES.PAWN:
                    return {
                        black: Wood_Pawn_Black,
                        white: Wood_Pawn_White,
                    };
            }
            break;
    }

    return {
        black: GameRoom_Pawn_Black,
        white: GameRoom_Pawn_White,
    };
}

export function getInitialChessBoard(): ChessBlock[][] {
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
                showPath: false,
                showExplosion: false,
                showKingDangerPath: false,
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

// ================================================
// Chess Moves
// ================================================

function getPawnMoves(
    board: ChessBlock[][],
    row: number,
    col: number,
    color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR]
) {
    const moves = [];
    const direction = color === CHESS_PIECE_COLOR.WHITE ? -1 : 1;
    const startRow = color === CHESS_PIECE_COLOR.WHITE ? 6 : 1;

    // Single step move
    if (board[row + direction] && !board[row + direction][col].piece) {
        moves.push({ row: row + direction, col });

        // Double step move
        if (row === startRow && !board[row + 2 * direction][col].piece) {
            moves.push({ row: row + 2 * direction, col });
        }
    }

    // Capture moves
    if (
        board[row + direction] &&
        board[row + direction][col - 1] &&
        board[row + direction][col - 1].piece &&
        board[row + direction][col - 1].piece!.color !== color
    ) {
        moves.push({ row: row + direction, col: col - 1 });
    }
    if (
        board[row + direction] &&
        board[row + direction][col + 1] &&
        board[row + direction][col + 1].piece &&
        board[row + direction][col + 1].piece!.color !== color
    ) {
        moves.push({ row: row + direction, col: col + 1 });
    }

    return moves;
}

function getKnightMoves(
    board: ChessBlock[][],
    row: number,
    col: number,
    color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR]
) {
    const moves = [];
    const knightMoves = [
        { row: 2, col: 1 },
        { row: 2, col: -1 },
        { row: -2, col: 1 },
        { row: -2, col: -1 },
        { row: 1, col: 2 },
        { row: 1, col: -2 },
        { row: -1, col: 2 },
        { row: -1, col: -2 },
    ];

    for (const { row: dRow, col: dCol } of knightMoves) {
        const r = row + dRow;
        const c = col + dCol;

        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (!board[r][c].piece || board[r][c].piece?.color !== color) {
                moves.push({ row: r, col: c });
            }
        }
    }

    return moves;
}

function getRookMoves(
    board: ChessBlock[][],
    row: number,
    col: number,
    color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR]
) {
    const moves = [];

    // Horizontal and vertical moves
    const directions = [
        { row: 1, col: 0 },
        { row: -1, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: -1 },
    ];

    for (const { row: dRow, col: dCol } of directions) {
        let r = row + dRow;
        let c = col + dCol;

        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (board[r][c].piece) {
                if (board[r][c].piece!.color !== color) {
                    moves.push({ row: r, col: c });
                }
                break;
            }
            moves.push({ row: r, col: c });
            r += dRow;
            c += dCol;
        }
    }

    return moves;
}

function getBishopMoves(
    board: ChessBlock[][],
    row: number,
    col: number,
    color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR]
) {
    const moves = [];
    const directions = [
        { row: 1, col: 1 },
        { row: 1, col: -1 },
        { row: -1, col: 1 },
        { row: -1, col: -1 },
    ];

    for (const { row: dRow, col: dCol } of directions) {
        let r = row + dRow;
        let c = col + dCol;

        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (board[r][c].piece) {
                if (board[r][c].piece!.color !== color) {
                    moves.push({ row: r, col: c });
                }
                break;
            }
            moves.push({ row: r, col: c });
            r += dRow;
            c += dCol;
        }
    }

    return moves;
}

function getQueenMoves(
    board: ChessBlock[][],
    row: number,
    col: number,
    color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR]
) {
    return [
        ...getRookMoves(board, row, col, color),
        ...getBishopMoves(board, row, col, color),
    ];
}

function getKingMoves(
    board: ChessBlock[][],
    row: number,
    col: number,
    color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR]
) {
    const moves = [];
    const kingMoves = [
        { row: 1, col: 0 },
        { row: -1, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: -1 },
        { row: 1, col: 1 },
        { row: 1, col: -1 },
        { row: -1, col: 1 },
        { row: -1, col: -1 },
    ];

    for (const { row: dRow, col: dCol } of kingMoves) {
        const r = row + dRow;
        const c = col + dCol;

        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (!board[r][c].piece || board[r][c].piece?.color !== color) {
                moves.push({ row: r, col: c });
            }
        }
    }

    return moves;
}

export function getValidMovesForPiece(
    board: ChessBlock[][],
    row: number,
    col: number,
    turn: MatchState["currentTurn"],
    checkForDangerMove: boolean = false
) {
    let moves: { row: number; col: number }[] = [];

    switch (board[row][col].piece?.type) {
        case CHESS_PIECES.PAWN:
            moves = getPawnMoves(board, row, col, turn);
            break;
        case CHESS_PIECES.KNIGHT:
            moves = getKnightMoves(board, row, col, turn);
            break;
        case CHESS_PIECES.ROOK:
            moves = getRookMoves(board, row, col, turn);
            break;
        case CHESS_PIECES.BISHOP:
            moves = getBishopMoves(board, row, col, turn);
            break;
        case CHESS_PIECES.QUEEN:
            moves = getQueenMoves(board, row, col, turn);
            break;
        case CHESS_PIECES.KING:
            moves = getKingMoves(board, row, col, turn);
            break;
        default:
            break;
    }

    // Check each move for danger
    const result = moves.map((move) => ({
        ...move,
        danger: checkForDangerMove
            ? isMoveDangerous(
                  JSON.parse(JSON.stringify(board)),
                  row,
                  col,
                  move.row,
                  move.col,
                  turn
              )
            : false,
    }));

    return result;
}

function isMoveDangerous(
    board: ChessBlock[][],
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
    color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR]
): boolean {
    const newBoard = board.map((row) =>
        row.map((block) => ({
            ...block,
            piece: block.piece ? { ...block.piece } : null,
        }))
    );
    const piece = newBoard[startRow][startCol].piece;

    if (!piece) return false;

    // Simulate the move
    newBoard[endRow][endCol].piece = piece;
    newBoard[startRow][startCol].piece = null;

    // Find the king's position
    let kingRow: number | null = null;
    let kingCol: number | null = null;

    outer: for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (
                newBoard[r][c].piece &&
                newBoard[r][c].piece!.type === CHESS_PIECES.KING &&
                newBoard[r][c].piece!.color === color
            ) {
                kingRow = r;
                kingCol = c;
                break outer;
            }
        }
    }

    if (kingRow === null || kingCol === null) {
        throw new Error("King not found on the board");
    }

    // Check if any opponent piece can attack the king
    const opponentColor =
        color === CHESS_PIECE_COLOR.WHITE
            ? CHESS_PIECE_COLOR.BLACK
            : CHESS_PIECE_COLOR.WHITE;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (
                newBoard[r][c].piece &&
                newBoard[r][c].piece!.color === opponentColor
            ) {
                const opponentMoves = getValidMovesForPiece(
                    newBoard,
                    r,
                    c,
                    opponentColor,
                    false
                ).filter((move) => !move.danger);
                if (
                    opponentMoves.some(
                        (move) => move.row === kingRow && move.col === kingCol
                    )
                ) {
                    return true;
                }
            }
        }
    }

    return false;
}

export function isKingInDanger(
    board: ChessBlock[][],
    color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR]
): boolean {
    // Find the king's position
    let kingRow: number | null = null;
    let kingCol: number | null = null;

    outer: for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (
                board[r][c].piece &&
                board[r][c].piece!.type === CHESS_PIECES.KING &&
                board[r][c].piece!.color === color
            ) {
                kingRow = r;
                kingCol = c;
                break outer;
            }
        }
    }

    if (kingRow === null || kingCol === null) return false; // No king found (should not happen in a valid game)

    // Check if any opponent piece can attack the king
    const opponentColor =
        color === CHESS_PIECE_COLOR.WHITE
            ? CHESS_PIECE_COLOR.BLACK
            : CHESS_PIECE_COLOR.WHITE;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (
                board[r][c].piece &&
                board[r][c].piece!.color === opponentColor
            ) {
                const moves = getValidMovesForPiece(
                    board,
                    r,
                    c,
                    opponentColor,
                    false
                );
                if (
                    moves.some(
                        (move) => move.row === kingRow && move.col === kingCol
                    )
                ) {
                    return true; // King is in danger
                }
            }
        }
    }

    return false; // King is not in danger
}

export function checkGameOver(
    board: ChessBlock[][],
    currentTurn: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR]
): {
    isGameOver: boolean;
    result: MatchState["status"];
    winner: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR] | null;
} {
    // Check ifH the current player's king is in check
    const isKingInCheck = isKingInDanger(board, currentTurn);

    // Get all valid moves for the current player
    let hasValidMoves = false;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (
                board[row][col].piece &&
                board[row][col].piece!.color === currentTurn
            ) {
                const moves = getValidMovesForPiece(
                    board,
                    row,
                    col,
                    currentTurn,
                    true
                );
                if (moves.some((move) => !move.danger)) {
                    hasValidMoves = true;
                    break;
                }
            }
        }
        if (hasValidMoves) break;
    }

    if (isKingInCheck && !hasValidMoves) {
        // Checkmate
        const winner =
            currentTurn === CHESS_PIECE_COLOR.WHITE
                ? CHESS_PIECE_COLOR.BLACK
                : CHESS_PIECE_COLOR.WHITE;

        return { isGameOver: true, result: MATCH_STATUS.CHECKMATE, winner };
    } else if (!isKingInCheck && !hasValidMoves) {
        // Stalemate
        return {
            isGameOver: true,
            result: MATCH_STATUS.STALEMATE,
            winner: null,
        };
    }

    // Game is still ongoing
    return {
        isGameOver: false,
        result: MATCH_STATUS.IN_PROGRESS,
        winner: null,
    };
}

// 1. change match status and show winner or game over
// 2. close game
// 3. get all games history of a player
// 4. watch a game play
// 6. add more animations
// 5. complete the project
