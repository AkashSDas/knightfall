import {
    PropType,
    Severity,
    getModelForClass,
    modelOptions,
    post,
    pre,
    prop,
} from "@typegoose/typegoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { type Types } from "mongoose";
import isEmail from "validator/lib/isEmail";

import { ACHIEVEMENTS, type Achievement } from "@/utils/achivement";
import { dateInFuture } from "@/utils/datetime";
import { BaseApiError } from "@/utils/errors";

import { ImageSubDocument } from "./image";
import { OAuthProviderSubDocument } from "./oauth-provider";

/** Handle error due to violation of unique fields. */
function handleDuplicateError(err: unknown, user: any, next: any) {
    if (err instanceof Error) {
        // Duplicate caught by pre hook
        if (err.message === "Duplicate") {
            return next(new BaseApiError(400, "Username/email already used"));
        }

        // Duplicate constrain of Mongoose failed
        if (err.name === "MongoError" && "code" in err && err.code === 11000) {
            return next(new BaseApiError(400, "Username/email already used"));
        }
    }

    return next();
}

/**
 * @remark Since fields like username could be null, the unique flag
 * is not set on them and therefore we have to check the uniqueness of username
 * in pre save hook.
 */
@pre<UserDocument>("save", async function preMongooseSave(next) {
    // Validate email and username uniqueness
    const isEmailChanged = this.isModified("email");
    const isUsernameChanged = this.isModified("username");

    if (isEmailChanged || isUsernameChanged) {
        const query = [];
        if (isEmailChanged) query.push({ email: this.email });
        if (isUsernameChanged) query.push({ username: this.username });

        const exists = await User.exists({ $or: query });
        if (exists?._id && !exists._id.equals(this._id)) {
            return next(new Error("Duplicate"));
        }
    }
})
@post<UserDocument>("save", handleDuplicateError)
@pre<UserDocument>(
    "findOneAndUpdate",
    async function preFindOneAndUpdateHook(next) {
        const user = (this as any).getQuery();
        const update = (this as any).getUpdate() as any;

        const emailUpdate = update?.["$set"]?.email;
        const usernameUpdate = update?.["$set"]?.username;

        // Validate email and username uniqueness
        if (emailUpdate || usernameUpdate) {
            const query = [];
            if (emailUpdate) query.push({ email: emailUpdate });
            if (usernameUpdate) query.push({ username: usernameUpdate });
            const exists = await User.exists({ $or: query });

            if (exists?._id && !exists._id.equals(user._id)) {
                return next(new Error("Duplicate"));
            }
        }

        return next();
    },
)
@post<UserDocument>("findOneAndUpdate", handleDuplicateError)
@modelOptions({
    schemaOptions: {
        timestamps: true,
        toJSON: { virtuals: true },
        typeKey: "type",
    },
    options: { allowMixed: Severity.ALLOW, customName: "user" },
})
export class UserDocument {
    // =================================
    // Fields
    // =================================

    /**
     * Username is required but for Google OAuth we first create user and then
     * we get the username from the user. Therefore username is optional
     */
    @prop({
        type: String,
        trim: true,
        maxlength: [256, "Username must be less than 256 characters long"],
        minlength: [2, "Username must be more than 2 characters long"],
        index: true,
    })
    username?: string;

    @prop({
        type: String,
        validate: [isEmail, "Email is not valid"],
        index: true,
        required: true,
    })
    email: string;

    @prop({ type: Boolean, default: false, required: true })
    isBanned: boolean;

    @prop({ type: String, select: false })
    magicLinkToken?: string;

    @prop({
        type: Date,
        select: false,
        validate: {
            validator: dateInFuture,
            message: "Magic link token expired",
        },
    })
    magicLinkTokenExpiresAt?: Date;

    @prop({ _id: false, type: () => ImageSubDocument, required: true })
    profilePic: ImageSubDocument;

    @prop(
        {
            type: () => [OAuthProviderSubDocument],
            _id: false,
            required: true,
            default: [],
        },
        PropType.ARRAY,
    )
    oauthProviders: OAuthProviderSubDocument[];

    @prop({ type: Number, default: 0, min: 0, required: true })
    winPoints: number;

    @prop(
        {
            type: () => [String],
            required: true,
            default: [],
            validate: {
                validator: (achievements: string[]) => {
                    const validAchievements = Object.values(ACHIEVEMENTS);
                    return achievements.every((item) => {
                        return validAchievements.includes(item as any);
                    });
                },
                message: `Invalid achievement(s) provided. Valid achievements are: ${Object.values(
                    ACHIEVEMENTS,
                ).join(", ")}`,
            },
        },
        PropType.ARRAY,
    )
    achievements: Achievement[];

    // =================================
    // Instance methods
    // =================================

    private generateToken(): { token: string; hash: string } {
        const token = crypto.randomBytes(32).toString("hex");
        const hash = crypto.createHash("sha256").update(token).digest("hex");
        return { token, hash };
    }

    /**
     * Generate a random token, hash it and set the has as magic link token
     * along with its expiry date.
     *
     * @returns the generated token
     */
    createMagicLinkToken(): string {
        const { token, hash } = this.generateToken();
        this.magicLinkToken = hash;
        this.magicLinkTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        return token;
    }

    /** Genereate access token for JWT authentication. Short duration */
    createAccessToken(): string {
        const payload = { _id: this._id, email: this.email };
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        });
    }

    /** Genereate refresh token for JWT authentication. Long duration */
    createRefreshToken(): string {
        const payload = { _id: this._id, email: this.email };
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        });
    }

    // =================================
    // Static methods
    // =================================

    // =================================
    // Virtuals
    // =================================

    _id!: Types.ObjectId;

    /** Get transformed MongoDB `_id` */
    get id() {
        return this._id.toHexString();
    }
}

/** User Typegoose Model */
export const User = getModelForClass(UserDocument);
