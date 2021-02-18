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
exports.__esModule = true;
var const_settings_1 = __importDefault(require("const-settings"));
exports.VoiceStateUpdate = function (oldState, newState, client) {
    if ([const_settings_1["default"].SALMONELLA_ID, const_settings_1["default"].BEROBA_ID].every(function (id) { return id !== oldState.guild.id; }))
        return;
    sendVCLog(oldState, newState, client);
    if (newState.channel)
        newStateChannel(newState.channel);
    if (oldState.channel)
        oldStateChannel(oldState.channel, client);
};
var sendVCLog = function (oldState, newState, client) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (oldState.guild.id !== const_settings_1["default"].SALMONELLA_ID)
        return;
    var channel = client.channels.cache.get(const_settings_1["default"].VC_LOG_CHANNEL);
    if (((_a = oldState.channel) === null || _a === void 0 ? void 0 : _a.id) === ((_b = newState.channel) === null || _b === void 0 ? void 0 : _b.id)) {
        if (!((_c = oldState.member) === null || _c === void 0 ? void 0 : _c.user.bot)) {
            var msg = streamingSndMute(oldState.member);
            if (!msg)
                return;
            channel.send(msg), console.log(msg);
            return;
        }
    }
    var name = getUserName(oldState.member);
    if (newState.channel) {
        (_d = newState.member) === null || _d === void 0 ? void 0 : _d.roles.remove(const_settings_1["default"].STREAMING_ROLE);
        (_e = newState.member) === null || _e === void 0 ? void 0 : _e.roles.remove(const_settings_1["default"].VIDEO_ROLE);
        if ((_f = newState.member) === null || _f === void 0 ? void 0 : _f.voice.deaf)
            (_g = newState.member) === null || _g === void 0 ? void 0 : _g.roles.add(const_settings_1["default"].DEAF_ROLE);
        var msg = name + " \u304C " + newState.channel.name + " \u306B\u5165\u5BA4\u3057\u307E\u3057\u305F";
        channel.send(msg), console.log(msg);
    }
    if (oldState.channel) {
        (_h = oldState.member) === null || _h === void 0 ? void 0 : _h.roles.remove(const_settings_1["default"].STREAMING_ROLE);
        (_j = oldState.member) === null || _j === void 0 ? void 0 : _j.roles.remove(const_settings_1["default"].VIDEO_ROLE);
        (_k = oldState.member) === null || _k === void 0 ? void 0 : _k.roles.remove(const_settings_1["default"].DEAF_ROLE);
        var msg = name + " \u304C " + oldState.channel.name + " \u304B\u3089\u9000\u51FA\u3057\u307E\u3057\u305F";
        channel.send(msg), console.log(msg);
    }
};
var streamingSndMute = function (member) {
    var name = getUserName(member);
    var streamRole = getIsRole(const_settings_1["default"].STREAMING_ROLE, member);
    var videoRole = getIsRole(const_settings_1["default"].VIDEO_ROLE, member);
    var deafRole = getIsRole(const_settings_1["default"].DEAF_ROLE, member);
    var streamFlag = member === null || member === void 0 ? void 0 : member.voice.streaming;
    var videoFlag = member === null || member === void 0 ? void 0 : member.voice.selfVideo;
    var deafFlag = member === null || member === void 0 ? void 0 : member.voice.deaf;
    var streamStart = function () {
        member === null || member === void 0 ? void 0 : member.roles.add(const_settings_1["default"].STREAMING_ROLE);
        return name + " \u304C\u753B\u9762\u5171\u6709\u3092\u958B\u59CB\u3057\u307E\u3057\u305F";
    };
    var streamEnd = function () {
        member === null || member === void 0 ? void 0 : member.roles.remove(const_settings_1["default"].STREAMING_ROLE);
        return name + " \u304C\u753B\u9762\u5171\u6709\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F";
    };
    var videoOn = function () {
        member === null || member === void 0 ? void 0 : member.roles.add(const_settings_1["default"].VIDEO_ROLE);
        return name + " \u304C\u30AB\u30E1\u30E9\u3092\u30AA\u30F3\u306B\u3057\u307E\u3057\u305F";
    };
    var videoOff = function () {
        member === null || member === void 0 ? void 0 : member.roles.remove(const_settings_1["default"].VIDEO_ROLE);
        return name + " \u304C\u30AB\u30E1\u30E9\u3092\u30AA\u30D5\u306B\u3057\u307E\u3057\u305F";
    };
    var mute = function () {
        if (deafRole) {
            if (deafFlag) {
                return name + " \u304C\u30DE\u30A4\u30AF\u30DF\u30E5\u30FC\u30C8" + ((member === null || member === void 0 ? void 0 : member.voice.mute) ? '' : 'を解除') + "\u3057\u307E\u3057\u305F";
            }
            else {
                member === null || member === void 0 ? void 0 : member.roles.remove(const_settings_1["default"].DEAF_ROLE);
                return name + " \u304C\u30B9\u30D4\u30FC\u30AB\u30FC\u30DF\u30E5\u30FC\u30C8\u3092\u89E3\u9664\u3057\u307E\u3057\u305F";
            }
        }
        else {
            if (deafFlag) {
                member === null || member === void 0 ? void 0 : member.roles.add(const_settings_1["default"].DEAF_ROLE);
                return name + " \u304C\u30B9\u30D4\u30FC\u30AB\u30FC\u30DF\u30E5\u30FC\u30C8\u3057\u307E\u3057\u305F";
            }
            else {
                return name + " \u304C\u30DE\u30A4\u30AF\u30DF\u30E5\u30FC\u30C8" + ((member === null || member === void 0 ? void 0 : member.voice.mute) ? '' : 'を解除') + "\u3057\u307E\u3057\u305F";
            }
        }
    };
    var none = '';
    if (streamRole && videoRole) {
        return (streamFlag && videoFlag ? mute() :
            !streamFlag && videoFlag ? streamEnd() :
                streamFlag && !videoFlag ? videoOff() :
                    !streamFlag && !videoFlag ? none :
                        none);
    }
    else if (!streamRole && videoRole) {
        return (streamFlag && videoFlag ? streamStart() :
            !streamFlag && videoFlag ? mute() :
                streamFlag && !videoFlag ? none :
                    !streamFlag && !videoFlag ? videoOff() :
                        none);
    }
    else if (streamRole && !videoRole) {
        return (streamFlag && videoFlag ? videoOn() :
            !streamFlag && videoFlag ? none :
                streamFlag && !videoFlag ? mute() :
                    !streamFlag && !videoFlag ? streamEnd() :
                        none);
    }
    else if (!streamRole && !videoRole) {
        return (streamFlag && videoFlag ? none :
            !streamFlag && videoFlag ? videoOn() :
                streamFlag && !videoFlag ? streamStart() :
                    !streamFlag && !videoFlag ? mute() :
                        none);
    }
    else {
        return none;
    }
};
var oldStateChannel = function (channel, client) { return __awaiter(void 0, void 0, void 0, function () {
    var exitFromVC, users;
    return __generator(this, function (_a) {
        exitFromVC = function () { var _a, _b; return (_b = (_a = client.voice) === null || _a === void 0 ? void 0 : _a.connections.map(function (v) { return v; }).filter(function (v) { return v.channel === channel; })[0]) === null || _b === void 0 ? void 0 : _b.disconnect(); };
        users = channel.members.map(function (m) { return m.user; });
        if (users.every(function (u) { return u.bot; }))
            exitFromVC();
        if (users.map(function (u) { return u.username; }).toString() === 'キャル')
            exitFromVC();
        return [2];
    });
}); };
var newStateChannel = function (channel) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (const_settings_1["default"].AFK_CHANNEL.some(function (c) { return c === channel.name; }))
                    return [2];
                users = channel.members.map(function (m) { return m.user; });
                if (users.every(function (u) { return u.bot; }))
                    return [2];
                return [4, channel.join()];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
var getUserName = function (m) { return ((m === null || m === void 0 ? void 0 : m.nickname) ? m === null || m === void 0 ? void 0 : m.nickname : (m === null || m === void 0 ? void 0 : m.user.username) || ''); };
var getIsRole = function (id, m) { return m === null || m === void 0 ? void 0 : m.roles.cache.some(function (r) { return r.id === id; }); };
