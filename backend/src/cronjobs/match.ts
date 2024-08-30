import { schedule } from "node-cron";

import { Match } from "@/models/match";
import { logger } from "@/utils/logger";
import { MATCH_STATUS } from "@/utils/match";

schedule("0 */2 * * *", function cancelIncompleteMatches() {
    Match.updateMany(
        {
            $or: [
                { status: MATCH_STATUS.IN_PROGRESS },

                // TODO: if matches are scheduled for later time, we should not cancel them
                { status: MATCH_STATUS.PENDING },
            ],
            startedAt: {
                $lt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes
            },
        },
        { $set: { status: MATCH_STATUS.CANCELLED } },
    )
        .then(() => {
            logger.info("Matches cancelled");
        })
        .catch((e) => {
            logger.error("Failed to cancel incomplete matches");
            logger.error(e);
        });
});
