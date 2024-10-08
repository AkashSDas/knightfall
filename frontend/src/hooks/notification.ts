import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";

import { SocketContext } from "@/lib/websocket";
import { notificationService } from "@/services/notification";
import { type Notification, NotificationSchema } from "@/utils/schemas";

import { useUser } from "./auth";

type UseNotificationsReturn = {
    notifications: Notification[];
    isLoading: boolean;
    fetchMore: () => void;
    hasMore: boolean;
    totalCount: number;
    isFetchingMore: boolean;
};

export function useNotifications({ limit = 5 }): UseNotificationsReturn {
    const { user, isAuthenticated } = useUser();
    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
        useInfiniteQuery({
            // eslint-disable-next-line @tanstack/query/exhaustive-deps
            queryKey: ["notifications", user?.id, limit],
            enabled: isAuthenticated,
            queryFn: ({ pageParam }) => {
                return notificationService.getLoggedInUserNotifications(
                    limit,
                    pageParam
                );
            },
            initialPageParam: 0,
            getNextPageParam: (lastPage) => {
                const lastPageLength = lastPage.notifications?.length;
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

    const notifications: Notification[] =
        data?.pages.reduce(function flatNotification(acc, cur) {
            return [...acc, ...cur.notifications];
        }, [] as Notification[]) ?? [];

    return {
        notifications,
        isLoading,
        fetchMore: fetchNextPage,
        hasMore: hasNextPage,
        isFetchingMore: isFetchingNextPage,
        totalCount: data?.pages[0].totalCount ?? 0,
    };
}

export function useNotificationRoom() {
    const { socket, isConnected } = useContext(SocketContext);
    const { isAuthenticated, user } = useUser();

    useEffect(
        function handleNotificationSocket() {
            if (socket && isConnected && isAuthenticated && user) {
                socket.emit("joinNotification", { userId: user.id });
            }

            window.addEventListener("beforeunload", handleUnload);

            return function cleanUpNotificationSocket() {
                handleUnload();
                window.removeEventListener("beforeunload", handleUnload);
            };

            function handleUnload() {
                if (socket && isConnected && isAuthenticated && user) {
                    socket.emit("leaveNotification", { userId: user.id });
                }
            }
        },
        [socket, isConnected, isAuthenticated, user?.id]
    );
}

export function useListenToNotifications() {
    const { socket, isConnected } = useContext(SocketContext);
    const queryClient = useQueryClient();
    const { isAuthenticated, user } = useUser();

    useEffect(
        function listenToNotifications() {
            if (isConnected && socket && isAuthenticated) {
                socket.on("notification", receiveNotification);
            }

            window.addEventListener("beforeunload", handleUnload);

            return () => {
                handleUnload();
                window.removeEventListener("beforeunload", handleUnload);
            };

            function handleUnload() {
                if (isConnected && socket && isAuthenticated && user) {
                    socket.off("notification", receiveNotification);
                }
            }

            function receiveNotification(data: unknown) {
                const output = NotificationSchema.safeParse(data);

                if (output.success) {
                    const key = ["notifications", user?.id];
                    queryClient.invalidateQueries({ queryKey: key });
                }
            }
        },
        [socket, isConnected, isAuthenticated, user?.id]
    );
}
