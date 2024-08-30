import cloudinary from "cloudinary";

export async function connectToCloudinary() {
    cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
}

/** Cloudinary folders in which assets can be uploaded. */
export const CLOUDINARY_DIR = {
    /** Save all of users profile pictures in this folder. */
    USER_PROFILE: "knightfall/profile",
};
