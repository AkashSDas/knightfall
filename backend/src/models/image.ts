import { prop } from "@typegoose/typegoose";

export class ImageSubDocument {
    @prop({ type: String })
    id?: string;

    @prop({ type: String, required: true })
    URL: string;
}
