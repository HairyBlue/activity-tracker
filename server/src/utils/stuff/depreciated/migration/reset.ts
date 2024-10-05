import * as fs from "fs";
import * as path from "path";
import { connection } from "../../../../db/dbcon";


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

migrateReset()