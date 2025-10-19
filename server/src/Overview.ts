import * as logging from "./logger";
import * as lodash from "lodash";
import * as express from "express";
import { show } from "./db/dbcon";
import { initAll } from "./commonData"
import { overviewAll } from "./types";
import { cleanQuery } from "./helpers/svcfunc";

const router = express.Router();

const queryActCount = "Select COUNT(DISTINCT(activity_same_record_uuid)) as count from Activity LEFT JOIN Club ON club_id = clubId LEFT JOIN Category ON category_id = categoryId where club_id = ? AND activitySchoolYear = ? AND activitySemester = ? AND activityStatus = ? AND clubArchive = 0 AND categoryArchive = 0";
const queryPCT = "SELECT targetActivityNumber FROM TargetActivity WHERE club_id = ? AND targetActivityYear = ? AND targetActivitySemester = ?";
const queryTarget = "SELECT COUNT(*) as count FROM TargetActivity WHERE club_id = ? AND targetActivityYear = ? AND targetActivitySemester = ?";
const queryLatest = "SELECT * from Activity INNER JOIN Club ON club_id = clubId INNER JOIN Category ON category_id = categoryId WHERE YEAR(activityStartDateIso) = ? AND activitySemester = ? AND activityArchive = 0 ORDER BY activityStartDateIso ASC LIMIT 20 OFFSET 0"
const queryListDataApproved = "Select * from Activity Club ON club_id = clubId  where activityStatus = 1"
const queryListDataPending = "Select * from Activity Club ON club_id = clubId where activityStatus = 0"

function queryAll( schoolYear: string, semester: string, orderBy: "ASC" | "DESC", limit: number, offset: number ) {
  const query = `
    Select
      activity_uuid,
      activity_same_record_uuid,
      activityName,
      activityNotes,
      activityDisplayDate,
      activityStartDateIso,
      activityEndDateIso,
      activitySemester,
      activitySchoolYear,
      activityVenue,
      activityPersonel,
      activityNumberParticipants,
      activityModality,
      activityStatus,
      activityComments,
      clubName,
      clubAcronym,
      categoryName,
      category_uuid,
      club_uuid
    From Activity
    LEFT JOIN Club ON club_id = clubId
    LEFT JOIN Category ON category_id = categoryId
    WHERE activitySchoolYear = '${schoolYear}'
    AND activitySemester = '${semester}'
    AND clubArchive = 0
    AND categoryArchive = 0
    ORDER BY activityStartDateIso ${orderBy}
    LIMIT ${limit}
    OFFSET ${offset}
  `
  const cleanedQuery = cleanQuery(query)

  return cleanedQuery;
}


function groupSameRecordUuid(rawData: any) {
  const cleanData: any = {};

  for (let data of rawData) {

    if (!cleanData[data.activity_same_record_uuid]) {
      cleanData[data.activity_same_record_uuid] = {};
      cleanData[data.activity_same_record_uuid]["activities"] = [];
    }

    cleanData[data.activity_same_record_uuid]["activities"].push(data);
  }

  return cleanData;
}

class Overview {
  clubs: any[];
  activitySchoolYear: string;
  sem: string;
  status: string;
  all: overviewAll;

  constructor(clubs: any, activitySchoolYear: string, sem: string, status: string) {
    this.activitySchoolYear = activitySchoolYear;
    this.sem = sem;
    this.clubs = clubs;
    this.status = status;

    this.all = { 
      data: {
        co: null,
        target: null, 
        latest: null
      }
    };
  }

  async getClubOrg(query: string) {
    let newData = [];

    for (let club of this.clubs) {
      const params = [club.clubId, this.activitySchoolYear, this.sem, this.status];

      const result: any = await show(query, params);
      const merge = lodash.merge(club, result[0]);
      newData.push(merge);
    }

    this.all.data.co = newData;
  }

  async getPercentage(query: string) {
    const coData = this.all.data.co;
    let newData = [];

    for (let co of coData) {
      const params = [co.clubId, this.activitySchoolYear, this.sem];
      const result: any = await show(query, params);

      const target = result[0];
      let percentage = 0.0;

      if (target) {
        percentage = Math.round((co.count / target.targetActivityNumber) * 100);
      }

      // delete co["clubId"];
      co["percentage"] = percentage;
      newData.push(co);
    }

    this.all.data.co = newData;
  }

  async tartgetActivity(query: string) {

    const noActivity = [];
    const hasActivity = [];

    let countNA = 0;
    let counHA = 0;

    for (let club of this.clubs) {
      const params = [club.clubId, this.activitySchoolYear, this.sem];
      const result: any = await show(query, params);
      
      if (result.length == 0) {
        continue;
      }

      const count = !isNaN(result[0]?.count) && result[0]?.count;

      if ( count > 0) {
        hasActivity.push(club.clubKey)
        counHA++
      } else { 
        noActivity.push(club.clubKey);
        countNA++
      }
    }

    const obj = {
      noActivity: noActivity,
      hasActivity: hasActivity,
      targetNum: [counHA, countNA]
    }

    this.all.data.target = obj;
  }

  // async latestActivity(query: string) {
  //   const params = [this.activitySchoolYear, this.sem];
  //   const result: any = await show(query, params);

  //   if (result.length > 0) {
  //     this.all.data.latest = result;
  //   }
  // }

  async latestActivity() {
    const query = queryAll(this.activitySchoolYear, this.sem, "ASC", 20, 0)
    const result =  await show(query, [])

    this.all.data.latest = groupSameRecordUuid(result);
  }

  getData() {
    return this.all;
  }
}



const defYear: string = new Date().getFullYear().toString();

async function processOverview(req: express.Request, activitySchoolYear: string, sem: string, status: string) {

  const common = await initAll(req);
  const clubs = common.initClub;

  const overview = new Overview(clubs, activitySchoolYear, sem, status);

  await overview.getClubOrg(queryActCount);
  // await overview.getPercentage(queryPCT);
  // await overview.tartgetActivity(queryTarget);
  await overview.latestActivity();

  return overview.getData();
}

router.get("/overview/:activitySchoolYear/:semester/:status", async function(req, res){
  const {activitySchoolYear, semester, status} =  req.params;
  
  const result = await processOverview(req, activitySchoolYear, semester, status);
  
  res.status(200);
  res.json(result)
})


export {
  router
}
