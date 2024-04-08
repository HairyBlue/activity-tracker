import * as winston from "winston";
import DailyRotateFile = require("winston-daily-rotate-file");
import * as JSZip from "jszip"
import * as fs from "fs";
import * as util from "util";
import { DateTime } from "luxon"
import 'dotenv/config'
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

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({
    format: simple(),
  }),)
}

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

function zipTheLogs() {
 
  const threeDaysAgo = DateTime.now().minus({days: 3})
  const files = fs.readdirSync(logFolder);
  const zip = new JSZip();

  files.forEach((file) => {
    if (file.startsWith("log-") && file.endsWith(".log")) {
      
      const datePart = file.split("log-")[1].split(".log")[0];
      const logDate = DateTime.fromFormat(datePart, 'yyyy-MM-dd-HH');

      if (logDate < threeDaysAgo) {
        const filePath = `${logFolder}/${file}`;
        const content = fs.readFileSync(filePath, "utf8");
        zip.file(file, content);
        zip.generateAsync({ type: "nodebuffer" }).then((content: any) => {
          fs.writeFileSync(`${logFolder}/older_logs_${DateTime.now().toFormat('yyyy-MM-dd')}.zip`, content);
          fs.unlinkSync(filePath)
        });
      }
    }
  });
}

function logList() {
  const files = fs.readdirSync(logFolder);
  const fileList: string[] = []

  files.forEach(file => {
    fileList.push(file)
  })
 
  return fileList
}

function readLog(file: string) {
  const filePath = `${logFolder}/${file}`;

  return fs.readFileSync(filePath, "utf8");
}

export { wichFileToLog, zipTheLogs, logList, readLog };
