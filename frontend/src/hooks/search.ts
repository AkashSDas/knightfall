import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchPlayers, userService } from "../services/user";

export function useSearchPlayers({
    limit = 5,
    searchText,
}: {
    limit?: number;
    searchText: string;
}): {
    hasMore: boolean;
    isLoading: boolean;
    players: SearchPlayers["players"];
    isFetchingMore: boolean;
    totalCount: number;
    fetchMore: () => void;
} {
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

    const players: SearchPlayers["players"] =
        data?.pages.reduce(
            (acc, cur) => {
                return [...acc, ...cur.players];
            },
            [] as SearchPlayers["players"]
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
