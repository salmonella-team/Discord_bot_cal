"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var fs = __importStar(require("fs"));
var yaml = __importStar(require("js-yaml"));
var yml = fs.readFileSync(process.cwd() + "/config/settings.yaml");
var Settings = yaml.safeLoad(String(yml), 'utf-8');
exports["default"] = Settings;
