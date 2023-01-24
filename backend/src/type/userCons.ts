import * as E from 'fp-ts/Either'
import { UnauthorizedUser, UserInfo, AuthorizedUser, ALL_AUTHORIZED_ACCOUNT_TUPLE } from './user'
import { identity, pipe } from 'fp-ts/function'

export const userOf: (userInfo: UserInfo) => E.Either<UnauthorizedUser, AuthorizedUser> = (userInfo) =>
  pipe(
    userInfo,
    E.fromPredicate((user) => user.account in ALL_AUTHORIZED_ACCOUNT_TUPLE, identity),
    E.mapLeft((unauth) => ({ ...unauth, _tag: 'Unauthorized' as const })),
    E.map((auth) => ({ ...auth, _tag: 'Authorized' as const }))
  )
