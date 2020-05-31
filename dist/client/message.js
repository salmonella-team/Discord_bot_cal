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
var cal = __importStar(require("../message/cal"));
var speak = __importStar(require("../message/speak"));
var spreadsheet = __importStar(require("../message/spreadsheet"));
var const_settings_1 = __importDefault(require("const-settings"));
var status = {
    Volume: 0.3,
    Mode: 0
};
exports.Message = function (msg, client) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, command, comment;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (((_a = msg.member) === null || _a === void 0 ? void 0 : _a.user.username) === 'キャル')
                    return [2];
                channel = msg.channel;
                if (!const_settings_1["default"].COMMAND_CHANNEL.some(function (c) { return c === (channel === null || channel === void 0 ? void 0 : channel.name); }))
                    return [2];
                command = msg.content.replace(/ |\.|,|:|=/, '.');
                comment = calCommands(command, msg, client);
                if (comment)
                    return [2, console.log(comment)];
                comment = speakCommands(command, msg);
                if (comment)
                    return [2, console.log(comment)];
                return [4, notExistCommands(command, msg)];
            case 1:
                comment = _b.sent();
                if (comment)
                    return [2, console.log(comment)];
                return [2];
        }
    });
}); };
var calCommands = function (command, msg, client) {
    switch (command.split(' ')[0]) {
        case '/cal':
        case '/cal.status':
            cal.ShowStatus(msg, client.voice, status);
            return 'cal show status';
        case '/cal.in':
        case '/cal.join':
            cal.JoinChannel(msg, client.voice);
            return 'cal join channel';
        case '/cal.out':
        case '/cal.disconnect':
            cal.Disconnect(msg, client.voice);
            return 'cal disconnect channel';
        case '/cal.up':
            status.Volume = cal.VolumeUp(msg, status.Volume);
            return 'cal volume up';
        case '/cal.down':
            status.Volume = cal.VolumeDown(msg, status.Volume);
            return 'cal volume down';
        case '/cal.vol':
        case '/cal.volume':
            var content = command.split(' ')[1];
            status.Volume = cal.VolumeChange(msg, status.Volume, content);
            return 'cal volume change';
        case '/cal.reset':
            status.Volume = cal.VolumeReset(msg);
            return 'cal reset';
        case '/cal.help':
            cal.Help(msg, status.Mode);
            return 'cal help';
        case '/cal.yabai':
            cal.Yabai(msg, client, status.Volume);
            return 'cal yabai';
        case '/cal.mode':
            status.Mode = cal.SwitchMode(msg, status.Mode);
            return 'switch devMode';
    }
    if (!status.Mode)
        return;
    switch (command.split(' ')[0]) {
        case '/cal.list':
        case '/cal.wl':
            var name_1 = command.split(' ')[1];
            if (!name_1) {
                cal.GetWhiteList(msg);
                return 'get whitelist';
            }
            else {
                cal.AddWhiteList(msg, name_1);
                return "add whitelist " + name_1;
            }
    }
};
var speakCommands = function (command, msg) {
    var value = (function () {
        switch (command) {
            case '/yabai':
            case '/yab':
                return {
                    url: const_settings_1["default"].URL.YABAI,
                    text: 'ヤバいわよ！',
                    comment: 'speak yabai'
                };
            case '/yabai.desu':
            case '/yabd':
                return {
                    url: const_settings_1["default"].URL.YABAIDESU,
                    text: 'ヤバいですね☆',
                    comment: 'speak yabai.desu'
                };
            case '/yabai.wayo':
            case '/yabw':
                return {
                    url: const_settings_1["default"].URL.YABAIWAYO,
                    text: 'プリコネの年末年始はヤバいわよ！',
                    comment: 'speak yabai.wayo'
                };
            case '/yabai.yaba':
            case '/yaby':
                return {
                    url: const_settings_1["default"].URL.YABAIYABA,
                    text: 'ヤバいヤバいヤバいヤバいヤバいヤバいですね☆',
                    comment: 'speak yabai.yaba'
                };
        }
        if (!status.Mode)
            return;
        switch (command) {
            case '/yabai.full':
            case '/yabf':
                return {
                    url: const_settings_1["default"].URL.YABAIFULL,
                    text: 'プリコネの年末年始はヤバいわよ！(Full)',
                    comment: 'speak yabai.full'
                };
            case '/yabai.yabai':
                return {
                    url: const_settings_1["default"].URL.YABAIYABAI,
                    text: 'ヤバいヤバいヤバいヤバいヤバいヤバい',
                    comment: 'speak yabai.yabai'
                };
            case '/yabai.slow':
                return {
                    url: const_settings_1["default"].URL.YABAISLOW,
                    text: 'ヤバいヤバいヤバいヤバいヤバいヤバいですね☆(slow)',
                    comment: 'speak yabai.slow'
                };
            case '/yabai.otwr':
                return {
                    url: const_settings_1["default"].URL.YABAIOTWR,
                    text: 'ヤバいヤバいヤバいヤバいヤバいヤバいですね☆(otwr)',
                    comment: 'speak yabai.otwr'
                };
        }
    })();
    if (!value)
        return;
    speak.Play(msg, value.url, status.Volume, value.text);
    return value.comment;
};
var notExistCommands = function (command, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var list;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (command.charAt(0) !== '/')
                    return [2];
                return [4, spreadsheet.GetWhiteList()];
            case 1:
                list = _a.sent();
                if (list.find(function (l) { return l === command.slice(1); }))
                    return [2];
                msg.reply('そんなコマンドないんだけど！');
                return [2, 'missing command'];
        }
    });
}); };
