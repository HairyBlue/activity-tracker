import * as express from "express";
import * as logging from "../logger";
import { show, create, update, destroy } from "../db/dbcon";
import { handleMod } from "../depreciated/cachedData";
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

async function clubsNoTargetActivity(year: any, semester: any) {
  const data: any = [];
  const clubs: any = await show("SELECT clubId, clubName, clubAcronym FROM Club", []);
  for (let club of clubs) {
    const res: any = await show(
      "SELECT COUNT(*) as count FROM TargetActivity WHERE club_id = ? AND targetActivityYear = ? AND targetActivitySemester = ?",
      [club.clubId, year, semester]
    );

    if (res[0].count == 0) {
      data.push(club);
    }
  }
  return data;
}

function register() {
  router.get("/target-activity", async function (req, res) {
    const { year, semester } = req.query;

    const data = {
      key: "target-activity",
      formData: {
        clubs: await show("SELECT clubId, clubName, clubAcronym FROM Club", []),
        clubNoAct: await clubsNoTargetActivity(year, semester),
        years: yearGenerated(),
      },
      result: await show(
        "SELECT targetActivityId, targetActivityNumber, targetActivityYear, targetActivitySemester, club_id, clubName, clubAcronym FROM TargetActivity INNER JOIN Club ON club_id = clubId WHERE targetActivityYear = ? AND targetActivitySemester = ?",
        [year, semester]
      ),
    };
    res.json(data);
  });

  router.post("/target-activity", async function (req, res) {
    const user = (req as GetUserRequest).user;
    let { targetActivityClubId, targetActivityNumber, targetActivityYear, targetActivitySemester } = req.body;

    const checkIfNotDup: any = await show(
      "Select COUNT(*) as count FROM TargetActivity WHERE club_id = ? AND targetActivityYear = ? AND targetActivitySemester = ?",
      [targetActivityClubId, targetActivityYear, targetActivitySemester]
    );

    if (typeof targetActivityNumber == "string") {
      targetActivityNumber = 0;
    }

    if (targetActivityClubId === null || targetActivityYear === "") {
      logger.warn(`${user} is failed to post data in target activity`);
      res.status(400).json({ message: "Please complete the form" });
      return;
    } else if (checkIfNotDup[0].count > 0) {
      logger.warn(`${user} is failed to post data in target activity`);
      res.status(400).json({ message: "Duplicate Entry" });
      return;
    } else {
      await create("INSERT INTO TargetActivity (club_id, targetActivityNumber, targetActivityYear, targetActivitySemester) values (?, ?, ?, ?)", [
        targetActivityClubId,
        targetActivityNumber,
        targetActivityYear,
        targetActivitySemester,
      ]);
      logger.info(`${user} is positng data in target activity`);

      handleMod()
      res.json({ message: "success" });
    }
  });

  router.put("/target-activity", async function (req, res) {
    const user = (req as GetUserRequest).user;
    let { targetActivityClubId, targetActivityNumber, targetActivityYear, targetActivityId, targetActivitySemester } = req.body;

    const checkIfClubSame: any = await show(
      "Select club_id FROM TargetActivity WHERE targetActivityId = ?",
      [targetActivityId]
    );
    const clubSupposed: any = await show(
      "Select clubName FROM Club WHERE clubId = ?",
      [checkIfClubSame[0].club_id]
    );

    if (typeof targetActivityNumber == "string") {
      targetActivityNumber = 0;
    }

    if (checkIfClubSame[0].club_id !== targetActivityClubId) {
      logger.warn(`${user} is failed to update data in target activity`);
      res.status(400).json({ message: `You update on different club supposed to be in ${clubSupposed[0].clubName}` });
      return;
    } else if (targetActivityClubId === null || targetActivityYear === "") {
      logger.warn(`${user} is failed to post data in target activity`);
      res.status(400).json({ message: "Please complete the form" });
      return;
    } else {
      await update(
        "UPDATE TargetActivity SET club_id = ?, targetActivityNumber = ?, targetActivityYear = ?, targetActivitySemester = ? WHERE targetActivityId = ?",
        [targetActivityClubId, targetActivityNumber, targetActivityYear, targetActivitySemester, targetActivityId]
      );

      logger.info(`${user} is positng data in target activity`);

      handleMod()
      res.json({ message: "success" });
    }
  });

  router.delete("/target-activity/:id", async function (req, res) {
    const user = (req as GetUserRequest).user;

    const targetActivityId = Number(req.params.id);

    await destroy("DELETE FROM TargetActivity WHERE targetActivityId = ?", [targetActivityId]);

    logger.info(`club was delete by ${user}`);

    handleMod()
    res.json({ message: "success" });
  });
  return router;
}
export { register };
