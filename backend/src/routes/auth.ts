import { Router } from "express";
import { validateResource } from "../middlewares/zod";
import * as schemas from "../schema/auth";
import * as ctrls from "../controllers/auth";
import { handleMiddlewareError } from "../utils/async";
import { sendErrorResponse } from "../utils/errors";
import passport from "passport";
import { verifyAuth } from "../middlewares/auth";
import { OAUTH_REDIRECT_INFO, STRATEGY } from "../utils/auth";
import { config } from "dotenv";

// This is needed for OAuth success. Not sure why, but removing fails
// redirect of OAuth signup/login
if (process.env.NODE_ENV !== "production") config();

export const router = Router();

// Google OAuth (signup)
router
    .get(
        "/signup/google",
        passport.authenticate(STRATEGY.GOOGLE_SIGNUP, {
            scope: ["profile", "email"],
        }),
        function signupWithGoogle() {},
    )
    .get(
        "/signup/google/redirect",
        passport.authenticate(STRATEGY.GOOGLE_SIGNUP, {
            failureMessage: "Cannot signup with Google, please try again",
            successRedirect: `${process.env.OAUTH_SIGNUP_SUCCESS_REDIRECT_URL}?info=${OAUTH_REDIRECT_INFO.signupSuccess}`,
            failureRedirect: `${process.env.OAUTH_SIGNUP_FAILURE_REDIRECT_URL}?info=${OAUTH_REDIRECT_INFO.signupFailed}`,
        }),
    );

// Goggle OAuth (login)
router
    .get(
        "/login/google",
        passport.authenticate(STRATEGY.GOOGLE_LOGIN, {
            scope: ["profile", "email"],
        }),
        function loginWithGoogle() {},
    )
    .get(
        "/login/google/redirect",
        passport.authenticate(STRATEGY.GOOGLE_LOGIN, {
            failureMessage: "Cannot login with Google, please try again",
            successRedirect: `${process.env.OAUTH_LOGIN_SUCCESS_REDIRECT_URL}?info=${OAUTH_REDIRECT_INFO.loginSuccess}`,
            failureRedirect: `${process.env.OAUTH_LOGIN_FAILURE_REDIRECT_URL}?info=${OAUTH_REDIRECT_INFO.signupInvalid}`,
        }),
        function loginWithGoogleRedirect() {},
    );

// Cancel OAuth Signup (this will be used after OAuth Signup)
router.delete(
    "/cancel-oauth",
    handleMiddlewareError(verifyAuth),
    handleMiddlewareError(ctrls.cancelOAuthCtrl),
    sendErrorResponse,
);

// Complete OAuth Signup (this will be used after OAuth Signup)
router.put(
    "/complete-oauth",
    validateResource(schemas.completeOAuthSchema),
    handleMiddlewareError(verifyAuth),
    handleMiddlewareError(ctrls.completeOAuthCtrl),
    sendErrorResponse,
);

router.post(
    "/signup",
    validateResource(schemas.emailSignupSchema),
    handleMiddlewareError(ctrls.emailSignupCtrl),
    sendErrorResponse,
);

router.post(
    "/login",
    validateResource(schemas.emailLoginSchema),
    handleMiddlewareError(ctrls.initMagicLinkLoginCtrl),
    sendErrorResponse,
);

router.get(
    "/login/:token",
    validateResource(schemas.emailCompleteMagicLinkLoginSchema),
    handleMiddlewareError(ctrls.completeMagicLinkLoginCtrl),
    sendErrorResponse,
);

// Get new access token (email/password login)
router.get(
    "/access-token",
    handleMiddlewareError(ctrls.accessTokenCtrl),
    sendErrorResponse,
);

// Logout
router.get(
    "/logout",
    handleMiddlewareError(ctrls.logoutCtrl),
    sendErrorResponse,
);
