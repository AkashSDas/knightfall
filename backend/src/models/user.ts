import { modelOptions, prop } from "@typegoose/typegoose";
import isEmail from "validator/lib/isEmail";

@modelOptions({})
export class UserSchema {
    // ================================
    // Fields
    // ================================

    @prop({
        type: String,
        trim: true,
        maxlength: [64, "Too long"],
        minlength: [3, "Too short"],
    })
    username?: string;

    @prop({ type: String, validate: [isEmail, "Invalid email"] })
    email: string;

    @prop({ type: Boolean, required: true, default: false })
    isBanned: boolean;

    @prop({ type: Boolean, required: true, default: false })
    isVerified: boolean;

    @prop({ type: String, select: false })
    verificationToken?: string;

    @prop({ type: Date, select: false })
    verificationTokenExpiresAt?: Date;

    @prop({ type: String, select: false })
    passwordHash?: string;

    @prop({ type: String, select: false })
    passwordResetToken?: string;

    @prop({ type: Date, select: false })
    passwordResetTokenExpiresAt?: Date;
}
