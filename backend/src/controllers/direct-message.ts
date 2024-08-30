import { Request, Response } from "express";

import { DirectMessage } from "@/models/direct-message";
import * as schemas from "@/schema/direct-message";

export async function getDirectMessagesCtrl(
    req: Request<
        unknown,
        unknown,
        unknown,
        schemas.GetDirectMessagesSchema["query"]
    >,
    res: Response,
) {
    const { limit, offset, friendId } = req.query;

    const filter = { friend: friendId };

    const [totalCount, directMessages] = await Promise.all([
        DirectMessage.countDocuments(filter),

        // Each direct message document has around `10` messages (subject to changes)
        DirectMessage.find(filter)
            .sort({ createdAt: -1 })
            .skip(offset ?? 0)
            .limit(limit ?? 10),
    ]);

    // Setting the X-Total-Count header
    res.set("X-Total-Count", totalCount.toString());

    return res
        .status(200)
        .json({ directMessages, totalCount, nextPageOffset: offset + limit });
}
