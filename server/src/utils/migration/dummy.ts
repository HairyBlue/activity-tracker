import { validateDates } from "../../helpers/formatAndValidation";
import { faker } from "@faker-js/faker";
import { connection } from "../../db/dbcon";
import * as luxon from "luxon";

async function dummyActivity() {
    try {
      const date = luxon.DateTime;
      const resultClub: any = (await connection).query("SELECT clubId from Club");
      const resultCategory: any = (await connection).query("SELECT categoryId from Category");
      const clubObj = (await resultClub)[0];
      const categoryObj = (await resultCategory)[0];
  
      for (let i = 0; i < 500; i++) {
        if (clubObj) {
          if (categoryObj) {
            const startDate = date.fromFormat("01-01-2024", "dd-MM-yyyy");
            const endDate = date.fromFormat("31-12-2024", "dd-MM-yyyy");
            const club_id = clubObj[Math.floor(Math.random() * clubObj.length)].clubId;
            const category_id = categoryObj[Math.floor(Math.random() * categoryObj.length)].categoryId;
            const activityStartDateIso: any = startDate
              .plus({ days: Math.floor(Math.random() * (endDate.diff(startDate, "days").days + 1)) })
              .toISODate();
            const activityEndDateIso: any = startDate
              .plus({ days: Math.floor(Math.random() * (endDate.diff(startDate, "days").days + 1)) })
              .toISODate();
            const displayDate = validateDates(activityStartDateIso, activityEndDateIso);
            const activityName = faker.company.name();
            const activityNotes = faker.lorem.sentences();
            const activitySemester = Math.floor(Math.random() * 2) + 1;
            
            if (displayDate) {
              (await connection).execute(
                "INSERT INTO activity (club_id, category_id, activityName, activityNotes, activityStartDateIso, activityEndDateIso, activityDisplayDate, activitySemester) values (?, ?, ?, ?, ?, ?, ?, ?)",
                [club_id, category_id, activityName, activityNotes, activityStartDateIso, activityEndDateIso, displayDate, activitySemester.toString()]
              );
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
  
dummyActivity()