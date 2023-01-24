import { FastifyInstance, RouteShorthandOptions, FastifyReply } from 'fastify'
import { identity, pipe } from 'fp-ts/lib/function'
import { UserCodec } from '../type/user'
import { userOf } from '../type/userCons'
import * as E from 'fp-ts/Either'
import * as EM from '../type/errorMessage'
import { internalServiceErrorOf } from '../type/error'

export const UserRouter = (server: FastifyInstance, opts: RouteShorthandOptions, done: (error?: Error) => void) => {
  server.get('/user', async (request, reply) =>
    pipe(
      request.session.user,
      UserCodec.decode,
      E.mapLeft((_) => EM.errorMessageOf(`user payload received from keycloak is invalid`)),
      E.mapLeft(internalServiceErrorOf),
      E.map(userOf),
      E.match(
        (e) => reply.status(500).send({ message: `${e._tag}: ${EM.errorMessageFrom(e.msg)}` }),
        E.match(
          (unauth) => reply.status(200).send({ user: unauth }),
          (auth) => reply.status(200).send({ user: auth })
        )
      )
    )
  )

  done()
}
