import { createContext } from "react";
import io, { Socket } from "socket.io-client";

export const socket: Socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ["websocket"],
    autoConnect: false, // Disable autoConnect to manually connect
});

export const SocketContext = createContext<{
    socket: Socket | null;
    isConnected: boolean;
}>({
    socket: null,
    isConnected: false,
});
