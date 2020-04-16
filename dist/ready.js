"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var env = __importStar(require("./env"));
exports.Ready = function (client) {
    var _a;
    var channel = client.channels.cache.get(env.GetVal('READY_CHANNEL'));
    channel === null || channel === void 0 ? void 0 : channel.send('キャルの参上よ！');
    console.log("Logged in as " + ((_a = client.user) === null || _a === void 0 ? void 0 : _a.username) + "!");
};
