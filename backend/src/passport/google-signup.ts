import { Request } from "express";
import passport from "passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { User } from "../models/user";
import { OAuthProvider } from "../models/oauth-provider";
import { BaseApiError } from "../utils/errors";
import { STRATEGY } from "../utils/auth";

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
            profileImage: { URL: picture },
            oauthProviders: [{ id: sub, provider: OAuthProvider.GOOGLE }],
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
    try {
        var user = await User.findById(_id);
    } catch (err) {
        var error = err;
    }

    done(error, user);
});

passport.use(STRATEGY.GOOGLE_SIGNUP, googleSignupStrategy());
