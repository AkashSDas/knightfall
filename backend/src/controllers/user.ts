import { Request, Response } from "express";
import * as schemas from "../schema/user";
import { User, UserDocument } from "../models/user";
import { BaseApiError } from "../utils/errors";

/** Controller to update user profile */
export async function updateProfileCtrl(
    req: Request<unknown, unknown, schemas.UpdateProfile["body"]>,
    res: Response,
) {
    const user = await User.findByIdAndUpdate((req.user as UserDocument)._id, {
        $set: req.body,
    });

    await user.save({ validateModifiedOnly: true });
    return res.status(201).json({ message: "Account created" });
}

export async function getUserNameOrEmailExists(
    req: Request<
        unknown,
        unknown,
        schemas.CheckUsernameOrEmailAlreadyTaken["body"]
    >,
    res: Response,
) {
    const orQuery: Record<string, string>[] = [];
    if (req.body.username) orQuery.push({ username: req.body.username });
    if (req.body.email) orQuery.push({ username: req.body.username });

    if (orQuery.length === 0) {
        throw new BaseApiError(
            400,
            "At least on of the value is required: 'username', 'email'",
        );
    }

    const user = await User.findOne({ $or: orQuery });
    if (user) return res.status(200).json({ exists: true });
    return res.status(200).json({ exists: false });
}
