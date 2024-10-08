import { v2 as cloudinary } from "cloudinary";
import type { Request, Response } from "express";
import { Types } from "mongoose";

import * as schemas from "@/schema/user";
import { User, type UserDocument } from "@/models/user";
import { CLOUDINARY_DIR } from "@/utils/cloudinary";
import { BaseApiError } from "@/utils/errors";
import { logger } from "@/utils/logger";

/** Controller to update user profile */
export async function updateProfileCtrl(
    req: Request<unknown, unknown, schemas.UpdateProfile["body"]>,
    res: Response,
) {
    const profilePic = req.files?.profilePic;
    const user = req.user as UserDocument;

    if (profilePic && !Array.isArray(profilePic)) {
        if (!user.profilePic.id) {
            // If no early uploaded image of user exist then upload the image sent

            cloudinary.uploader
                .upload(profilePic.tempFilePath, {
                    folder: CLOUDINARY_DIR.USER_PROFILE,
                })
                .then((info) => {
                    logger.info(`Uploaded profile pic: ${info.url}`);
                    return User.findByIdAndUpdate(user._id, {
                        $set: {
                            profilePic: { URL: info.url, id: info.public_id },
                        },
                    });
                })
                .catch((e) => {
                    logger.error(`Failed to upload profile pic: ${e}`);
                });
        } else {
            // If an early uploaded image of user exist then overwrite it

            cloudinary.uploader
                .upload(profilePic.tempFilePath, {
                    public_id: (req.user as UserDocument).profilePic.id,
                    overwrite: true,
                })
                .then((info) => {
                    logger.info(`Uploaded profile pic: ${info.url}`);
                })
                .catch((e) => {
                    logger.error(`Failed to upload profile pic: ${e}`);
                });
        }
    }

    // Update other user info
    await User.findByIdAndUpdate(user._id, { $set: req.body });

    return res.status(200).json({ message: "Profile updated" });
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

/**
 * Get logged in user info
 * @route GET /user/profile
 *
 * Middelewares used:
 * - `verifyAuth`
 */
export async function getLoggedInUserProfile(req: Request, res: Response) {
    return res.status(200).json({ user: req.user as UserDocument });
}

export async function getUserPublicProfile(
    req: Request<schemas.GetUserPublicProfile["params"]>,
    res: Response,
) {
    const { userId } = req.params;

    const results = await User.aggregate([
        {
            $sort: { winPoints: -1 },
        },
        {
            $group: {
                _id: null,
                users: { $push: "$$ROOT" },
            },
        },
        {
            $unwind: {
                path: "$users",
                includeArrayIndex: "index",
            },
        },
        {
            $set: {
                rank: { $add: ["$index", 1] }, // Ensure index starts from 0
            },
        },
        {
            $project: {
                id: "$users._id",
                username: "$users.username",
                isBanned: "$users.isBanned",
                profilePic: "$users.profilePic",
                winPoints: "$users.winPoints",
                achievements: "$users.achievements",
                rank: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$rank", 1] }, then: "Top 1" },
                            { case: { $eq: ["$rank", 2] }, then: "Top 2" },
                            { case: { $eq: ["$rank", 3] }, then: "Top 3" },
                            { case: { $lte: ["$rank", 10] }, then: "Top 10" },
                            { case: { $lte: ["$rank", 50] }, then: "Top 50" },
                            { case: { $lte: ["$rank", 100] }, then: "Top 100" },
                        ],
                        default: "Above 100",
                    },
                },
            },
        },
        {
            $unset: "_id",
        },
        {
            $match: { id: new Types.ObjectId(userId) },
        },
    ]);

    if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: results[0] });
}

export async function searchPlayerByUsernameOrUserId(
    req: Request<
        unknown,
        unknown,
        unknown,
        schemas.SearchPlayerByUsernameOrUserId["query"]
    >,
    res: Response,
) {
    const { queryText } = req.query;
    let { limit, offset } = req.query;

    if (limit === undefined) limit = 10;
    if (offset === undefined) offset = 0;

    if (Types.ObjectId.isValid(queryText)) {
        // Search by userId

        const [players, totalCount] = await Promise.all([
            User.aggregate([
                { $match: { _id: new Types.ObjectId(queryText) } },
                { $sort: { username: 1 } },
                { $skip: offset },
                { $limit: limit },
            ]),
            User.countDocuments({ _id: new Types.ObjectId(queryText) }),
        ]);

        return res
            .status(200)
            .json({ players, totalCount, nextPageOffset: offset + limit });
    } else {
        if (queryText === "") {
            // Get all users

            const [players, totalCount] = await Promise.all([
                User.aggregate([
                    { $sort: { username: 1 } },
                    { $skip: offset },
                    { $limit: limit },
                ]),
                User.countDocuments({}),
            ]);

            return res
                .status(200)
                .json({ players, totalCount, nextPageOffset: offset + limit });
        } else {
            // Search player by username

            const [players, totalCount] = await Promise.all([
                User.aggregate([
                    {
                        $match: {
                            username: { $regex: queryText, $options: "i" },
                        },
                    },
                    { $sort: { username: 1 } },
                    { $skip: offset },
                    { $limit: limit },
                ]),
                User.countDocuments({
                    username: { $regex: queryText, $options: "i" },
                }),
            ]);

            return res
                .status(200)
                .json({ players, totalCount, nextPageOffset: offset + limit });
        }
    }
}
