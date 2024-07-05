import { Request, Response } from "express";
import * as schemas from "../schema/auth";
import { User } from "../models/user";
import { sendEmail } from "../utils/email";
import { BaseApiError } from "../utils/errors";
import { createHash } from "crypto";
import { REFRESH_TOKEN_COOKIE_KEY, loginCookieConfig } from "../utils/auth";

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
    const link = `${process.env.FRONTEND_URL}/auth/login?magic-token=${token}`;
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
    const link = `${process.env.FRONTEND_URL}/auth/login?magic-token=${token}`;
    await user.save({ validateModifiedOnly: true });

    // Not awaiting here so that we don't wait for the email to be sent
    sendEmail({
        to: user.email,
        subject: "Magic link login",
        text: `Click on the link to login: ${link}`,
        html: `Click on the link to login: <a href="${link}">${link}</a>`,
    });

    return res.status(200).json({ message: "Account created" });
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

    delete user.magicLinkToken;
    delete user.magicLinkTokenExpiresAt;
    await user.save({ validateModifiedOnly: true });

    const accessToken = user.createAccessToken();
    const refreshToken = user.createRefreshToken();
    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, loginCookieConfig);

    return res.status(200).json({ accessToken, user });
}
