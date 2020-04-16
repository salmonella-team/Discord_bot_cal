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
var cal = __importStar(require("./cal"));
var speak = __importStar(require("./speak"));
var spreadsheet = __importStar(require("./spreadsheet"));
var env = __importStar(require("./env"));
var status = {
    Volume: 0.3,
    Mode: 0
};
exports.Message = function (msg, client) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, command, content, volume, name_1, list;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (((_a = msg.member) === null || _a === void 0 ? void 0 : _a.user.username) === 'キャル')
                    return [2];
                channel = msg.channel;
                if ((channel === null || channel === void 0 ? void 0 : channel.name) !== '効果音-001' && (channel === null || channel === void 0 ? void 0 : channel.name) !== 'テスト用')
                    return [2];
                command = msg.content.replace(/ |\.|,|:|=/, '.');
                switch (command.split(' ')[0]) {
                    case '/cal':
                    case '/cal.status':
                        cal.ShowStatus(msg, client.voice, status);
                        return [2, 'cal show status'];
                    case '/cal.in':
                    case '/cal.join':
                        cal.JoinChannel(msg, client.voice);
                        return [2, 'cal join channel'];
                    case '/cal.out':
                    case '/cal.disconnect':
                        cal.Disconnect(msg, client.voice);
                        return [2, 'cal disconnect channel'];
                    case '/cal.up':
                        status.Volume = cal.VolumeUp(msg, status.Volume);
                        return [2, 'cal volume up'];
                    case '/cal.down':
                        status.Volume = cal.VolumeDown(msg, status.Volume);
                        return [2, 'cal volume down'];
                    case '/cal.vol':
                    case '/cal.volume':
                        content = command.split(' ')[1];
                        status.Volume = cal.VolumeChange(msg, status.Volume, content);
                        return [2, 'cal volume change'];
                    case '/cal.reset':
                        status.Volume = cal.VolumeReset(msg);
                        return [2, 'cal reset'];
                    case '/cal.help':
                        cal.Help(msg, status.Mode);
                        return [2, 'cal help'];
                    case '/cal.mode':
                        status.Mode = cal.SwitchMode(msg, status.Mode);
                        return [2, 'switch devMode'];
                }
                volume = status.Volume;
                switch (command) {
                    case '/yabai':
                    case '/yab':
                        speak.Play(msg, env.GetVal('YABAI_URL'), volume, 'ヤバいわよ！');
                        return [2, 'speak yabai'];
                    case '/yabai.desu':
                    case '/yabd':
                        speak.Play(msg, env.GetVal('YABAIDESU_URL'), volume, 'ヤバいですね☆');
                        return [2, 'speak yabai.desu'];
                    case '/yabai.wayo':
                    case '/yabw':
                        speak.Play(msg, env.GetVal('YABAIWAYO_URL'), volume, 'プリコネの年末年始はヤバいわよ！');
                        return [2, 'speak yabai.wayo'];
                    case '/yabai.yaba':
                    case '/yaby':
                        speak.Play(msg, env.GetVal('YABAIYABA_URL'), volume, 'ヤバいヤバいヤバいヤバいヤバいヤバいですね☆');
                        return [2, 'speak yabai.yaba'];
                }
                if (status.Mode) {
                    switch (command.split(' ')[0]) {
                        case '/cal.list':
                        case '/cal.wl':
                            name_1 = command.split(' ')[1];
                            if (!name_1) {
                                cal.GetWhiteList(msg);
                                return [2, 'get whitelist'];
                            }
                            else {
                                cal.AddWhiteList(msg, name_1);
                                return [2, "add whitelist " + name_1];
                            }
                    }
                    switch (command) {
                        case '/yabai.full':
                        case '/yabf':
                            speak.Play(msg, env.GetVal('YABAIFULL_URL'), volume, 'プリコネの年末年始はヤバいわよ！(Full)');
                            return [2, 'speak yabai.full'];
                        case '/yabai.yabai':
                            speak.Play(msg, env.GetVal('YABAYABAI_URL'), volume, 'ヤバいヤバいヤバいヤバいヤバいヤバい');
                            return [2, 'speak yabai.yabai'];
                        case '/yabai.slow':
                            speak.Play(msg, env.GetVal('YABAISLOW_URL'), volume, 'ヤバいヤバいヤバいヤバいヤバいヤバいですね☆(slow)');
                            return [2, 'speak yabai.slow'];
                        case '/yabai.otwr':
                            speak.Play(msg, env.GetVal('YABAIOTWR_URL'), volume, 'ヤバいヤバいヤバいヤバいヤバいヤバいですね☆(otwr)');
                            return [2, 'speak yabai.otwr'];
                    }
                }
                if (command.charAt(0) !== '/')
                    return [2];
                return [4, spreadsheet.GetWhiteList()];
            case 1:
                list = _b.sent();
                if (list.find(function (l) { return l === command.slice(1); }))
                    return [2];
                msg.reply('そんなコマンドないんだけど！');
                return [2, 'missing command'];
        }
    });
}); };
