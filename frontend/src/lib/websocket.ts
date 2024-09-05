import { createContext } from "react";
import io, { Socket } from "socket.io-client";

import { envVariables } from "@/utils/env";

export const socket: Socket = io(envVariables.VITE_BACKEND_URL, {
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
