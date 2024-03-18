import * as express from "express";
import * as logging from "./logger";
import { show, create, update, destroy } from "./db/dbcon";
import { validateDates } from "./helpers/formatAndValidation";
interface GetUserRequest extends express.Request {
  user?: string;
}

const logger = logging.wichFileToLog("clubAndOrg");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

async function getCategoryCount(year: any) {
  const clubs: any = await show("SELECT clubName, clubAcronym, REPLACE(clubName, ' ', '_') AS clubKey, clubId from Club", []);
  const categories: any = await show("SELECT categoryName, REPLACE(categoryName, ' ', '_') AS categoryKey, categoryId FROM Category", []);
  let obj: any = {};
  let data: any[] = [];
  for (let club of clubs) {
    obj[club.clubKey] = {};
    obj[club.clubKey]["clubName"] = club.clubName;
    obj[club.clubKey]["clubAcronym"] = club.clubAcronym;
    obj[club.clubKey]["category"] = [];
    for (let category of categories) {
      const result: any = await show(
        "SELECT COUNT(*) AS count FROM Activity WHERE club_id = ? AND category_id = ? AND YEAR(activityStartDateIso) = ?",
        [club.clubId, category.categoryId, year]
      );

      obj[club.clubKey]["category"].push({ categoryName: category.categoryName, count: result[0].count });
    }
    data.push(obj[club.clubKey]);
    delete data[club.clubKey];
  }
  return data;
}

// getCategoryCount();

async function getClubCount(year: any) {
  const clubs: any = await show("SELECT clubName, clubAcronym, REPLACE(clubName, ' ', '_') AS clubKey, clubId from Club", []);
  let obj: any = {};
  let data: any[] = [];
  for (let club of clubs) {
    obj[club.clubKey] = {};
    obj[club.clubKey]["clubName"] = club.clubName;
    obj[club.clubKey]["clubAcronym"] = club.clubAcronym;
    const result: any = await show("SELECT COUNT(*) as count FROM Activity WHERE club_id = ? AND YEAR(activityStartDateIso) = ?", [
      club.clubId,
      year,
    ]);

    obj[club.clubKey]["count"] = result[0].count;
    data.push(obj[club.clubKey]);
    delete data[club.clubKey];
  }
  return data;
}

async function getPercentage(year: any) {
  const clubs: any = await show("SELECT clubName, clubAcronym, REPLACE(clubName, ' ', '_') AS clubKey, clubId from Club", []);
  let obj: any = {};
  let data: any[] = [];
  for (let club of clubs) {
    obj[club.clubKey] = {};
    obj[club.clubKey]["clubName"] = club.clubName;
    obj[club.clubKey]["clubAcronym"] = club.clubAcronym;
    const result: any = await show(
      `SELECT ROUND((COUNT(*)/(SELECT targetActivityNumber FROM TargetActivity WHERE club_id = ? AND targetActivityYear = '2024') * 100)) AS percentage FROM Activity WHERE club_id = ? AND YEAR(activityStartDateIso) = ?`,
      [club.clubId, club.clubId, year]
    );

    obj[club.clubKey]["count"] = Number(result[0].percentage);
    data.push(obj[club.clubKey]);
    delete data[club.clubKey];
  }
  return data;
}

async function getMonths(year: any) {
  const clubs: any = await show("SELECT clubName, clubAcronym, REPLACE(clubName, ' ', '_') AS clubKey, clubId from Club", []);
  const categories: any = await show("SELECT categoryName, REPLACE(categoryName, ' ', '_') AS categoryKey, categoryId FROM Category", []);
  let obj: any = {};
  let data: any[] = [];
  for (let club of clubs) {
    obj[club.clubKey] = {};
    obj[club.clubKey]["clubName"] = club.clubName;
    obj[club.clubKey]["clubAcronym"] = club.clubAcronym;
    obj[club.clubKey]["category"] = {};
    for (let category of categories) {
      const result: any = await show(
        "SELECT MONTH(activityStartDateIso) AS months, COUNT(*) AS count FROM Activity WHERE club_id = ? AND  category_id = ? AND YEAR(activityStartDateIso) = ? GROUP BY MONTH(activityStartDateIso)",
        [club.clubId, category.categoryId, year]
      );

      obj[club.clubKey]["category"][category.categoryName] = [];

      const toArray = [];
      for (let i = 1; i <= 12; i++) {
        toArray.push(0);
        for (let res of result) {
          if (i == res.months) {
            toArray[i - 1] = res.count;
          }
        }
      }
      obj[club.clubKey]["category"][category.categoryName] = toArray;
    }

    data.push(obj[club.clubKey]);
    delete data[club.clubKey];
  }
  // console.log(JSON.parse(JSON.stringify(data)));
  return data;
}

async function clubsTargetActivity(year: any) {
  const obj: any = {};
  obj["hasActivity"] = [];
  obj["noActivity"] = [];
  const clubs: any = await show("SELECT clubId, clubName, clubAcronym FROM Club", []);
  for (let club of clubs) {
    const res: any = await show("SELECT COUNT(*) as count FROM TargetActivity WHERE club_id = ? AND targetActivityYear = ?", [club.clubId, year]);

    if (res[0].count > 0) {
      obj["hasActivity"].push(club);
    }
    if (res[0].count == 0) {
      obj["noActivity"].push(club);
    }
  }
  obj["nums"] = [];
  obj["nums"].push(obj["hasActivity"].length);
  obj["nums"].push(obj["noActivity"].length);
  return obj;
}

function yearGenerated() {
  let startYear = 2000;
  let endYear = 2050;
  let yearData: string[] = [];
  for (let i = startYear; i <= endYear; i++) {
    yearData.push(i.toString());
  }
  return yearData;
}

router.get("/overview", async function (req, res) {
  //category-count, club-count, percentage, months
  const { year } = req.query;
  const data = {
    countRef: await getClubCount(year),
    percentageRef: await getPercentage(year),
    clubActivityRef: await clubsTargetActivity(year),
    calendarActivityRef: await show(
      `SELECT * from Activity INNER JOIN Club ON club_id = clubId INNER JOIN Category ON category_id = categoryId WHERE YEAR(activityStartDateIso) = ${year}`,
      []
    ),
    latest20ActivityRef: await show(
      `SELECT * from Activity INNER JOIN Club ON club_id = clubId INNER JOIN Category ON category_id = categoryId WHERE YEAR(activityStartDateIso) = ${year} ORDER BY activityStartDateIso ASC LIMIT 20 OFFSET 0`,
      []
    ),
    yearRef: yearGenerated(),
  };
  res.json({ result: data });
});

router.get("/clubs-organizatons", async function (req, res) {
  //category-count, club-count, percentage, months
  const { year } = req.query;
  const data = {
    categoryRef: await getCategoryCount(year),
    monthsRef: await getMonths(year),
    clubsRef: await show("SELECT clubName, clubAcronym FROM Club", []),
    yearRef: yearGenerated(),
  };
  res.json({ result: data });
});
export { router };
