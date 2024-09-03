import { logger } from "@typegoose/typegoose/lib/logSettings";
import type {
    BeAnObject,
    IObjectWithTypegooseFunction,
} from "@typegoose/typegoose/lib/types";
import { type Document, Types } from "mongoose";
import { schedule } from "node-cron";
import { Socket } from "socket.io";
import { z } from "zod";

import {
    DirectMessage,
    type DirectMessageDocument,
    Message,
} from "@/models/direct-message";
import { io } from "@/websocket";

/**
 * Storing direct messages in memory for some time. This will have saved status and
 * document instance and last updated time. Whenever messages are sent between
 * friends in a DM, these message won't be directly saved in the DB, instead it will
 * be create/fetch a DirectMessage document, and add it in that. These messages
 * will be saved after a time interval (based on time specificed in cron job),
 * and memory will be cleared if the last updated time is older "some" time (ex: 5mins).
 *
 * This approach doesn't saves the message immediately allowing quick messaging
 * between friends. After sometime (should be smaller time since user can reload
 * and not find there messages). Issues with cron job is that that can't be
 * lesser than 1min.
 *
 * To solve this issue a complex logic could be setup which will get message from
 * `friendsDirectMessages` and join it in the endpoints reponse which returns
 * messages between friends.
 **/
export const friendsDirectMessages: Record<
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

/** Save direct messages in DB. */
export async function saveMessage(payload: {
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
        `[📮 DMs save DMs] ${payload.friendId}: ${savedDM?.dbModelInstance.messages.length}`,
    );

    if (savedDM) {
        // If there exists a DM instance with friend._id then check current messages length

        if (savedDM.dbModelInstance.messages.length > 10) {
            // If it has more than "10" messages then save DM instance and create a new
            // DM document with current message

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
                lastEdited: new Date(Date.now()),
            };

            return {
                directMessageId: newDM.id,
                // @ts-expect-error message will always have `_id`
                messageId: newDM.messages[0]._id,
            };
        } else {
            // If it has less than "10" messages then just add current message
            // to the existing DM document

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
                        // @ts-expect-error message will always have `_id`
                    ]._id,
            };
        }
    } else {
        // If a DM instance in local memory i.e. `friendsDirectMessages` doesn't
        // exists then create a new one else get that one from DB and push it into
        // `friendsDirectMessages` and use it.

        const dm = await DirectMessage.findOne(
            { friend: payload.friendId },
            {},
            { sort: { createdAt: -1 } },
        );

        if (!dm) {
            // If there is no DM document with friend._id then create a new one

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
                // @ts-expect-error message will always have `_id`
                messageId: newDM.messages[0]._id,
            };
        } else {
            // If there is a DM document with friend._id then push current message

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
                // @ts-expect-error message will always have `_id`
                messageId: dm.messages[dm.messages.length - 1]._id,
            };
        }
    }
}

const joinRoomSchema = z.object({
    friendId: z.string().refine((v) => Types.ObjectId.isValid(v), {
        message: "Invalid friendId",
    }),
});

const leaveRoomSchema = z.object({
    friendId: z.string().refine((v) => Types.ObjectId.isValid(v), {
        message: "Invalid friendId",
    }),
});

const sendMessageSchema = z.object({
    friendId: z.string().refine((v) => Types.ObjectId.isValid(v), {
        message: "Invalid friendId",
    }),
    senderUserId: z.string().refine((v) => Types.ObjectId.isValid(v), {
        message: "Invalid senderUserId",
    }),
    room: z.string(),
    text: z.string().min(1, { message: "Message cannot be empty" }),
});

export const directMessageWebSocketHandlers = {
    joinRoom(socket: Socket, payload: unknown) {
        const parsed = joinRoomSchema.safeParse(payload);

        if (parsed.success) {
            const { friendId } = parsed.data;
            const roomName = `dm_${friendId}`;
            socket.join(roomName);
            logger.info(`[📨 dm] JOIN: ${roomName}`);
        }
    },
    leaveRoom(socket: Socket, payload: unknown) {
        const parsed = leaveRoomSchema.safeParse(payload);

        if (parsed.success) {
            const { friendId } = parsed.data;
            const roomName = `dm_${friendId}`;
            socket.leave(roomName);
            logger.info(`[📨 dm] LEAVE: ${roomName}`);
        }
    },
    sendMessage(payload: unknown) {
        const parsed = sendMessageSchema.safeParse(payload);

        if (parsed.success) {
            const { senderUserId, friendId, text, room } = parsed.data;

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
            })()
                .then(() => {
                    logger.info(`[📨 dm] Message enqueued to save later on`);
                })
                .catch((e) => {
                    logger.error(`[📨 dm] Failed to send message`);
                    logger.error(e);
                });
        }
    },
};

// This cronjob saves direct messages in DB every minute
schedule("* * * * *", function saveDMs() {
    try {
        const promises: Promise<
            (typeof friendsDirectMessages)[keyof typeof friendsDirectMessages]["dbModelInstance"]
        >[] = [];

        for (const friendId in friendsDirectMessages) {
            const savedDM = friendsDirectMessages[friendId];
            if (
                savedDM.saveStatus === "pending" ||
                savedDM.saveStatus === "error"
            ) {
                promises.push(savedDM.dbModelInstance.save());
            }
        }

        logger.info(
            `[📮 DMs save DMs]: Saving ${promises.length} DM documents`,
        );

        (async () => {
            // Await for all saves to complete
            await Promise.all(promises);

            // Mark DMs as saved
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

        logger.error(`[📮 DMs save DMs] Failed to save: ${error}`);
    }
});
