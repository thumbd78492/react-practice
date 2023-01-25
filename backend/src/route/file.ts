import { FastifyInstance, RouteShorthandOptions, FastifyReply } from 'fastify'
import { identity, pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import * as EM from '../type/errorMessage'
import * as TSP from 'ts-pattern'
import * as service from '../service/file'
import * as AsyncStream from 'fp-ts-stream/AsyncStream'
import { internalServiceErrorOf } from '../type/error'
import fastifyMultipart from '@fastify/multipart'
import { UserCodec } from '../type/user'
import { userDecoder } from '../type/userCons'

export const UserRouter = (server: FastifyInstance, opts: RouteShorthandOptions, done: (error?: Error) => void) => {
  server.post('/files', async (request, reply) =>
    pipe(
      request.session.user,
      userDecoder,
      E.chain(E.mapLeft((u) => EM.errorMessageOf(`user is not verified to upload files.\nname:${u.name}\naccount:${u.account}`))),
      E.mapLeft(internalServiceErrorOf),
      TE.fromEither,
      TE.chainW((authorizedUser) => pipe(request.files(), AsyncStream.fromAsyncIterable, service.uploadFiles(authorizedUser))),
      TE.match(
        (e) =>
          TSP.match(e)
            .with({ _tag: 'InternalServiceError' }, { _tag: 'MinioError' }, () => reply.status(500))
            .exhaustive()
            .send({ message: `${e._tag}: ${EM.errorMessageFrom(e.msg)}` }),
        (r) => reply.status(201).send({ files: r })
      )
    )
  )

  done()
}
