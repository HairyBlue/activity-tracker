import * as express from "express";
import { configs } from "./settings";
import {
  bcryptCompareHashedPassword,
  jwtSignUser,
} from "./helpers/formatAndValidation";
import { show, update } from "./db/dbcon";
import { accessRightType, getAccessLevelType } from "./types";
import { encrypWithCryptojs, clientSecret } from "./dClient";
import { GetUserRequest } from "./types";

import * as logging from "./logger";
import "dotenv/config";

const logger = logging.wichFileToLog("auth");

const defaultUser = configs.local.user;

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

async function loginFunc(req: express.Request, res: express.Response) {
  const enableAll =
    process.env.NODE_ENV == "production" ||
    process.env.NODE_ENV == "development";
  const isLoginDefault = process.env.LOGIN_DEFAULT == "False" ? false : true;
  const { emailOrUsername, password } = req.body;

  const cleantEU = emailOrUsername.trim();
  const cleanPwd = password.trim();

  if (isLoginDefault) {
    let login = false;
    if (
      defaultUser.username === cleantEU ||
      defaultUser.email === cleantEU
    ) {
      if (bcryptCompareHashedPassword(cleanPwd, defaultUser.password)) {
        login = true;

        logger.info(`Login success by ${cleantEU}`);

        // console.log(encrypWithCryptojs("WEBMASTER"));
        const stringify = encrypWithCryptojs("WEBMASTER");

        res.status(200).json({
          message: "success",
          token: jwtSignUser("3ddb0697-bcf3-4457-a3cd-2878f7ee53e5"),
          stringify: stringify,
        });
      }
    }

    if (!login) {
      logger.warn(`Login attemp or failed by ${cleantEU}`);

      res.status(401).json({ message: "error" });
    }
  } else if (enableAll) {
    const result: any = await show(
      "SELECT * FROM Users WHERE username = ? OR email = ?",
      [cleantEU, cleantEU]
    );

    if (result.length > 0) {
      if (bcryptCompareHashedPassword(cleanPwd, result[0].password)) {
        const level: any = await show(
          "SELECT level from Roles inner join Levels on level_id = levelId inner join Users on user_id = userId WHERE user_id = ?",
          [result[0].userId]
        );

        await update("Update Users Set login = 1 Where userId = ?", [
          result[0].userId,
        ]);

 
        logger.info(`Login success by ${cleantEU}`);
        
       
        const stringify = encrypWithCryptojs(level[0].level);
        res.status(200).json({
          message: "success",
          token: jwtSignUser(result[0].user_uuid),
          stringify: stringify,
        });
      } else {
        logger.warn(`Login attemp or failed by ${cleantEU}`);
        res.status(401).json({ message: "error" });
      }
    } else {
      logger.warn(`Login attemp or failed by ${cleantEU}`);
      res.status(401).json({ message: "error" });
    }
  }
}

async function logoutFunc(req: express.Request, res: express.Response) {
  const user_uuid = (req as GetUserRequest).user_uuid;

  const result: any = await update(
    "Update Users Set login = 0 WHERE user_uuid = ?",
    [user_uuid]
  );

  if (result) {
    res.status(200);
    res.json({ message: "success" });
  }
}

async function getAccessLevel(user_uuid: string): Promise<getAccessLevelType> {
  const result: any = await show("SELECT * FROM Users WHERE user_uuid = ?", [
    user_uuid,
  ]);

  const level: any = await show(
    "SELECT level from Roles inner join Levels on level_id = levelId inner join Users on user_id = userId WHERE user_id = ?",
    [result[0].userId]
  );

  return {
    user: result[0],
    level: level[0].level,
  };
}

async function getStudentProfile(user_id: number) {
  const result: any = await show(
    "SELECT * FROM Student LEFT JOIN Users ON userId = student_user_id LEFT JOIN Club ON club_id = clubId WHERE student_user_id = ?",
    [user_id]
  );

  return result;
}

function approveAccess(level: string, accessRight: accessRightType): boolean {
  const hasAccess = level.match(accessRight);
  if (hasAccess) {
    return true;
  }
  return false;
}

export {
  loginFunc,
  logoutFunc,
  getAccessLevel,
  getStudentProfile,
  approveAccess,
};
