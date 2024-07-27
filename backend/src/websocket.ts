import { createServer } from "http";
import { Server } from "socket.io";
import { app } from "./api";
import { logger } from "./utils/logger";
import {
    DirectMessage,
    DirectMessageDocument,
    Message,
} from "./models/direct-message";
import { Document, Types } from "mongoose";
import {
    BeAnObject,
    IObjectWithTypegooseFunction,
} from "@typegoose/typegoose/lib/types";
import { schedule } from "node-cron";
import { User } from "./models/user";
import {
    CHESS_PIECE_COLOR,
    CHESS_PIECES,
    ChessPiece,
    MATCH_STATUS,
    Match,
    MatchMove,
    getInitialChessBoard,
} from "./models/match";

export const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_BASE_URL,
        credentials: true,
    },
});

// Storing direct messages in memory for some time. This will have saved status and
// document instance and last updated time. Whenever messages are sent between
// friends in a DM, these message won't be directly saved in the DB, instead it will
// be create/fetch a DirectMessage document, and add it in that. These messages
// will be saved after a time interval (based on time specificed in cron job),
// and memory will be cleared if the last updated time is older "some" time (ex: 5mins).
//
// This approach doesn't saves the message immediately allowing quick messaging
// between friends. After sometime (should be smaller time since user can reload
// and not find there messages). Issues with cron job is that that can't be
// lesser than 1min.
//
// To solve this issue a complex logic could be setup which will get message from
// `friendsDirectMessages` and join it in the endpoints reponse which returns
// messages between friends.
const friendsDirectMessages: Record<
    string,
    {
        lastEdited: Date;
        saveStatus: "pending" | "done" | "error";
        dbModelInstance: Document<unknown, BeAnObject, DirectMessageDocument> &
            Omit<
                DirectMessageDocument &
                    Required<{
                        _id: Types.ObjectId;
                    }>,
                "typegooseName"
            > &
            IObjectWithTypegooseFunction;
    }
> = {};

async function saveMessage(payload: {
    senderUserId: string;
    text: string;

    /** Friend document id and not user's friend's userId */
    friendId: string;
}): Promise<{
    directMessageId: string;
    messageId: string;
}> {
    const savedDM = friendsDirectMessages[payload.friendId];
    logger.info(
        `[📮 DMs save box] ${payload.friendId}: ${savedDM?.dbModelInstance.messages.length}`,
    );

    if (savedDM) {
        if (savedDM.dbModelInstance.messages.length > 10) {
            if (savedDM["saveStatus"] === "pending") {
                await savedDM.dbModelInstance.save();
            }

            const newDM = new DirectMessage({
                friend: payload.friendId,
                messages: [{ text: payload.text, user: payload.senderUserId }],
                previousMessage: savedDM.dbModelInstance._id,
            });

            friendsDirectMessages[payload.friendId] = {
                dbModelInstance: newDM,
                saveStatus: "pending",
                lastEdited: new Date(),
            };

            return {
                directMessageId: newDM.id,
                // @ts-ignore
                messageId: newDM.messages[0]._id,
            };
        } else {
            savedDM.dbModelInstance.messages.push(
                new Message({ text: payload.text, user: payload.senderUserId }),
            );

            friendsDirectMessages[payload.friendId] = {
                dbModelInstance: savedDM.dbModelInstance,
                saveStatus: "pending",
                lastEdited: new Date(),
            };

            return {
                directMessageId: savedDM.dbModelInstance.id,
                messageId:
                    savedDM.dbModelInstance.messages[
                        savedDM.dbModelInstance.messages.length - 1
                        // @ts-ignore
                    ]._id,
            };
        }
    } else {
        const dm = await DirectMessage.findOne(
            { friend: payload.friendId },
            {},
            { sort: { createdAt: -1 } },
        );

        if (!dm) {
            const newDM = new DirectMessage({
                friend: payload.friendId,
                messages: [{ text: payload.text, user: payload.senderUserId }],
            });

            friendsDirectMessages[payload.friendId] = {
                dbModelInstance: newDM,
                saveStatus: "pending",
                lastEdited: new Date(),
            };

            return {
                directMessageId: newDM.id,
                // @ts-ignore
                messageId: newDM.messages[0]._id,
            };
        } else {
            dm.messages.push(
                new Message({ text: payload.text, user: payload.senderUserId }),
            );

            friendsDirectMessages[payload.friendId] = {
                dbModelInstance: dm,
                saveStatus: "pending",
                lastEdited: new Date(),
            };

            return {
                directMessageId: dm.id,
                // @ts-ignore
                messageId: dm.messages[dm.messages.length - 1]._id,
            };
        }
    }
}

const playersInLobby: {
    userId: string;
    addedAt: Date;
    winPoints: number;
}[] = [];

io.on("connection", function connectToWebSocket(socket) {
    logger.info(`[🟢 socket] CONNECTED: ${socket.id}`);

    socket.on("disconnect", function socketDisconnected() {
        logger.info(`[🟢 socket] DISCONNECTED: ${socket.id}`);
    });

    // ================================
    // Notification
    // ================================

    socket.on("joinNotification", function joinNotification({ userId }) {
        const roomName = `notification_${userId}`;
        socket.join(roomName);
        logger.info(`[🔔 notification] JOIN: ${roomName}`);
    });

    socket.on("leaveNotification", function leaveNotification({ userId }) {
        const roomName = `notification_${userId}`;
        socket.leave(roomName);
        logger.info(`[🔔 notification] LEAVE: ${roomName}`);
    });

    // ================================
    // Direct Message
    // ================================

    socket.on("joinDirectMessage", function joinDirectMessage({ friendId }) {
        const roomName = `dm_${friendId}`;
        socket.join(roomName);
        logger.info(`[📨 dm] JOIN: ${roomName}`);
    });

    socket.on("leaveDirectMessage", function leaveDirectMessage({ friendId }) {
        const roomName = `dm_${friendId}`;
        socket.leave(roomName);
        logger.info(`[📨 dm] LEAVE: ${roomName}`);
    });

    socket.on(
        "directMessage",
        function directMessage({ text, room, senderUserId, friendId }) {
            (async () => {
                const { directMessageId, messageId } = await saveMessage({
                    senderUserId,
                    friendId,
                    text,
                });

                io.to(room).emit("directMessage", {
                    text,
                    senderUserId,
                    friendId,
                    directMessageId,
                    messageId,
                });
            })();
        },
    );

    // ==========================================
    // Search for player to play game with
    // ==========================================

    socket.on("joinSearchPlayerForGame", function ({ userId }) {
        const roomName = `search_player_for_game_${userId}`;
        socket.join(roomName);
        logger.info(`[⚽ search_player_for_game] JOIN: ${roomName}`);
    });

    socket.on("leaveSearchPlayerForGame", function ({ userId }) {
        const roomName = `search_player_for_game_${userId}`;
        socket.leave(roomName);

        playersInLobby.splice(
            playersInLobby.findIndex((p) => p.userId === userId),
            1,
        );

        logger.info(`[⚽ search_player_for_game] LEAVE: ${roomName}`);
    });

    socket.on(
        "searchPlayerForGame",
        function searchPlayerForGame(payload: {
            userId: string;
            addedAt: Date;
            winPoints: number;
            winPointsOffset: number;
        }) {
            // Search for a player in the lobby, if exists then create a match
            // and return it, else push the player in the lobby. For matching
            // similar ranked players search winPoints (+50 or -50 i.e. winPointsOffset)

            const matchingPlayer = playersInLobby.find((p) => {
                if (
                    Math.abs(p.winPoints - payload.winPoints) <=
                        payload.winPointsOffset &&
                    p.userId !== payload.userId
                ) {
                    return true;
                } else {
                    return false;
                }
            });

            if (!matchingPlayer) {
                const exists = playersInLobby.find(
                    (p) => p.userId === payload.userId,
                );

                if (!exists) {
                    playersInLobby.push(payload);
                }
            } else {
                (async () => {
                    const [player1, player2] = await Promise.all([
                        User.findById(matchingPlayer.userId),
                        User.findById(payload.userId),
                    ]);

                    try {
                        const color =
                            Math.random() < 0.5
                                ? CHESS_PIECE_COLOR.BLACK
                                : CHESS_PIECE_COLOR.WHITE;
                        const match = await Match.create({
                            player1: player1.id,
                            player2: player2.id,
                            player1Color: color,
                            player2Color:
                                color === CHESS_PIECE_COLOR.WHITE
                                    ? CHESS_PIECE_COLOR.BLACK
                                    : CHESS_PIECE_COLOR.WHITE,
                            moves: [
                                new MatchMove({
                                    board: getInitialChessBoard(),

                                    // Initializing with black's turn because in FE the latest board's (in this
                                    // case it will be the first board) the turn is checked and opposite
                                    // turn is set because the last move was of the other turn. Since
                                    // we want to start with white's turn, we set it to black
                                    turn: CHESS_PIECE_COLOR.BLACK,
                                }),
                            ],
                        });

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
                })();
            }
        },
    );

    // ==========================================
    // Match room
    // ==========================================

    socket.on("joinMatchRoom", function joinMatchRoom({ matchId }) {
        const roomName = `match_${matchId}`;
        socket.join(roomName);
        logger.info(`[🏓 match] JOIN: ${roomName}`);
    });

    socket.on("leaveMatchRoom", function leaveMatchRoom({ matchId }) {
        const roomName = `match_${matchId}`;
        socket.leave(roomName);
        logger.info(`[🏓 match] LEAVE: ${roomName}`);
    });

    socket.on(
        "matchChessMove",
        function matchChessMove(payload: {
            matchId: string;
            playerId: string;
            move: {
                turn: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR];
                board: {
                    color: (typeof CHESS_PIECE_COLOR)[keyof typeof CHESS_PIECE_COLOR];
                    type: (typeof CHESS_PIECES)[keyof typeof CHESS_PIECES];
                }[][];
            };
            status: (typeof MATCH_STATUS)[keyof typeof MATCH_STATUS];
        }) {
            const roomName = `match_${payload.matchId}`;
            const move = new MatchMove({
                turn: payload.move.turn,
                board: payload.move.board.map((row) => {
                    return row.map((cell) => {
                        return new ChessPiece({
                            color: cell.color,
                            type: cell.type,
                        });
                    });
                }),
            });

            Match.updateOne(
                { _id: payload.matchId },
                { $push: { moves: move }, status: payload.status },
            )
                .then(() => logger.info("Match move saved"))
                .catch((e) => logger.error(e));

            io.to(roomName).emit("matchChessMove", {
                matchId: payload.matchId,
                playerId: payload.playerId,
                move: {
                    turn:
                        move.turn === CHESS_PIECE_COLOR.BLACK
                            ? CHESS_PIECE_COLOR.WHITE
                            : CHESS_PIECE_COLOR.BLACK,
                    board: move.board,
                },
                status: payload.status,
            });
        },
    );
});

schedule("0 */2 * * *", function cancelIncompleteMatches() {
    Match.updateMany(
        {
            $or: [
                { status: MATCH_STATUS.IN_PROGRESS },
                { status: MATCH_STATUS.PENDING },
            ],
            createdAt: {
                $lt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes
            },
        },
        { $set: { status: MATCH_STATUS.CANCELLED } },
    )
        .then(() => logger.info("Matches cancelled"))
        .catch((e) => logger.error(e));
});

schedule("* * * * *", function saveDMs() {
    const promises = [];

    for (const friendId in friendsDirectMessages) {
        const savedDM = friendsDirectMessages[friendId];
        if (savedDM.saveStatus === "pending") {
            promises.push(savedDM.dbModelInstance.save());
        }
    }

    logger.info(`[📮 DMs save box]: Saving ${promises.length} DM documents`);

    try {
        (async () => {
            await Promise.all(promises);

            Object.entries(friendsDirectMessages).forEach(
                ([friendId, savedDM]) => {
                    if (savedDM.saveStatus === "pending") {
                        friendsDirectMessages[friendId].saveStatus = "done";
                    }
                },
            );

            // Cleanup remove if the lastUpdated is older than 5 minutes
            for (const friendId in friendsDirectMessages) {
                const savedDM = friendsDirectMessages[friendId];
                if (savedDM.lastEdited < new Date(Date.now() - 5 * 60 * 1000)) {
                    delete friendsDirectMessages[friendId];
                }
            }
        })();
    } catch (error) {
        Object.entries(friendsDirectMessages).forEach(([friendId, savedDM]) => {
            if (savedDM.saveStatus === "pending") {
                friendsDirectMessages[friendId].saveStatus = "error";
            }
        });

        logger.error(`[📮 DMs save box] Failed to save: ${error}`);
    }
});
