import { z } from "zod";
import { HTTP_METHOD, api } from "../lib/api";
import { FRIEND_REQUEST_STATUS } from "../utils/friend";

const FriendUserSchema = z.object({
    id: z.string(),
    username: z.string().optional(),
    isBanned: z.boolean(),
    profilePic: z.object({ URL: z.string(), id: z.string().optional() }),
    winPoints: z.number().min(0),
    achievements: z.array(z.string()),
});

const GetFriendRequestsSchema = z.object({
    friends: z.array(
        z.object({
            id: z.string(),
            fromUser: FriendUserSchema,
            toUser: FriendUserSchema,
            status: z.nativeEnum(FRIEND_REQUEST_STATUS),
            createdAt: z.string().transform((v) => new Date(v)),
        })
    ),
});

class FriendService {
    constructor() {}

    async getFriendRequests(
        requestStatus: (typeof FRIEND_REQUEST_STATUS)[keyof typeof FRIEND_REQUEST_STATUS],
        type: "from" | "to"
    ) {
        return await api.fetch<
            z.infer<typeof GetFriendRequestsSchema>,
            "GET_FRIEND_REQUESTS"
        >(
            "GET_FRIEND_REQUESTS",
            {
                method: HTTP_METHOD.GET,
                params: { requestStatus, type },
                isProtected: true,
            },
            (data, status) =>
                status === 200 &&
                typeof data === "object" &&
                data !== null &&
                "friends" in data,
            GetFriendRequestsSchema
        );
    }

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

    async updateFriendRequestStatus(
        requestStatus: (typeof FRIEND_REQUEST_STATUS)[keyof typeof FRIEND_REQUEST_STATUS],
        friendId: string
    ): Promise<string> {
        const [ok, err] = await api.fetch("UPDATE_FRIEND_REQUEST_STATUS", {
            method: HTTP_METHOD.PATCH,
            data: { friendId, requestStatus },
            isProtected: true,
        });

        if (err || !ok) {
            return err?.message ?? "Failed to update friend request status";
        } else if (
            typeof ok === "object" &&
            ok !== null &&
            "message" in ok &&
            typeof ok.message === "string"
        ) {
            return ok.message;
        } else {
            return "Friend request status updated";
        }
    }

    async searchFriendsByUsernameOrUserId(queryText: string) {
        return await api.fetch<
            z.infer<typeof GetFriendRequestsSchema>,
            "SEARCH_FRIENDS"
        >(
            "SEARCH_FRIENDS",
            {
                method: HTTP_METHOD.GET,
                params: { queryText },
                isProtected: true,
            },
            (data, status) =>
                status === 200 &&
                typeof data === "object" &&
                data !== null &&
                "friends" in data,
            GetFriendRequestsSchema
        );
    }
}

export const friendService = new FriendService();
