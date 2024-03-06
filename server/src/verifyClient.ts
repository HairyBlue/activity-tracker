import * as jwt from "jsonwebtoken";
import * as express from "express";
import * as settings from "./settings";
import * as logging from "./logger";
const logger = logging.wichFileToLog("verifyClient");

const defaults = settings.defaultSettings;
interface GetUserRequest extends express.Request {
  user?: string | jwt.JwtPayload;
}
const verifyClient = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.header("authorization");

  if (!authHeader) {
    logger.warn("User attemp to access without token");
    res.sendStatus(401);
    return;
  } else {
    const token = authHeader.split(" ")[1];
    jwt.verify(
      token,
      defaults.settings.secret,
      function (err: any, decode: any) {
        if (err) {
          logger.warn(
            "User attemp to access with invalid token or credentials"
          );
          res.sendStatus(403);
          return;
        } else {
          (req as GetUserRequest).user = decode.emailOrUsername;
          next();
        }
      }
    );
  }
};

export { verifyClient };
