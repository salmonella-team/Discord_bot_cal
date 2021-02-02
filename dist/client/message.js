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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
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
var moji_1 = __importDefault(require("moji"));
var axios_1 = __importDefault(require("axios"));
var google_tts_api_1 = require("google-tts-api");
var throw_env_1 = __importDefault(require("throw-env"));
var const_settings_1 = __importDefault(require("const-settings"));
var cal = __importStar(require("../message/cal"));
var speak = __importStar(require("../message/speak"));
var spreadsheet = __importStar(require("../message/spreadsheet"));
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
                return [4, removeMessage(msg)];
            case 1:
                comment = _b.sent();
                if (comment)
                    return [2, console.log(comment)];
                command = msg.content.replace(/ |\.|,|:|=/, '.');
                comment = calCommands(command, msg, client);
                if (comment)
                    return [2, console.log(comment)];
                comment = speakCommands(command, msg);
                if (comment)
                    return [2, console.log(comment)];
                return [4, notExistCommands(command, msg)];
            case 2:
                comment = _b.sent();
                if (comment)
                    return [2, console.log(comment)];
                return [4, readAloud(msg, client)];
            case 3:
                comment = _b.sent();
                if (comment)
                    return [2, console.log(comment)];
                return [2];
        }
    });
}); };
var calCommands = function (command, msg, client) {
    var channel = msg.channel;
    if (!const_settings_1["default"].COMMAND_CHANNEL.some(function (c) { return c === (channel === null || channel === void 0 ? void 0 : channel.name); }))
        return;
    switch (command.split(' ')[0]) {
        case '/cal':
        case '/cal.status':
            cal.ShowStatus(msg, client.voice, status);
            return 'cal show status';
        case '/cal.in':
        case '/cal.join':
        case '/cal.connect':
            cal.JoinChannel(msg, client.voice);
            return 'cal join channel';
        case '/cal.out':
        case '/cal.discon':
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
        case '/cal.mode':
            status.Mode = cal.SwitchMode(msg, status.Mode);
            return 'switch devMode';
    }
    switch (true) {
        case /bpm/.test(command): {
            var _a = __read(command.replace('.', ' ').split(' ').map(Number), 4), former = _a[1], ahead = _a[2], bpm = _a[3];
            msg.channel.send((former / ahead) * bpm);
            return 'bpm calc';
        }
    }
};
var speakCommands = function (command, msg) {
    var channel = msg.channel;
    if (!const_settings_1["default"].COMMAND_CHANNEL.some(function (c) { return c === (channel === null || channel === void 0 ? void 0 : channel.name); }))
        return;
    var value = (function () {
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
            case 'おはなし<.reichan:778714208954220586>':
            case 'お話し<.reichan:778714208954220586>':
            case 'お話<.reichan:778714208954220586>':
            case 'おはなし.<:reichan:778714208954220586>':
            case 'お話し.<:reichan:778714208954220586>':
            case 'お話.<:reichan:778714208954220586>':
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
        return;
    speak.Play(msg, value.url, status.Volume, value.text);
    return value.comment;
};
var notExistCommands = function (command, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, list, cmd;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                channel = msg.channel;
                if (!const_settings_1["default"].COMMAND_CHANNEL.some(function (c) { return c === (channel === null || channel === void 0 ? void 0 : channel.name); }))
                    return [2];
                if (command.charAt(0) !== '/')
                    return [2];
                return [4, spreadsheet.GetWhiteList()];
            case 1:
                list = _a.sent();
                cmd = command.slice(1).split('.')[0];
                if (list.find(function (l) { return l === cmd; }))
                    return [2];
                msg.reply('そんなコマンドないんだけど！');
                return [2, 'missing command'];
        }
    });
}); };
var removeMessage = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var roles, _a, match, msgList_1, n;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                roles = (_b = msg.member) === null || _b === void 0 ? void 0 : _b.roles.cache.map(function (r) { return r.name; });
                if (!const_settings_1["default"].REMOTE_YABAI.some(function (r) { return roles === null || roles === void 0 ? void 0 : roles.find(function (v) { return v === r; }); }))
                    return [2, ''];
                _a = true;
                switch (_a) {
                    case /rm/.test(msg.content): return [3, 1];
                }
                return [3, 3];
            case 1:
                match = msg.content.replace(/・/g, '/').match(/\//);
                if (!match)
                    return [2, ''];
                return [4, msg.channel.messages.fetch()];
            case 2:
                msgList_1 = (_c.sent()).map(function (v) { return v; });
                n = (function (arg) { return (/\d/.test(arg) ? Number(arg) : 1); })(msg.content.replace('/rm ', ''));
                __spread(Array(n + 1)).forEach(function (_, i) { return setTimeout(function () { return msgList_1[i]["delete"](); }, 100); });
                return [2, 'delete message'];
            case 3:
                {
                    return [2, ''];
                }
                _c.label = 4;
            case 4: return [2];
        }
    });
}); };
var readAloud = function (msg, client) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, vc, lang, content, options, res, url, connect;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (msg.author.bot)
                    return [2];
                channel = msg.channel;
                if (!const_settings_1["default"].READ_ALOUD_CHANNEL.some(function (c) { return c === (channel === null || channel === void 0 ? void 0 : channel.name); }))
                    return [2];
                vc = client.voice.connections.map(function (v) { return v; }).filter(function (v) { var _a; return v.channel.guild.id === ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id); });
                if (!vc.length)
                    return [2];
                if (/\`\`\`/.test(msg.content))
                    return [2];
                lang = /^en/.test(msg.content.replace('おはなし', '').trim()) ? 'en-US' : 'ja-JP';
                content = aloudFormat(msg.content);
                if (!content)
                    return [2];
                options = {
                    method: 'post',
                    url: const_settings_1["default"].API_URL.HIRAGANA,
                    headers: { 'Content-Type': 'application/json' },
                    data: {
                        app_id: throw_env_1["default"]('HIRAGANA_APIKEY'),
                        sentence: content,
                        output_type: 'katakana'
                    }
                };
                return [4, axios_1["default"](options)
                        .then(function (r) { return r.data; })["catch"](function (e) { return console.log(e); })];
            case 1:
                res = _c.sent();
                url = google_tts_api_1.getAudioUrl(res.converted.slice(0, 200), {
                    lang: lang,
                    slow: false,
                    host: const_settings_1["default"].API_URL.GTTS
                });
                return [4, ((_b = (_a = vc[0].voice) === null || _a === void 0 ? void 0 : _a.channel) === null || _b === void 0 ? void 0 : _b.join())];
            case 2:
                connect = _c.sent();
                connect === null || connect === void 0 ? void 0 : connect.play(url, { volume: 0.5 });
                return [2, "speak " + (lang === 'en-US' ? 'en ' : '') + content];
        }
    });
}); };
var aloudFormat = function (content) {
    var replaceWara = function (str) {
        var flag = false;
        return str
            .split('')
            .reverse()
            .map(function (s) {
            if (flag)
                return s;
            if (!/w/i.test(s)) {
                flag = true;
                return s;
            }
            else {
                return 'ワラ';
            }
        })
            .reverse()
            .join('');
    };
    var separat = {
        char: ['>', '<'],
        count: 0,
        call: function () { return separat.char[separat.count ? separat.count-- : separat.count++]; }
    };
    var counter = {
        count: 0,
        call: function () { return (counter.count = counter.count === 2 ? 0 : counter.count + 1); }
    };
    var emojiTrim = function (c, i, str) {
        if (counter.count) {
            return c === ':' ? (counter.call(), separat.call()) : c;
        }
        else {
            if (c === '<' && str[i + 1] === ':')
                counter.call();
            return c;
        }
    };
    return moji_1["default"](content)
        .convert('HK', 'ZK')
        .toString()
        .replace(/おはなし|お話し|お話/, '')
        .trim()
        .replace(/^en/, '')
        .trim()
        .replace(/https?:\/\/\S+/g, '')
        .split('\n')
        .map(replaceWara)
        .join('')
        .split('')
        .map(emojiTrim)
        .join('')
        .replace(/<[^<>]*>/g, '')
        .slice(0, 200);
};
