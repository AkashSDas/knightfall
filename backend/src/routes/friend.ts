import { Router } from "express";

import * as ctrls from "@/controllers/friend";
import * as middlewares from "@/middlewares/auth";
import * as schemas from "@/schema/friend";
import { validateResource } from "@/middlewares/zod";
import { handleMiddlewareError } from "@/utils/async";
import { sendErrorResponse } from "@/utils/errors";

export const router = Router();

router.get(
    "/request",
    validateResource(schemas.getLoggedInUserFriends),
    handleMiddlewareError(middlewares.verifyAuth),
    handleMiddlewareError(ctrls.getLoggedInUserFriends),
    sendErrorResponse,
);

router.post(
    "/request",
    validateResource(schemas.sendFriendRequest),
    handleMiddlewareError(middlewares.verifyAuth),
    handleMiddlewareError(ctrls.sendFriendRequest),
    sendErrorResponse,
);

router.patch(
    "/request",
    validateResource(schemas.updateFriendRequestStatus),
    handleMiddlewareError(middlewares.verifyAuth),
    handleMiddlewareError(ctrls.updateFriendRequestStatus),
    sendErrorResponse,
);

router.get(
    "/search",
    validateResource(schemas.searchFriendByUsernameOrUserIdSchema),
    handleMiddlewareError(middlewares.verifyAuth),
    handleMiddlewareError(ctrls.searchFriendByUsernameOrUserIdCtrl),
    sendErrorResponse,
);
