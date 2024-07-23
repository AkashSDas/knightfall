import { Request, Response } from "express";
import * as schemas from "../schema/match";
import { Match } from "../models/match";
import { BaseApiError } from "../utils/errors";

export async function getMatchCtrl(
    req: Request<schemas.GetMatchSchema["param"]>,
    res: Response,
) {
    const match = await Match.findById(req.params.matchId)
        .populate("player1")
        .populate("player2");

    if (!match) {
        throw new BaseApiError(400, "Match does not exists.");
    }

    return res.status(200).json({ match });
}
