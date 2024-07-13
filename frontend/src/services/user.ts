import { HTTP_METHOD, api } from "../lib/api";
import * as z from "zod";
import { UserSchema } from "../utils/zod";

const GetLoggedInUserProfile = z.object({ user: UserSchema });

export type GetLoggedInUserProfile = z.infer<typeof GetLoggedInUserProfile>;

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
            GetLoggedInUserProfile
        );
    }

    async updateProfile(payload: FormData) {
        return await api.fetch(
            "UPDATE_USER_PROFILE",
            { method: HTTP_METHOD.PATCH, isProtected: true, data: payload },
            (_data, status) => status === 200
        );
    }
}

export const userService = new UserService();
