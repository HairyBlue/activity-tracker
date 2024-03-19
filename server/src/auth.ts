import * as express from "express";
import { defaultUser } from "./settings";
import { bcryptCompareHashedPassword, jwtSignUser } from "./helpers/formatAndValidation";
import { show, create, destroy, update } from "./db/dbcon";
import * as logging from "./logger";
import "dotenv/config";

const logger = logging.wichFileToLog("auth");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.post("/login", async function (req, res) {
  const { emailOrUsername, password } = req.body;
  if (process.env.NODE_ENV == "production" || process.env.NODE_ENV == "staging") {
    // -------------------------------------------------------------------------------------------------------------------
    const result: any = await show("SELECT * FROM Users WHERE username = ? OR email = ?", [emailOrUsername, emailOrUsername]);
    if (result.length > 0) {
      if (bcryptCompareHashedPassword(password, result[0].password)) {
        const level: any = await show(
          "SELECT level from Roles inner join Levels on level_id = levelId inner join Users on user_id = userId WHERE user_id = ?",
          [result[0].userId]
        );

        logger.info(`Login success by ${emailOrUsername}`);
        res.status(200).json({ message: "success", token: jwtSignUser(emailOrUsername), level: level[0].level });
      } else {
        logger.warn(`Login attemp or failed by ${emailOrUsername}`);
        res.status(401).json({ message: "error" });
      }
    } else {
      logger.warn(`Login attemp or failed by ${emailOrUsername}`);
      res.status(401).json({ message: "error" });
    }

    // -------------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------
  } else {
    // -------------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------
    const { emailOrUsername, password } = req.body;
    let login = false;

    if (defaultUser.username === emailOrUsername || defaultUser.email === emailOrUsername) {
      if (bcryptCompareHashedPassword(password, defaultUser.password)) {
        login = true;
        logger.info(`Login success by ${emailOrUsername}`);
        res.status(200).json({ message: "success", token: jwtSignUser(emailOrUsername) });
      }
    }
    if (!login) {
      logger.warn(`Login attemp or failed by ${emailOrUsername}`);
      res.status(401).json({ message: "error" });
    }
  }

  // -------------------------------------------------------------------------------------------------------------------
});

export { router };
