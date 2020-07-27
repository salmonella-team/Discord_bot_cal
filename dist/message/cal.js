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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var spreadsheet = __importStar(require("./spreadsheet"));
var const_settings_1 = __importDefault(require("const-settings"));
var roundFloat = function (n) { return Math.round(n * 10) / 10; };
exports.ShowStatus = function (msg, voice, status) {
    var channel = voice === null || voice === void 0 ? void 0 : voice.connections.map(function (v) { return v.channel; }).filter(function (v) { return v.guild; }).filter(function (v) { var _a; return v.guild.name === ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.name); }).map(function (v) { return v.name; }).toString();
    var join = channel ? channel + "\u306B\u63A5\u7D9A\u3057\u3066\u3044\u308B\u308F" : 'どこのボイスチャンネルにも接続してないわ';
    msg.reply(join + "\n\u97F3\u91CF\u306F" + roundFloat(status.Volume) + "\u3088\uFF01" + (status.Mode ? '(DevMode)' : ''));
};
var getVoiceConnection = function (msg, voice) { return voice === null || voice === void 0 ? void 0 : voice.connections.map(function (v) { return v; }).filter(function (v) { var _a; return v.channel.guild.name === ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.name); })[0]; };
exports.JoinChannel = function (msg, voice) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, connect;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                channel = (_a = msg.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
                if (!channel)
                    return [2, msg.reply('あんたがボイスチャンネルに居ないと入れないじゃないの！')];
                connect = getVoiceConnection(msg, voice);
                if ((channel === null || channel === void 0 ? void 0 : channel.name) === (connect === null || connect === void 0 ? void 0 : connect.channel.name))
                    return [2, msg.reply("\u3082\u3046" + (channel === null || channel === void 0 ? void 0 : channel.name) + "\u306B\u63A5\u7D9A\u3057\u3066\u308B\u308F")];
                return [4, (channel === null || channel === void 0 ? void 0 : channel.join())];
            case 1:
                _b.sent();
                msg.reply((channel === null || channel === void 0 ? void 0 : channel.name) + "\u306B\u63A5\u7D9A\u3057\u305F\u308F\u3088\uFF01");
                return [2];
        }
    });
}); };
exports.Disconnect = function (msg, voice) {
    var _a;
    var connect = getVoiceConnection(msg, voice);
    if (!connect)
        return msg.reply('あたしはどこのボイスチャンネルに入ってないわよ');
    connect === null || connect === void 0 ? void 0 : connect.disconnect();
    msg.reply(((_a = connect === null || connect === void 0 ? void 0 : connect.channel) === null || _a === void 0 ? void 0 : _a.name) + "\u304B\u3089\u5207\u65AD\u3057\u305F\u308F");
};
exports.VolumeUp = function (msg, volume) {
    if (roundFloat(volume) >= 1) {
        msg.reply('これ以上音量を上げられないわ');
    }
    else {
        volume += 0.1;
        msg.reply("\u97F3\u91CF\u3092\u4E0A\u3052\u305F\u308F\u3088\uFF01(" + roundFloat(volume) + ")");
    }
    return volume;
};
exports.VolumeDown = function (msg, volume) {
    if (roundFloat(volume) <= 0.1) {
        msg.reply('これ以上音量を下げられないわ');
    }
    else {
        volume -= 0.1;
        msg.reply("\u97F3\u91CF\u3092\u4E0B\u3052\u305F\u308F\u3088\uFF01(" + roundFloat(volume) + ")");
    }
    return volume;
};
exports.VolumeChange = function (msg, volume, content) {
    if (!content) {
        msg.reply('音量が指定されていないんだけど！');
        return volume;
    }
    var valid = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, '1.0'].map(function (n) { return String(n); }).find(function (n) { return n === content; });
    if (!valid) {
        msg.reply('その音量にはできないんだけど！');
        return volume;
    }
    msg.reply("\u97F3\u91CF\u3092" + content + "\u306B\u3057\u305F\u308F\u3088\uFF01");
    return Number(content);
};
exports.VolumeReset = function (msg) {
    msg.reply('音量をリセットしたわよ！(0.3)');
    return 0.3;
};
exports.GetWhiteList = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var whiteList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetWhiteList()];
            case 1:
                whiteList = _a.sent();
                msg.reply("\u30B3\u30DE\u30F3\u30C9\u7528\u306E\u30DB\u30EF\u30A4\u30C8\u30EA\u30B9\u30C8\u4E00\u89A7\u3088\uFF01\n" + whiteList.join('\n'));
                return [2];
        }
    });
}); };
exports.AddWhiteList = function (msg, name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.AddWhiteList(name)];
            case 1:
                if (_a.sent()) {
                    msg.reply("\u30B3\u30DE\u30F3\u30C9\u7528\u306E\u30DB\u30EF\u30A4\u30C8\u30EA\u30B9\u30C8\u306B" + name + "\u3092\u8FFD\u52A0\u3057\u305F\u308F\u3088\uFF01");
                }
                else {
                    msg.reply("\u305D\u306E\u30B3\u30DE\u30F3\u30C9\u306F\u65E2\u306B\u8FFD\u52A0\u3055\u308C\u3066\u3044\u308B\u308F");
                }
                return [2];
        }
    });
}); };
exports.Help = function (msg, mode) {
    var help = mode
        ? "\u9AD8\u5EA6\u306A\u9B54\u6CD5\u4E00\u89A7\u3088\uFF01```\n/cal        \u30AD\u30E3\u30EB\u306E\u72B6\u614B\u3092\u8868\u793A\n/cal.in     \u30AD\u30E3\u30EB\u3092\u30DC\u30A4\u30B9\u30C1\u30E3\u30F3\u30CD\u30EB\u306B\u63A5\u7D9A\n/cal.out    \u30AD\u30E3\u30EB\u3092\u30DC\u30A4\u30B9\u30C1\u30E3\u30F3\u30CD\u30EB\u304B\u3089\u5207\u65AD\n/cal.up     \u30AD\u30E3\u30EB\u306E\u58F0\u91CF\u3092\u4E0A\u3052\u308B\n/cal.down   \u30AD\u30E3\u30EB\u306E\u58F0\u91CF\u3092\u4E0B\u3052\u308B\n/cal.volume <0.1~1.0> \u30AD\u30E3\u30EB\u306E\u58F0\u91CF\u3092\u6307\u5B9A\u306E\u97F3\u91CF\u306B\u3059\u308B\n/cal.reset  \u30AD\u30E3\u30EB\u306E\u97F3\u91CF\u3092\u30EA\u30BB\u30C3\u30C8\u3059\u308B\n/cal.list   \u30B3\u30DE\u30F3\u30C9\u7528\u306E\u30DB\u30EF\u30A4\u30C8\u30EA\u30B9\u30C8\u3092\u8868\u793A\n/cal.list <name> \u30DB\u30EF\u30A4\u30C8\u30EA\u30B9\u30C8\u306B\u5024\u3092\u8FFD\u52A0\n/cal.help   \u30AD\u30E3\u30EB\u306E\u30B3\u30DE\u30F3\u30C9\u4E00\u89A7\n/cal.mode   \u30AD\u30E3\u30EB\u306E\u30E2\u30FC\u30C9\u3092\u5207\u308A\u66FF\u3048\u308B\n\n/yabai       \u30E4\u30D0\u3044\u308F\u3088\uFF01\n/yabai.desu  \u30E4\u30D0\u3044\u3067\u3059\u306D\u2606\n/yabai.wayo  \u30D7\u30EA\u30B3\u30CD\u306E\u5E74\u672B\u5E74\u59CB\u306F\u30E4\u30D0\u3044\u308F\u3088\uFF01\n/yabai.yaba  \u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u3067\u3059\u306D\u2606\n/yabai.full  \u30D7\u30EA\u30B3\u30CD\u306E\u5E74\u672B\u5E74\u59CB\u306F\u30E4\u30D0\u3044\u308F\u3088\uFF01(Full)\n/yabai.yabai \u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\n/yabai.slow  \u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u3067\u3059\u306D\u2606(slow)\n/yabai.otwr  \u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u3067\u3059\u306D\u2606(otwr)\n```\u203B`.`\u306F` `\u3067\u4EE3\u7528\u53EF\u80FD\u3000\u4F8B:`/cal help`\n"
        : "\u9B54\u6CD5\u4E00\u89A7\u3088\uFF01```\n/cal        \u30AD\u30E3\u30EB\u306E\u72B6\u614B\u3092\u8868\u793A\n/cal.in     \u30AD\u30E3\u30EB\u3092\u30DC\u30A4\u30B9\u30C1\u30E3\u30F3\u30CD\u30EB\u306B\u63A5\u7D9A\n/cal.out    \u30AD\u30E3\u30EB\u3092\u30DC\u30A4\u30B9\u30C1\u30E3\u30F3\u30CD\u30EB\u304B\u3089\u5207\u65AD\n/cal.up     \u30AD\u30E3\u30EB\u306E\u58F0\u91CF\u3092\u4E0A\u3052\u308B\n/cal.down   \u30AD\u30E3\u30EB\u306E\u58F0\u91CF\u3092\u4E0B\u3052\u308B\n/cal.volume <0.1~1.0> \u30AD\u30E3\u30EB\u306E\u58F0\u91CF\u3092\u6307\u5B9A\u306E\u97F3\u91CF\u306B\u3059\u308B\n/cal.reset  \u30AD\u30E3\u30EB\u306E\u97F3\u91CF\u3092\u30EA\u30BB\u30C3\u30C8\u3059\u308B\n/cal.list   \u30B3\u30DE\u30F3\u30C9\u7528\u306E\u30DB\u30EF\u30A4\u30C8\u30EA\u30B9\u30C8\u3092\u8868\u793A\n/cal.list <name> \u30DB\u30EF\u30A4\u30C8\u30EA\u30B9\u30C8\u306B\u5024\u3092\u8FFD\u52A0\n/cal.help   \u30AD\u30E3\u30EB\u306E\u30B3\u30DE\u30F3\u30C9\u4E00\u89A7\n\n/yabai      \u30E4\u30D0\u3044\u308F\u3088\uFF01\n/yabai.desu \u30E4\u30D0\u3044\u3067\u3059\u306D\u2606\n/yabai.wayo \u30D7\u30EA\u30B3\u30CD\u306E\u5E74\u672B\u5E74\u59CB\u306F\u30E4\u30D0\u3044\u308F\u3088\uFF01\n/yabai.yaba \u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u30E4\u30D0\u3044\u3067\u3059\u306D\u2606\n```\u203B`.`\u306F` `\u3067\u4EE3\u7528\u53EF\u80FD\u3000\u4F8B:`/cal help`\n";
    msg.reply(help);
};
var getMsgUserRoles = function (msg) { var _a; return (_a = msg.member) === null || _a === void 0 ? void 0 : _a.roles.cache.map(function (r) { return r.name; }); };
var isRole = function (checkRoles, userRoles) {
    return !checkRoles.some(function (r) { return userRoles === null || userRoles === void 0 ? void 0 : userRoles.find(function (v) { return v === r; }); });
};
exports.Yabai = function (msg, client, volume) { return __awaiter(void 0, void 0, void 0, function () {
    var roles, channel, connect;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                roles = getMsgUserRoles(msg);
                if (isRole(const_settings_1["default"].REMOTE_YABAI, roles)) {
                    msg.reply('そんなコマンドないんだけど！');
                    return [2];
                }
                channel = client.channels.cache.get(const_settings_1["default"].REMOTE_YABAI_CHANNEL);
                return [4, (channel === null || channel === void 0 ? void 0 : channel.join())];
            case 1:
                connect = _a.sent();
                connect === null || connect === void 0 ? void 0 : connect.play(const_settings_1["default"].URL.YABAI, { volume: volume });
                msg.reply('リモートヤバいわよ！');
                return [2];
        }
    });
}); };
exports.SwitchMode = function (msg, mode) {
    var roles = getMsgUserRoles(msg);
    if (isRole(const_settings_1["default"].DEVELOP_ROLE, roles)) {
        msg.reply('あんたにモードを切り替える権限ないわ');
        return mode;
    }
    mode = ~mode;
    msg.reply(mode ? 'DevModeになったわよ！' : 'DevModeを解除したわ');
    return mode;
};
