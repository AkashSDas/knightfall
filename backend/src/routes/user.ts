import { Router } from "express";
import { validateResource } from "../middlewares/zod";
import * as schemas from "../schema/user";
import * as ctrls from "../controllers/user";
import { handleMiddlewareError } from "../utils/async";
import { sendErrorResponse } from "../utils/errors";

export const router = Router();

router.post(
    "/check-uniqueness",
    validateResource(schemas.checkUsernameOrEmailAlreadyTaken),
    handleMiddlewareError(ctrls.getUserNameOrEmailExists),
    sendErrorResponse,
);

router.patch(
    "/profile",
    validateResource(schemas.updateProfileSchema),
    handleMiddlewareError(ctrls.updateProfileCtrl),
    sendErrorResponse,
);
