import { EmailSignupInputs } from "../components/auth/SignupForm";
import { HTTP_METHOD, api } from "../lib/api";

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
}

export const authService = new AuthService();
