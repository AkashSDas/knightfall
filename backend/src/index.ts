import { config } from "dotenv";
import { connectToDB } from "./utils/db";
import { logger } from "./utils/logger";
import { httpServer } from "./websocket";

if (process.env.NODE_ENV !== "production") config();

connectToDB();

const port = process.env.PORT ? Number(process.env.PORT) : 8000;
httpServer.listen(port, function initApp() {
    logger.info(`API is available on http://localhost:${port}/api`);
});
