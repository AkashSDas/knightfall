import { useMutation, useQuery } from "@tanstack/react-query";
import { friendService } from "../services/friend";
import { useAppToast } from "./ui";
import { useUser } from "./auth";
import { FRIEND_REQUEST_STATUS } from "../utils/friend";

function useGetFriends(
    status: (typeof FRIEND_REQUEST_STATUS)[keyof typeof FRIEND_REQUEST_STATUS],
    type: "from" | "to"
) {
    const { user, isAuthenticated } = useUser();

    const query = useQuery({
        queryKey: [isAuthenticated, user?.id, "friends", status, type],
        enabled: isAuthenticated,
        queryFn: async () => {
            const [ok, err] = await friendService.getFriendRequests(
                status,
                type
            );

            if (err || !ok) {
                return [] as unknown as NonNullable<typeof ok>["friends"];
            }

            return ok.friends;
        },
        staleTime: 1000 * 60 * 10, // 10mins
    });

    return query;
}

export function useFriendManager() {
    const { infoToast } = useAppToast();
    const { isAuthenticated, pushToLogin } = useUser();

    // "from" here doesn't matter as its going to get friend
    // whose request the user has accepted or vice versa
    const acceptedFriendsQuery = useGetFriends(
        FRIEND_REQUEST_STATUS.ACCEPTED,
        "from"
    );

    const receivedRequestsQuery = useGetFriends(
        FRIEND_REQUEST_STATUS.PENDING,
        "to"
    );

    const sentRequestsQuery = useGetFriends(
        FRIEND_REQUEST_STATUS.PENDING,
        "from"
    );

    /** Logged in user's requests that the other users have rejected */
    const rejectedRequestsQuery = useGetFriends(
        FRIEND_REQUEST_STATUS.REJECTED,
        "to"
    );

    /** Requests that the logged in user has rejected */
    const blockedRequestsQuery = useGetFriends(
        FRIEND_REQUEST_STATUS.REJECTED,
        "from"
    );

    const sendRequestMutation = useMutation({
        mutationFn: async (args: { userId: string }) => {
            if (!isAuthenticated) {
                pushToLogin();
            } else {
                const msg = await friendService.sendFriendRequest(args.userId);
                infoToast(msg);
            }
        },
    });

    return {
        sendRequest: {
            mutation: sendRequestMutation.mutateAsync,
            isPending: sendRequestMutation.isPending,
        },
        acceptedFriendsQuery,
        receivedRequestsQuery,
        sentRequestsQuery,
        rejectedRequestsQuery,
        blockedRequestsQuery,
    };
}
