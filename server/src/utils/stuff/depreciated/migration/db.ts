// import * as fs from "fs";
// import * as path from "path";
// // import * as luxon from "luxon";
// // import { faker } from "@faker-js/faker";
// import { connection } from "../../db/dbcon";
// // import { categories, clubs } from "./seed";
// // import { validateDates } from "../../helpers/formatAndValidation";

// import "dotenv/config";
// async function migrate() {
//   try {
//     const migrationSQL = fs.readFileSync(path.join(__dirname, "./sql/migration.sql"), "utf-8");
//     for (let q of migrationSQL.split(";")) {
//       (await connection).query(q);
//     }
//   } catch (e) {
//     console.log(e);
//   } finally {
//     console.log("Migration Success");
//     (await connection).end();
//   }
// }

// async function migrateReset() {
//   try {
//     const migrationSQL = fs.readFileSync(path.join(__dirname, "./sql/migration-reset.sql"), "utf-8");
//     for (let q of migrationSQL.split(";")) {
//       (await connection).query(q);
//     }
//   } catch (e) {
//     console.log(e);
//   } finally {
//     console.log("Migration Reset Success");
//     (await connection).end();
//   }
// }

// SEEED ***********************************************
// async function seedCategory() {
//   try {
//     for (let category of categories) {
//       (await connection).query(`INSERT INTO Category (categoryName) value ('${category}')`);
//     }
//   } catch (e) {
//     console.log(e);
//   } finally {
//     console.log("Seed Category Success");
//     // (await connection).end();
//   }
// }

// async function seedClub() {
//   try {
//     for (let club of clubs) {
//       (await connection).query(`INSERT INTO Club (clubName, clubAcronym) values ('${club.name}', '${club.acronym}')`);
//     }
//   } catch (e) {
//     console.log(e);
//   } finally {
//     console.log("Seed Club Success");
//     (await connection).end();
//   }
// }

// const clubId = [
//   { clubId: 1 },
//   { clubId: 2 },
//   { clubId: 3 },
//   { clubId: 4 },
//   { clubId: 5 },
//   { clubId: 6 },
//   { clubId: 7 },
//   { clubId: 8 },
//   { clubId: 9 },
//   { clubId: 10 },
//   { clubId: 11 },
//   { clubId: 12 },
//   { clubId: 13 },
//   { clubId: 14 },
//   { clubId: 15 },
//   { clubId: 16 },
//   { clubId: 17 },
//   { clubId: 18 },
//   { clubId: 19 },
//   { clubId: 20 },
//   { clubId: 21 },
//   { clubId: 22 },
//   { clubId: 23 },
//   { clubId: 24 },
//   { clubId: 25 },
//   { clubId: 26 },
//   { clubId: 27 },
//   { clubId: 28 },
//   { clubId: 29 },
//   { clubId: 30 },
//   { clubId: 31 },
//   { clubId: 32 },
//   { clubId: 33 },
//   { clubId: 34 },
//   { clubId: 35 },
//   { clubId: 36 },
//   { clubId: 37 },
//   { clubId: 38 },
//   { clubId: 39 },
//   { clubId: 40 },
//   { clubId: 41 },
// ];

// const categoryId = [{ categoryId: 1 }, { categoryId: 2 }, { categoryId: 3 }, { categoryId: 4 }, { categoryId: 5 }, { categoryId: 6 }];

// async function seedActivity() {
//   try {
//     const date = luxon.DateTime;
//     const resultClub: any = (await connection).query("SELECT clubId from Club");
//     const resultCategory: any = (await connection).query("SELECT categoryId from Category");
//     const clubObj = (await resultClub)[0];
//     const categoryObj = (await resultCategory)[0];

//     for (let i = 0; i < 500; i++) {
//       if (clubObj) {
//         if (categoryObj) {
//           const startDate = date.fromFormat("01-01-2024", "dd-MM-yyyy");
//           const endDate = date.fromFormat("31-12-2024", "dd-MM-yyyy");
//           const club_id = clubObj[Math.floor(Math.random() * clubObj.length)].clubId;
//           const category_id = categoryObj[Math.floor(Math.random() * categoryObj.length)].categoryId;
//           const activityStartDateIso: any = startDate
//             .plus({ days: Math.floor(Math.random() * (endDate.diff(startDate, "days").days + 1)) })
//             .toISODate();
//           const activityEndDateIso: any = startDate
//             .plus({ days: Math.floor(Math.random() * (endDate.diff(startDate, "days").days + 1)) })
//             .toISODate();
//           const displayDate = validateDates(activityStartDateIso, activityEndDateIso);
//           const activityName = faker.company.name();
//           const activityNotes = faker.lorem.sentences();
//           const activitySemester = Math.floor(Math.random() * 2) + 1;
          
//           if (displayDate) {
//             (await connection).execute(
//               "INSERT INTO activity (club_id, category_id, activityName, activityNotes, activityStartDateIso, activityEndDateIso, activityDisplayDate, activitySemester) values (?, ?, ?, ?, ?, ?, ?, ?)",
//               [club_id, category_id, activityName, activityNotes, activityStartDateIso, activityEndDateIso, displayDate, activitySemester.toString()]
//             );
//           }
//         }
//       }
//     }
//   } catch (e) {
//     console.log(e);
//   } finally {
//     console.log("Seed Dummy Activity Success");
//     (await connection).end();
//   }
// }

// async function dropTables() {
//   try {
//     const migrationSQL = fs.readFileSync("./sql/droptables.sql", "utf-8");
//     for (let q of migrationSQL.split(";")) {
//      (await connection).query(q)
//     }
//   } catch (e) {
//     console.log(e);
//   } finally {
//    (await connection).end()
//   }
// }

// if (process.argv[2] == "1") migrate();

// if (process.env.NODE_ENV !== "production") {
//   if (process.argv[2] == "2") migrateReset();
//   if (process.argv[2] == "3") {
//     seedCategory();
//     seedClub();
//   }
//   if (process.argv[2] == "4") {
//     seedActivity();
//   }
// } else {
//   console.log("Trying to do a migration reset in production");
// }

// process.on('SIGINT', function () {
//   console.log('Received SIGINT. Terminating gracefully...');
//   // Your cleanup tasks here
//   process.exit();
// });

// seedActivity()
