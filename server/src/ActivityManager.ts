import * as fs from "fs";
import * as express from "express";
import * as logging from "./logger";
import { show, create, update, destroy } from "./db/dbcon";
import { validateDates } from "./helpers/formatAndValidation";
import { cleanQuery } from "./helpers/svcfunc";
import { GetUserRequest } from "./types";
import { getAccessLevel, getStudentProfile, approveAccess } from "./auth";
import { getDocuments, getEachCategory, getEachClub } from "./commonData";
import { uuid } from "./helpers/svcfunc";
import { Settings, DateTime } from "luxon"

Settings.defaultZone = "Asia/Manila"

const logger = logging.wichFileToLog("activity");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));



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
    AND activityArchive = 0
    ORDER BY activityStartDateIso ${orderBy}
    LIMIT ${limit}
    OFFSET ${offset}
  `
  const cleanedQuery = cleanQuery(query)

  return cleanedQuery;
}

function queryEach( ) {
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
      activityStatusTimeStamp,
      clubName,
      clubAcronym,
      categoryName,
      category_uuid,
      club_uuid
    From Activity
    LEFT JOIN Club ON club_id = clubId
    LEFT JOIN Category ON category_id = categoryId
    WHERE activity_same_record_uuid = ?
    AND activityArchive = 0
  `
  const cleanedQuery = cleanQuery(query)

  return cleanedQuery;
}

function queryClub( schoolYear: string, semester: string, orderBy: "ASC" | "DESC", limit: number, offset: number, club_uuid: string) {
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
    WHERE club_uuid = '${club_uuid}'
    AND activitySchoolYear = '${schoolYear}'
    AND activitySemester = '${semester}'
    AND activityArchive = 0
    ORDER BY activityStartDateIso ${orderBy}
    LIMIT ${limit}
    OFFSET ${offset}
  `
  const cleanedQuery = cleanQuery(query)

  return cleanedQuery;
}


function queryClubAndCategory( schoolYear: string, semester: string, orderBy: "ASC" | "DESC", limit: number, offset: number, club_uuid: string, category_uuid: string) {
  const query = `
    Select
      activity_uuid,
      activityName,
      activityNotes,
      activityDisplayDate,
      activityStartDateIso,
      activityEndDateIso,
      activitySemester,
      activitySchoolYear,
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
    LEFT JOIN Documents ON activityId = document_activity_id
    WHERE club_uuid = '${club_uuid}'
    AND category_uuid = '${category_uuid}'
    AND activitySchoolYear = '${schoolYear}'
    AND activitySemester = '${semester}'
    AND activityArchive = 0
    ORDER BY activityStartDateIso ${orderBy}
    LIMIT ${limit}
    OFFSET ${offset}
  `
  const cleanedQuery = cleanQuery(query)

  return cleanedQuery;
}


function queryBySearch( schoolYear: string, semester: string, orderBy: "ASC" | "DESC", limit: number, offset: number) {
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
    WHERE activityName LIKE ? 
    OR clubName LIKE ? 
    OR clubAcronym LIKE ? 
    OR categoryName LIKE ?
    AND activitySchoolYear = '${schoolYear}'
    AND activitySemester = '${semester}'
    AND activityArchive = 0
    ORDER BY activityStartDateIso ${orderBy}
    LIMIT ${limit}
    OFFSET ${offset}
  `
  const cleanedQuery = cleanQuery(query)

  return cleanedQuery;
}

function querySearchByClub( schoolYear: string, semester: string, orderBy: "ASC" | "DESC", limit: number, offset: number, club_id: any) {
  const query = `
    Select
      activity_uuid,
      activityName,
      activityNotes,
      activityDisplayDate,
      activityStartDateIso,
      activityEndDateIso,
      activitySemester,
      activitySchoolYear,
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
    LEFT JOIN Documents ON activityId = document_activity_id
    WHERE activityName LIKE ? 
    AND club_id = '${club_id}'
    AND activitySchoolYear = '${schoolYear}'
    AND activitySemester = '${semester}'
    AND activityArchive = 0
    ORDER BY activityStartDateIso ${orderBy}
    LIMIT ${limit}
    OFFSET ${offset}
  `
  const cleanedQuery = cleanQuery(query)

  return cleanedQuery;
}


function postActivityQuery() {
  const query = `
    INSERT INTO Activity 
    (
      activity_uuid,
      activity_same_record_uuid,
      activityName,
      activityNotes,
      category_id,
      club_id,
      activityStartDateIso,
      activityEndDateIso,
      activityDisplayDate,
      activitySemester,
      activitySchoolYear,
      activityVenue,
      activityPersonel,
      activityNumberParticipants,
      activityModality,
      activityStatus,
      activityComments,
      activityStatusTimeStamp
    ) 
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const cleanedQuery = cleanQuery(query)

    return cleanedQuery;
}

function updateActivityQuery() {
  const query = `
    UPDATE Activity 
    SET 
      activityName = ?, 
      activityNotes = ?, 
      category_id = ?, 
      activityStartDateIso = ?, 
      activityEndDateIso = ?,
      activityDisplayDate = ?, 
      activitySemester = ?,
      activitySchoolYear = ?,
      activityVenue = ?,
      activityPersonel = ?,
      activityNumberParticipants = ?,
      activityModality =?,
      activityStatus = ?,
      activityComments =?,
      activityStatusTimeStamp = ?
    WHERE activity_same_record_uuid = ?`
    const cleanedQuery = cleanQuery(query)

    return cleanedQuery;
}

function approveDeniedQuery() {
  const query = `
    UPDATE Activity 
    SET 
      activityStatus = ?,
      activityComments = ?
    WHERE 
      activity_uuid = ?`

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

class Activity {
  schoolYear: string;
  sem: string;
  orderBy: "ASC" | "DESC";
  limit: number;
  offset: number;

  constructor(schoolYear: string, sem: string, orderBy: "ASC" | "DESC", pageSize: string, pageNumber: string) {
    this.schoolYear = schoolYear;
    this.sem = sem;
    this.orderBy = orderBy;
    this.limit = parseInt(pageSize);
    this.offset = (parseInt(pageNumber) - 1) * this.limit;
  }

  async getAll() {
    const query = queryAll(this.schoolYear, this.sem, this.orderBy, this.limit, this.offset)
    const result =  await show(query, [])

    return groupSameRecordUuid(result);
    // return result;
  }

  async getByClub(club_uuid: string) {
    const query = queryClub(this.schoolYear, this.sem, this.orderBy, this.limit, this.offset, club_uuid);
    const result =  await show(query, []);

    return groupSameRecordUuid(result);
    // return result
  }

  async getByCbCt(club_uuid: string, category_uuid: string) {
    const query = queryClubAndCategory(this.schoolYear, this.sem, this.orderBy, this.limit, this.offset, club_uuid, category_uuid)
    const result =  await show(query, [])
    return groupSameRecordUuid(result);
    // return result
  }

  async getBySearch(activityName: string, clubName: string,  clubAcronym: string,  categoryName: string) {
    const query = queryBySearch(this.schoolYear, this.sem, this.orderBy, this.limit, this.offset)
    const result =  await show(query, [activityName, clubName, clubAcronym, categoryName])
    return groupSameRecordUuid(result);
    // return result
  }

  async getSearchByClub(activityName: string, categoryName: string, club_id: any) {
    const query = querySearchByClub(this.schoolYear, this.sem, this.orderBy, this.limit, this.offset, club_id)
    const result =  await show(query, [activityName, categoryName])
    return result
  }
}


async function activityData(req: express.Request, res: express.Response ) {
  try {
    const { activitySchoolYear, activitySemester, orderBy, pageSize, pageNumber, club_uuid, category_uuid, searchFilter} = req.query as any;
    const activity = new Activity(activitySchoolYear, activitySemester, orderBy, pageSize, pageNumber);
    
    let result = null;
    
    if (searchFilter.length > 0) {
      const search = '%' + searchFilter + '%';
      result = await activity.getBySearch(search, search, search, search)
    // } else if (club_uuid.length > 0 && category_uuid.length > 0) {
    //   result = await activity.getByCbCt(club_uuid, category_uuid);
    } else if (club_uuid.length > 0 ) {
      result = await activity.getByClub(club_uuid);
    }  else {
      result = await activity.getAll();
    }

    res.status(200)
    res.json({data: result})

  } catch(error) {
    logger.error(error)
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function acitivityDataByClub(req: express.Request, res: express.Response, userId: number) {
  try {
    // const level = req.params.level;
    // const user_uuid = (req as GetUserRequest).user_uuid;
    // const userAccess: any = await getAccessLevel(user_uuid);
    let student = await  getStudentProfile(userId);
    student = student[0]

    const { activitySchoolYear, activitySemester, orderBy, pageSize, pageNumber, category_uuid, searchFilter} = req.query as any;

    const activity = new Activity(activitySchoolYear, activitySemester, orderBy, pageSize, pageNumber);

    // let result = null;

    // if (searchFilter.length > 0) {
    //   const search = '%' + searchFilter + '%';
    //   result = await activity.getSearchByClub(search, search, student.club_id)
    // } else
    // if (category_uuid.length > 0) {
    //   result = await activity.getByCbCt(student.club_uuid, category_uuid);
    // } else {
     // result = await activity.getByClub(student.club_uuid);
    // }

    const result = await activity.getByClub(student.club_uuid);
    return res.status(200).json({data: result})

  } catch(error) {
    logger.error(error)
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function addActivity(req: express.Request, res: express.Response) {
  try {
    const now = DateTime.now();
    const formatedDate = now.toFormat('MMMM d, yyyy, h:mm a');

    const {
      activityName,
      activityNotes,
      category_uuids,
      club_uuids,
      activityStartDateIso,
      activityEndDateIso,
      activitySemester,
      activitySchoolYear,
      activityVenue,
      activityPersonels,
      activityNumberParticipants,
      activityModality,
      activityStatus,
      activityComments
    } = req.body;

    const activityDisplayDate = validateDates(activityStartDateIso, activityEndDateIso, activitySchoolYear);
    // console.log(activityDisplayDate)
    if(!activityDisplayDate) {
      return res.status(400).json({error: "Failed to submit, invalid start date and end date"})
    }

    // const category: any = await getEachCat(category_uuid);
    setTimeout(async()=>{

      for (let club_uuid of club_uuids) {
        const club: any = await getEachClub(club_uuid);
        const sameRecordUuid = uuid.v4();
        for (let category_uuid of category_uuids) {
          const category: any = await getEachCategory(category_uuid);
          const params = [
            uuid.v4(),
            sameRecordUuid,
            activityName,
            activityNotes,
            category[0].categoryId,
            club[0].clubId,
            activityStartDateIso,
            activityEndDateIso,
            activityDisplayDate,
            activitySemester,
            activitySchoolYear,
            activityVenue,
            JSON.stringify(activityPersonels),
            activityNumberParticipants,
            activityModality,
            activityStatus,
            activityComments,
            formatedDate
          ]
        
          await create(postActivityQuery(), params);
        }
      }
  
      res.status(200);
      res.json({message: "success"})

    }, 500);

  } catch(error) {
    logger.error(error)
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


async function repostActivity(req: express.Request, res: express.Response) {
  try {
    const now = DateTime.now();
    const formatedDate = now.toFormat('MMMM d, yyyy, h:mm a');

    const {
      activity_same_record_uuid,
      activityName,
      activityNotes,
      category_uuids,
      club_uuid,
      activityStartDateIso,
      activityEndDateIso,
      activitySemester,
      activitySchoolYear,
      activityVenue,
      activityPersonels,
      activityNumberParticipants,
      activityModality,
      activityStatus,
      activityComments
    } = req.body;

    const activityDisplayDate = validateDates(activityStartDateIso, activityEndDateIso, activitySchoolYear);
 
    if(!activityDisplayDate) {
      return res.status(400).json({error: "Failed to submit, invalid start date and end date"})
    }

    const sameRecordUuid = activity_same_record_uuid;
    
    await destroy(`DELETE FROM Activity WHERE activity_same_record_uuid = ?`, [sameRecordUuid])

    setTimeout(async()=>{

      const club: any = await getEachClub(club_uuid);

      for (let category_uuid of category_uuids) {
        const category: any = await getEachCategory(category_uuid);
        const params = [
          uuid.v4(),
          sameRecordUuid,
          activityName,
          activityNotes,
          category[0].categoryId,
          club[0].clubId,
          activityStartDateIso,
          activityEndDateIso,
          activityDisplayDate,
          activitySemester,
          activitySchoolYear,
          activityVenue,
          JSON.stringify(activityPersonels),
          activityNumberParticipants,
          activityModality,
          activityStatus,
          activityComments,
          formatedDate
        ]
        
  
        await create(postActivityQuery(), params);
      }
      
  
      res.status(200);
      res.json({message: "success"})

    }, 500)
  } catch(error) {
    logger.error(error)
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// async function updateActivity(req: express.Request, res: express.Response) {
//   try {

//     const now = DateTime.now();
//     const formatedDate = now.toFormat('MMMM d, yyyy, h:mm a')

//     const {
//       activity_same_record_uuid,
//       activityName,
//       activityNotes,
//       category_uuids,
//       activityStartDateIso,
//       activityEndDateIso,
//       activitySemester,
//       activitySchoolYear,
//       activityVenue,
//       activityPersonels,
//       activityNumberParticipants,
//       activityModality,
//       activityStatus,
//       activityComments,
//       preVSelectedCategory
//     } = req.body;

//     const validDate = validateDates(activityStartDateIso, activityEndDateIso, activitySchoolYear);
   
//     if(!validDate) {
//       return res.status(400).json({error: "Failed to submit, invalid start date and end date"})
//     }

//     //const category: any = await getEachCat(category_uuid);
//     for (let category_uuid of category_uuids) {
//       const category: any = await getEachCategory(category_uuid);

//       const params = [
//         activityName,
//         activityNotes,
//         category[0].categoryId,
//         activityStartDateIso,
//         activityEndDateIso,
//         validDate,
//         activitySemester,
//         activitySchoolYear,
//         activityVenue,
//         JSON.stringify(activityPersonels),
//         activityNumberParticipants,
//         activityModality,
//         activityStatus,
//         activityComments.trim(),
//         formatedDate,
//         activity_same_record_uuid,
//       ]

//       // await update(updateActivityQuery(), params);
//   }
//     res.status(200);
//     res.json({message: "success"})
//   } catch(error) {
//     logger.error(error)
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// }

// async function approveActivity(req: express.Request, res: express.Response) {
//   try {
//     // const { activityStatus, activityComments, activity_uuid } = req.body;
//     // let status = 0;

//     // const user_uuid = (req as GetUserRequest).user_uuid;
//     // const userAccess: any = await getAccessLevel(user_uuid);
//     // const approve =  approveAccess(userAccess.level, "WEBMASTER|ADMIN|STAFF");

//     // if (!approve) {
//     //   return res.status(403).json({error: "Forbidden"})
//     // }

//     // if (activityStatus == true) {
//     //   status = 1;
//     // } else {
//     //   status = 0;
//     // }
//     // const params = [
//     //   status,
//     //   activityComments,
//     //   activity_uuid
//     // ]

//     // await update(approveDeniedQuery(), params);

//     res.status(200);
//     res.json({message: "success"});
//   } catch(error) {
//     logger.error(error)
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// }


async function removeActivity(req: express.Request, res: express.Response) {
  try {
    const deleteActivity = `DELETE FROM Activity WHERE activity_same_record_uuid = ?`;
    const deleteDocumets = `DELETE FROM Documents WHERE document_activity_same_uuid = ?`;

    const { activity_same_record_uuid } = req.params;
    const documentDetails: any = await getDocuments(activity_same_record_uuid);
  
    const document = documentDetails[0];
    
    if (document) {
      if (document.documentLocation) {
        if (fs.existsSync(document.documentLocation)) {
          fs.rmSync(document.documentLocation, {recursive: true})
        }
      }
    }

    await destroy(deleteActivity, [activity_same_record_uuid]);
    await destroy(deleteDocumets, [activity_same_record_uuid]);

    res.status(200);
    res.json({message: "success"})
  } catch(error) {
    logger.error(error)
    return res.status(500).json({ error: "Internal Server Error" });
  }

}

async function getActivity(req: express.Request, res: express.Response) {
  const user_uuid = (req as GetUserRequest).user_uuid;
  const userAccess: any = await getAccessLevel(user_uuid);
  const level = req.params.level;

  const approve =  approveAccess(userAccess.level, "WEBMASTER|ADMIN|STAFF");

  if (approve) {
    await activityData(req, res)
  } else if (level == "STUDENT" && userAccess.level == level) {
    await acitivityDataByClub(req, res, userAccess.user.userId)
  } else {
    res.sendStatus(401)
  }
}


async function getActivityEach(req: express.Request, res: express.Response) {
    const { activity_same_record_uuid } = req.params;
   
    const query = queryEach()
    
    const result: any =  await show(query, [activity_same_record_uuid]);

    const statify = groupSameRecordUuid(result);
    
    res.status(200);
    res.json({data: statify})
}



router.get("/activity/:level", getActivity);

router.get("/activity-each/:activity_same_record_uuid", getActivityEach);

router.post("/activity", addActivity);

router.post("/activity-repost", repostActivity);

// router.put("/activity", updateActivity);
// router.patch("/activity/approve-deneid", approveActivity );

router.delete("/activity/:activity_same_record_uuid", removeActivity );

export {
  router
}