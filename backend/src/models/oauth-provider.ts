import { prop } from "@typegoose/typegoose";

export const OAuthProvider = {
    GOOGLE: "google",
} as const;

export class OAuthProviderSubDocument {
    @prop({ type: String, required: true })
    sid: string;

    @prop({ type: String, required: true, enum: Object.values(OAuthProvider) })
    provider: (typeof OAuthProvider)[keyof typeof OAuthProvider];
}
