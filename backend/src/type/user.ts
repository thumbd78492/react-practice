import * as t from 'io-ts'

export const ALL_AUTHORIZED_ACCOUNT_TUPLE = ['thumbd78492@gmail.com', 'thumbd53311@gmail.com'] as const
export type AuthorizedAccount = typeof ALL_AUTHORIZED_ACCOUNT_TUPLE[number]

const ALL_USER_TUPLE = ['AuthorizedUser', 'UnauthorizedUser'] as const
export type User = typeof ALL_USER_TUPLE[number]

export const UserCodec = t.type({ account: t.string, name: t.string })
export type UserInfo = t.TypeOf<typeof UserCodec>

export type AuthorizedUser = {
  _tag: 'Authorized'
} & UserInfo

export type UnauthorizedUser = {
  _tag: 'Unauthorized'
} & UserInfo
