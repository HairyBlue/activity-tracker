require("source-map-support").install();
import * as http from "http";
import * as logging from "./logger";
import createRoutes from "./createRoutes";
import { initDiscord } from "./discord";
import { Settings } from "luxon"
import { configs } from "./settings" 
import * as cron from "./depreciated/cronjob"

Settings.defaultZone = "Asia/Manila"
const logger = logging.wichFileToLog("app");
logger.info("Setting: ", configs)

const app = createRoutes();
const server = http.createServer(app);
const port = process.env.NODE_ENV == "production" ? (process.env.SERVER_PORT && process.env.SERVER_PORT.trim()  != '' ? parseInt(process.env.SERVER_PORT, 10) : 3500) : 3500;

initDiscord();
setInterval((logging.zipTheLogs), configs.default.zipInterval)

process
  .on("unhandledRejection", (reason, p) => {
    logger.error(reason, "Unhandled Rejection at Promise", p);
    logger.error(reason);
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", function (exception) {
    logger.error(exception, "Fatal Uncaught exception: ");
    process.exit(1);
  });

server.listen(port, "0.0.0.0", () => {
  const date = new Date(Date.now());
  logger.info("server start at " + date + " on port " + port)
});

logger.info(`service runs on ${process.env.NODE_ENV} environment`)

// cron.dumpSql()
// TODO: Implement this feature
// !: IMPORTANT
// ?: ASK
// *: General
// HACK: Temporary workaround, needs refactoring later
// REVIEW: Review this code for potential improvements
// NOTE: Additional information about the following code
// DEBUG: Temporary debug message, remove before production
// OPTIMIZE: Consider optimizing this code for better performance
