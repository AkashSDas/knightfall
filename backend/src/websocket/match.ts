import { Types } from "mongoose";
import { schedule } from "node-cron";
import { Socket } from "socket.io";
import { z } from "zod";

import { ChessPiece, Match, MatchMove } from "@/models/match";
import { logger } from "@/utils/logger";
import { CHESS_PIECES, CHESS_PIECE_COLORS, MATCH_STATUS } from "@/utils/match";
import { io } from "@/websocket";

const joinRoomSchema = z.object({
    matchId: z.string().refine((v) => Types.ObjectId.isValid(v), {
        message: "Invalid matchId",
    }),
});

const leaveRoomSchema = z.object({
    matchId: z.string().refine((v) => Types.ObjectId.isValid(v), {
        message: "Invalid matchId",
    }),
});

const matchStartSchema = z.object({
    matchId: z.string().refine((v) => Types.ObjectId.isValid(v), {
        message: "Invalid matchId",
    }),
});

const matchEndSchema = z.object({
    matchId: z.string().refine((v) => Types.ObjectId.isValid(v), {
        message: "Invalid matchId",
    }),
    newStatus: z.nativeEnum(MATCH_STATUS),
    metadata: z.object({
        reason: z.string(),
        byPlayer: z.object({
            username: z.string(),
            id: z.string(),
        }),
    }),
});

const matchChessMoveSchema = z.object({
    matchId: z.string().refine((v) => Types.ObjectId.isValid(v), {
        message: "Invalid matchId",
    }),
    playerId: z.string().refine((v) => Types.ObjectId.isValid(v), {
        message: "Invalid playerId",
    }),
    status: z.nativeEnum(MATCH_STATUS),
    move: z.object({
        turn: z.nativeEnum(CHESS_PIECE_COLORS),
        board: z
            .array(
                z
                    .array(
                        z.object({
                            color: z.nativeEnum(CHESS_PIECE_COLORS).nullable(),
                            type: z.nativeEnum(CHESS_PIECES).nullable(),
                        }),
                    )
                    .length(8),
            )
            .length(8),
    }),
});

export const matchWebSocketHandlers = {
    joinRoom(socket: Socket, payload: unknown) {
        const parsed = joinRoomSchema.safeParse(payload);

        if (parsed.success) {
            const { matchId } = parsed.data;
            const roomName = `match_${matchId}`;
            socket.join(roomName);
            logger.info(`[🏓 match] JOIN: ${roomName}`);
        }
    },
    leaveRoom(socket: Socket, payload: unknown) {
        const parsed = leaveRoomSchema.safeParse(payload);

        if (parsed.success) {
            const { matchId } = parsed.data;
            const roomName = `match_${matchId}`;
            socket.leave(roomName);
            logger.info(`[🏓 match] LEAVE: ${roomName}`);
        }
    },
    startGame(payload: unknown) {
        const parsed = matchStartSchema.safeParse(payload);

        if (parsed.success) {
            const { matchId } = parsed.data;

            Match.findOne({ _id: matchId })
                .then(function startGameIfNotStarted(match) {
                    if (!match.startedAt) {
                        Match.updateOne(
                            { _id: match._id },
                            {
                                $set: {
                                    status: MATCH_STATUS.IN_PROGRESS,
                                    startedAt: new Date(Date.now()),
                                },
                            },
                        );
                    }
                })
                .catch(function failedToStartGame(e) {
                    logger.error(
                        `Failed to start game with matchId being ${matchId}`,
                    );
                    logger.error(e);
                });
        }
    },
    endGame(socket: Socket, payload: unknown) {
        const parsed = matchEndSchema.safeParse(payload);

        if (parsed.success) {
            const { matchId, newStatus } = parsed.data;
            const roomName = `match_${matchId}`;

            Match.updateOne({ _id: matchId }, { $set: { status: newStatus } })
                .then(function () {
                    logger.info(`[🏓 match] MATCH STATUS: ${newStatus}`);
                })
                .catch(function (e) {
                    logger.error(
                        `[🏓 match] Failed to end match with matchId being ${matchId}`,
                    );
                    logger.error(e);
                });

            socket.to(roomName).emit("matchChessEnd", payload);
        }
    },
    makeMove(payload: unknown) {
        const parsed = matchChessMoveSchema.safeParse(payload);

        if (parsed.success) {
            const { matchId, move, playerId, status } = parsed.data;

            const roomName = `match_${matchId}`;

            // Create move sub-document
            const moveDoc = new MatchMove({
                turn: move.turn,
                board: move.board.map((row) => {
                    return row.map((cell) => {
                        return new ChessPiece({
                            color: cell.color,
                            type: cell.type,
                        });
                    });
                }),
            });

            // Asynchronously save this move in the match document
            Match.updateOne(
                { _id: matchId },
                { $push: { moves: moveDoc }, status },
            )
                .then(() => {
                    logger.info(`Match move saved for match: ${matchId}`);
                })
                .catch((e) => {
                    logger.error(
                        `Failed to save match move for match: ${matchId}`,
                    );
                    logger.error(e);
                });

            // After move who's turn is it?
            const nextTurn =
                move.turn === CHESS_PIECE_COLORS.BLACK
                    ? CHESS_PIECE_COLORS.WHITE
                    : CHESS_PIECE_COLORS.BLACK;

            // Send board status to the other player
            io.to(roomName).emit("matchChessMove", {
                matchId,
                playerId,
                move: {
                    turn: nextTurn,
                    board: move.board,
                },
                status,
            });
        }
    },
};

schedule("0 */2 * * *", function cancelIncompleteMatches() {
    Match.updateMany(
        {
            $or: [
                { status: MATCH_STATUS.IN_PROGRESS },

                // TODO: if matches are scheduled for later time, we should not cancel them
                { status: MATCH_STATUS.PENDING },
            ],
            startedAt: {
                $lt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes
            },
        },
        { $set: { status: MATCH_STATUS.CANCELLED } },
    )
        .then(() => {
            logger.info("Matches cancelled");
        })
        .catch((e) => {
            logger.error("Failed to cancel incomplete matches");
            logger.error(e);
        });
});
