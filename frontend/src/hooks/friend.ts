import { useMutation } from "@tanstack/react-query";
import { friendService } from "../services/friend";
import { useAppToast } from "./ui";

export function useFriendManager() {
    const { infoToast } = useAppToast();

    const sendRequestMutation = useMutation({
        mutationFn: async (args: { userId: string }) => {
            const msg = await friendService.sendFriendRequest(args.userId);
            infoToast(msg);
        },
    });

    return {
        sendRequest: {
            mutation: sendRequestMutation.mutateAsync,
            isPending: sendRequestMutation.isPending,
        },
    };
}
