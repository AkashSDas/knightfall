import { Router } from "express";
import { handleMiddlewareError } from "../utils/async";
import { verifyAuth } from "../middlewares/auth";
import * as ctrls from "../controllers/direct-message";
import * as schemas from "../schema/direct-message";
import { sendErrorResponse } from "../utils/errors";
import { validateResource } from "../middlewares/zod";

export const router = Router();

router.get(
    "",
    validateResource(schemas.getDirectMessagesSchema),
    handleMiddlewareError(verifyAuth),
    handleMiddlewareError(ctrls.getDirectMessagesCtrl),
    sendErrorResponse,
);
