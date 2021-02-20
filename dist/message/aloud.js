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
var etc_1 = require("../config/etc");
var fs = __importStar(require("fs"));
var Stream = false;
var Queue = [];
var Dispatcher;
exports.Read = function (msg, client) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, vc, lang, content, options, res, url;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (msg.author.bot)
                    return [2];
                channel = msg.channel;
                return [4, etc_1.VcChannelList()];
            case 1:
                if (!(_d.sent()).some(function (c) { return c === (channel === null || channel === void 0 ? void 0 : channel.name); }))
                    return [2];
                if (/[Ａ-Ｚ]+|[ａ-ｚ]+|[０-９]+|　/.test(msg.content)) {
                    if (((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id) === const_settings_1["default"].BEROBA_ID) {
                        (_b = msg.member) === null || _b === void 0 ? void 0 : _b.roles.add(const_settings_1["default"].CHINA_ROLE);
                    }
                    msg.content = "cn " + msg.content
                        .replace(/^(おはなし|お話し|お話)/, '')
                        .trim()
                        .replace(/^(en|us|zh|cn|es|ru|de|it|vi|vn|gb|ja|jp)/i, '')
                        .trim();
                }
                vc = (_c = client.voice) === null || _c === void 0 ? void 0 : _c.connections.map(function (v) { return v; }).filter(function (v) { var _a; return v.channel.guild.id === ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id); });
                if (!(vc === null || vc === void 0 ? void 0 : vc.length))
                    return [2];
                if (!(msg.content === '/skip')) return [3, 4];
                Dispatcher === null || Dispatcher === void 0 ? void 0 : Dispatcher.destroy();
                if (!(Queue.length > 0)) return [3, 3];
                return [4, exports.Play(Queue.shift(), vc[0])];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3:
                Stream = false;
                console.log('skip');
                return [2];
            case 4:
                if (/\`\`\`/.test(msg.content))
                    return [2];
                lang = (function (str) {
                    switch (true) {
                        case /^(en|us)/i.test(str):
                            return 'en-US';
                        case /^(zh|cn)/i.test(str):
                            return 'zh-CN';
                        case /^es/i.test(str):
                            return 'es-ES';
                        case /^ru/i.test(str):
                            return 'ru-RU';
                        case /^de/i.test(str):
                            return 'de-DE';
                        case /^it/i.test(str):
                            return 'it-IT';
                        case /^(vi|vn)/i.test(str):
                            return 'vi-VN';
                        case /^gb/i.test(str):
                            return 'en-GB';
                        case /^(ja|jp)/i.test(str):
                        default:
                            return 'ja-JP';
                    }
                })(msg.content.replace(/^(おはなし|お話し|お話)/, '').trim());
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
            case 5:
                res = _d.sent();
                url = google_tts_api_1.getAudioUrl(res.converted.slice(0, 200), { lang: lang });
                exports.Add({ content: content, url: url, volume: 0.5 }, vc[0]);
                return [2];
        }
    });
}); };
exports.Add = function (item, vc) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                Queue.push(item);
                if (Stream === true)
                    return [2];
                return [4, exports.Play(Queue.shift(), vc)];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
exports.Play = function (item, vc) { return __awaiter(void 0, void 0, void 0, function () {
    var re, connect;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4, axios_1["default"].get((item === null || item === void 0 ? void 0 : item.url) || '', { responseType: 'arraybuffer' })];
            case 1:
                re = _c.sent();
                fs.writeFileSync("./tmp.mp3", Buffer.from(re.data), 'binary');
                return [4, ((_b = (_a = vc.voice) === null || _a === void 0 ? void 0 : _a.channel) === null || _b === void 0 ? void 0 : _b.join())];
            case 2:
                connect = _c.sent();
                Dispatcher = connect === null || connect === void 0 ? void 0 : connect.play(fs.createReadStream('./tmp.mp3'), { volume: item === null || item === void 0 ? void 0 : item.volume });
                Dispatcher === null || Dispatcher === void 0 ? void 0 : Dispatcher.on('start', function () {
                    Stream = true;
                    console.log("start: " + (item === null || item === void 0 ? void 0 : item.content));
                });
                Dispatcher === null || Dispatcher === void 0 ? void 0 : Dispatcher.on('finish', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(Queue.length > 0)) return [3, 2];
                                return [4, exports.Play(Queue.shift(), vc)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                Stream = false;
                                console.log("finish: " + (item === null || item === void 0 ? void 0 : item.content));
                                return [2];
                        }
                    });
                }); });
                return [2];
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
            if (!/w|ｗ|Ｗ/i.test(s)) {
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
        .replace(/^(おはなし|お話し|お話)/, '')
        .trim()
        .replace(/^(en|us|zh|cn|es|ru|de|it|vi|vn|gb|ja|jp)/i, '')
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
