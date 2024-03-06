import * as mysql from "mysql2";
import * as settings from "../settings";

const defaults = settings.defaultSettings;
export const pool = mysql.createPool({
  host: defaults.db.host,
  user: defaults.db.user,
  password: defaults.db.password,
  database: defaults.db.database,
  connectionLimit: defaults.db.connectionLimit,
});
