import * as z from "zod";

import { HTTP_METHOD, api } from "@/lib/api";
import { UserSchema } from "@/utils/schemas";

// ===================================
// Schemas
// ===================================

const GetLoggedInUserProfileResponseSchema = z.object({
    user: UserSchema,
});

const GetUserPublicProfileResponseSchema = z.object({
    user: z.object({
        id: z.string(),
        username: z.string().optional(),
        isBanned: z.boolean(),
        profilePic: z.object({ URL: z.string() }),
        winPoints: z.number().min(0),
        achievements: z.array(z.string()),
        rank: z.enum([
            "Top 1",
            "Top 2",
            "Top 3",
            "Top 10",
            "Top 50",
            "Top 100",
            "Above 100",
        ]),
    }),
});

const SearchPlayersResponseSchema = z.object({
    players: z.array(
        z
            .object({
                _id: z.string(),
                username: z.string().optional(),
                isBanned: z.boolean(),
                profilePic: z.object({ URL: z.string() }),
                winPoints: z.number().min(0),
                achievements: z.array(z.string()),
            })
            .transform((data) => ({ id: data._id, ...data }))
    ),
    totalCount: z.number().min(0),
    nextPageOffset: z.number().min(0),
});

export type GetUserPublicProfileResponse = z.infer<
    typeof GetUserPublicProfileResponseSchema
>;

// ===================================
// Service
// ===================================

class UserService {
    constructor() {}

    async getLoggedInUserProfile() {
        return await api.fetch<
            z.infer<typeof GetLoggedInUserProfileResponseSchema>,
            "GET_LOGGED_IN_USER_PROFILE"
        >(
            "GET_LOGGED_IN_USER_PROFILE",
            { method: HTTP_METHOD.GET },
            function (data, status) {
                return (
                    status === 200 &&
                    typeof data === "object" &&
                    data !== null &&
                    "user" in data
                );
            },
            GetLoggedInUserProfileResponseSchema
        );
    }

    async patchLoggedInUserProfile(payload: FormData) {
        return await api.fetch(
            "UPDATE_USER_PROFILE",
            { method: HTTP_METHOD.PATCH, isProtected: true, data: payload },
            (_data, status) => status === 200
        );
    }

    async getPlayerPublicProfile(userId: string) {
        const [ok, err] = await api.fetch<
            z.infer<typeof GetUserPublicProfileResponseSchema>,
            "GET_PUBLIC_PROFILE"
        >(
            "GET_PUBLIC_PROFILE",
            { method: HTTP_METHOD.GET, urlPayload: { userId } },
            function (data, status) {
                return (
                    status === 200 &&
                    data !== null &&
                    typeof data === "object" &&
                    "user" in data
                );
            },
            GetUserPublicProfileResponseSchema
        );

        if (!ok || err) {
            return null;
        } else {
            return ok.user;
        }
    }

    async searchPlayers(queryText: string, limit: number, offset: number) {
        const [ok] = await api.fetch<
            z.infer<typeof SearchPlayersResponseSchema>,
            "SEARCH_PLAYERS"
        >(
            "SEARCH_PLAYERS",
            { method: HTTP_METHOD.GET, params: { limit, offset, queryText } },
            function (data, status) {
                return (
                    status === 200 &&
                    typeof data === "object" &&
                    data !== null &&
                    "players" in data &&
                    "totalCount" in data &&
                    "nextPageOffset" in data
                );
            },
            SearchPlayersResponseSchema
        );

        if (!ok) {
            return {
                nextPageOffset: 0,
                players: [] as z.infer<
                    typeof SearchPlayersResponseSchema
                >["players"],
                totalCount: 0,
            };
        } else {
            return ok;
        }
    }
}

/** Interact with user endpoints. */
export const userService = new UserService();
