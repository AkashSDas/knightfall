import { useEffect } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    autoConnect: true,
});

export function useWebSocket() {
    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        window.addEventListener("beforeunload", handleUnload);

        return () => {
            console.log("Disconnecting from server");
            socket.disconnect();
            window.removeEventListener("beforeunload", handleUnload);
        };

        function handleUnload() {
            socket.disconnect();
        }
    }, []);
}
