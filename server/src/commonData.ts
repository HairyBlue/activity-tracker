import { show, create, update, destroy } from "./db/dbcon";
import { initAllType, GetUserRequest } from "./types";
import { cleanQuery, uuid } from "./helpers/svcfunc";
import { getAccessLevel, getStudentProfile, approveAccess } from "./auth";
import * as express from "express";
import * as logging from "./logger";

const logger = logging.wichFileToLog("common-data");

async function initCategoryFunc() {
   return await show("SELECT * FROM Category WHERE categoryArchive = 0", []);
 }

 async function initClubFunc() {
   return await show("SELECT  * from Club WHERE clubArchive = 0", []);
 }

 async function initEachClubFunc(club_id: number) {
   return await show("SELECT  * from Club WHERE clubId = ? and clubArchive = 0", [club_id]);
 }

 async function initSchoolYearFunc() {
   return await show("SELECT * FROM SchoolYear", []);
 }

async function initAll(req: express.Request): Promise<initAllType> {
   const user_uuid = (req as GetUserRequest).user_uuid;
   const userAccess: any = await getAccessLevel(user_uuid);


   const approve =  approveAccess(userAccess.level, "WEBMASTER|ADMIN|STAFF");

   let initClub: any = [];
   
   if (approve) {
      initClub = await initClubFunc();
   } else if (approveAccess(userAccess.level, "STUDENT")) {
      let student = await getStudentProfile(userAccess.user.userId);
      student = student[0]
      initClub = await initEachClubFunc(student.club_id);
   }

   const initCategory = await initCategoryFunc();
   const initYear: any = await initSchoolYearFunc()
   
   return {
      initClub,
      initCategory,
      initYear
   }
}


async function getEachClub(club_uuid: string) {
   return await show("SELECT * from Club Where club_uuid = ? AND clubArchive = 0", [club_uuid]);
}

async function getEachCat(category_uuid: string) {
   return await show("SELECT * from Category Where category_uuid = ? AND categoryArchive = 0", [category_uuid]);
}

async function activityAndDoc(activity_uuid: string) {
   const query = `
   Select * From Activity
   LEFT JOIN Club ON club_id = clubId
   LEFT JOIN Documents ON activityId = document_activity_id
   WHERE activity_uuid = ? AND activityArchive = 0`

   const cleanedQuery = cleanQuery(query)

   return await show(cleanedQuery, [activity_uuid])
}

async function getActivityAndClub(activity_uuid: string) {
   const query = `Select * From Activity LEFT JOIN Club ON club_id = clubId WHERE activity_uuid = ? AND activityArchive = 0`
   return await show(query, [activity_uuid])
}


async function getActivityCount() {
   const query = `Select COUNT(*) as count From Activity Where activityArchive = 0`
   return await show(query, [])
}

async function getActivityCountByClub(userId: number) {
   let student = await  getStudentProfile(userId);
   student = student[0];

   const query = `Select COUNT(*) as count From Activity LEFT JOIN Club ON club_id = clubId Where activityArchive = 0 and clubId = ?`
   return await show(query, [student.club_id])
}

const router = express.Router();

router.get("/init", async function(req: express.Request, res: express.Response ) {
   try {
      const initData =  await initAll(req);
      res.status(200);
      res.json({init: initData})
   } catch (error) {
      logger.error(error)
      res.status(500).json({ error: "Internal Server Error" });
   }
})




router.get("/activity-count", async function(req: express.Request, res: express.Response ) {
   try {
      const user_uuid = (req as GetUserRequest).user_uuid;
      const userAccess: any = await getAccessLevel(user_uuid);
      const level = req.params.level;
    
      const approve =  approveAccess(userAccess.level, "WEBMASTER|ADMIN|STAFF");

      let count: any = null;

      if (approve) {
         count =  await getActivityCount();
      } else if (level == "STUDENT" && userAccess.level == level) {
         count = await getActivityCountByClub(userAccess.user.userId)
      }
   
      res.status(200);
      res.json({count: count})
   } catch (error) {
      logger.error(error)
      res.status(500).json({ error: "Internal Server Error" });
   }
})

export {
   router,
   initAll,
   getEachCat,
   getEachClub,
   activityAndDoc,
   getActivityAndClub
}