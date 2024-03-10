import * as fs from "fs"
import * as path from "path"
import "dotenv/config"
import {connection} from "../../db/dbcon"

async function migrate() {
  try {
    const migrationSQL = fs.readFileSync(path.join(__dirname, "./sql/migration.sql"), "utf-8");
    for (let q of migrationSQL.split(";")) {
      (await connection).query(q)
    }
  } catch (e) {
    console.log(e);
  } finally {
      console.log("Migration Success");
      (await connection).end()
  }
}

async function migrateReset() {
  try {
    const migrationSQL = fs.readFileSync(path.join(__dirname, "./sql/migration-reset.sql"), "utf-8");
    for (let q of migrationSQL.split(";")) {
      (await connection).query(q)
    }
  } catch (e) {
    console.log(e);
  } finally {
      console.log("Migration Reset Success");
      (await connection).end()
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
  if (process.argv[2] == "3") console.log("Need to add some seeders here");
} else {
  console.log("Trying to do a migration reset in production")
}

// process.on('SIGINT', function () {
//   console.log('Received SIGINT. Terminating gracefully...');
//   // Your cleanup tasks here
//   process.exit();
// });