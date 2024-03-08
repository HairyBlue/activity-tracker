import express = require("express");
import * as path from "path";

import * as loginroute from "./auth";
import * as acitivityroute from "./activity";
import * as middleware from "./verifyClient";
import * as manageroute from "./manage";

function createRoutes() {
  const app = express();
  const verifyClient = middleware.verifyClient;

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));

  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    //res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  // * ROUTES
  app.use("/api", loginroute.router);
  app.use("/api", verifyClient, acitivityroute.router);
  app.use("/api", verifyClient, manageroute.router);

  return app;
}
export default createRoutes;
