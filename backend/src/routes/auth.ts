import { Router } from "express";
import { validateResource } from "../middlewares/zod";
import * as schemas from "../schema/auth";
import * as ctrls from "../controllers/auth";
import { handleMiddlewareError } from "../utils/async";
import { sendErrorResponse } from "../utils/errors";

export const router = Router();

// ==================================
// Signup routes
// ==================================

// Email signup
router.post(
    "/signup",
    validateResource(schemas.emailSignupSchema),
    handleMiddlewareError(ctrls.emailSignupCtrl),
    sendErrorResponse,
);
