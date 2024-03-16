import * as express from "express";
import * as logging from "./logger";
import { show, create, update, destroy } from "./db/dbcon";
import { validateDates } from "./helpers/formatAndValidation";
interface GetUserRequest extends express.Request {
  user?: string;
}

const logger = logging.wichFileToLog("activity");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

interface GetUserRequest extends express.Request {
  user?: string;
}
// TODO add oher functionality for acitivity

function yearGenerated() {
  let startYear = 2000;
  let endYear = 2050;
  let yearData: string[] = [];
  for (let i = startYear; i <= endYear; i++) {
    yearData.push(i.toString());
  }
  return yearData;
}

router.get("/activity", async function (req, res) {

  let { pageSize, pageNumber, searchFilter, clubFilter, categoryFilter, year, orderBy } = req.query;
  let data: any = {};
  const page_size = Number(pageSize);
  const offSet: number = (Number(pageNumber) - 1) * page_size;

  data["year"] = yearGenerated();
  data["count"] = await show("SELECT COUNT(*) as count from Activity", []);
  data["formdata"] = {
    club: await show("SELECT clubId, clubName, clubAcronym FROM Club", []),
    category: await show("SELECT categoryId, categoryName FROM Category", []),
  };

  if (orderBy !== "" && orderBy !== "ASC") {
    orderBy = "DESC";
  } else if (orderBy == "") orderBy = "DESC";

  if (searchFilter == "" && clubFilter == "" && categoryFilter == "") {
    data["result"] = await show(
      `SELECT * from Activity INNER JOIN Club ON club_id = clubId INNER JOIN Category ON category_id = categoryId WHERE EXTRACT(YEAR FROM activity_created_at) = ${year} ORDER BY activity_created_at ${orderBy} LIMIT ${page_size} OFFSET ${offSet} `,
      []
    );
  } else if (searchFilter !== "") {
    data["result"] = await show(
      `SELECT * from Activity INNER JOIN Club ON club_id = clubId INNER JOIN Category ON category_id = categoryId WHERE activityName LIKE ? OR clubName LIKE ? OR categoryName LIKE ? or activityDisplayDate LIKE ? AND EXTRACT(YEAR FROM activity_created_at) = ${year} ORDER BY activity_created_at ${orderBy} LIMIT ${page_size} OFFSET ${offSet} `,
      [`%${searchFilter}%`, `%${searchFilter}%`, `%${searchFilter}%`, `%${searchFilter}%`]
    );
  } else if (clubFilter !== "") {
    data["result"] = await show(
      `SELECT * from Activity INNER JOIN Club ON club_id = clubId INNER JOIN Category ON category_id = categoryId WHERE club_id = ? AND EXTRACT(YEAR FROM activity_created_at) = ${year} ORDER BY activity_created_at ${orderBy} LIMIT ${page_size} OFFSET ${offSet}`,
      [Number(clubFilter)]
    );
  } else if (categoryFilter !== "") {
    data["result"] = await show(
      `SELECT * from Activity INNER JOIN Club ON club_id = clubId INNER JOIN Category ON category_id = categoryId WHERE category_id = ? AND EXTRACT(YEAR FROM activity_created_at) = ${year} ORDER BY activity_created_at ${orderBy} LIMIT ${page_size} OFFSET ${offSet} `,
      [Number(categoryFilter)]
    );
  }

  res.json(data);
});

router.post("/activity", async function (req, res) {
  const user = (req as GetUserRequest).user;
  const { club_id, category_id, activityName, activityNotes, activityStartDateIso, activityEndDateIso } = req.body;
  const displayDate = validateDates(activityStartDateIso, activityEndDateIso);

  if (!club_id || !category_id || activityName == "") {
    logger.warn(`${user} is failed to post data in acitivity`);
    res.status(400).json({ message: "Please complete the form" });
  } else if (!displayDate) {
    logger.warn(`${user} is failed to input a date in acitivity`);
    res.status(400).json({ message: "Please select or change the date" });
  } else {
    await create(
      "INSERT INTO Activity (club_id, category_id, activityName, activityNotes, activityStartDateIso, activityEndDateIso, activityDisplayDate) values (?, ?, ?, ?, ?, ?, ?)",
      [club_id, category_id, activityName, activityNotes, activityStartDateIso, activityEndDateIso, displayDate]
    );
  }

  logger.info(`activity was added by ${user}`);
  res.json({ message: "success" });
});

router.put("/activity", async function (req, res) {
  const user = (req as GetUserRequest).user;

  const { activityId, club_id, category_id, activityName, activityNotes, activityStartDateIso, activityEndDateIso } = req.body;
  const displayDate = validateDates(activityStartDateIso, activityEndDateIso);

  if (!club_id || !category_id || activityName == "") {
    logger.warn(`${user} is failed to post data in acitivity`);
    res.status(400).json({ message: "Please complete the form" });
  } else if (!displayDate) {
    logger.warn(`${user} is failed to input a date in acitivity`);
    res.status(400).json({ message: "Please select or change the date" });
  } else {
    await update(
      "UPDATE Activity SET club_id = ?, category_id = ?, activityName = ?, activityNotes = ?, activityStartDateIso = ?, activityEndDateIso = ?, activityDisplayDate = ? WHERE activityId = ?",
      [club_id, category_id, activityName, activityNotes, activityStartDateIso, activityEndDateIso, displayDate, activityId]
    );
  }

  logger.info(`activity was updated by ${user}`);
  res.json({ message: "success" });
});
export { router };
