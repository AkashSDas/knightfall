import { Types } from "mongoose";
import { Socket } from "socket.io";
import { z } from "zod";

import { logger } from "@/utils/logger";

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

export const notificationWebSocketHandlers = {
    joinRoom(socket: Socket, payload: unknown) {
        const parsed = joinRoomSchema.safeParse(payload);

        if (parsed.success) {
            const { userId } = parsed.data;
            const roomName = `notification_${userId}`;
            socket.join(roomName);
            logger.info(`[🔔 notification] JOIN: ${roomName}`);
        }
    },
    leaveRoom(socket: Socket, payload: unknown) {
        const parsed = leaveRoomSchema.safeParse(payload);

        if (parsed.success) {
            const { userId } = parsed.data;
            const roomName = `notification_${userId}`;
            socket.leave(roomName);
            logger.info(`[🔔 notification] LEAVE: ${roomName}`);
        }
    },
};
