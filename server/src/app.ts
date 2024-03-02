require("source-map-support").install();
import * as express from "express";
import * as http from "http";
import * as path from "path";

import * as loginroute from "./auth"
import * as acitivityroute from "./activity"
import * as middleware from "./utils/verifyClient"

import * as logging from "./utils/logger"

const logger = logging.wichFileToLog("app")
const app = express();
const server = http.createServer(app);
const verifyClient = middleware.verifyClient

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  //res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// * ROUTES
app.use("/api", loginroute.router)
app.use("/api", verifyClient, acitivityroute.router)

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