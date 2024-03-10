import * as express from "express";
import { defaultUser } from "./settings"
import {bcryptCompareHashedPassword, jwtSignUser} from "./helpers/formatAndValidation"
import * as logging from "./logger";
import 'dotenv/config'

const logger = logging.wichFileToLog("auth");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV == "production" || process.env.NODE_ENV == "staging"){
  // TODO ADD FOR LOGIN USER
  console.log("NEED TO ADD FOR LOGIN USER IN PROD OR STAGE")
} else {
  router.post("/login", function (req, res) {
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
  });
}  
  


export { router };
