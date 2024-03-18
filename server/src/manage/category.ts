import * as express from "express";
import * as logging from "../logger";
import { show, create, update, destroy } from "../db/dbcon";
interface GetUserRequest extends express.Request {
  user?: string;
}

const logger = logging.wichFileToLog("category");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

function register() {
  router.get("/category", async function (req, res) {
    const { year } = req.query;
    const data = await show("SELECT categoryId, categoryName FROM Category", []);
    res.json({ key: "category", result: data });
  });

  router.post("/category", async function (req, res) {
    const user = (req as GetUserRequest).user;
    const { categoryName } = req.body;

    if (categoryName === "") {
      logger.warn(`${user} is failed to post data in category`);
      res.status(400).json({ message: "Please complete the form" });
      return;
    }

    await create("INSERT INTO Category (categoryName) values (?)", [categoryName]);

    logger.info(`${user} is posting data in category`);
    res.json({ message: "success" });
  });

  router.put("/category", async function (req, res) {
    const user = (req as GetUserRequest).user;
    const { categoryId, categoryName } = req.body;

    if (categoryId === null || categoryName === "") {
      logger.warn(`${user} is failed to update data in category`);
      res.status(400).json({ message: "Please complete the form" });
      return;
    }

    await update("UPDATE Category SET categoryName = ? WHERE categoryId = ?", [categoryName, categoryId]);

    logger.info(`${user} is updating data in category`);
    res.json({ message: "success" });
  });

  router.delete("/category/:id", async function (req, res) {
    const user = (req as GetUserRequest).user;

    const categoryId = Number(req.params.id);
  
    await destroy("DELETE FROM Category WHERE categoryId = ?", [categoryId]);

    logger.info(`category was delete by ${user}`);
    res.json({ message: "success" });
  });

  return router;
}

export { register };
