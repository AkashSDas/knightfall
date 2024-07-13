import { HTTP_METHOD, api } from "../lib/api";
import * as z from "zod";
import { UserSchema } from "../utils/zod";

const getLoggedInUserProfileSchema = z.object({ user: UserSchema });

const getUserPublicProfileSchema = z.object({
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

export type GetLoggedInUserProfile = z.infer<
    typeof getLoggedInUserProfileSchema
>;
export type GetUserPublicProfile = z.infer<typeof getUserPublicProfileSchema>;

class UserService {
    constructor() {}

    async getLoggedInUserProfile() {
        return await api.fetch<
            GetLoggedInUserProfile,
            "GET_LOGGED_IN_USER_PROFILE"
        >(
            "GET_LOGGED_IN_USER_PROFILE",
            { method: HTTP_METHOD.GET },
            (data, status) =>
                status === 200 &&
                typeof data === "object" &&
                data !== null &&
                "user" in data,
            getLoggedInUserProfileSchema
        );
    }

    async updateProfile(payload: FormData) {
        return await api.fetch(
            "UPDATE_USER_PROFILE",
            { method: HTTP_METHOD.PATCH, isProtected: true, data: payload },
            (_data, status) => status === 200
        );
    }

    async getPlayerProfile(userId: string) {
        const [ok, err] = await api.fetch<
            GetUserPublicProfile,
            "GET_PUBLIC_PROFILE"
        >(
            "GET_PUBLIC_PROFILE",
            { method: HTTP_METHOD.GET, urlPayload: { userId } },
            (data, status) =>
                status === 200 &&
                data !== null &&
                typeof data === "object" &&
                "user" in data,
            getUserPublicProfileSchema
        );

        if (!ok || err) {
            return null;
        } else {
            return ok.user;
        }
    }
}

export const userService = new UserService();
