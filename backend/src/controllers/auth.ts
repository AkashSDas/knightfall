import { Request, Response } from "express";
import { EmailSignup } from "../schema/auth";
import { User } from "../models/user";
import { sendEmail } from "../utils/email";

export async function emailSignupCtrl(
    req: Request<unknown, unknown, EmailSignup["body"]>,
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
