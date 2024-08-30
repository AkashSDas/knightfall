import { OAUTH_PROVIDERS, type OAuthProvider } from "@/utils/auth";
import { prop } from "@typegoose/typegoose";

export class OAuthProviderSubDocument {
    @prop({ type: String, required: true })
    sid: string;

    @prop({
        type: String,
        required: true,
        enum: Object.values(OAUTH_PROVIDERS),
    })
    provider: OAuthProvider;
}
