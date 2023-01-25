import * as E from 'fp-ts/Either'
import * as EM from './errorMessage'
import { UnauthorizedUser, UserInfo, AuthorizedUser, ALL_AUTHORIZED_ACCOUNT_TUPLE, UserCodec } from './user'
import { identity, pipe, flow } from 'fp-ts/function'

export const userDecoder: (userInfo: unknown) => E.Either<EM.ErrorMessage, E.Either<UnauthorizedUser, AuthorizedUser>> = (userInfo) =>
  pipe(
    userInfo,
    UserCodec.decode,
    E.mapLeft((_) => EM.errorMessageOf(`user payload received from keycloak is invalid`)),
    E.map(
      flow(
        E.fromPredicate((user: UserInfo) => user.account in ALL_AUTHORIZED_ACCOUNT_TUPLE, identity),
        E.mapLeft((unauth) => ({ ...unauth, _tag: 'Unauthorized' as const })),
        E.map((auth) => ({ ...auth, _tag: 'Authorized' as const }))
      )
    )
  )
