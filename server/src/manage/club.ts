import * as express from "express";
import * as logging from "../logger";
import { show, create, update, destroy } from "../db/dbcon";
interface GetUserRequest extends express.Request {
  user?: string;
}

const logger = logging.wichFileToLog("club");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

function register() {
  router.get("/club", async function (req, res) {
    const { year } = req.query;
    const data = await show("SELECT clubId, clubName, clubAcronym FROM Club", []);
    res.json({ key: "club", result: data });
  });

  router.post("/club", async function (req, res) {
    const user = (req as GetUserRequest).user;
    const { clubName, clubAcronym } = req.body;
    if (clubName === "") {
      logger.warn(`${user} is failed to post data in club`);
      res.status(400).json({ message: "Club or organizatons name should not be empty" });
      return;
    }
    await create("INSERT INTO Club (clubName, clubAcronym) values (?, ?)", [clubName, clubAcronym]);
    logger.info(`${user} is posting data in club`);
    res.json({ message: "success" });
  });

  router.put("/club", async function (req, res) {
    const user = (req as GetUserRequest).user;
    const { clubId, clubName, clubAcronym } = req.body;
    if (clubId === null || clubName === "" || clubAcronym === "") {
      logger.warn(`${user} is failed to update data in club`);
      res.status(400).json({ message: "Please complete the form" });
      return;
    }

    await update("UPDATE Club SET clubName = ?, clubAcronym = ? WHERE clubId = ?", [clubName, clubAcronym, clubId]);

    logger.info(`${user} is updating data in club`);
    res.json({ message: "success" });
  });

  router.delete("/club/:id", async function (req, res) {
    const user = (req as GetUserRequest).user;

    const clubId = Number(req.params.id);
  
    await destroy("DELETE FROM Club WHERE clubId = ?", [clubId]);

    logger.info(`club was delete by ${user}`);
    res.json({ message: "success" });
  });
  return router;
}
export { register };
