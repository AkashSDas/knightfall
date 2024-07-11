import { useInfiniteQuery } from "@tanstack/react-query";
import { useUser } from "./auth";
import { Notification, notificationService } from "../services/notification";

type UseNotificationsReturn = {
    notifications: Notification[];
    isLoading: boolean;
    fetchMore: () => void;
    hasMore: boolean;
};

export function useNotifications({ limit = 5 }): UseNotificationsReturn {
    const { user, isAuthenticated } = useUser();
    const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
        queryKey: ["notifications", user?.id, limit],
        enabled: isAuthenticated,
        queryFn: ({ pageParam }) => {
            return notificationService.getMany(limit, pageParam);
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

    console.log({ data });

    const notifications: Notification[] =
        data?.pages.reduce((acc, cur) => {
            return [...acc, ...cur.notifications];
        }, [] as Notification[]) ?? [];

    return {
        notifications,
        isLoading,
        fetchMore: fetchNextPage,
        hasMore: hasNextPage,
    };
}
