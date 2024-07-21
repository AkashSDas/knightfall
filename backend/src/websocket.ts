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
