import * as fs from "fs";
import * as path from "path";
import "dotenv/config";
import { connection } from "../../db/dbcon";
import { categories, clubs } from "./seed";
async function migrate() {
  try {
    const migrationSQL = fs.readFileSync(path.join(__dirname, "./sql/migration.sql"), "utf-8");
    for (let q of migrationSQL.split(";")) {
      (await connection).query(q);
    }
  } catch (e) {
    console.log(e);
  } finally {
    console.log("Migration Success");
    (await connection).end();
  }
}

async function migrateReset() {
  try {
    const migrationSQL = fs.readFileSync(path.join(__dirname, "./sql/migration-reset.sql"), "utf-8");
    for (let q of migrationSQL.split(";")) {
      (await connection).query(q);
    }
  } catch (e) {
    console.log(e);
  } finally {
    console.log("Migration Reset Success");
    (await connection).end();
  }
}

// SEEED ***********************************************
async function seedCategory() {
  try {
    for (let category of categories) {
      (await connection).query(`INSERT INTO Category (categoryName) value ('${category}')`);
    }
  } catch (e) {
    console.log(e);
  } finally {
    console.log("Seed Category Success");
    // (await connection).end();
  }
}

async function seedClub() {
  try {
    for (let club of clubs) {
      (await connection).query(`INSERT INTO Club (clubName, clubAcronym) values ('${club.name}', '${club.acronym}')`);
    }
  } catch (e) {
    console.log(e);
  } finally {
    console.log("Seed Club Success");
    (await connection).end();
  }
}
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

if (process.argv[2] == "1") migrate();

if (process.env.NODE_ENV !== "production") {
  if (process.argv[2] == "2") migrateReset();
  if (process.argv[2] == "3") {
    seedCategory();
    seedClub();
  }
} else {
  console.log("Trying to do a migration reset in production");
}

// process.on('SIGINT', function () {
//   console.log('Received SIGINT. Terminating gracefully...');
//   // Your cleanup tasks here
//   process.exit();
// });
