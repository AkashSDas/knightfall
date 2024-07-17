import { HTTP_METHOD, api } from "../lib/api";

class FriendService {
    constructor() {}

    async sendFriendRequest(sendRequestToUserId: string) {
        const [ok, err] = await api.fetch(
            "SEND_FRIEND_REQUEST",
            {
                method: HTTP_METHOD.POST,
                data: { toUserId: sendRequestToUserId },
                isProtected: true,
            },
            (data, status) =>
                status === 200 &&
                typeof data === "object" &&
                data !== null &&
                "message" in data
        );

        if (err || !ok) {
            return err?.message ?? "Failed to send friend request";
        } else {
            if (
                typeof ok === "object" &&
                ok !== null &&
                "message" in ok &&
                typeof ok.message === "string"
            )
                return ok.message;

            return "Friend request sent";
        }
    }
}

export const friendService = new FriendService();
