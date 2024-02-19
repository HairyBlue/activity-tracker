require("source-map-support").install();
import * as express from "express";
import * as http from "http";
import * as path from "path";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as bcrypt from "bcrypt";
import * as session from "express-session";
import * as xlxs from "xlsx";
import { DateTime } from "luxon";

// TODO: Implement this feature
// !: IMPORTANT
// ?: ASK
// *: General
// HACK: Temporary workaround, needs refactoring later
// REVIEW: Review this code for potential improvements
// NOTE: Additional information about the following code
// DEBUG: Temporary debug message, remove before production
// OPTIMIZE: Consider optimizing this code for better performance

//create http server
const app = express();
const server = http.createServer(app);
const defaults = yaml.load(fs.readFileSync(path.join(__dirname, "utils/defualt.settings.yaml"), "utf-8")) as any;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "twZ9TBDEcOJfev6R",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  //res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

app.post("/api/login", function (req, res) {
  const users = defaults?.settings.user as any[];
  const { emailOrUsername, password } = req.body;

  req.session.user = emailOrUsername;
  users.forEach((user) => {
    if (user[0] === emailOrUsername) {
      if (bcrypt.compareSync(password, user[1])) {
        req.session.user = emailOrUsername;
        res.status(200).json({ message: "success" });
      }
    }
  });
  res.status(401);
});

app.post("/api/activity", function (req, res) {
  console.log(req.body);
});
app.put("/api/activity", function (req, res) {
  console.log(req.body);
});
process
  .on("unhandledRejection", (reason, p) => {
    // logger.error(reason, "Unhandled Rejection at Promise", p);
    // logger.error(reason);
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", function (exception) {
    // logger.error(exception, "Fatal Uncaught exception: ");
    console.error(exception, "Fatal Uncaught exception: ");
    process.exit(1);
  });

server.listen(3500, () => {
  console.log("server is running");
});
