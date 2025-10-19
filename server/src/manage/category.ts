import * as express from "express";
import * as logging from "../logger";
import { GetUserRequest } from "../types";
import { getAccessLevel, getStudentProfile, approveAccess } from "../auth";
import { show, create, update, destroy } from "../db/dbcon";
import { uuid } from "../helpers/svcfunc";

const logger = logging.wichFileToLog("manage-category");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));


function register() {
// ***************************************************************************************************************************************************
  router.get("/category", async function (req, res) {
    const data = await show("SELECT * FROM Category Where categoryArchive = 0", [])
    
    res.status(200);
    res.json({ result: data });
  });

  router.get("/category-archive", async function (req, res) {
    const data = await show("SELECT * FROM Category Where categoryArchive = 1", [])
    
    res.status(200);
    res.json({ result: data });
  });

// ***************************************************************************************************************************************************
  router.post("/category", async function (req, res) {
    const user_uuid = (req as GetUserRequest).user_uuid;
    const userAccess: any = await getAccessLevel(user_uuid);
    const user = userAccess.user;
   
    const approve = approveAccess(userAccess.level, "WEBMASTER|ADMIN");

    if (!approve) {
      return res.status(403).json({error: "Forbidden"})
    }

    const { categoryName } = req.body;
    const cleanCategoryName = categoryName.trim();

    if (cleanCategoryName === "") {
      logger.warn(`${user.username} is failed to post data in category`);
      res.status(400).json({ error: "Unable to add data. Please complete the form" });
      return;
    }

    await create("INSERT INTO Category (category_uuid, categoryName) values (?, ?)", [uuid.v4(), cleanCategoryName]);

    logger.info(`${user} is posting data in category`);
    res.status(200);
    res.json({ message: "success" });
  });


// ***************************************************************************************************************************************************
  router.put("/category", async function (req, res) {
    const user_uuid = (req as GetUserRequest).user_uuid;
    const userAccess: any = await getAccessLevel(user_uuid);
    const user = userAccess.user;
   
    const approve =  approveAccess(userAccess.level, "WEBMASTER|ADMIN");

    if (!approve) {
      return res.status(403).json({error: "Forbidden"})
    }

    const { categoryId, categoryName } = req.body;
    const cleanCategoryName = categoryName.trim();

    if (categoryId === null || cleanCategoryName === "") {
      logger.warn(`${user.username} is failed to update data in category`);
      res.status(400).json({ error: "Unable to update. Please complete the form" });
      return;
    }

    await update("UPDATE Category SET categoryName = ? WHERE categoryId = ?", [categoryName, categoryId]);

    logger.info(`${user} is updating data in category`);
    res.status(200);
    res.json({ message: "success" });
  });

  //***************************************************************************************************************************************************
  router.patch("/category/:id", async function (req: express.Request, res: express.Response) {
    const user_uuid = (req as GetUserRequest).user_uuid;
    const userAccess: any = await getAccessLevel(user_uuid);
    const user = userAccess.user;
    const approve =  approveAccess(userAccess.level, "WEBMASTER|ADMIN");

    if (!approve) {
      return res.status(403).json({error: "Forbidden"})
    }

    const categoryId = Number(req.params.id);

    await update("UPDATE Activity SET activityArchive = 1 WHERE category_id = ?", [categoryId]);
    await update("UPDATE Category SET categoryArchive = 1 WHERE categoryId = ?", [categoryId]);
  
    logger.info(`category was archive by ${user.username}`);
    res.status(200);
    res.json({ message: "success" });
  });

  router.patch("/category-restore/:id", async function (req: express.Request, res: express.Response) {
    const user_uuid = (req as GetUserRequest).user_uuid;
    const userAccess: any = await getAccessLevel(user_uuid);
    const user = userAccess.user;
    const approve =  approveAccess(userAccess.level, "WEBMASTER|ADMIN");

    if (!approve) {
      return res.status(403).json({error: "Forbidden"})
    }

    const categoryId = Number(req.params.id);

    // await update("UPDATE Activity SET activityArchive = 0 WHERE category_id = ?", [categoryId]);
    await update("UPDATE Category SET categoryArchive = 0 WHERE categoryId = ?", [categoryId]);
  
    logger.info(`category was restore by ${user.username}`);
    res.status(200);
    res.json({ message: "success" });
  });

  return router;
}

export { register };
