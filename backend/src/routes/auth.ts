import { Router } from "express";
import { validateResource } from "../middlewares/zod";
import * as schemas from "../schema/auth";
import * as ctrls from "../controllers/auth";
import { handleMiddlewareError } from "../utils/async";
import { sendErrorResponse } from "../utils/errors";
import passport from "passport";
import { verifyAuth } from "../middlewares/auth";
import { STRATEGY } from "../utils/auth";

export const router = Router();

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

router.post(
    "/login/:token",
    validateResource(schemas.emailCompleteMagicLinkLoginSchema),
    handleMiddlewareError(ctrls.completeMagicLinkLoginCtrl),
    sendErrorResponse,
);

// Google OAuth (signup)
router
    .get(
        STRATEGY.GOOGLE_SIGNUP,
        passport.authenticate(STRATEGY.GOOGLE_SIGNUP, {
            scope: ["profile", "email"],
        }),
        function signupWithGoogle() {},
    )
    .get(
        "/signup/google/redirect",
        passport.authenticate(STRATEGY.GOOGLE_SIGNUP, {
            failureMessage: "Cannot signup with Google, please try again",
            successRedirect: process.env.OAUTH_SIGNUP_SUCCESS_REDIRECT_URL,
            failureRedirect: process.env.OAUTH_SIGNUP_FAILURE_REDIRECT_URL,
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
            successRedirect: process.env.OAUTH_LOGIN_SUCCESS_REDIRECT_URL,
            failureRedirect: `${process.env.OAUTH_LOGIN_FAILURE_REDIRECT_URL}?info=signup-invalid`,
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
