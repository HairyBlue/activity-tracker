import * as fs from "fs";
import * as path from "path";
import { connection } from "../../../../db/dbcon";


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

migrate()