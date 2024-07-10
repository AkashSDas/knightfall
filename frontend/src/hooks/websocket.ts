import { useEffect } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

export function useWebSocket() {
    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        return () => {
            socket.disconnect();
        };
    }, []);
}
