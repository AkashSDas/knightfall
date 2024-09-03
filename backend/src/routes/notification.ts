import { Router } from "express";

import * as ctrls from "@/controllers/notification";
import * as schemas from "@/schema/notification";
import { verifyAuth } from "@/middlewares/auth";
import { validateResource } from "@/middlewares/zod";
import { handleMiddlewareError } from "@/utils/async";
import { sendErrorResponse } from "@/utils/errors";

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
