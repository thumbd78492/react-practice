import { ErrorMessage } from './errorMessage'

export type ServerError = ServerListenError

export type EnvironmentSettingError = {
  _tag: 'EnvironmentSettingError'
  msg: ErrorMessage
}

export const environmentSettingErrorOf: (msg: ErrorMessage) => EnvironmentSettingError = (msg) => ({
  _tag: 'EnvironmentSettingError',
  msg,
})

export type ServerListenError = {
  _tag: 'ServerListenError'
  msg: ErrorMessage
}

export const serverListenErrorOf: (msg: ErrorMessage) => ServerListenError = (msg) => ({
  _tag: 'ServerListenError',
  msg,
})

export type InternalServiceError = {
  _tag: 'InternalServiceError'
  msg: ErrorMessage
}

export const internalServiceErrorOf: (msg: ErrorMessage) => InternalServiceError = (msg) => ({
  _tag: 'InternalServiceError',
  msg,
})
