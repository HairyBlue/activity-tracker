import * as mysql from "mysql2/promise";
import {Config} from "../types"
import {developmentDB, stagingDB} from "../settings";
import 'dotenv/config'

let config: Config = {
  host: '',
  user: '',
  password: '',
  name: '',
  limit: 0,
}

if (process.env.NODE_ENV == "production") {
  config.host = process.env.DB_HOST
  config.user = process.env.DB_USER
  config.password = process.env.DB_PASSWORD
  config.name = process.env.DB_NAME
  config.limit =  parseInt(process.env.DB_LIMIT as string) || 20
} else if(process.env.NODE_ENV == "staging") {
  config.host = stagingDB.host
  config.user = stagingDB.user
  config.password = stagingDB.pasword
  config.name = stagingDB.name
  config.limit =  stagingDB.limit
} else {
  config.host = developmentDB.host
  config.user = developmentDB.user
  config.password = developmentDB.pasword
  config.name = developmentDB.name
  config.limit =  developmentDB.limit
}

export const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.name,
  connectionLimit: config.limit
});

export const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.name,
})