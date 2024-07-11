import { PropsWithChildren, useEffect } from "react";
import { SocketContext, socket } from "../lib/websocket";

export function SocketProvider(props: PropsWithChildren<unknown>) {
    useEffect(function handleWebSocketConnection() {
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

    return (
        <SocketContext.Provider value={{ socket: socket }}>
            {props.children}
        </SocketContext.Provider>
    );
}
