import { PropsWithChildren, useEffect, useState } from "react";
import { SocketContext, socket } from "../lib/websocket";

export function SocketProvider(props: PropsWithChildren<unknown>) {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(function handleWebSocketConnection() {
        socket.connect();

        socket.on("connect", () => {
            setIsConnected(true);
            console.log("Connected to server");
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
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

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {props.children}
        </SocketContext.Provider>
    );
}
