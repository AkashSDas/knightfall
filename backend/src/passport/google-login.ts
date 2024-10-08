import passport from "passport";
import {
    type Profile,
    Strategy,
    type VerifyCallback,
} from "passport-google-oauth20";

import { User, type UserDocument } from "@/models/user";
import { STRATEGY } from "@/utils/auth";

async function verify(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    next: VerifyCallback,
) {
    const { email } = profile._json;
    const user = await User.findOne({ email });

    // If the user doesn't exists or the user exists but the signup process isn't
    // completed yet then don't login
    if (!user || (user && !user.username)) {
        return next(null, null);
    }

    // Log the user in
    return next(null, user);
}

function googleLoginStrategy() {
    return new Strategy(
        {
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL_FOR_LOGIN,
        },
        verify,
    );
}

passport.serializeUser(function serializeLoginUser(user, done) {
    done(null, (user as any)._id);
});

passport.deserializeUser(async function deserializeLoginUser(_id, done) {
    let user: UserDocument | null = null;
    let error: unknown = null;

    try {
        user = await User.findById(_id);
    } catch (err) {
        error = err;
    }

    done(error, user);
});

passport.use(STRATEGY.GOOGLE_LOGIN, googleLoginStrategy());
