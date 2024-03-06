import * as express from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as settings from "./settings";
import * as logging from "./logger";

const logger = logging.wichFileToLog("auth");

const router = express.Router();
const defaults = settings.defaultSettings as any;

router.use(express.urlencoded({ extended: true }));

// TODO need to add SQL for user login
router.post("/login", function (req, res) {
  const users = defaults?.settings.user as any[];
  const { emailOrUsername, password } = req.body;
  let login = false;
  users.forEach((user) => {
    if (user[0] === emailOrUsername) {
      if (bcrypt.compareSync(password, user[1])) {
        const token = jwt.sign(
          { emailOrUsername: emailOrUsername },
          defaults.settings.secret
        );
        login = true;
        logger.info(`Login success by ${emailOrUsername}`);
        res.status(200).json({ message: "success", token: token });
      }
    }
  });
  if (!login) {
    logger.warn(`Login attemp or failed by ${emailOrUsername}`);
    res.status(401).json({ message: "error" });
  }
});

export { router };
