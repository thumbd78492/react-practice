import fastify, { FastifyInstance } from 'fastify'
import keycloak, { KeycloakOptions } from 'fastify-keycloak-adapter'
import * as TE from 'fp-ts/TaskEither'
import * as EM from './type/errorMessage'
import { ServerError, serverListenErrorOf } from './type/error'
import { AppConfig, FastifyConfig } from './type/config'
import { pipe } from 'fp-ts/lib/function'

const serverListen: (server: FastifyInstance) => (fastifyConfig: FastifyConfig) => TE.TaskEither<EM.ErrorMessage, FastifyInstance> =
  (server) => (fastifyConfig) =>
    pipe(
      TE.tryCatch(
        () => server.listen(fastifyConfig),
        (em) => EM.errorMessageOf(`server listen error: ${em}`)
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

  server.get('/ping', async (request, reply) => {
    return reply.status(200).send({
      message: 'pong',
    })
  })

  return pipe(appConfig.fastifyConfig, serverListen(server), TE.mapLeft(serverListenErrorOf))
}

export { startServer }
