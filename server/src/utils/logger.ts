import * as winston from "winston";
import DailyRotateFile = require("winston-daily-rotate-file");
import * as fs from "fs";
import * as util from "util";
const { combine, timestamp, json, errors, simple } = winston.format;

const logFolder = "logs";

if (!fs.existsSync(logFolder)) {
  fs.mkdirSync(logFolder);
}
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      format: simple(),
    }),
    new DailyRotateFile({
      dirname: logFolder,
      filename: "log-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      maxSize: "20m",
      json: true,
      format: combine(errors({ stack: true }), timestamp(), json()),
    }),
  ],
});

function wichFileToLog(filename: string) {
  return {
    warn: function (...args: any) {
      let msg = util.format.apply({}, args);
      logger.log("warn", { filename, message: msg });
    },
    info: function (...args: any) {
      let msg = util.format.apply({}, args);
      logger.log("info", { filename, message: msg });
    },
    error: function (...args: any) {
      let msg = util.format.apply({}, args);
      logger.log("error", { filename, message: msg });
    },
  };
}

export { wichFileToLog };
