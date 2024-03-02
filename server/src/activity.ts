import * as express from "express";
import * as logging from "./utils/logger";

const logger = logging.wichFileToLog("activity");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

interface GetUserRequest extends express.Request {
  user?: string;
}
// TODO add oher functionality for acitivity

router.post("/activity", function (req, res) {
  logger.info(`activity was added by ${(req as GetUserRequest).user}`);

  console.log(req.body);
});

router.put("/activity", function (req, res) {
  console.log(req.body);
});
export { router };
