import * as express from "express";
import { show, create, destroy, update } from "../db/dbcon";
import {
  validateEmail,
  bcryptHashPassword,
} from "../helpers/formatAndValidation";
import { GetUserRequest } from "../types";
import { getAccessLevel, getStudentProfile, approveAccess } from "../auth";
import * as logging from "../logger";
import "dotenv/config";
import { uuid } from "../helpers/svcfunc";


const logger = logging.wichFileToLog("manage-user");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

const levelType: any = {
   ADMIN: 2,
   STAFF: 3,
   STUDENT: 4,
 };

 async function hasAccessManipulatingUser(req: express.Request, res: express.Response, next: express.NextFunction) {
   const { role } = req.params;

   const user_uuid = (req as GetUserRequest).user_uuid;
   const userAccess: any = await getAccessLevel(user_uuid);

   if (approveAccess(userAccess.level, "WEBMASTER")) {
      if (["ADMIN", "STAFF", "STUDENT"].indexOf(role) != -1) {
         next();
      }
   } else if (approveAccess(userAccess.level, "ADMIN")) {
      if (["STAFF", "STUDENT"].indexOf(role) != -1) {
         next();
      }
   } else if (approveAccess(userAccess.level, "STAFF")) {
      if (["STUDENT"].indexOf(role) != -1) {
         next();
      }
   } else if (role == "undefined") {
      res.status(400).json({error: "Please select a role"});
   } else {
      res.status(403).json({error: "Forbidden"});
   }
   
 }

 async function forHasAccess(req: express.Request, res: express.Response, next: express.NextFunction) {
   const user_uuid = (req as GetUserRequest).user_uuid;
   const userAccess: any = await getAccessLevel(user_uuid);

   if (!approveAccess(userAccess.level, "WEBMASTER|ADMIN|STAFF")) {
      return res.status(403).json({error: "Forbidden"});
   }

   next();
}

function retRoles(accessLevel: string) {
   let out: string[] = []; 
   if (approveAccess(accessLevel, "WEBMASTER")) {
      out = ["ADMIN", "STAFF", "STUDENT"]
   } else if (approveAccess(accessLevel, "WEBMASTER|ADMIN")) {
      out = ["STAFF", "STUDENT"]
   } else if (approveAccess(accessLevel, "STAFF") ) {
      out = ["STUDENT"]
   } 

   return out;
}

async function roles(req: express.Request, res: express.Response) {
   const user_uuid = (req as GetUserRequest).user_uuid;
   const userAccess: any = await getAccessLevel(user_uuid);
   
   res.status(200);
   res.json({data: retRoles(userAccess.level)})
}


async function insertRoles(userId: number, levelId: number) {
   await create("INSERT INTO Roles(user_id , level_id) values (?, ?)", [
      userId,
      levelId,
    ]);
}

function cleanedUserInfo(username: string, email: string, password: string): 
{
   tUsername: string,
   tEmail: string,
   tPassword: string
} | false {

   if ( username == undefined ||
      email == undefined ||
      password == undefined
   ) {
      return false;
   }

   const tUsername = username.trim();
   const tEmail = email.trim();
   const tPassword = password.trim();

   if (
      tUsername == "" &&
      tEmail == "" &&
      tPassword
   ) {
      return false;
   }

   return {
      tUsername,
      tEmail,
      tPassword
   }
}

//============================= SECTION =============================================================

async function createStudents(userId: number, reqBody: any) {
   const {club_id, schoolYear  } = reqBody;

   await create(
      "INSERT INTO Student (student_user_id, club_id, schoolYear, student_uuid) values (?, ?, ?, ?)", 
   [
      userId,
      club_id,
      schoolYear,
      uuid.v4()
   ]
   );
}

async function updateStudent(userId: number, reqBody: any) {
   const {club_id, schoolYear  } = reqBody;

   await update(
     "UPDATE Student SET club_id = ?, schoolYear = ? WHERE student_user_id = ?",
      [
         club_id, 
         schoolYear, 
         userId
      ]
   );
 
}

async function userList(req: express.Request, res: express.Response) {
   const user_uuid = (req as GetUserRequest).user_uuid;
   const userAccess: any = await getAccessLevel(user_uuid);

   let member = null;
   if(approveAccess(userAccess.level, "WEBMASTER")) {
      member = await show("SELECT userId, user_uuid, username, email, level, login FROM Users LEFT JOIN Roles ON userId = user_id LEFT JOIN Levels ON level_id = levelId WHERE levelId != 1 and levelId != 4", []);
   } else if (approveAccess(userAccess.level, "ADMIN")) {
      member = await show("SELECT userId, user_uuid, username, email, level, login FROM Users LEFT JOIN Roles ON userId = user_id LEFT JOIN Levels ON level_id = levelId WHERE levelId = 3", [])
   } 
   
   const student = await show("SELECT userId, user_uuid, student_uuid, username, email, club_id, schoolYear, level, login FROM Users LEFT JOIN Student ON userId = student_user_id LEFT JOIN Roles ON userId = user_id LEFT JOIN Levels ON level_id = levelId WHERE levelId = 4", []);

   res.status(200);
   res.json(
      { 
      data: {
         member: member,
         student: student
      }
   }
   );
}


async function addUser(req: express.Request, res: express.Response) {
   const {
      username,
      email,
      password,
      role
   } = req.body;

   const cleaned = cleanedUserInfo(username, email, password);

   if (!cleaned) {
      logger.warn(`Failed to add student`);
      res.status(400).json({ error: "Please complete the form" });
      return
   }

   const {tUsername, tEmail, tPassword} = cleaned;

   if (!validateEmail(tEmail)) {
      logger.warn(`Failed to add email to student`);
      res.status(400).json({ error: "Please used valid email" });
      return
   }

   const isEmail: any = await show("Select * from Users where email = ?", [tEmail]);
   const isUsername: any = await show("Select * from Users where username = ?", [tUsername]);

   if (isEmail && isEmail.length > 0) {
      logger.warn(`Failed to add email, (${tEmail}) already exit`);
      res.status(400).json({ error: `Failed to add email. This "${tEmail}" already exit.`});
      return
   } else if (isUsername && isUsername.length > 0) {
      logger.warn(`Failed to add username, (${tUsername}) already exit`);
      res.status(400).json({ error: `Failed to add username. This "${tUsername}" already exit.` });
      return
   }

   const result: any = await create(
      "INSERT INTO Users(user_uuid, username, email, password) values(?, ?, ?, ?)",
      [
         uuid.v4(),
         tUsername, 
         tEmail, 
         bcryptHashPassword(tPassword)
      ]
    );

    const userId = result.insertId;
    const level = levelType[role];

    await insertRoles(userId, level);

    if (role == "STUDENT") {
      await createStudents(userId, req.body);
    }

    res.status(200);
    res.json({message: "success"});
}


async function updateUser(req: express.Request, res: express.Response){
   const { userId, role } = req.params;
   const { username, email } = req.body;

   const tUsername = username.trim();
   const tEmail = email.trim();

   if ( tUsername == "" && tEmail == "" ) {
      logger.warn(`Failed to add student`);
      res.status(400).json({ error: "Please complete the form" });
      return
   }

   if (!validateEmail(tEmail)) {
      logger.warn(`Failed to add email to student`);
      res.status(400).json({ error: "Please used valid email" });
      return
   }

   await update(
      "UPDATE Users SET username = ?, email = ? WHERE userId = ?",
      [tUsername, tEmail, userId]
    );

    if (role == "STUDENT") {
      await updateStudent(parseInt(userId), req.body);
    }

    res.status(200);
    res.json({message: "success"});
}

async function removeUser(req: express.Request, res: express.Response) {
   const { userId, role } = req.params;

   await destroy("DELETE FROM Users WHERE userId = ?", [userId]);

   res.status(200);
   res.json({message: "success"});
}

async function updatePassword(req: express.Request, res: express.Response) {
   const { userId, password } = req.params;

   const tPassword = password.trim();

   if (tPassword == "") {
      logger.warn(`Failed to update student password`);
      res.status(400).json({ error: "Please complete the form" });
   }

   await update("Update Users Set password = ? Where userId = ?",
   [
      bcryptHashPassword(tPassword),
      userId
   ]
   );

   res.status(200);
   res.json({message: "success"});
}


router.get("/user-roles", roles);

router.get("/user-list", userList);

router.post("/user/:role", hasAccessManipulatingUser, addUser);

router.put("/user/:userId/:role", hasAccessManipulatingUser, updateUser);

router.delete("/user/:userId/:role", hasAccessManipulatingUser, removeUser);

router.patch("/user-password/:userId/:password", updatePassword);

export {
   router
}

