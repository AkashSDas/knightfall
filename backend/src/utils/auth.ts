import { CookieOptions } from "express";

export const REFRESH_TOKEN_COOKIE_KEY = "refreshToken";

export const loginCookieConfig: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
};

export const STRATEGY = {
    GOOGLE_SIGNUP: "google-signup",
    GOOGLE_LOGIN: "google-login",
} as const;
