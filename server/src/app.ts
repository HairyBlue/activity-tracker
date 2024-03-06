require("source-map-support").install();
import * as http from "http";
import * as logging from "./logger";
import createRoutes from "./createRoutes";
const logger = logging.wichFileToLog("app");
const app = createRoutes();
const server = http.createServer(app);

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

server.listen(3500, () => {
  console.log("server is running");
});

// TODO: Implement this feature
// !: IMPORTANT
// ?: ASK
// *: General
// HACK: Temporary workaround, needs refactoring later
// REVIEW: Review this code for potential improvements
// NOTE: Additional information about the following code
// DEBUG: Temporary debug message, remove before production
// OPTIMIZE: Consider optimizing this code for better performance
