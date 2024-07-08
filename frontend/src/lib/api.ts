import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { AnyZodObject } from "zod";
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "../utils/auth";

const endpoints = {
    // Auth
    EMAIL_SIGNUP: "/api/auth/signup",
    NEW_ACCESS_TOKEN: "/api/auth/access-token",
    CANCEL_OAUTH_SIGNUP: "/api/auth/cancel-oauth",
    COMPLETE_OAUTH_SIGNUP: "/api/auth/complete-oauth",

    // User
    GET_LOGGED_IN_USER_PROFILE: "/api/user/profile",
} as const;

export const HTTP_METHOD = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE",
};

type Ok<T> = T | null;
type Err = { message: string; data: unknown; fromServer: boolean } | null;

class APIProvider {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: import.meta.env.VITE_BACKEND_URL,
            withCredentials: true,
            timeout: 3000, // 3 seconds
            timeoutErrorMessage: "Request timed out",
        });
    }

    private getAccessToken(): string {
        const token = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
        if (typeof token !== "string") throw new Error("Token not found");
        return token;
    }

    async fetch<T>(
        action: keyof typeof endpoints,
        config: AxiosRequestConfig & {
            /** If is protected then pass the bearer token. */
            isProtected?: boolean;
        },
        /**
         * To check if the request is successful. Like status code is 200 and
         * 'user' is in body.
         **/
        conditionForSuccess?: (data: T, status: number) => boolean,

        /** Validate retured payload using zod schema */
        zodSchema?: AnyZodObject
    ): Promise<[Ok<T>, Err]> {
        try {
            const res = await this.api(endpoints[action], {
                ...config,
                headers: {
                    ...(config.headers ?? {}),
                    ...(config.isProtected
                        ? { Authorization: `Bearer ${this.getAccessToken()}` }
                        : {}),
                },
            });

            const { data, status } = res;

            let checkConditions = true;
            if (conditionForSuccess) {
                checkConditions = conditionForSuccess(data, status);
            }

            if (checkConditions) {
                if (zodSchema) {
                    await zodSchema.parseAsync(data);
                }

                return [data, null];
            } else {
                return [data, null];
            }
        } catch (e) {
            if (e instanceof AxiosError) {
                if (e.response) {
                    const { message, data } = e.response.data ?? {};
                    return [
                        null,
                        {
                            message: message ?? e.message,
                            data: data ?? null,
                            fromServer: true,
                        },
                    ];
                }

                if (e.message === "Network Error") {
                    return [
                        null,
                        {
                            message: "Network Error",
                            data: null,
                            fromServer: false,
                        },
                    ];
                }
            }
        }

        return [
            null,
            {
                message: "Unknown error",
                data: null,
                fromServer: false,
            },
        ];
    }
}

export const api = new APIProvider();
