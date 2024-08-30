import { Router } from "express";

import * as ctrls from "@/controllers/direct-message";
import { verifyAuth } from "@/middlewares/auth";
import { validateResource } from "@/middlewares/zod";
import * as schemas from "@/schema/direct-message";
import { handleMiddlewareError } from "@/utils/async";
import { sendErrorResponse } from "@/utils/errors";

export const router = Router();

router.get(
    "",
    validateResource(schemas.getDirectMessagesSchema),
    handleMiddlewareError(verifyAuth),
    handleMiddlewareError(ctrls.getDirectMessagesCtrl),
    sendErrorResponse,
);
