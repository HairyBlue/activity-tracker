import * as express from "express";
import { show, create, destroy, update } from "../db/dbcon";
import {
  validateEmail,
  bcryptHashPassword,
} from "../helpers/formatAndValidation";
import * as logging from "../logger";
import "dotenv/config";

const logger = logging.wichFileToLog("client");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

interface GetUserRequest extends express.Request {
  user?: string;
}

type LevelId = {
  admin: 2;
  staff: 3;
};

const isLevelId: LevelId = {
  admin: 2,
  staff: 3,
};

type Level = {
  webmaster: "WEBMASTER";
  admin: "ADMIN";
  staff: "STAFF";
};

const isLevel: Level = {
  webmaster: "WEBMASTER",
  admin: "ADMIN",
  staff: "STAFF",
};

router.post("/user", async function (req, res) {
  const user = (req as GetUserRequest).user;
  const { username, email, password, role } = req.body;

  if (
    username.trim().length == 0 ||
    email.trim().length == 0 ||
    password.trim().length == 0
  ) {
    logger.warn(`${user} is failed to add user has a role ${role}`);
    res.status(400).json({ message: "Please complete the form" });
  } else if (!validateEmail(email)) {
    logger.warn(`${user} is failed to add email user has a role ${role}`);
    res.status(400).json({ message: "Invalid email address" });
  } else {
    const loginUser: any = await show(
      "SELECT * FROM Users WHERE username = ? OR email = ?",
      [user, user]
    );
    if (loginUser.length > 0) {
      const level: any = await show(
        "SELECT * from Roles inner join Levels on level_id = levelId inner join Users on user_id = userId WHERE user_id = ?",
        [loginUser[0].userId]
      );

      if (
        role == "STAFF" &&
        (level[0].level == isLevel.admin || level[0].level == isLevel.webmaster)
      ) {
        const isExist: any = await show(
          "SELECT * FROM Users WHERE username = ? OR email = ?",
          [username, email]
        );

        if (isExist.length > 0) {
          logger.warn(`${user} add duplicate entry ${username}`);
          res.status(400).json({ message: "Duplicate entry" });
        } else {
          const result: any = await create(
            "INSERT INTO Users(username, email, password) values(?, ?, ?)",
            [username, email, bcryptHashPassword(password)]
          );

          const user_id = result.insertId;
          const level_id: number = isLevelId.staff;

          await create("INSERT INTO Roles(user_id , level_id) values (?, ?)", [
            user_id,
            level_id,
          ]);
          logger.info(`${user} add user ${username} that has a role ${role}`);
          res.status(200).json({ message: "success" });
        }
      } else if (role == "ADMIN" && level[0].level == isLevel.webmaster) {
        const isExist: any = await show(
          "SELECT * FROM Users WHERE username = ? OR email = ?",
          [username, email]
        );

        if (isExist.length > 0) {
          logger.warn(`${user} add duplicate entry ${username}`);
          res.status(400).json({ message: "Duplicate entry" });
        } else {
          const result: any = await create(
            "INSERT INTO Users(username, email, password) values(?, ?, ?)",
            [username, email, bcryptHashPassword(password)]
          );

          const user_id = result.insertId;
          const level_id: number = isLevelId.admin;

          logger.info(`${user} add user ${username} that has a role ${role}`);
          await create("INSERT INTO Roles(user_id , level_id) values (?, ?)", [
            user_id,
            level_id,
          ]);
          res.status(200).json({ message: "success" });
        }
      } else if (level[0].level == isLevel.staff || true) {
        logger.warn(`${user} is failed to add user that has a role ${role}`);
        res.status(403).json({ message: "Forbidden request" });
      }
    }
  }
});

router.patch("/user", async function (req, res) {
  const user = (req as GetUserRequest).user;
  const { username, email } = req.body;

  const checkUsername: string = username;
  const checkEmail: string = email;

  const result: any = await show(
    "SELECT * FROM Users WHERE username = ? OR email = ?",
    [user, user]
  );

  if (checkUsername.trim() === "" || checkEmail.trim() === "") {
    logger.warn(`${user} is failed to update account`);
    res.status(400).json({ message: "Please complete the form" });
  } else if (!validateEmail(email)) {
    res.status(400).json({ message: "Invalid email address" });
  } else {
    if (result.length > 0) {
      await update(
        "UPDATE Users SET username = ?, email = ? WHERE userId = ?",
        [username, email, result[0].userId]
      );
      res.json({ message: "success" });
    } else {
      res.status(404).json({ message: "No Match Found" });
    }
  }
});

router.get("/user", async function (req, res) {
  const user = (req as GetUserRequest).user;
  const loginUser: any = await show(
    "SELECT * FROM Users WHERE username = ? OR email = ?",
    [user, user]
  );

  if (loginUser.length > 0) {
    const level: any = await show(
      "SELECT * from Roles inner join Levels on level_id = levelId inner join Users on user_id = userId WHERE user_id = ?",
      [loginUser[0].userId]
    );

    if (level[0].level == isLevel.webmaster) {
      const data: any = {};
      data["users"] = await show(
        "SELECT * from Roles inner join Levels on level_id = levelId inner join Users on user_id = userId WHERE level != 'WEBMASTER'",
        []
      );
      data["myaccount"] = loginUser[0];

      res.status(200).json(data);
    }

    if (level[0].level == isLevel.admin) {
      const data: any = {};
      data["users"] = await show(
        "SELECT * from Roles inner join Levels on level_id = levelId inner join Users on user_id = userId WHERE level = 'STAFF'",
        []
      );
      data["myaccount"] = loginUser[0];

      res.status(200).json(data);
    }

    if (level[0].level == isLevel.staff) {
      const data: any = {};
      data["users"] = [];
      data["myaccount"] = loginUser[0];

      res.status(200).json(data);
    }
  }
});

router.delete("/user/:id", async function (req, res) {
  const user = (req as GetUserRequest).user;
  const loginUser: any = await show(
    "SELECT * FROM Users WHERE username = ? OR email = ?",
    [user, user]
  );
  const user_id = req.params.id;
  if (loginUser.length > 0) {
    const level: any = await show(
      "SELECT * from Roles inner join Levels on level_id = levelId inner join Users on user_id = userId WHERE user_id = ?",
      [loginUser[0].userId]
    );

    if (level[0].level == isLevel.webmaster) {
      await destroy("DELETE FROM Users WHERE userId = ?", [user_id]);
      res.status(200).json({ message: "success" });
    } else if (level[0].level == isLevel.admin) {
      await destroy("DELETE FROM Users WHERE userId = ?", [user_id]);
      res.status(200).json({ message: "success" });
    } else if (level[0].level == isLevel.staff || true) {
      logger.warn(`${user} is trying to delete user`);
      res.status(403).json({ message: "Forbidden request" });
    }
  }
});

export { router };
