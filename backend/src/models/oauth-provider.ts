import { prop } from "@typegoose/typegoose";

export const AuthProvider = {
    GOOGLE: "google",
} as const;

export class OAuthProviderSubDocument {
    @prop({ type: String, required: true })
    sid: string;

    @prop({ type: String, required: true, enum: Object.values(AuthProvider) })
    provider: (typeof AuthProvider)[keyof typeof AuthProvider];
}
