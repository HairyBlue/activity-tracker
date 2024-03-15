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

router.get("/activity", async function (req, res) {
  const data = {
    formdata: {
      club: await show("SELECT clubId, clubName, clubAcronym FROM Club", []),
      category: await show("SELECT categoryId, categoryName FROM Category", []),
    },
    result: await show("SELECT * from Activity", []),
  };
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

router.put("/activity", function (req, res) {
  console.log(req.body);
});
export { router };
