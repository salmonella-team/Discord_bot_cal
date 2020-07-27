"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var const_settings_1 = __importDefault(require("const-settings"));
exports.Ready = function (client) {
    var _a;
    var channel = client.channels.cache.get(const_settings_1["default"].CHANNEL_CALL_ID);
    channel === null || channel === void 0 ? void 0 : channel.send('キャルの参上よ！');
    console.log("Logged in as " + ((_a = client.user) === null || _a === void 0 ? void 0 : _a.username) + "!");
};
