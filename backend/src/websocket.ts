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
    logger.info(`Consumer connected to websocket: ${socket.id}`);

    socket.on("disconnect", function socketDisconnected() {
        logger.info(`Consumer disconnected from websocket: ${socket.id}`);
    });
});
