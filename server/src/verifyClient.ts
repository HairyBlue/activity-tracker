// import * as jwt from "jsonwebtoken";
import * as express from "express";
import * as logging from "./logger";
import { jwtVerifyUser } from "./helpers/formatAndValidation"
const logger = logging.wichFileToLog("verifyClient");
import { GetUserRequest } from "./types";

const verifyClient = (req: express.Request,  res: express.Response, next: express.NextFunction) => {
  const authHeader = req.header("authorization");
  if (!authHeader) {
    logger.warn("User attemp to access without token");
    res.sendStatus(401);
    return;
  } else {
    const token = authHeader.split(" ")[1];
    jwtVerifyUser(token).then((decode: any) => {
      (req as GetUserRequest).user_uuid = decode.user_uuid;
      next();
    }).catch(error => {
      logger.warn( `User attemp to access with invalid token or credentials | ${error.name} => ${error.message}` );
      res.sendStatus(403);
      return;
    })

    // jwt.verify(token, secret, function (err: any, decode: any) {
    //     if (err) {
    //       logger.warn( "User attemp to access with invalid token or credentials" );
    //       res.sendStatus(403);
    //       return;
    //     } else {
    //       (req as GetUserRequest).user = decode.emailOrUsername;
    //       next();
    //     }
    //   }
    // );

  }
};

export { verifyClient };
