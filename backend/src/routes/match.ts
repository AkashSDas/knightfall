import { Router } from "express";

import * as ctrls from "@/controllers/match";
import * as middlewares from "@/middlewares/auth";
import * as schemas from "@/schema/match";
import { validateResource } from "@/middlewares/zod";
import { handleMiddlewareError } from "@/utils/async";
import { sendErrorResponse } from "@/utils/errors";

export const router = Router();

router.get(
    "/:matchId",
    validateResource(schemas.getMatchSchema),
    handleMiddlewareError(middlewares.verifyAuth),
    handleMiddlewareError(ctrls.getMatchCtrl),
    sendErrorResponse,
);
