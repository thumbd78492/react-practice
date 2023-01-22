"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverListenErrorOf = exports.environmentSettingErrorOf = void 0;
const environmentSettingErrorOf = (msg) => ({
    _tag: 'EnvironmentSettingError',
    msg,
});
exports.environmentSettingErrorOf = environmentSettingErrorOf;
const serverListenErrorOf = (msg) => ({
    _tag: 'ServerListenError',
    msg,
});
exports.serverListenErrorOf = serverListenErrorOf;
