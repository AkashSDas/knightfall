import { schedule } from "node-cron";

import { logger } from "@/utils/logger";
import { friendsDirectMessages as dms } from "@/websocket/direct-message";

// This cronjob saves direct messages in DB every minute
schedule("* * * * *", function saveDMs() {
    try {
        const promises: Promise<
            (typeof dms)[keyof typeof dms]["dbModelInstance"]
        >[] = [];

        for (const friendId in dms) {
            const savedDM = dms[friendId];
            if (
                savedDM.saveStatus === "pending" ||
                savedDM.saveStatus === "error"
            ) {
                promises.push(savedDM.dbModelInstance.save());
            }
        }

        logger.info(
            `[📮 DMs save DMs]: Saving ${promises.length} DM documents`,
        );

        (async () => {
            // Await for all saves to complete
            await Promise.all(promises);

            // Mark DMs as saved
            Object.entries(dms).forEach(([friendId, savedDM]) => {
                if (savedDM.saveStatus === "pending") {
                    dms[friendId].saveStatus = "done";
                }
            });

            // Cleanup remove if the lastUpdated is older than 5 minutes
            for (const friendId in dms) {
                const savedDM = dms[friendId];
                if (savedDM.lastEdited < new Date(Date.now() - 5 * 60 * 1000)) {
                    delete dms[friendId];
                }
            }
        })();
    } catch (error) {
        Object.entries(dms).forEach(([friendId, savedDM]) => {
            if (savedDM.saveStatus === "pending") {
                dms[friendId].saveStatus = "error";
            }
        });

        logger.error(`[📮 DMs save DMs] Failed to save: ${error}`);
    }
});
