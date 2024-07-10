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
