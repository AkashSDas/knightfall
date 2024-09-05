import { useInfiniteQuery } from "@tanstack/react-query";

import { userService } from "@/services/user";

type Config = {
    limit?: number;
    searchText: string;
};

export function useSearchPlayers({ limit = 10, searchText }: Config) {
    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
        useInfiniteQuery({
            // eslint-disable-next-line @tanstack/query/exhaustive-deps
            queryKey: ["searchPlayers", searchText],
            // enabled: searchText.length > 2,
            queryFn: ({ pageParam }) => {
                return userService.searchPlayers(searchText, limit, pageParam);
            },
            initialPageParam: 0,
            getNextPageParam: (lastPage) => {
                const lastPageLength = lastPage.players?.length;
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

    const players =
        data?.pages.reduce(
            function flatPlayers(acc, cur) {
                return [...acc, ...cur.players];
            },
            [] as NonNullable<typeof data>["pages"][number]["players"]
        ) ?? [];

    return {
        players,
        isLoading,
        fetchMore: fetchNextPage,
        totalCount: data?.pages[0]?.totalCount ?? 0,
        hasMore: hasNextPage,
        isFetchingMore: isFetchingNextPage,
    };
}
