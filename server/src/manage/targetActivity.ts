import * as express from "express";
import * as logging from "../logger";
import { show, create, update, destroy } from "../db/dbcon";
interface GetUserRequest extends express.Request {
  user?: string;
}

const logger = logging.wichFileToLog("targetActivity");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

function yearGenerated() {
  let startYear = 2000;
  let endYear = 2050;
  let yearData: string[] = [];
  for (let i = startYear; i <= endYear; i++) {
    yearData.push(i.toString());
  }
  return yearData;
}

// function targetActivityDummy() {
//   let random = [];
//   for (let i = 0; i < clubData.result.length; i++) {
//     random.push(Math.floor(Math.random() * 21));
//   }
//   return random;
// }
function register() {
  router.get("/target-activity", async function (req, res) {
    const data = {
      key: "target-activity",
      formData: {
        clubs: await show("SELECT clubId, clubName, clubAcronym FROM Club", []),
        years: yearGenerated(),
      },
      result: await show(
        "SELECT targetActivityId, targetActivityNumber, targetActivityYear, club_id, clubName, clubAcronym FROM TargetActivity INNER JOIN Club ON club_id = clubId",
        []
      ),
    };
    res.json(data);
  });

  router.post("/target-activity", async function (req, res) {
    const user = (req as GetUserRequest).user;
    let { targetActivityClubId, targetActivityNumber, targetActivityYear } = req.body;

    if (targetActivityClubId === null || targetActivityYear === "") {
      logger.warn(`${user} is failed to post data in target activity`);
      res.status(400).json({ message: "Please complete the form" });
      return;
    }
    if (typeof targetActivityNumber == "string") {
      targetActivityNumber = 0;
    }

    await create("INSERT INTO TargetActivity (club_id, targetActivityNumber, targetActivityYear) values (?, ?, ?)", [
      targetActivityClubId,
      targetActivityNumber,
      targetActivityYear,
    ]);

    logger.info(`${user} is positng data in target activity`);
    res.json({ message: "success" });
  });

  router.put("/target-activity", async function (req, res) {
    const user = (req as GetUserRequest).user;
    let { targetActivityClubId, targetActivityNumber, targetActivityYear, targetActivityId } = req.body;

    if (targetActivityClubId === null || targetActivityYear === "") {
      logger.warn(`${user} is failed to post data in target activity`);
      res.status(400).json({ message: "Please complete the form" });
      return;
    }
    if (typeof targetActivityNumber == "string") {
      targetActivityNumber = 0;
    }
    await update("UPDATE TargetActivity SET club_id = ?, targetActivityNumber = ?, targetActivityYear = ? WHERE targetActivityId = ?", [
      targetActivityClubId,
      targetActivityNumber,
      targetActivityYear,
      targetActivityId,
    ]);

    logger.info(`${user} is positng data in target activity`);
    res.json({ message: "success" });
  });

  return router;
}
export { register };
