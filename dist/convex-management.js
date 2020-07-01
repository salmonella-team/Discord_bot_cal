"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Discord = __importStar(require("discord.js"));
var throw_env_1 = __importDefault(require("throw-env"));
var const_settings_1 = __importDefault(require("const-settings"));
exports.ConvexManagement = function () {
    console.log('test');
    var client = new Discord.Client();
    client.on('guildMemberAdd', function (member) {
        var _a;
        console.log('test');
        if (member.guild.name !== const_settings_1["default"].WELCOME_SERVER)
            return;
        var channel = client.channels.cache.get(throw_env_1["default"]('WELCOME_CHANNEL_ID'));
        channel === null || channel === void 0 ? void 0 : channel.send("<@!" + ((_a = member.user) === null || _a === void 0 ? void 0 : _a.id) + "> \u307E\u305A\u306F <#" + throw_env_1["default"]('GUIDE_CHANNEL_ID') + "> \u3092\u78BA\u8A8D\u3057\u306A\u3055\u3044\uFF01");
    });
    client.login(throw_env_1["default"]('CAL_TOKEN'));
};
