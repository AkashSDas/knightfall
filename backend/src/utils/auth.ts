import { type CookieOptions } from "express";

import { type ValueOf } from "./types";

/** OAuth PassportJS Strategies. */
export const STRATEGY = {
    GOOGLE_SIGNUP: "google-signup",
    GOOGLE_LOGIN: "google-login",
} as const;

/** Query params values for different PassportJS success/failed OAuth signup/login. */
export const OAUTH_REDIRECT_INFO = {
    signupSuccess: "signup-success",
    signupFailed: "signup-failed",
    loginSuccess: "login-success",

    /** When user's signup is incomplete and user tries to login. */
    signupInvalid: "signup-invalid",
} as const;

/** Supported OAuth Providers (for oauth login/signup). */
export const OAUTH_PROVIDERS = {
    GOOGLE: "google",
} as const;

export const REFRESH_TOKEN_COOKIE_KEY = "refreshToken";

export const loginCookieConfig: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
};

export type OAuthProvider = ValueOf<typeof OAUTH_PROVIDERS>;
