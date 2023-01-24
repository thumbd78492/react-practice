import fastify, { FastifyInstance } from 'fastify'
import keycloak, { KeycloakOptions } from 'fastify-keycloak-adapter'
import * as t from 'io-ts'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import * as EM from './type/errorMessage'
import { ServerError, internalServiceErrorOf, serverListenErrorOf } from './type/error'
import { AppConfig, FastifyConfig } from './type/config'
import { identity, pipe } from 'fp-ts/lib/function'
import { UserRouter } from './route/user'
import session from '@fastify/session'
import * as minio from 'minio'

const serverListen: (server: FastifyInstance) => (fastifyConfig: FastifyConfig) => TE.TaskEither<EM.ErrorMessage, FastifyInstance> =
  (server) => (fastifyConfig) =>
    pipe(
      TE.tryCatch(
        () => server.listen(fastifyConfig),
        (e) => EM.errorMessageOf(`${e}`)
      ),
      TE.map((_) => server)
    )

const startServer: (appConfig: AppConfig) => TE.TaskEither<ServerError, FastifyInstance> = (appConfig) => {
  const server: FastifyInstance = fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
      },
      level: appConfig.fastifyConfig.logLevel,
    },
  })

  console.debug('appConfig:', appConfig)

  server.get('/ping', async (request, reply) => {
    return reply.status(200).send({
      message: 'pong',
    })
  })

  server.register(keycloak, { ...appConfig.keycloakConfig } satisfies KeycloakOptions)
  server.register(UserRouter, { prefix: 'api/v1' })

  return pipe(appConfig.fastifyConfig, serverListen(server), TE.mapLeft(serverListenErrorOf))
}

export { startServer }
