import { HTTP_METHOD, api } from "../lib/api";
import * as z from "zod";
import { UserSchema } from "../utils/zod";

const GetLoggedInUserProfile = z.object({ user: UserSchema });

class UserService {
    constructor() {}

    async getLoggedInUserProfile() {
        return await api.fetch<z.infer<typeof GetLoggedInUserProfile>>(
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
}

export const userService = new UserService();
