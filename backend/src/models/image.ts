import { prop } from "@typegoose/typegoose";

/**
 * This sub-document represents an image. An image will have `id` if its stored
 * in external storage like Cloudinary and that storage returns an id which will
 * be used to delete that image later on.
 **/
export class ImageSubDocument {
    @prop({ type: String })
    id?: string;

    @prop({ type: String, required: true })
    URL: string;
}
