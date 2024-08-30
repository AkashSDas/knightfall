import { createServer } from "http";
import { Server } from "socket.io";

import { app } from "./api";
import { logger } from "./utils/logger";
import { directMessageWebSocketHandlers } from "./websocket/direct-message";
import { lobbyWebSocketHandlers } from "./websocket/lobby";
import { matchWebSocketHandlers } from "./websocket/match";
import { notificationWebSocketHandlers } from "./websocket/notification";

export const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_BASE_URL,
        credentials: true,
    },
});

// Rooms are used to make create socket connect between client and server.
io.on("connection", function connectToWebSocket(socket) {
    logger.info(`[🟢 socket] CONNECTED: ${socket.id}`);

    socket.on("error", function socketError(error) {
        logger.error(`[🟢 socket] ERROR: ${error}`);
    });

    socket.on("disconnect", function socketDisconnected() {
        logger.info(`[🟢 socket] DISCONNECTED: ${socket.id}`);
    });

    // ================================
    // Notification
    // ================================

    socket.on("joinNotification", function joinNotificationRoom(payload) {
        notificationWebSocketHandlers.joinRoom(socket, payload);
    });

    socket.on("leaveNotification", function leaveNotificationRoom(payload) {
        notificationWebSocketHandlers.leaveRoom(socket, payload);
    });

    // ================================
    // Direct Message
    // ================================

    socket.on("joinDirectMessage", function joinDirectMessageRoom(payload) {
        directMessageWebSocketHandlers.joinRoom(socket, payload);
    });

    socket.on("leaveDirectMessage", function leaveDirectMessageRoom(payload) {
        directMessageWebSocketHandlers.leaveRoom(socket, payload);
    });

    socket.on("directMessage", function sendMessageToReceiver(payload) {
        directMessageWebSocketHandlers.sendMessage(payload);
    });

    // ==========================================
    // Search for player to play game with
    // ==========================================

    socket.on("joinSearchPlayerForGame", function (payload) {
        lobbyWebSocketHandlers.joinRoom(socket, payload);
    });

    socket.on("leaveSearchPlayerForGame", function (payload) {
        lobbyWebSocketHandlers.leaveRoom(socket, payload);
    });

    socket.on("searchPlayerForGame", function searchPlayerForGame(payload) {
        lobbyWebSocketHandlers.pushToLobby(payload);
    });

    // ==========================================
    // Match room
    // ==========================================

    socket.on("joinMatchRoom", function joinMatchRoom(payload) {
        matchWebSocketHandlers.joinRoom(socket, payload);
    });

    socket.on("leaveMatchRoom", function leaveMatchRoom(payload) {
        matchWebSocketHandlers.leaveRoom(socket, payload);
    });

    socket.on("matchChessStart", function matchChessStarted(payload) {
        matchWebSocketHandlers.startGame(payload);
    });

    socket.on("matchChessEnd", function matchChessEnded(payload) {
        matchWebSocketHandlers.endGame(socket, payload);
    });

    socket.on("matchChessMove", function matchChessMove(payload) {
        matchWebSocketHandlers.makeMove(payload);
    });
});
