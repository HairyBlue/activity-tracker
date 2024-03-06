const mysql = require("mysql2/promise");
const yaml = require("js-yaml");
const fs = require("fs");

// TODO - increase connection limit if more query (by default 10)
const settings = yaml.load(fs.readFileSync("db.migration.yaml"), "utf-8");
const pool = mysql.createPool({
  host: settings.db.host,
  user: settings.db.user,
  password: settings.db.password,
  database: settings.db.database,
  connectionLimit: settings.db.connectionLimit
});

let migrationSQL;
let conn = null;

async function migrate() {
  try {
    migrationSQL = fs.readFileSync("./sql/migration.sql", "utf-8");
    for (q of migrationSQL.split(";")) {
      conn = await pool.getConnection();
      await conn.query(q);
    }
  } catch (e) {
    console.log(e);
  } finally {
    if (conn) {
      console.log("Migration Success");
      conn.release();
      conn = null
    }
  }
}

async function migrateReset() {
  try {
    migrationSQL = fs.readFileSync("./sql/migration-reset.sql", "utf-8");
    for (q of migrationSQL.split(";")) {
      conn = await pool.getConnection();
       await conn.query(q);
    }
  } catch (e) {
    console.log(e);
  } finally {
    if (conn) {
      console.log("Migration Reset Success");
      conn.release();
      conn = null
    }
  }
}

async function dropTables() {
  try {
    migrationSQL = fs.readFileSync("./sql/droptables.sql", "utf-8");
    for (q of migrationSQL.split(";")) {
      conn = await pool.getConnection();
      await conn.query(q);
      
    }
  } catch (e) {
    console.log(e);
  } finally {
    if (conn) {
      console.log("Drop Tables: Success");
      conn.release();
      conn = null
    }
  }
}

if (process.argv[2] == "1") migrate();
if (process.argv[2] == "2") migrateReset();
if (process.argv[2] == "3") dropTables();
