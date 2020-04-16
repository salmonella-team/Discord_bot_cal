"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var Discord = __importStar(require("discord.js"));
var env = __importStar(require("./env"));
var message_1 = require("./message");
var client = new Discord.Client();
client.on('ready', function () {
    var _a;
    var channel = client.channels.cache.get(env.GetVal('READY_CHANNEL'));
    channel === null || channel === void 0 ? void 0 : channel.send('キャルの参上よ！');
    console.log("Logged in as " + ((_a = client.user) === null || _a === void 0 ? void 0 : _a.username) + "!");
});
client.on('voiceStateUpdate', function (oldState, newState) { return __awaiter(void 0, void 0, void 0, function () {
    var users, connect;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!oldState.channel) return [3, 2];
                users = (_a = oldState.channel) === null || _a === void 0 ? void 0 : _a.members.map(function (m) { return m.user.username; }).toString();
                if (!(users === 'キャル')) return [3, 2];
                return [4, ((_b = oldState.channel) === null || _b === void 0 ? void 0 : _b.join())];
            case 1:
                connect = _d.sent();
                connect === null || connect === void 0 ? void 0 : connect.disconnect();
                _d.label = 2;
            case 2:
                if (!newState.channel) return [3, 4];
                if (newState.channel.name === '宿屋')
                    return [2];
                return [4, ((_c = newState.channel) === null || _c === void 0 ? void 0 : _c.join())];
            case 3:
                _d.sent();
                _d.label = 4;
            case 4: return [2];
        }
    });
}); });
client.on('message', function (msg) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
    switch (_b.label) {
        case 0:
            _a = (function (text) { return text && console.log(text); });
            return [4, message_1.Message(msg, client)];
        case 1: return [2, _a.apply(void 0, [_b.sent()])];
    }
}); }); });
client.login(env.GetVal('CAL_TOKEN'));
