import * as express from "express";
import * as logging from "../logger";
import { show } from "../db/dbcon";
import * as XLSX from 'xlsx';

/* load 'fs' for readFile and writeFile support */
import * as fs from 'fs';
XLSX.set_fs(fs);

interface GetUserRequest extends express.Request {
  user?: string;
}

const logger = logging.wichFileToLog("excelExport");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));


async function categories() {
    const result: any = await show("SELECT categoryName FROM Category", []);
    return result.map((category: any) => category.categoryName.toUpperCase())
}

async function clubList() {
    const result: any = await show("SELECT * FROM Club", []);
    return result
}


async function appendData(category: string[], club: any, year: any, semester: any) {
    const result: any = await show(`SELECT activityDisplayDate, activityName, categoryName from Activity INNER JOIN Club ON club_id = clubId INNER JOIN Category ON category_id = categoryId WHERE clubId = ? AND YEAR(activityStartDateIso) = ${year} AND activitySemester = ${semester} ORDER BY activityStartDateIso ASC`,
        [club.clubId]);
    const data: any[] = []


    for (let res of result) {
        let temp: any[] = []
        temp.push(res.activityDisplayDate)
        for (let ct of category) {
            if (ct == res.categoryName) {
                temp.push(res.activityName)
            } else {
                temp.push(null)
            }
        }
        data.push(temp)
    }

   return data
}

async function allActivies(category: string[], clubs: any, year: any, semester: any) {
    let fdata: any[]= []
    for (let club of clubs) {
        const clubCon = club.clubAcronym.length > 0 ? `${club.clubName} (${club.clubAcronym})` : club.clubName
        let data: any[] = [clubCon]
        const result: any = await show(`SELECT Count(*) as count, categoryName from Activity INNER JOIN Club ON club_id = clubId INNER JOIN Category ON category_id = categoryId WHERE clubId = ? AND YEAR(activityStartDateIso) = ${year} AND activitySemester = ${semester} GROUP BY categoryName`,
        [club.clubId]);
    
           
        for (let ct of category) {
            let hasCount = false
            for (let res of result) {
                if (ct == res.categoryName) {
                    data.push(res.count)
                    hasCount = true
                }
            }
            if (!hasCount) {
                data.push(null)
            }
        }

        fdata.push(data)
    }


    return fdata
}

router.get("/excel-export", async function (req, res) {
    const { year, semester, filename = "records" } = req.query;
    
    const category: any = await categories();
    const clubs: any = await clubList()

    const workbook = XLSX.utils.book_new();
    const COL_WIDTH = 200;

    const ws2: any = XLSX.utils.aoa_to_sheet([[null]]);
    for (let i = 0; i < category.length + 1; i++){
        if(!ws2["!cols"]) ws2["!cols"] = [];
        if(!ws2["!cols"][i]) ws2["!cols"][i] = {wch: 8};
        ws2["!cols"][i].wpx = COL_WIDTH;
    }

    XLSX.utils.sheet_add_aoa(ws2, [category], { origin: "B1" });
    const dataSheetActivities: any[] = await allActivies(category, clubs, year, semester)
    XLSX.utils.sheet_add_aoa(ws2, dataSheetActivities, { origin: "A3" });
    XLSX.utils.book_append_sheet(workbook, ws2, "NUMBER OF ACTIVITIES DONE");

    for (let club of clubs) {
        const ws: any = XLSX.utils.aoa_to_sheet([[club.clubName]]);
       
        for (let i = 0; i < category.length + 1; i++){
            if(!ws["!cols"]) ws["!cols"] = [];
            if(!ws["!cols"][i]) ws["!cols"][i] = {wch: 8};
            ws["!cols"][i].wpx = COL_WIDTH;
        }

        XLSX.utils.sheet_add_aoa(ws, [category], { origin: "B3" });

        const dataSheetClubs: any[] = await appendData(category, club, year, semester)
        XLSX.utils.sheet_add_aoa(ws, dataSheetClubs, { origin: "A4" });

        const sheetName: string = club.clubAcronym.length > 0 ? club.clubAcronym: club.clubName.substring(0, 31)
        const newSheeet = sheetName.split("/").join("-")
        XLSX.utils.book_append_sheet(workbook, ws, newSheeet);
    }

    let buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    res.attachment(`${filename}.xlsx`);
    res.status(200).send(buf);
})

export { router };