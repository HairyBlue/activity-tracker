import * as yaml from "js-yaml";
import * as path from "path";
import * as fs from "fs";

const defaultSettingsYaml = yaml.load(
  fs.readFileSync(
    path.join(__dirname, "./settings/defualt.settings.yaml"),
    "utf-8"
  )
) as any;

const defaults = defaultSettingsYaml.settings

const defaultSecret = defaults.secret
const defaultUser = {
  username: defaults.user.username,
  email: defaults.user.email,
  password: defaults.user.password,
}

const developmentDB = {
  host: defaults.db.development.host,
  user: defaults.db.development.user,
  password: defaults.db.development.password,
  name: defaults.db.development.name,
  limit: defaults.db.development.connectionLimit
}

const stagingDB = {
  host: defaults.db.staging.host,
  user: defaults.db.staging.user,
  password: defaults.db.staging.password,
  name: defaults.db.staging.name,
  limit: defaults.db.staging.connectionLimit
}


export { defaults, defaultUser, defaultSecret, developmentDB, stagingDB };
