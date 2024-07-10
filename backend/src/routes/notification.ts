import { Router } from "express";
import { handleMiddlewareError } from "../utils/async";
import { verifyAuth } from "../middlewares/auth";
import * as ctrls from "../controllers/notification";
import * as schemas from "../schema/notification";
import { sendErrorResponse } from "../utils/errors";
import { validateResource } from "../middlewares/zod";

export const router = Router();

router.get(
    "",
    validateResource(schemas.getLoggedInUserNotificationsSchema),
    handleMiddlewareError(verifyAuth),
    handleMiddlewareError(ctrls.getLoggedInUserNotificationsCtrl),
    sendErrorResponse,
);

router.patch(
    "/mark-seen",
    validateResource(schemas.markNotificationsAsSeenSchema),
    handleMiddlewareError(verifyAuth),
    handleMiddlewareError(ctrls.markNotificationsAsSeenCtrl),
    sendErrorResponse,
);
