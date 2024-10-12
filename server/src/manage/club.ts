import * as express from "express";
import * as logging from "../logger";
import { GetUserRequest } from "../types";
import { getAccessLevel, getStudentProfile, approveAccess } from "../auth";
import { show, create, update, destroy } from "../db/dbcon";
import { uuid } from "../helpers/svcfunc";

const logger = logging.wichFileToLog("manage-club");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));


function register() {
  // ***************************************************************************************************************************************************
  router.get("/club", async function (req, res) {
    const data = await show("SELECT * from Club Where clubArchive = 0", []);
    
    res.status(200);
    res.json({ result: data });
  });

 // ***************************************************************************************************************************************************
  router.post("/club", async function (req, res) {
    const user_uuid = (req as GetUserRequest).user_uuid;
    const userAccess: any = await getAccessLevel(user_uuid);
    const user = userAccess.user;
   
    const approve =  approveAccess(userAccess.level, "WEBMASTER|ADMIN");

    if (!approve) {
      return res.status(403).json({error: "Forbidden"})
    }

    const { clubName, clubAcronym } = req.body;
    const cleanClubName = clubName.trim();
    const cleanClubAcronym = clubAcronym.trim();

    if (cleanClubName === "") {
      logger.warn(`${user.username} is failed to post data in club`);
      res.status(400).json({ error: "Unable to add data. Please complete the form" });
      return; 
    }

    console.log(cleanClubName, cleanClubAcronym)
    await create("INSERT INTO Club (club_uuid, clubName, clubAcronym) values (?, ?, ?)", [uuid.v4() ,cleanClubName, cleanClubAcronym]);
    logger.info(`${user.username} is posting data in club`);

    res.status(200);
    res.json({ message: "success" });
  });

 // ***************************************************************************************************************************************************
  router.put("/club", async function (req, res) {
    const user_uuid = (req as GetUserRequest).user_uuid;
    const userAccess: any = await getAccessLevel(user_uuid);
    const user = userAccess.user;
   
    const approve =  approveAccess(userAccess.level, "WEBMASTER|ADMIN");

    if (!approve) {
      return res.status(403).json({error: "Forbidden"})
    }

    const { clubId, clubName, clubAcronym } = req.body;

    const cleanClubName = clubName.trim();
    const cleanClubAcronym = clubAcronym.trim();

    if (clubId === null || cleanClubName === "" ) {
      logger.warn(`${user.username} is failed to update data in club`);
      res.status(400).json({ error: "Unable to update. Please complete the form" });
      return;
    }

    await update("UPDATE Club SET clubName = ?, clubAcronym = ? WHERE clubId = ?", [cleanClubName, cleanClubAcronym, clubId]);

    logger.info(`${user.username} is updating data in club`);

    res.status(200);
    res.json({ message: "success" });
  });

 // ***************************************************************************************************************************************************
  router.patch("/club/:id", async function (req: express.Request, res: express.Response) {
    const user_uuid = (req as GetUserRequest).user_uuid;
    const userAccess: any = await getAccessLevel(user_uuid);
    const user = userAccess.user;
    const approve =  approveAccess(userAccess.level, "WEBMASTER|ADMIN");

    if (!approve) {
      return res.status(403).json({error: "Forbidden"})
    }

    const clubId = Number(req.params.id);
    console.log(clubId)
    await update("UPDATE Activity SET activityArchive = 1 WHERE club_id = ?", [clubId]);
    await update("UPDATE Club SET clubArchive = 1 WHERE clubId = ?", [clubId]);

    logger.info(`club was delete by ${user.username}`);
    
    res.status(200);
    res.json({ message: "success" });
  });
  


  return router;
}
export { register };
