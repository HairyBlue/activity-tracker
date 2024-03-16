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

const clubDummy = [
  {
    clubName: "Association of Computer Studies Students",
    clubKey: "Association_of_Computer_Studies_Students",
    clubId: 1,
  },
  {
    clubName: "Association of Liberal Arts Students",
    clubKey: "Association_of_Liberal_Arts_Students",
    clubId: 2,
  },
  {
    clubName: "Association of Marketing Management Students",
    clubKey: "Association_of_Marketing_Management_Students",
    clubId: 3,
  },
  {
    clubName: "Association of Student Assistants",
    clubKey: "Association_of_Student_Assistants",
    clubId: 4,
  },
  {
    clubName: "College of Accountancy, Business and Entrepreneurship",
    clubKey: "College_of_Accountancy,_Business_and_Entrepreneurship",
    clubId: 5,
  },
  {
    clubName: "College of Computing and Information Sciences",
    clubKey: "College_of_Computing_and_Information_Sciences",
    clubId: 6,
  },
  {
    clubName: "College of Education, Arts and Sciences",
    clubKey: "College_of_Education,_Arts_and_Sciences",
    clubId: 7,
  },
  {
    clubName: "College of Health Sciences",
    clubKey: "College_of_Health_Sciences",
    clubId: 8,
  },
  {
    clubName: "College of Special Programs",
    clubKey: "College_of_Special_Programs",
    clubId: 9,
  },
  {
    clubName: "College of Special Programs Student Government",
    clubKey: "College_of_Special_Programs_Student_Government",
    clubId: 10,
  },
  {
    clubName: "College Student Government",
    clubKey: "College_Student_Government",
    clubId: 11,
  },
  {
    clubName: "Crime Buster Club",
    clubKey: "Crime_Buster_Club",
    clubId: 12,
  },
  { clubName: "Innovators", clubKey: "Innovators", clubId: 13 },
  {
    clubName: "Junior Association of Hospitality Management",
    clubKey: "Junior_Association_of_Hospitality_Management",
    clubId: 14,
  },
  {
    clubName: "Junior Executives of Business Administration",
    clubKey: "Junior_Executives_of_Business_Administration",
    clubId: 15,
  },
  {
    clubName: "Junior Financial Executives",
    clubKey: "Junior_Financial_Executives",
    clubId: 16,
  },
  {
    clubName: "Junior Financial Executives",
    clubKey: "Junior_Financial_Executives",
    clubId: 17,
  },
  {
    clubName: "Junior Philippine Association of Management Accountants",
    clubKey: "Junior_Philippine_Association_of_Management_Accountants",
    clubId: 18,
  },
  {
    clubName: "Junior Philippine Institute of Civil Engineers",
    clubKey: "Junior_Philippine_Institute_of_Civil_Engineers",
    clubId: 19,
  },
  {
    clubName: "Junior Philippine Institute of Accountants",
    clubKey: "Junior_Philippine_Institute_of_Accountants",
    clubId: 20,
  },
  {
    clubName: "Junior People Management Association of the Philippines",
    clubKey: "Junior_People_Management_Association_of_the_Philippines",
    clubId: 21,
  },
  {
    clubName: "Junior People Management Association of the Philippines",
    clubKey: "Junior_People_Management_Association_of_the_Philippines",
    clubId: 22,
  },
  {
    clubName: "Kapisanan ng mga Mag-aaral sa Filipino",
    clubKey: "Kapisanan_ng_mga_Mag-aaral_sa_Filipino",
    clubId: 23,
  },
  {
    clubName: "Kapisanan ng mga Mag-aaral sa Filipino",
    clubKey: "Kapisanan_ng_mga_Mag-aaral_sa_Filipino",
    clubId: 24,
  },
  {
    clubName: "League of Science Majors",
    clubKey: "League_of_Science_Majors",
    clubId: 25,
  },
  { clubName: "Math Club", clubKey: "Math_Club", clubId: 26 },
  {
    clubName: "Organization of Physical Education Major",
    clubKey: "Organization_of_Physical_Education_Major",
    clubId: 27,
  },
  {
    clubName: "Organization of Physical Education Major",
    clubKey: "Organization_of_Physical_Education_Major",
    clubId: 28,
  },
  {
    clubName: "Peer Facilitators’ Club",
    clubKey: "Peer_Facilitators’_Club",
    clubId: 29,
  },
  {
    clubName: "Philippine Nursing Student Association",
    clubKey: "Philippine_Nursing_Student_Association",
    clubId: 30,
  },
  {
    clubName: "Red Cross Youth",
    clubKey: "Red_Cross_Youth",
    clubId: 31,
  },
  {
    clubName: "Student Association of Radiologic Technology",
    clubKey: "Student_Association_of_Radiologic_Technology",
    clubId: 32,
  },
  {
    clubName: "Society of Elementary Education Students",
    clubKey: "Society_of_Elementary_Education_Students",
    clubId: 33,
  },
  {
    clubName: "Society of English Majors",
    clubKey: "Society_of_English_Majors",
    clubId: 34,
  },
  {
    clubName: "Society of English Majors",
    clubKey: "Society_of_English_Majors",
    clubId: 35,
  },
  {
    clubName: "Society of Junior Psychologists",
    clubKey: "Society_of_Junior_Psychologists",
    clubId: 36,
  },
  {
    clubName: "Society of Math Majors",
    clubKey: "Society_of_Math_Majors",
    clubId: 37,
  },
  {
    clubName: "TerpsiCORean Performing Group",
    clubKey: "TerpsiCORean_Performing_Group",
    clubId: 38,
  },
  {
    clubName: "Vocation Club/Hummingbirds/Lectors",
    clubKey: "Vocation_Club/Hummingbirds/Lectors",
    clubId: 39,
  },
  {
    clubName: "Young Information Specialist",
    clubKey: "Young_Information_Specialist",
    clubId: 40,
  },
  {
    clubName: "Youth for Christ",
    clubKey: "Youth_for_Christ",
    clubId: 41,
  },
];

async function getCategoryCount() {
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
        "SELECT COUNT(*) AS count FROM Activity WHERE club_id = ? AND category_id = ? AND YEAR(activityStartDateIso) = 2024",
        [club.clubId, category.categoryId]
      );

      obj[club.clubKey]["category"].push({ categoryName: category.categoryName, count: result[0].count });
    }
    data.push(obj[club.clubKey]);
    delete data[club.clubKey];
  }
  console.log(data[0]);
}

// getCategoryCount();

async function getClubCount() {
  const clubs: any = await show("SELECT clubName, clubAcronym, REPLACE(clubName, ' ', '_') AS clubKey, clubId from Club", []);
  let obj: any = {};
  let data: any[] = [];
  for (let club of clubs) {
    obj[club.clubKey] = {};
    obj[club.clubKey]["clubName"] = club.clubName;
    obj[club.clubKey]["clubAcronym"] = club.clubAcronym;
    const result: any = await show("SELECT COUNT(*) as count FROM Activity WHERE club_id = ?", [club.clubId]);

    obj[club.clubKey]["count"] = result[0].count;
    data.push(obj[club.clubKey]);
    delete data[club.clubKey];
  }
  console.log(data);
}

async function getPercentage() {
  const clubs: any = await show("SELECT clubName, clubAcronym, REPLACE(clubName, ' ', '_') AS clubKey, clubId from Club", []);
  let obj: any = {};
  let data: any[] = [];
  for (let club of clubs) {
    obj[club.clubKey] = {};
    obj[club.clubKey]["clubName"] = club.clubName;
    obj[club.clubKey]["clubAcronym"] = club.clubAcronym;
    const result: any = await show(
      `SELECT ROUND((COUNT(*)/(SELECT targetActivityNumber FROM TargetActivity WHERE club_id = ? AND targetActivityYear = '2024') * 100)) AS percentage FROM Activity WHERE club_id = ? AND YEAR(activityStartDateIso) = 2024`,
      [club.clubId, club.clubId]
    );

    obj[club.clubKey]["percentage"] = Number(result[0].percentage);
    data.push(obj[club.clubKey]);
    delete data[club.clubKey];
  }
  console.log(data);
}

async function getActivityMonth() {
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
        "SELECT MONTH(activityStartDateIso) AS months, COUNT(*) AS count FROM Activity WHERE club_id = ? AND  category_id = ? AND YEAR(activityStartDateIso) = '2024' GROUP BY MONTH(activityStartDateIso)",
        [club.clubId, category.categoryId]
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
      obj[club.clubKey]["category"][category.categoryName] = toArray
    }

    data.push(obj[club.clubKey]);
    delete data[club.clubKey];
  }
  // console.log(JSON.parse(JSON.stringify(data)));
  console.log(data[0].category);
}

