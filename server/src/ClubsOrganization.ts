import * as lodash from "lodash"
import * as logging from "./logger";
import * as express from "express";
import { show } from "./db/dbcon";
import { clubOrgType } from "./types";
import { initAll } from "./commonData"

const router = express.Router();

const queryCategory = 
  "SELECT REPLACE(categoryName, ' ', '_') AS categoryKey, categoryName, count(*) as count  FROM Activity" +
  " " +
  "LEFT JOIN Category on category_id = categoryId" +
  " " +
  "WHERE club_id = ? AND activitySchoolYear = ? AND activitySemester = ?  AND activityArchive = 0 AND activityStatus = ?" +
  " " +
  "GROUP BY category_id";

const queryCategoryMonth = 
  "SELECT categoryName, MONTH(activityStartDateIso) AS months, COUNT(*) AS activity_count FROM Activity" +
  " " +
  "LEFT JOIN Category ON category_id = categoryId" +
  " " +
  "WHERE club_id = ?  AND activitySchoolYear = ? AND activitySemester = ?  AND activityArchive = 0 AND activityStatus = ?" +
  " " +
  "GROUP BY categoryId, MONTH(activityStartDateIso)";

type category = { [key: string]: number };
type months = { [key: string]: number[] };

type sorted = {[key: string]: any };

class ClubsOrganizatons {
  clubs: any[];
  categories: any[];
  year: string;
  sem: string;
  status: string
  all: clubOrgType;

  constructor (clubs: any, categories: any, year: string, sem: string, status: string) {
    this.clubs = clubs;
    this.categories = categories;
    this.year = year;
    this.sem = sem;
    this.status = status;

    this.all = {
      data: this.clubs
    } 
  }

  async getCategory(query: string) {
    const data = this.all.data;
    const newData = [];
    
    for (let club of data) {
      const params = [club.clubId, this.year, this.sem, this.status];
      const result: any = await show(query, params);

      if (result.length == 0 && !result) {
        continue;
      }

      const categories = result;

      const category: category = {};

      let obj = { category };

      for (let cat of categories) {
        obj.category[cat.categoryName] = cat.count;
      }
       
      for (let cat2 of this.categories) {
        const noAct = cat2.categoryName;
        if ( !obj.category[noAct] ) {
          obj.category[noAct] = 0;
        }
      } 

      obj.category = this.sortedObj(obj.category);

      const merge = lodash.merge(club, obj);
      newData.push(merge);
    }
  
    this.all.data = newData;
  }

  async getCategoryMonth(query: string) {
    const data = this.all.data;
    const newData = [];
    
    for (let club of data) {
      const params = [club.clubId, this.year, this.sem, this.status];
      const result: any = await show(query, params);
     
      if (result.length == 0 && !result) {
        continue;
      }

      const months: months = {};
      let obj = { months };

      let group = result.reduce((acc: any, cur: any) => {
        if (acc == undefined) acc = {};
        if ( !acc[cur.categoryName] ) acc[cur.categoryName] = []
        
        for(let i = 0; i < cur.activity_count; i++) {
          acc[cur.categoryName].push(cur.months)
        }
       
        return acc;
        }, {});


      for (let cat of this.categories) {
        const noAct: string = cat.categoryName;
        if ( !group[noAct] ) {
          group[noAct] = [];
        }
       } 

      group = this.sortedObj(group);
      obj.months = group;

      const merge = lodash.merge(club, obj);
      newData.push(merge);
    }

    this.all.data = newData;
  }

  sortedObj(obj: sorted): sorted {
    let sortedObj: sorted = {}
    const sorted =  Object.keys(obj).sort();

    for (let sort of sorted) {
      sortedObj[sort] = obj[sort];
    }

    return sortedObj;
  }

  getData() {
    return this.all; 
  }
}



async function processCO(req: express.Request , year: string, sem: string, status: string) {

  const common = await initAll(req);

  const clubs = common.initClub;
  const categories = common.initCategory;

  const clubOrg = new ClubsOrganizatons(clubs, categories, year, sem, status);

  await clubOrg.getCategory(queryCategory);
  await clubOrg.getCategoryMonth(queryCategoryMonth);

  return clubOrg.getData();
}

router.get("/club-org/:activitySchoolYear/:semester/:status", async function(req, res){
  const {activitySchoolYear, semester, status} =  req.params;

  const result = await processCO(req, activitySchoolYear, semester, status);
  
  res.status(200);
  res.json(result)
})


export {
  router
}
