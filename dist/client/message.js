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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var const_settings_1 = __importDefault(require("const-settings"));
var aloud = __importStar(require("../message/aloud"));
var cal = __importStar(require("../message/cal"));
var speak = __importStar(require("../message/speak"));
var spreadsheet = __importStar(require("../message/spreadsheet"));
var etc_1 = require("../config/etc");
var status = {
    Volume: 0.3,
    Mode: 0
};
exports.Message = function (msg, client) { return __awaiter(void 0, void 0, void 0, function () {
    var comment, command;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (((_a = msg.member) === null || _a === void 0 ? void 0 : _a.user.username) === 'キャル')
                    return [2];
                return [4, aloud.RemoveMessage(msg)];
            case 1:
                comment = _b.sent();
                if (comment)
                    return [2, console.log(comment)];
                command = msg.content.replace(/ |\.|,|:|=/, '.');
                return [4, calCommands(command, msg, client)];
            case 2:
                comment = _b.sent();
                if (comment)
                    return [2, console.log(comment)];
                return [4, speakCommands(command, msg)];
            case 3:
                comment = _b.sent();
                if (comment)
                    return [2, console.log(comment)];
                return [4, notExistCommands(command, msg)];
            case 4:
                comment = _b.sent();
                if (comment)
                    return [2, console.log(comment)];
                return [4, aloud.Read(msg, client)];
            case 5:
                comment = _b.sent();
                if (comment)
                    return [2, console.log(comment)];
                return [2];
        }
    });
}); };
var calCommands = function (command, msg, client) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, content, name_1, _a, former, ahead, bpm;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                channel = msg.channel;
                return [4, etc_1.VcChannelList()];
            case 1:
                if (!(_b.sent()).some(function (c) { return c === (channel === null || channel === void 0 ? void 0 : channel.name); }))
                    return [2];
                switch (command.split(' ')[0]) {
                    case '/cal':
                    case '/cal.status':
                        cal.ShowStatus(msg, client.voice, status);
                        return [2, 'cal show status'];
                    case '/cal.in':
                    case '/cal.join':
                    case '/cal.connect':
                        cal.JoinChannel(msg, client.voice);
                        return [2, 'cal join channel'];
                    case '/cal.out':
                    case '/cal.discon':
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
                    case '/cal.mode':
                        status.Mode = cal.SwitchMode(msg, status.Mode);
                        return [2, 'switch devMode'];
                }
                switch (true) {
                    case /bpm/.test(command): {
                        _a = __read(command.replace('.', ' ').split(' ').map(Number), 4), former = _a[1], ahead = _a[2], bpm = _a[3];
                        msg.channel.send((former / ahead) * bpm);
                        return [2, 'bpm calc'];
                    }
                }
                return [2];
        }
    });
}); };
var speakCommands = function (command, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                channel = msg.channel;
                return [4, etc_1.VcChannelList()];
            case 1:
                if (!(_a.sent()).some(function (c) { return c === (channel === null || channel === void 0 ? void 0 : channel.name); }))
                    return [2];
                value = (function () {
                    switch (command) {
                        case '/yabai':
                        case '/yab':
                            return {
                                url: const_settings_1["default"].URL.YABAI,
                                text: 'ヤバイわよ！',
                                comment: 'speak yabai'
                            };
                        case '/yabai.desu':
                        case '/yabd':
                            return {
                                url: const_settings_1["default"].URL.YABAIDESU,
                                text: 'やばいですね☆',
                                comment: 'speak yabai.desu'
                            };
                        case '/yabai.wayo':
                        case '/yabw':
                            return {
                                url: const_settings_1["default"].URL.YABAIWAYO,
                                text: 'プリコネの年末年始はヤバイわよ！',
                                comment: 'speak yabai.wayo'
                            };
                        case '/yabai.yaba':
                        case '/yaby':
                            return {
                                url: const_settings_1["default"].URL.YABAIYABA,
                                text: 'ヤバイヤバイヤバイヤバイヤバイやばいですね☆',
                                comment: 'speak yabai.yaba'
                            };
                        case 'jinai':
                        case 'jinnai':
                            return {
                                url: const_settings_1["default"].URL.JINNAI,
                                text: '笑いのニューウェーブ\n陣 内 智 則',
                                comment: 'speak jinnai'
                            };
                        case 'jinaitomonori':
                        case 'jinnaitomonori':
                            return {
                                url: const_settings_1["default"].URL.JINNAITOMONORI,
                                text: '次々に、新しい仕掛けを繰り出すのは、この男〜！\n笑いのニューウェーブ\n陣 内 智 則',
                                comment: 'speak jinnaitomonori'
                            };
                        case 'hikakin':
                        case 'Hikakin':
                        case 'HIKAKIN':
                            return {
                                url: const_settings_1["default"].URL.HIKAKIN,
                                text: 'HIKAKIN TV Everyday',
                                comment: 'speak HIKAKIN'
                            };
                        case 'helloyoutube':
                        case 'helloYouTube':
                        case 'HelloYouTube':
                            return {
                                url: const_settings_1["default"].URL.HELLOYOUTUBE,
                                text: 'ブンブンハローYouTube',
                                comment: 'speak helloYouTube'
                            };
                        case 'hikakintv':
                        case 'HikakinTv':
                        case 'HIKAKINTV':
                            return {
                                url: const_settings_1["default"].URL.HIKAKINTV,
                                text: 'HIKAKIN TV Everyday\nブンブンハローYouTube\nどうもHIKAKINです',
                                comment: 'speak HIKAKINTV'
                            };
                        case 'setokouji':
                            return {
                                url: const_settings_1["default"].URL.SETOKOUJI,
                                text: 'ﾃﾞｰｰｰｰｰﾝ\n瀬戸弘司の動画',
                                comment: 'speak setokouji'
                            };
                        case 'misuzu':
                            return {
                                url: const_settings_1["default"].URL.MISUZU,
                                text: '怒涛の合格 みすず学苑 怒涛の合格 みすず学苑 怒涛の合格',
                                comment: 'speak misuzu'
                            };
                        case 'スシロー':
                            return {
                                url: const_settings_1["default"].URL.SUSHIRO,
                                text: 'スシロー スシロー',
                                comment: 'speak sushiro'
                            };
                        case 'usamaru':
                            return {
                                url: const_settings_1["default"].URL.USAMARU,
                                text: 'ｷﾞｶﾞｷﾞｶﾞﾌﾝﾌﾝｶﾞｶﾞｶﾞｶﾞｶﾞｶﾞｶﾞｶﾞｶﾞ',
                                comment: 'speak usamaru'
                            };
                        case 'ニューイヤーバースト':
                            return {
                                url: const_settings_1["default"].URL.NYARU,
                                text: '何発でも打ち込むわ！ニューイヤーバースト！！！',
                                comment: 'speak nyaru'
                            };
                        case 'heero':
                            return {
                                url: const_settings_1["default"].URL.HEERO,
                                text: 'ヒイロ・ユイ',
                                comment: 'speak heero'
                            };
                        case 'deden':
                            return {
                                url: const_settings_1["default"].URL.DEDEN,
                                text: 'ﾃﾞﾃﾞﾝ',
                                comment: 'speak deden'
                            };
                        case 'gi':
                            return {
                                url: const_settings_1["default"].URL.GI,
                                text: 'ギラティナ',
                                comment: 'speak gi'
                            };
                        case '船越':
                            return {
                                url: const_settings_1["default"].URL.FUNAKOSHI,
                                text: '火曜サスペンス劇場 フラッシュバックテーマ',
                                comment: 'speak funakoshi'
                            };
                        case '片平':
                            return {
                                url: const_settings_1["default"].URL.KATAHIRA,
                                text: '火曜サスペンス劇場 アイキャッチ',
                                comment: 'speak katahira'
                            };
                        case '<.reichan:778714208954220586>':
                            return {
                                url: const_settings_1["default"].URL.REITYAN,
                                text: 'れいちゃん',
                                comment: 'speak reityan'
                            };
                        case '素敵な仲間が増えますよ':
                            return {
                                url: const_settings_1["default"].URL.KARIN,
                                text: 'クソメガネ',
                                comment: 'speak karin'
                            };
                        case 'ざわざわ':
                        case 'ざわ…ざわ…':
                            return {
                                url: const_settings_1["default"].URL.ZAWAZAWA,
                                text: 'ざわ…ざわ…',
                                comment: 'speak zawazawa'
                            };
                        case 'お願いマッスル':
                            return {
                                url: const_settings_1["default"].URL.MUSCLE,
                                text: 'お願いマッスル\nめっちゃモテたい',
                                comment: 'speak muscle'
                            };
                        case 'ﾈｺﾁｬﾝ':
                            return {
                                url: const_settings_1["default"].URL.NEKO,
                                text: 'あ～あ\nGUCCIの7万円もするﾈｺﾁｬﾝのTシャツがほしいよ～',
                                comment: 'speak neko'
                            };
                    }
                    if (!status.Mode)
                        return;
                    switch (command) {
                        case '/yabai.full':
                        case '/yabf':
                            return {
                                url: const_settings_1["default"].URL.YABAIFULL,
                                text: 'プリコネの年末年始はヤバイわよ！(Full)',
                                comment: 'speak yabai.full'
                            };
                        case '/yabai.yabai':
                            return {
                                url: const_settings_1["default"].URL.YABAIYABAI,
                                text: 'ヤバイヤバイヤバイヤバイヤバイヤバイ',
                                comment: 'speak yabai.yabai'
                            };
                        case '/yabai.slow':
                            return {
                                url: const_settings_1["default"].URL.YABAISLOW,
                                text: 'ヤバイヤバイヤバイヤバイヤバイやばいですね☆(slow)',
                                comment: 'speak yabai.slow'
                            };
                        case '/yabai.otwr':
                            return {
                                url: const_settings_1["default"].URL.YABAIOTWR,
                                text: 'ヤバイヤバイヤバイヤバイヤバイやばいですね☆(otwr)',
                                comment: 'speak yabai.otwr'
                            };
                    }
                })();
                if (!value)
                    return [2];
                speak.Play(msg, value.url, status.Volume, value.text);
                return [2, value.comment];
        }
    });
}); };
var notExistCommands = function (command, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, list, cmd;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                channel = msg.channel;
                return [4, etc_1.VcChannelList()];
            case 1:
                if (!(_a.sent()).some(function (c) { return c === (channel === null || channel === void 0 ? void 0 : channel.name); }))
                    return [2];
                if (command.charAt(0) !== '/')
                    return [2];
                return [4, spreadsheet.GetWhiteList()];
            case 2:
                list = _a.sent();
                cmd = command.slice(1).split('.')[0];
                if (list.find(function (l) { return l === cmd; }))
                    return [2];
                msg.reply('そんなコマンドないんだけど！');
                return [2, 'missing command'];
        }
    });
}); };
