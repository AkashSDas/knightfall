import { createServer } from "http";
import { Server } from "socket.io";
import { app } from "./api";
import { logger } from "./utils/logger";

export const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_BASE_URL,
        credentials: true,
    },
});

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
});
