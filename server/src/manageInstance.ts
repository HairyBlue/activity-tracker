import * as express from "express";
import * as logging from "./logger";
import { show, create, update, destroy } from "./db/dbcon";
interface GetUserRequest extends express.Request {
  user?: string;
}

const logger = logging.wichFileToLog("manage");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

// CATEGORY ****************************************************************************************
router.get("/category", async function (req, res) {
  const data = await show("SELECT categoryId, categoryName FROM Category", []);
  res.json({ key: "category", result: data });
});

router.post("/category", async function (req, res) {
  const user = (req as GetUserRequest).user;
  const { categoryName } = req.body;

  if (categoryName === "") {
    logger.warn(`${user} is failed to post data in category`);
    res.status(400);
    return;
  }

  await create("INSERT INTO Category (categoryName) values (?)", [categoryName]);

  logger.info(`${user} is posting data in category`);
  res.json({ message: "success" });
});

router.put("/category", async function (req, res) {
  const user = (req as GetUserRequest).user;
  const { categoryId, categoryName } = req.body;

  if (categoryId === null || categoryName === "") {
    logger.warn(`${user} is failed to update data in category`);
    res.status(400);
    return;
  }

  await update("UPDATE Category SET categoryName = ? WHERE categoryId = ?", [categoryName, categoryId]);

  logger.info(`${user} is updating data in category`);
  res.json({ message: "success" });
});

// CLUB ****************************************************************************************
router.get("/club", async function (req, res) {
  const data = await show("SELECT clubId, clubName, clubAcronym FROM Club", []);
  res.json({ key: "club", result: data });
});


router.post("/club", async function (req, res) {
  const user = (req as GetUserRequest).user;
  const { clubName, clubAcronym } = req.body;
  if (clubName === "" || clubAcronym === "") {
    logger.warn(`${user} is failed to post data in club`);
    res.status(400);
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
    res.status(400);
    return;
  }

  await update("UPDATE Club SET clubName = ?, clubAcronym = ? WHERE clubId = ?", [clubName, clubAcronym, clubId]);

  logger.info(`${user} is updating data in club`);
  res.json({ message: "success" });
});

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

router.get("/target-activity", async function (req, res) {
  const targetActivityData = {
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
  res.json(targetActivityData);
});

router.post("/target-activity", async function (req, res) {
  const user = (req as GetUserRequest).user;
  const { targetActivityClubId, targetActivityNumber, targetActivityYear } = req.body;

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
  console.log(req.body);
  const { targetActivityClubId, targetActivityNumber, targetActivityYear, targetActivityId } = req.body;

  await update("UPDATE TargetActivity SET club_id = ?, targetActivityNumber = ?, targetActivityYear = ? WHERE targetActivityId = ?", [
    targetActivityClubId,
    targetActivityNumber,
    targetActivityYear,
    targetActivityId,
  ]);

  logger.info(`${user} is positng data in target activity`);
  res.json({ message: "success" });
});
// export { router };

