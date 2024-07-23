import { useContext, useEffect, useRef } from "react";
import { SocketContext } from "../lib/websocket";
import { useUser } from "./auth";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

export function useSearchMatchRoom() {
    const { socket, isConnected } = useContext(SocketContext);
    const { isAuthenticated, user } = useUser();

    useEffect(
        function handleSearchMatchSocket() {
            if (socket && isConnected && isAuthenticated && user) {
                socket.emit("joinSearchPlayerForGame", { userId: user.id });

                window.addEventListener("beforeunload", handleUnload);

                return function cleanUpSearchMatchSocket() {
                    handleUnload();
                    window.removeEventListener("beforeunload", handleUnload);
                };
            }

            function handleUnload() {
                if (socket && isConnected && isAuthenticated && user) {
                    socket.emit("leaveSearchPlayerForGame", {
                        userId: user.id,
                    });
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [socket, isConnected, isAuthenticated, user?.id]
    );
}

const FoundPlayerForMatchSchema = z.object({
    opponentUser: z.object({
        id: z.string(),
        username: z.string(),
        profilePic: z.object({
            URL: z.string(),
            id: z.string().optional(),
        }),
        winPoints: z.number().min(0),
    }),
    matchId: z.string(),
});

export function useSearchMatch() {
    const { socket, isConnected } = useContext(SocketContext);
    const { isAuthenticated, user } = useUser();
    const navigate = useNavigate();

    /** Search players whose winPoints are +10 or -10 of the current user */
    const winPointsDiff = useRef(10);

    useEffect(
        function searchMatch() {
            let interval: ReturnType<typeof setInterval>;

            if (socket && isConnected && isAuthenticated) {
                interval = setInterval(function checkIfPlayerFound() {
                    socket.emit("searchPlayerForGame", {
                        userId: user?.id,
                        addedAt: new Date(),
                        winPoints: user?.winPoints,
                        winPointsOffset: winPointsDiff.current,
                    });

                    // If we didn't find a player whose rank is around current player's
                    // then we increase the diff
                    winPointsDiff.current += 10;
                }, 1000);
            }

            window.addEventListener("beforeunload", handleUnload);

            return function cleanUpSearchMatch() {
                handleUnload();
                window.removeEventListener("beforeunload", handleUnload);
            };

            function handleUnload() {
                if (
                    socket &&
                    isConnected &&
                    isAuthenticated &&
                    user &&
                    interval
                ) {
                    clearInterval(interval);
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [socket, isConnected, isAuthenticated, user?.id]
    );

    useEffect(function listenToFoundMatch() {
        if (socket && isConnected && isAuthenticated) {
            socket.on("foundPlayerForMatch", receiveFoundMatch);
        }

        return function cleanUpFoundMatch() {
            if (socket && isConnected && isAuthenticated) {
                socket.off("foundPlayerForMatch", receiveFoundMatch);
            }
        };

        function receiveFoundMatch(data: unknown) {
            const result = FoundPlayerForMatchSchema.safeParse(data);
            if (result.success) {
                navigate(`/match/${result.data.matchId}`);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
