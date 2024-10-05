import * as yaml from "js-yaml";
import * as path from "path";
import * as fs from "fs";
import * as lodash from "lodash";
import * as type from "./types"

const localSettings = "local.settings.yaml";
const defaultSettings = "default.settings.yaml";

const settingsPath = path.join(__dirname, "settings");
const settings = fs.readdirSync(settingsPath)

let configs: type.configType = {};

for (let setting of settings) {
  const filePath = `${settingsPath}/${setting}`;
  const content  =  yaml.load(fs.readFileSync(filePath, "utf8")) as any;
  const setConfig = content.settings;

  if ( defaultSettings == setting) {
    configs["default"] = setConfig
  }

  if ( localSettings == setting) {
    configs["local"] = setConfig
  }
} 


export { configs };
