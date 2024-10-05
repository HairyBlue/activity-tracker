import * as express from "express";
import * as logging from "../logger";
import { GetUserRequest } from "../types";
import { getAccessLevel, getStudentProfile, approveAccess } from "../auth";
import { show, create, update, destroy } from "../db/dbcon";
import { uuid } from "../helpers/svcfunc";


const logger = logging.wichFileToLog("manage-school-year");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

 function register() {

   router.get("/scool-year", async function (req, res) {
      const data: any = await show("SELECT * FROM SchoolYear", []);

      data.sort((a: any, b: any) => {
        return parseInt(a.yearStart) - parseInt(b.yearStart);
      });

      res.status(200);
      res.json({ key: "scool-year", result: data });
    });

    router.post("/scool-year", async function (req, res) {
      const user_uuid = (req as GetUserRequest).user_uuid;
      const userAccess: any = await getAccessLevel(user_uuid);
      const user = userAccess.user;
     
      const approve =  approveAccess(userAccess.level, "WEBMASTER|ADMIN");
  
      if (!approve) {
        return res.status(403).json({error: "Forbidden"})
      }

      try {
        const { yearStart, yearEnd } = req.body;
  
        const cleantYearStart = yearStart.trim();
        const cleanYearEnd = yearEnd.trim();
  
        const isYearStart: any = new Date(cleantYearStart);
        const isYearEnd: any = new Date(cleanYearEnd);
  
        if (isNaN(isYearStart) && isNaN(isYearEnd)) {
          logger.warn(`${user} is failed to post data in schoolyear`);
          res.status(400).json({ error: "Invalid given year" });
          return;
        } else if (cleantYearStart == cleanYearEnd) {
          logger.warn(`${user} is failed to post data in schoolyear`);
          res.status(400).json({ error: "Invalid. The same given year" });
          return;
        }
  

        await create("INSERT INTO SchoolYear (school_year_uuid, yearStart, yearEnd) values (?, ?, ?)", [uuid.v4(), cleantYearStart, cleanYearEnd]);
  
        logger.info(`${user} is posting data in schoolyear`);

        res.status(200);
        res.json({ message: "success" });

      } catch (error) {
        logger.warn(`${user} is failed to post data in schoolyear`);
        res.status(400).json({ message: "Dupplicate year" });
      }

    });
  
    router.put("/scool-year", async function (req, res) {
      const user_uuid = (req as GetUserRequest).user_uuid;
      const userAccess: any = await getAccessLevel(user_uuid);
      const user = userAccess.user;
     
      const approve =  approveAccess(userAccess.level, "WEBMASTER|ADMIN");
  
      if (!approve) {
        return res.status(403).json({error: "Forbidden"})
      }

      try {
        const { yearStart, yearEnd, school_year_uuid } = req.body;
  
        const cleantYearStart = yearStart.trim();
        const cleanYearEnd = yearEnd.trim();
  
        const isYearStart: any = new Date(cleantYearStart);
        const isYearEnd: any = new Date(cleanYearEnd);
  
        if (isNaN(isYearStart) && isNaN(isYearEnd)) {
          logger.warn(`${user} is failed to update data in schoolyear`);
          res.status(400).json({ error: "Invalid given year" });
          return;
        }
  
        await create("UPDATE SchoolYear SET yearStart = ?, yearEnd = ? where school_year_uuid = ?", [cleantYearStart, cleanYearEnd, school_year_uuid]);
  
        logger.info(`${user} is updating data in schoolYear`);
        
        res.status(200);
        res.json({ message: "success" });

      } catch (error) {
        logger.warn(`${user} is failed to update data in schoolyear`);
        res.status(400).json({ message: "Dupplicate year" });
      }
    });
  

    router.delete("/scool-year/:school_year_uuid", async function (req: express.Request, res: express.Response) {
      const user_uuid = (req as GetUserRequest).user_uuid;
      const userAccess: any = await getAccessLevel(user_uuid);
      const user = userAccess.user;
     
      const approve =  approveAccess(userAccess.level, "WEBMASTER|ADMIN");
  
      if (!approve) {
        return res.status(403).json({error: "Forbidden"})
      }
  
      const school_year_uuid = req.params.school_year_uuid;
   
      await destroy("DELETE FROM SchoolYear WHERE school_year_uuid = ?", [school_year_uuid]);
  
      logger.info(`schoolYear was delete by ${user}`);
      
      res.status(200);
      res.json({ message: "success" });
    });

    return router
}

export  { register }
