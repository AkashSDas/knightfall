import { EmailSignupInputs } from "../components/auth/SignupForm";
import { HTTP_METHOD, api } from "../lib/api";
import * as z from "zod";
import { UserSchema } from "../utils/zod";
import { CompleteOAuthSignupInputs } from "../components/auth/CompleteOAuthSignupForm";

const GetNewAccessTokenSchema = z.object({
    accessToken: z.string(),
    user: UserSchema,
});
const CompleteOAuthSignupSchema = z.object({
    user: UserSchema,
});

class AuthService {
    constructor() {}

    async emailSignup(payload: EmailSignupInputs) {
        return await api.fetch(
            "EMAIL_SIGNUP",
            { method: HTTP_METHOD.POST, data: payload },
            (data, status) =>
                status === 201 &&
                typeof data === "object" &&
                data !== null &&
                "message" in data &&
                data.message === "Account created"
        );
    }

    async getNewAccessToken() {
        return await api.fetch<z.infer<typeof GetNewAccessTokenSchema>>(
            "NEW_ACCESS_TOKEN",
            { method: HTTP_METHOD.GET },
            (data, status) =>
                status === 200 &&
                typeof data === "object" &&
                data !== null &&
                "user" in data &&
                "accessToken" in data,
            GetNewAccessTokenSchema
        );
    }

    async cancelOAuthSignup() {
        return await api.fetch<unknown>("CANCEL_OAUTH_SIGNUP", {
            method: HTTP_METHOD.DELETE,
        });
    }

    async completeOAuthSignup(payload: CompleteOAuthSignupInputs) {
        return await api.fetch<z.infer<typeof CompleteOAuthSignupSchema>>(
            "COMPLETE_OAUTH_SIGNUP",
            { method: HTTP_METHOD.PUT, data: payload },
            (data, status) =>
                status === 200 &&
                typeof data === "object" &&
                data !== null &&
                "user" in data,
            CompleteOAuthSignupSchema
        );
    }
}

export const authService = new AuthService();
