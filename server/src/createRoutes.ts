import express = require("express");
import * as path from "path";

import * as loginroute from "./auth";
import * as clientroute from "./client";
import * as activityroute from "./activity";
import * as middleware from "./verifyClient";
import * as club from "./manage/club";
import * as category from "./manage/category";
import * as targetActivity from "./manage/targetActivity";
import * as clubOrg from "./clubsandorg";
import * as exportExcel from "./utils/exportExcel"

function createRoutes() {
  const app = express();
  const verifyClient = middleware.verifyClient;

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
  app.use("/", exportExcel.router)
  app.use("/api", loginroute.router);

  app.use("/api", verifyClient, clientroute.router);
  app.use("/api", verifyClient, activityroute.router);
  app.use("/api", verifyClient, club.register());
  app.use("/api", verifyClient, category.register());
  app.use("/api", verifyClient, targetActivity.register());
  app.use("/api", verifyClient, clubOrg.router);
  return app;
}
export default createRoutes;
