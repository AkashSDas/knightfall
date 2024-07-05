import { Router } from "express";
import { validateResource } from "../middlewares/zod";
import * as schemas from "../schema/auth";
import * as ctrls from "../controllers/auth";
import { handleMiddlewareError } from "../utils/async";
import { sendErrorResponse } from "../utils/errors";

export const router = Router();

router.post(
    "/signup",
    validateResource(schemas.emailSignupSchema),
    handleMiddlewareError(ctrls.emailSignupCtrl),
    sendErrorResponse,
);

router.post(
    "/login",
    validateResource(schemas.emailLoginSchema),
    handleMiddlewareError(ctrls.initMagicLinkLoginCtrl),
    sendErrorResponse,
);

router.post(
    "/login/:token",
    validateResource(schemas.emailCompleteMagicLinkLoginSchema),
    handleMiddlewareError(ctrls.completeMagicLinkLoginCtrl),
    sendErrorResponse,
);
