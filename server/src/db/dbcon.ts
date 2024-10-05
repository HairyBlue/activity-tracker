import * as mysql from "mysql2/promise";
import { configs } from "../settings";
import * as type from "../types";
import * as logging from "../logger";

const logger = logging.wichFileToLog("db");

import "dotenv/config";

let db: type.dbType = {
  host: "",
  user: "",
  password: "",
  name: "",
  limit: 0,
};

if (process.env.NODE_ENV == "production") {
  db.host = process.env.MYSQL_DB_HOST;
  db.user = process.env.MYSQL_DB_USER;
  db.password = process.env.MYSQL_DB_PASSWORD;
  db.name = process.env.MYSQL_DB_NAME;
  db.limit = parseInt(process.env.MYSQL_DB_LIMIT as string) || 20;
} else {
  const localDB = configs.local.db;

  db.host = localDB.host;
  db.user = localDB.user;
  db.password = localDB.password;
  db.name = localDB.name;
  db.limit = localDB.limit;
}

export const pool = mysql.createPool({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.name,
  connectionLimit: db.limit,
});

export const connection = mysql.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.name,
});

async function show(query: string, params: Array<any>) {
  try {
    let result;
    if (params.length > 0) {
      result = await pool.execute(query, params);
    } else {
      result = await pool.query(query);
    }

    return result[0];
  } catch (error) {
    logger.error(new Error("MYSQL Error in showing data"))
  } finally {
    pool.releaseConnection;
  }
}

async function create(query: string, params: Array<any>) {
  try {
    const result = await pool.execute(query, params);
    return result[0]
  } catch (error) {
    logger.error(new Error("MYSQL Error in creating data"))
    // throw new Error("MYSQL Error in creating data");
  } finally {
    pool.releaseConnection;
  }
}

async function update(query: string, params: Array<any>) {
  try {
    const result = await pool.execute(query, params);
    return result[0]
  } catch (error) {
    logger.error(new Error("MYSQL Error in updating data"))
    // throw new Error("MYSQL Error in updating data");
  } finally {
    pool.releaseConnection;
  }
}

async function destroy(query: string, params: Array<any>) {
  try {
    const result = await pool.execute(query, params);
    return result[0]
  } catch (error) {
    logger.error(new Error("MYSQL Error in destroying data"));
    // throw new Error("MYSQL Error in destroying data");
  } finally {
    pool.releaseConnection;
  }
}


export { show, create, update, destroy };
