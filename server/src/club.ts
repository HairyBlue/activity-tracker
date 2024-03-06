import * as express from "express";
import * as logging from "./logger";

interface GetUserRequest extends express.Request {
  user?: string;
}
const logger = logging.wichFileToLog("club");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get("/clun", function (req, res) {});

router.post("/club", function (req, res) {
  console.log(req.body);
});

router.patch("/club", function (req, res) {
  console.log(req.body);
});
// TODO add club post and get
