import { Types } from "mongoose";
import { Socket } from "socket.io";
import { z } from "zod";

import { Match, MatchMove } from "@/models/match";
import { User } from "@/models/user";
import { logger } from "@/utils/logger";
import { CHESS_PIECE_COLORS, getInitialChessBoard } from "@/utils/match";
import { io } from "@/websocket";

/** Players who are looking for opponents will be added in this list. */
const playersInLobby: {
    userId: string;
    addedAt: string;
    winPoints: number;
}[] = [];

const joinRoomSchema = z.object({
    userId: z.string().refine((v) => Types.ObjectId.isValid(v), {
        message: "Invalid userId",
    }),
});

const leaveRoomSchema = z.object({
    userId: z.string().refine((v) => Types.ObjectId.isValid(v), {
        message: "Invalid userId",
    }),
});

const pushToLobbySchema = z.object({
    userId: z.string().refine((v) => Types.ObjectId.isValid(v), {
        message: "Invalid userId",
    }),
    addedAt: z.string(),
    winPoints: z.number().min(0),
    winPointsOffset: z.number(),
});

export const lobbyWebSocketHandlers = {
    joinRoom(socket: Socket, payload: unknown) {
        const parsed = joinRoomSchema.safeParse(payload);

        if (parsed.success) {
            const { userId } = parsed.data;
            const roomName = `search_player_for_game_${userId}`;
            socket.join(roomName);
            logger.info(`[⚽ search_player_for_game] JOIN: ${roomName}`);
        }
    },
    leaveRoom(socket: Socket, payload: unknown) {
        const parsed = leaveRoomSchema.safeParse(payload);

        if (parsed.success) {
            const { userId } = parsed.data;

            const roomName = `search_player_for_game_${userId}`;
            socket.leave(roomName);

            playersInLobby.splice(
                playersInLobby.findIndex((p) => p.userId === userId),
                1,
            );

            logger.info(`[⚽ search_player_for_game] LEAVE: ${roomName}`);
        }
    },
    pushToLobby(payload: unknown) {
        const parsed = pushToLobbySchema.safeParse(payload);

        if (parsed.success) {
            // Search for a player in the lobby, if exists then create a match
            // and return it, else push the player in the lobby. For matching
            // similar ranked players search winPoints (+50 or -50 i.e. winPointsOffset)

            const { winPoints, winPointsOffset, userId, addedAt } = parsed.data;

            const matchingPlayer = playersInLobby.find((p) => {
                if (
                    Math.abs(p.winPoints - winPoints) <= winPointsOffset &&
                    p.userId !== userId
                ) {
                    return true;
                } else {
                    return false;
                }
            });

            if (!matchingPlayer) {
                // If no opponent found then push player to lobby

                const exists = playersInLobby.find((p) => p.userId === userId);

                if (!exists) {
                    playersInLobby.push({ addedAt, userId, winPoints });
                }
            } else {
                // If opponent found then start a match for them

                (async () => {
                    const [player1, player2] = await Promise.all([
                        User.findById(matchingPlayer.userId),
                        User.findById(userId),
                    ]);

                    try {
                        // Choose piece color for a player
                        const color =
                            Math.random() < 0.5
                                ? CHESS_PIECE_COLORS.BLACK
                                : CHESS_PIECE_COLORS.WHITE;

                        // Create match document with initial board
                        const match = await Match.create({
                            player1: player1.id,
                            player2: player2.id,
                            player1Color: color,
                            player2Color:
                                color === CHESS_PIECE_COLORS.WHITE
                                    ? CHESS_PIECE_COLORS.BLACK
                                    : CHESS_PIECE_COLORS.WHITE,
                            moves: [
                                new MatchMove({
                                    board: getInitialChessBoard(),

                                    // Initializing with black's turn because in FE the latest board's (in this
                                    // case it will be the first board) the turn is checked and opposite
                                    // turn is set because the last move was of the other turn. Since
                                    // we want to start with white's turn, we set it to black
                                    turn: CHESS_PIECE_COLORS.BLACK,
                                }),
                            ],
                        });

                        // Start game in client with opponent
                        io.to(`search_player_for_game_${player1.id}`).emit(
                            "foundPlayerForMatch",
                            {
                                opponentUser: {
                                    id: player2.id,
                                    username: player2.username,
                                    profilePic: player2.profilePic,
                                    winPoints: player2.winPoints,
                                },
                                matchId: match.id,
                            },
                        );

                        // Start game in client with opponent
                        io.to(`search_player_for_game_${player2.id}`).emit(
                            "foundPlayerForMatch",
                            {
                                opponentUser: {
                                    id: player1.id,
                                    username: player1.username,
                                    profilePic: player1.profilePic,
                                    winPoints: player1.winPoints,
                                },
                                matchId: match.id,
                            },
                        );
                    } catch (e) {
                        logger.error(`[❌ searchPlayerForGame] ${e}`);
                    }
                })()
                    .then(() => {
                        console.log(
                            `Match started between ${userId} and ${matchingPlayer.userId}`,
                        );
                    })
                    .catch((e) => {
                        logger.error(`[❌ searchPlayerForGame] ${e}`);
                    });
            }
        }
    },
};
