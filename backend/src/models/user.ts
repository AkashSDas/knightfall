import {
    Severity,
    getModelForClass,
    modelOptions,
    post,
    pre,
    prop,
} from "@typegoose/typegoose";
import isEmail from "validator/lib/isEmail";
import { dateInFuture } from "../utils/datetime";
import { ImageSubDocument } from "./image";
import { OAuthProviderSubDocument } from "./oauth-provider";
import crypto from "crypto";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { BaseApiError } from "../utils/errors";

/** Handle error due to violation of unique fields */
function handleDuplicateError(err: unknown, user: any, next: any) {
    if (err instanceof Error) {
        // Duplicate caught by pre hook
        if (err.message === "Duplicate") {
            return next(new BaseApiError(400, "Username/email already used."));
        }

        // Duplicate constrain of Mongoose failed
        if (err.name === "MongoError" && "code" in err && err.code === 11000) {
            return next(new BaseApiError(400, "Username/email already used."));
        }
    }

    return next();
}

/**
 * @remark Since fields like username could be null, the unique flag
 * is not set on them.
 */
@pre<UserDocument>("save", async function preMongooseSave(next) {
    // Validate email and username uniqueness
    const isEmailChanged = this.isModified("email");
    const isUsernameChanged = this.isModified("username");

    if (isEmailChanged || isUsernameChanged) {
        let query = [];
        if (isEmailChanged) query.push({ email: this.email });
        if (isUsernameChanged) query.push({ username: this.username });

        const exists = await User.exists({ $or: query });
        if (exists?._id && !exists._id.equals(this._id)) {
            return next(new Error("Duplicate"));
        }
    }
})
@post<UserDocument>("save", handleDuplicateError)
@pre<UserDocument>("findOneAndUpdate", async function preMongooseSave(next) {
    // Validate email and username uniqueness
    const isEmailChanged = this.isModified("email");
    const isUsernameChanged = this.isModified("username");

    if (isEmailChanged || isUsernameChanged) {
        let query = [];
        if (isEmailChanged) query.push({ email: this.email });
        if (isUsernameChanged) query.push({ username: this.username });

        const exists = await User.exists({ $or: query });
        if (exists?._id && !exists._id.equals(this._id)) {
            return next(new Error("Duplicate"));
        }
    }
})
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
    })
    username?: string;

    @prop({ type: String, validate: [isEmail, "Email is not valid"] })
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

    @prop({ _id: false, type: () => ImageSubDocument })
    profilePic: ImageSubDocument;

    @prop({
        type: () => [OAuthProviderSubDocument],
        _id: false,
        required: true,
        default: [],
    })
    oauthProviders: OAuthProviderSubDocument[];

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
        var payload = { _id: this._id, email: this.email };
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        });
    }

    /** Genereate refresh token for JWT authentication. Long duration */
    createRefreshToken(): string {
        var payload = { _id: this._id, email: this.email };
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
