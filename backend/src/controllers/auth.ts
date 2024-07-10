import { Request, Response } from "express";
import * as schemas from "../schema/auth";
import { User, UserDocument } from "../models/user";
import { sendEmail } from "../utils/email";
import { BaseApiError } from "../utils/errors";
import { createHash } from "crypto";
import { REFRESH_TOKEN_COOKIE_KEY, loginCookieConfig } from "../utils/auth";
import jwt from "jsonwebtoken";

export async function emailSignupCtrl(
    req: Request<unknown, unknown, schemas.EmailSignup["body"]>,
    res: Response,
) {
    const { email, username } = req.body;
    const user = await User.create({
        email,
        username,
        profilePic: { URL: "https://i.imgur.com/6VBx3io.png" },
    });

    const token = user.createMagicLinkToken();
    const link = `${process.env.FRONTEND_BASE_URL}/auth/login?magic-token=${token}`;
    await user.save({ validateModifiedOnly: true });

    // Not awaiting here so that we don't wait for the email to be sent
    sendEmail({
        to: user.email,
        subject: "Magic link login",
        text: `Click on the link to login: ${link}`,
        html: `Click on the link to login: <a href="${link}">${link}</a>`,
    });

    return res.status(201).json({ message: "Account created" });
}

export async function initMagicLinkLoginCtrl(
    req: Request<unknown, unknown, schemas.EmailLogin["body"]>,
    res: Response,
) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        throw new BaseApiError(404, "User not found");
    }

    const token = user.createMagicLinkToken();
    const link = `${process.env.FRONTEND_BASE_URL}/auth/login?magic-token=${token}`;
    await user.save({ validateModifiedOnly: true });

    // Not awaiting here so that we don't wait for the email to be sent
    sendEmail({
        to: user.email,
        subject: "Magic link login",
        text: `Click on the link to login: ${link}`,
        html: `Click on the link to login: <a href="${link}">${link}</a>`,
    });

    return res.status(200).json({
        message: "Email with login magic link is sent to your email.",
    });
}

export async function completeMagicLinkLoginCtrl(
    req: Request<
        schemas.EmailCompleteMagicLinkLogin["params"],
        unknown,
        unknown
    >,
    res: Response,
) {
    const unhased = createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        magicLinkToken: unhased,
        magicLinkTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
        throw new BaseApiError(400, "Invalid token");
    }

    user.magicLinkToken = undefined;
    user.magicLinkTokenExpiresAt = undefined;
    await user.save({ validateModifiedOnly: true });

    const accessToken = user.createAccessToken();
    const refreshToken = user.createRefreshToken();
    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, loginCookieConfig);

    return res.status(200).json({ accessToken, user });
}

/**
 * Cancel OAuth signup process and delete the user
 *
 * @route DELETE /auth/signup
 * @remark User that logged in will be deleted and OAuth session will be logged out
 *
 * Middleware used are:
 * - `verifyAuth`
 */
export async function cancelOAuthCtrl(req: Request, res: Response) {
    if (!req.user) throw new BaseApiError(401, "Unauthorized");

    const user = await User.findByIdAndDelete((req.user as UserDocument)?._id);
    if (!user) throw new BaseApiError(401, "Unauthorized");

    if (typeof req.logOut === "function") req.logOut(function () {});
    return res.status(200).json({ user });
}

/**
 * Complete user OAuth signup process by saving compulsory fields
 *
 * @route PUT /auth/complete-oauth
 * @remark User that logged in will be updated with compulsory fields
 *
 * Middleware used are:
 * - `verifyAuth`
 */
export async function completeOAuthCtrl(
    req: Request<{}, {}, schemas.CompleteOAuth["body"]>,
    res: Response,
) {
    const user = await User.findByIdAndUpdate(
        (req.user as UserDocument)._id,
        { $set: { username: req.body.username } },
        { new: true },
    );

    if (!user) throw new BaseApiError(401, "Unauthorized");
    return res.status(200).json({ user });
}

/**
 * Get a new access token using refresh token
 *
 * @route GET /auth/access-token
 * @remark Throwning an error inside the callback of `jwt.verify` was not working
 * and there was a timeout error. So, I sent a response instead of throwing an error
 * and it working fine. Follow the test cases regarding this.
 */
export async function accessTokenCtrl(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new BaseApiError(401, "Unauthorized");
    }

    try {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async function getNewAccessToken(
                err: jwt.VerifyErrors,
                decoded: string | jwt.JwtPayload,
            ) {
                if (err instanceof jwt.TokenExpiredError) {
                    throw new BaseApiError(401, "Unauthorized. Token expired");
                } else if (err instanceof jwt.JsonWebTokenError) {
                    throw new BaseApiError(401, "Unauthorized. Invalid token");
                } else if (err) {
                    throw new BaseApiError(401, "Unauthorized");
                }

                const user = await User.findById((decoded as any)._id);
                if (!user) {
                    throw new BaseApiError(401, "Unauthorized");
                }

                const accessToken = user.createAccessToken();
                return res.status(200).json({ user, accessToken });
            },
        );
    } catch (error) {
        throw new BaseApiError(401, "Unauthorized. Invalid token");
    }
}

/**
 * Logout user with email login or social login
 * @route GET /auth/logout
 */
export async function logoutCtrl(req: Request, res: Response) {
    if (req.cookies?.refreshToken) {
        res.clearCookie(REFRESH_TOKEN_COOKIE_KEY, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            // secure: process.env.NODE_ENV === "production",
        });
    } else if (req.logOut) {
        req.logOut(function successfulOAuthLogout() {});
    }

    return res.status(200).json({ message: "Logged out" });
}
