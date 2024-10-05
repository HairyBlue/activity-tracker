import * as cron from "node-cron";
import { DateTime } from "luxon";
import * as os from "os"
import * as fs from "fs"
import * as path from "path"
import "dotenv/config";
import { spawn } from "child_process";

import * as logging from "../logger";

const logger = logging.wichFileToLog('cronjob')

function dumpSql() {
    let backUpDir: any;
    if (os.platform() == 'win32') {
        backUpDir =  path.join(os.homedir(), "activity_tracker_backup")
    } else {
        backUpDir = '/var'
    }

    if (!fs.existsSync(backUpDir)) {
        fs.mkdirSync(backUpDir)
    }

    // '*/2 * * * *' for debug runs every two min
    
    // schedule every 15th of the month
    cron.schedule('* 10 15 * *', function () {
        const backupFile: any = fs.createWriteStream(path.join(backUpDir, `${process.env.DB_NAME}_${DateTime.now().toFormat('yyyy-MM-dd-hh-mm')}.sql`))
        const mysqldump = spawn('mysqldump', ['-u', process.env.DB_USER as string, `-p${process.env.DB_PASSWORD}`, process.env.DB_NAME as string])
        
        mysqldump
            .stdout
            .pipe(backupFile)
            .on('finish', function () {
                logger.info("Backup success")
            })
            .on('error', function (err: any) {
                logger.warn("Backup failed" + err)
            })

        // mysqldump.stderr.on('data', function (data: any) {
        //     logger.warn('mysqldump error', data)
        // })

        // mysqldump.on('exit', function (code: any) {
        //     if (code == 0) {
        //         logger.info("Backup success")
        //     } else {
        //         logger.warn("Backup failed")
        //     }
        // })
    })

    // schedule every 30th of the month
    cron.schedule('* 10 30 * *', function () {
        const backupFile: any = fs.createWriteStream(path.join(backUpDir, `${process.env.DB_NAME}_${DateTime.now().toFormat('yyyy-MM-dd-hh-mm')}.sql`))
        const mysqldump = spawn('mysqldump', ['-u', process.env.DB_USER as string, `-p${process.env.DB_PASSWORD}`, process.env.DB_NAME as string])
        
        mysqldump
            .stdout
            .pipe(backupFile)
            .on('finish', function () {
                logger.info("Backup success")
            })
            .on('error', function (err: any) {
                logger.warn("Backup failed" + err)
            })
    })

}

export {
    dumpSql
}