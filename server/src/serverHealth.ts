import * as logging from "./logger";
import * as express from "express";

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

function bytesToMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function getMem(): string {
  const memoryUsage = process.memoryUsage();
  return (
    `RSS => ${bytesToMb(memoryUsage.rss)}\n` +
    `HEAP TOTAL => ${bytesToMb(memoryUsage.heapTotal)}\n` +
    `HEAP USED => ${bytesToMb(memoryUsage.heapUsed)}`
  );
}


 function serverStatus(req: express.Request, res: express.Response) {
   res.status(200);
   res.json({
      memory: getMem().split("\n"),
      logs: logging.readLatestLog()
   })
 }


 router.get("/server-health", serverStatus)

 export {
   router,
   getMem
 }