import axios, {
    AxiosError,
    type AxiosInstance,
    type AxiosRequestConfig,
} from "axios";
import { type AnyZodObject } from "zod";

import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "@/utils/auth";
import { envVariables } from "@/utils/env";

const endpoints = {
    // Auth
    EMAIL_SIGNUP: "/api/auth/signup",
    EMAIL_LOGIN: "/api/auth/login",
    NEW_ACCESS_TOKEN: "/api/auth/access-token",
    CANCEL_OAUTH_SIGNUP: "/api/auth/cancel-oauth",
    COMPLETE_OAUTH_SIGNUP: "/api/auth/complete-oauth",
    LOGOUT: "/api/auth/logout",
    MAGIC_LINK_TOKEN_VERIFICATION({ token }: { token: string }) {
        return `/api/auth/login/${token}`;
    },

    // User
    GET_LOGGED_IN_USER_PROFILE: "/api/user/profile",
    UPDATE_USER_PROFILE: "/api/user/profile",
    GET_PUBLIC_PROFILE({ userId }: { userId: string }) {
        return `/api/user/profile/${userId}`;
    },
    SEARCH_PLAYERS: "/api/user/search-players",

    // Notification
    GET_NOTIFICATIONS: "/api/notification",
    MARK_NOTIFICATION_AS_SEEN: "/api/notification/mark-seen",

    // Friend
    SEND_FRIEND_REQUEST: "/api/friend/request",
    GET_FRIEND_REQUESTS: "/api/friend/request",
    UPDATE_FRIEND_REQUEST_STATUS: "/api/friend/request",
    SEARCH_FRIENDS: "/api/friend/search",

    // Direct messages
    GET_DIRECT_MESSAGES: "/api/direct-message",

    // Match
    GET_MATCH({ matchId }: { matchId: string }) {
        return `/api/match/${matchId}`;
    },
} as const;

export const HTTP_METHOD = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE",
};

// Utility type to extract the parameters of a function if it is a function, otherwise it is never
type EndpointPayload<T> = T extends (...args: infer P) => unknown
    ? P[0]
    : never;

// Utility type to make `urlPayload` required if the endpoint is a function
type FetchConfig<U extends keyof typeof endpoints> =
    EndpointPayload<(typeof endpoints)[U]> extends never
        ? AxiosRequestConfig & { isProtected?: boolean }
        : AxiosRequestConfig & {
              isProtected?: boolean;
              /** Payload that will be used to create url. */
              urlPayload: EndpointPayload<(typeof endpoints)[U]>;
          };

type Ok<T> = T | null;
export type Err = {
    message: string;
    data: unknown;
    fromServer: boolean;
} | null;

class APIProvider {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: envVariables.VITE_BACKEND_URL,
            withCredentials: true,
            timeout: 3000, // 3 seconds
            timeoutErrorMessage: "Request timed out",
        });
    }

    private getAccessToken(): string | null {
        // In BE when a request is checked if user is authenticated or not
        // there we first check if the user is OAuth logged in the continue
        // else check the bearer token. So if there's an OAuth logged in
        // Sending null as bearer token won't give error because it won't be validated
        // in case of OAuth (which is what we want), and in case of magic email
        // login it will give (which is what we want).

        const token = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
        return token;
    }

    async fetch<T, U extends keyof typeof endpoints>(
        action: U,
        config: FetchConfig<U>,
        /**
         * To check if the request is successful. Like status code is 200 and
         * 'user' is in body.
         **/
        conditionForSuccess?: (data: T, status: number) => boolean,

        /** Validate retured payload using zod schema */
        zodSchema?: AnyZodObject
    ): Promise<[Ok<T>, Err]> {
        try {
            const url = endpoints[action];
            let endpoint: string;
            if (typeof url !== "string") {
                if ("urlPayload" in config) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    endpoint = url(config.urlPayload as any);
                } else {
                    throw new Error(
                        `'config.urlPayload' is missing for ${action}`
                    );
                }
            } else {
                endpoint = url;
            }

            const res = await this.api(endpoint, {
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
                    const output = (await zodSchema.parseAsync(data)) as T;
                    return [output, null];
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

/** Interact with API. */
export const api = new APIProvider();
