import { Router } from "express";
import * as ctrls from "../controllers/match";
import * as schemas from "../schema/match";
import * as middlewares from "../middlewares/auth";
import { handleMiddlewareError } from "../utils/async";
import { sendErrorResponse } from "../utils/errors";
import { validateResource } from "../middlewares/zod";

export const router = Router();

router.get(
    "/:matchId",
    validateResource(schemas.getMatchSchema),
    handleMiddlewareError(middlewares.verifyAuth),
    handleMiddlewareError(ctrls.getMatchCtrl),
    sendErrorResponse,
);
