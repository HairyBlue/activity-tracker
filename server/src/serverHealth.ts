import * as logging from "./logger";
import * as express from "express";
import checkDiskSpace  from 'check-disk-space';
import * as path from "path";
import * as fs from "fs";


const router = express.Router();
router.use(express.urlencoded({ extended: true }));

function folderExists(folderPath: string): boolean {
  return fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory();
}

function bytesToMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function bytesToGb(bytes: number): string {
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

function getMem(): string {
  const memoryUsage = process.memoryUsage();
  return (
    `RSS => ${bytesToMb(memoryUsage.rss)}\n` +
    `HEAP TOTAL => ${bytesToMb(memoryUsage.heapTotal)}\n` +
    `HEAP USED => ${bytesToMb(memoryUsage.heapUsed)}`
  );
}

async function diskSpace() {
  const dirs = process.cwd();

  if (!folderExists(dirs)) {
    return null;  // Return null if folder doesn't exist
  }

  const diskSpace = await checkDiskSpace(dirs); // Replace 'C:' with your target drive
  return diskSpace;
}


 async function serverStatus(req: express.Request, res: express.Response) {
  const currentDiskSpace = await diskSpace();

   res.status(200);
   res.json({
      memory: getMem().split("\n"),
      logs: logging.readLatestLog(),
      diskSpace: {
        path: currentDiskSpace ? currentDiskSpace.diskPath : null,
        free: currentDiskSpace ? bytesToGb(currentDiskSpace.free) : null,
        size: currentDiskSpace ? bytesToGb(currentDiskSpace.size) : null,
      },

   })
 }

 router.get("/server-health", serverStatus)

 export {
   router,
   getMem
 }