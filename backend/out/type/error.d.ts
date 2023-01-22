import { ErrorMessage } from './errorMessage';
export type ServerError = ServerListenError;
export type EnvironmentSettingError = {
    _tag: 'EnvironmentSettingError';
    msg: ErrorMessage;
};
export declare const environmentSettingErrorOf: (msg: ErrorMessage) => EnvironmentSettingError;
export type ServerListenError = {
    _tag: 'ServerListenError';
    msg: ErrorMessage;
};
export declare const serverListenErrorOf: (msg: ErrorMessage) => ServerListenError;
