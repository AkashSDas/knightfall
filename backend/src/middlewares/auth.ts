import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { BaseApiError } from "../utils/errors";
import { User } from "../models/user";

async function verifyJwt(req: Request, res: Response, next: NextFunction) {
    // Check if the bearer token is present in the request header
    const authHeader =
        req.headers?.authorization ||
        (req.headers?.Authorization as string) ||
        req.cookies?.accessToken ||
        req.body?.accessToken;

    if (!authHeader?.startsWith("Bearer ")) {
        throw new BaseApiError(401, "Unauthorized");
    }

    // Verify the token
    const token = authHeader.split(" ")[1];

    try {
        const decodedJwt = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
        ) as jwt.JwtPayload;

        const user = await User.findById(decodedJwt._id);
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new BaseApiError(401, "Unauthorized. Token expired");
        }

        if (error instanceof jwt.JsonWebTokenError) {
            throw new BaseApiError(401, "Unauthorized");
        }

        throw new BaseApiError(500, "Internal server error");
    }
}

export async function verifyAuth(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Check if the user is logged in using OAuth
    if (req.user) return next();

    // If the user is logged in using JWT
    return verifyJwt(req, res, next);
}
