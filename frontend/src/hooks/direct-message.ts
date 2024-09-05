import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { SocketContext } from "@/lib/websocket";
import { directMessageService } from "@/services/direct-message";
import { friendsChatActions } from "@/store/friends-chat/slice";
import { type DirectMessage } from "@/utils/schemas";

import { useUser } from "./auth";
import { useAppDispatch } from "./store";

const ReceivedDMSchema = z.object({
    directMessageId: z.string(),
    friendId: z.string(),
    messageId: z.string(),
    senderUserId: z.string(),
    text: z.string(),
});

export function useDirectMessageRoom(friendId: string | undefined) {
    const { socket, isConnected } = useContext(SocketContext);
    const { isAuthenticated, user } = useUser();

    useEffect(
        function handleDirectMessageSocket() {
            if (socket && isConnected && isAuthenticated && user && friendId) {
                socket.emit("joinDirectMessage", { friendId });

                window.addEventListener("beforeunload", handleUnload);

                return function cleanUpDirectMessageSocket() {
                    handleUnload();
                    window.removeEventListener("beforeunload", handleUnload);
                };
            }

            function handleUnload() {
                if (
                    socket &&
                    isConnected &&
                    isAuthenticated &&
                    user &&
                    friendId
                ) {
                    socket.emit("leaveDirectMessage", { friendId });
                }
            }
        },
        [socket, isConnected, isAuthenticated, user?.id, friendId]
    );
}

export function useListenToDirectMessages(friendId: string | undefined) {
    const { socket, isConnected } = useContext(SocketContext);
    const { isAuthenticated, user } = useUser();
    const [hasConnected, setHasConnected] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(
        function listenToDMs() {
            if (socket && isConnected && isAuthenticated && user && friendId) {
                socket.on("directMessage", receivedMessage);
                setHasConnected(true);
            }

            window.addEventListener("beforeunload", handleUnload);

            return function cleanUpDirectMessageSocket() {
                handleUnload();
                window.removeEventListener("beforeunload", handleUnload);
            };

            function handleUnload() {
                if (
                    socket &&
                    isConnected &&
                    isAuthenticated &&
                    user &&
                    friendId
                ) {
                    socket.off("directMessage", receivedMessage);
                    setHasConnected(false);
                }
            }

            function receivedMessage(data: unknown) {
                const parsed = ReceivedDMSchema.safeParse(data);

                if (parsed.success) {
                    dispatch(friendsChatActions.pushMessage(parsed.data));
                }
            }
        },
        [socket, isConnected, isAuthenticated, user?.id]
    );

    return { hasConnected };
}

export function useDirectMessages(args: { limit?: number; friendId?: string }) {
    const { limit = 20, friendId } = args;
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useUser();
    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
        useInfiniteQuery({
            // eslint-disable-next-line @tanstack/query/exhaustive-deps
            queryKey: ["directMessages", user?.id, limit, friendId],
            enabled: isAuthenticated && friendId !== undefined,
            queryFn: ({ pageParam }) => {
                return directMessageService.getDMs(limit, pageParam, friendId!);
            },
            initialPageParam: 0,
            getNextPageParam: (lastPage) => {
                const lastPageLength = lastPage.directMessages?.length;
                if (lastPageLength) {
                    if (lastPageLength < limit) {
                        return undefined;
                    } else {
                        return lastPage.nextPageOffset ?? 0;
                    }
                }
            },
            staleTime: 1000 * 30, // 30secs
        });

    const directMessages: DirectMessage[] = useMemo(
        function flatDMs() {
            return (
                data?.pages.reduce((acc, cur) => {
                    return [...acc, ...cur.directMessages];
                }, [] as DirectMessage[]) ?? []
            );
        },
        [data]
    );

    useEffect(
        function updateReduxFriendChat() {
            if (directMessages.length > 0 && friendId) {
                dispatch(
                    friendsChatActions.initialPopulateFriendChat({
                        friendId: friendId,
                        messages: directMessages,
                    })
                );
            }
        },
        [directMessages, isLoading, friendId]
    );

    return {
        isLoading,
        fetchMore: fetchNextPage,
        hasMore: hasNextPage,
        isFetchingMore: isFetchingNextPage,
        totalCount: data?.pages[0].totalCount ?? 0,
    };
}
