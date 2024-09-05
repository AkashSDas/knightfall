import { type PropsWithChildren, useEffect, useState } from "react";

import { SocketContext, socket } from "@/lib/websocket";

/** Wrap the root of the component tree under which you want to use the websocket. */
export function SocketProvider(props: PropsWithChildren<unknown>) {
    /** Status of whether we are connected to the server */
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
