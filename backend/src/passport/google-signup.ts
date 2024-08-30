import { type Request } from "express";
import passport from "passport";
import {
    type Profile,
    Strategy,
    type VerifyCallback,
} from "passport-google-oauth20";

import { User, type UserDocument } from "@/models/user";
import { OAUTH_PROVIDERS, STRATEGY } from "@/utils/auth";
import { BaseApiError } from "@/utils/errors";

/** Check if the user exists or not. If not then create a new user else login the user. */
async function verify(
    _req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    next: VerifyCallback,
) {
    const { email, sub, picture } = profile._json;
    const user = await User.findOne({ email: email });

    // Login the user if the user already has an account
    if (user) {
        return next(null, user);
    }

    // Signup the user
    try {
        const newUser = await User.create({
            email,
            profilePic: { URL: picture },
            oauthProviders: [{ sid: sub, provider: OAUTH_PROVIDERS.GOOGLE }],
        });

        return next(null, newUser);
    } catch (error) {
        if (error instanceof Error || typeof error === "string") {
            return next(error, null);
        }

        throw new BaseApiError(500, "Internal Server Error");
    }
}

function googleSignupStrategy() {
    return new Strategy(
        {
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
            passReqToCallback: true,
        },
        verify,
    );
}

passport.serializeUser(function serializeSignupUser(user, done) {
    done(null, (user as any)._id);
});

passport.deserializeUser(async function deserializeSignupUser(_id, done) {
    let user: UserDocument | null = null;
    let error: unknown = null;

    try {
        user = await User.findById(_id);
    } catch (err) {
        error = err;
    }

    done(error, user);
});

passport.use(STRATEGY.GOOGLE_SIGNUP, googleSignupStrategy());
