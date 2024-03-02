import * as yaml from "js-yaml";
import * as path from "path";
import * as fs from "fs";

const defaultSettings = yaml.load(
  fs.readFileSync(
    path.join(__dirname, "../settings/defualt.settings.yaml"),
    "utf-8"
  )
) as any;

export { defaultSettings };
