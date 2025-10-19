import { validateDates } from "../helpers/formatAndValidation";
import { faker } from "@faker-js/faker";
import { connection } from "../db/dbcon";
import { uuid } from "../helpers/svcfunc";
import * as luxon from "luxon";

const date = luxon.DateTime;

let clubObj: any = null;
let categoryObj: any = null;
let schoolYearObj: any = null;

function cleanUp() {
  clubObj = null;
  categoryObj = null;
  schoolYearObj = null;
}

async function initialize() {
  const resultClub: any = (await connection).query("SELECT clubId from Club");
  const resultCategory: any = (await connection).query("SELECT categoryId from Category");
  const resultSchoolYear: any = (await connection).query("SELECT yearStart, yearEnd from SchoolYear");
  
  clubObj = (await resultClub)[0];
  categoryObj = (await resultCategory)[0];
  schoolYearObj = (await resultSchoolYear)[0];
}

function activityDateInit() {
 
  const startDate = date.fromFormat("01-01-2024 00:00:00", "dd-MM-yyyy HH:mm:ss");
  const endDate = date.fromFormat("31-12-2024 23:59:59", "dd-MM-yyyy HH:mm:ss");

  const activityStartDateIso: any = startDate
  .plus({ days: Math.floor(Math.random() * (endDate.diff(startDate, "days").days + 1)) })
  .toISODate();

  const activityEndDateIso: any = startDate
  .plus({ days: Math.floor(Math.random() * (endDate.diff(startDate, "days").days + 1)) })
  .toISODate(); 

  let concatYear = "";
  for (let schoolYear of schoolYearObj) {
    if( date.fromISO(activityStartDateIso).year.toString() == schoolYear.yearStart ) {

      concatYear = schoolYear.yearStart + "-" + schoolYear.yearEnd
    }
  }

  const dispDate =  validateDates(activityStartDateIso, activityEndDateIso, concatYear);

  if (!dispDate) { 
    return false
  }


  return { "displayDate": dispDate, "schoolYear": concatYear, "activityStartDateISO": activityStartDateIso, "activityEndDateISO": activityEndDateIso }
}


async function dummyActivity() {
    try {
      for (let i = 0; i < 500; i++) {
        if (clubObj) {
          if (categoryObj) {

            const club_id = clubObj[Math.floor(Math.random() * clubObj.length)].clubId;
            const category_id = categoryObj[Math.floor(Math.random() * categoryObj.length)].categoryId;


            const activityName = faker.company.name();
            const activityNotes = faker.lorem.sentences();
            const activitySemester = Math.floor(Math.random() * 2) + 1;
            const dateInit =  activityDateInit();

            const fakeVenue = faker.location.secondaryAddress();
            const options = ["On-Campus", "Off-Campus", "Online"];
            const randomModality = options[Math.floor(Math.random() * options.length)];

            const activityStatus = ["APPROVED", "DISAPPROVED", "PENDING"]
            const randomStatus = activityStatus[Math.floor(Math.random() * options.length)];

            let randomComments = faker.lorem.sentence();

            if (randomStatus == "APPROVED" || randomStatus == "PENDING") {
              randomComments = "";
            }

            const dateFormmater = new Intl.DateTimeFormat('en-US', {
              weekday: 'short',
              month: 'short', 
              day: "numeric",
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
              timeZone: "Asia/Manila",
           }).format(faker.date.anytime()).toString()
            
            if (dateInit) {
              const query = `
                INSERT INTO Activity 
                (
                  activity_uuid,
                  activity_same_record_uuid,
                  activityName,
                  activityNotes,
                  category_id,
                  club_id,
                  activityStartDateIso,
                  activityEndDateIso,
                  activityDisplayDate,
                  activitySemester,
                  activitySchoolYear,
                  activityVenue,
                  activityModality,
                  activityStatus,
                  activityComments,
                  activityStatusTimeStamp
                ) 
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const params = [
                  uuid.v4(),
                  uuid.v4(),
                  activityName,
                  activityNotes,
                  category_id,
                  club_id,
                  dateInit.activityStartDateISO,
                  dateInit.activityEndDateISO,
                  dateInit.displayDate,
                  activitySemester,
                  dateInit.schoolYear,
                  fakeVenue,
                  randomModality,
                  randomStatus,
                  randomComments,
                  dateFormmater
                ];

              (await connection).execute(query, params);

            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log("Seed Dummy Activity Success");
      (await connection).end();
    }
}
  

async function doDummy() {
  await initialize();
  await dummyActivity();
  cleanUp();
}

doDummy()

 
