import express = require("express");
import * as path from "path";
import * as middleware from "./verifyClient";
import * as auth from "./auth";
import * as init from "./commonData"

import * as activity from "./ActivityManager";
import * as overview from "./Overview";
import * as clubOrg from "./ClubsOrganization"
import * as club from "./manage/club";
import * as category from "./manage/category";
import * as schoolYear from "./manage/schoolYear"

import * as user from "./manage/user";

import * as exportExcel from "./utils/exportExcel";
import * as fileUpload from "./FileUploadManager";
import * as serverHealth from "./serverHealth";

// import * as clientroute from "./manage/user";
// import * as activityroute from "./activity";

// import * as targetActivity from "./manage/targetActivity";
// import * as clubOrg from "./depreciated/clubsandorg";
function createRoutes() {
  const app = express();
  const verifyClient = middleware.verifyClient;

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));
  app.use("/attachments", express.static(path.join(__dirname, "attachments")));

  app.use(function (req, res, next) {
    res.setHeader("Team", "Dummy Batch");
    res.setHeader("Author", "Hairyblue");
    res.setHeader("Department", "CCIS");

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type,Team,Author,Department"
    );

    //res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  // STATIC FILES

  
  // * ROUTES
  app.use("/export", exportExcel.router);

  app.post("/api/login", auth.loginFunc);

  app.patch("/api/logout", verifyClient, auth.logoutFunc);

  app.use("/api", verifyClient, init.router);
  app.use("/api", verifyClient, overview.router);
  app.use("/api", verifyClient, activity.router);
  app.use("/api", verifyClient, clubOrg.router);

  app.use("/api/manage", verifyClient, club.register());
  app.use("/api/manage", verifyClient, category.register());
  app.use("/api/manage", verifyClient, schoolYear.register());

  app.use("/api", verifyClient, user.router);
  app.use("/api", verifyClient, fileUpload.router);

  app.use("/api", verifyClient, serverHealth.router);
  
  // app.use("/api", verifyClient, clientroute.router);
  // app.use("/api", verifyClient, activityroute.router);
  // app.use("/api", verifyClient, targetActivity.register());
  // app.use("/api", verifyClient, clubOrg.router);
 
  return app;
}
export default createRoutes;
