import { Router } from "express";
import { validateResource } from "../middlewares/zod";
import * as schemas from "../schema/user";
import * as ctrls from "../controllers/user";
import * as middlewares from "../middlewares/auth";
import { handleMiddlewareError } from "../utils/async";
import { sendErrorResponse } from "../utils/errors";

export const router = Router();

router.post(
    "/check-uniqueness",
    validateResource(schemas.checkUsernameOrEmailAlreadyTakenSchema),
    handleMiddlewareError(ctrls.getUserNameOrEmailExists),
    sendErrorResponse,
);

router.patch(
    "/profile",
    validateResource(schemas.updateProfileSchema),
    handleMiddlewareError(middlewares.verifyAuth),
    handleMiddlewareError(ctrls.updateProfileCtrl),
    sendErrorResponse,
);

router.get(
    "/profile",
    handleMiddlewareError(middlewares.verifyAuth),
    handleMiddlewareError(ctrls.getLoggedInUserProfile),
    sendErrorResponse,
);

router.get(
    "/public-profile",
    validateResource(schemas.getUserPublicProfileSchema),
    handleMiddlewareError(ctrls.getUserPublicProfile),
    sendErrorResponse,
);
