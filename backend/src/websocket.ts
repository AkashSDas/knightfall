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
    logger.info("Connected to websocket");

    socket.on("disconnect", function socketDisconnected() {
        logger.info("Disconnected from websocket");
    });
});
