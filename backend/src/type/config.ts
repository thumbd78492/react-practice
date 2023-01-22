import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as EM from './errorMessage'
import { pipe, flow, identity } from 'fp-ts/lib/function'
import { errorMessageAddFront } from './errorMessage'

export type FastifyConfig = {
  host: string
  port: number
  logLevel: string
}

export type FastifyConfigEnv = {
  host?: string
  port?: string
  logLevel?: string
}

export type KeycloakConfig = {
  appOrigin: string
  keycloakSubdomain: string
  clientId: string
  clientSecret: string
}

export type KeycloakConfigEnv = Partial<KeycloakConfig>

export type AppConfig = {
  fastifyConfig: FastifyConfig
  keycloakConfig: KeycloakConfig
}

export type AppConfigEnv = {
  fastifyConfig: FastifyConfigEnv
  keycloakConfig: KeycloakConfigEnv
}

export const fastifyConfigOf: (fastifyConfigEnv: FastifyConfigEnv) => E.Either<EM.ErrorMessage, FastifyConfig> = (fastifyConfigEnv) =>
  pipe(
    E.Do,
    EM.eApS('host', E.fromNullable(EM.errorMessageOf(`FASTIFY_HOST not found.`))(fastifyConfigEnv.host)),
    EM.eApS(
      'port',
      pipe(
        fastifyConfigEnv.port,
        E.fromNullable(EM.errorMessageOf(`FASTIFY_PORT not found.`)),
        E.chain(
          E.fromPredicate(
            (p) => Number.isInteger(Number(p)) && Number(p) > 0,
            (p) => EM.errorMessageOf(`FASTIFY_PORT is not a port: ${p}.`)
          )
        ),
        E.map(parseInt)
      )
    ),
    EM.eApS(
      'logLevel',
      pipe(
        fastifyConfigEnv.logLevel,
        O.fromNullable,
        O.match(() => 'debug', identity),
        E.right
      )
    )
  )

export const keycloakConfigOf: (keycloakConfigEnv: KeycloakConfigEnv) => E.Either<EM.ErrorMessage, KeycloakConfig> = (
  keycloakConfigEnv
) =>
  pipe(
    E.Do,
    EM.eApS('appOrigin', E.fromNullable(EM.errorMessageOf(`KEYCLOAK_APP_ORIGIN not found.`))(keycloakConfigEnv.appOrigin)),
    EM.eApS('clientId', E.fromNullable(EM.errorMessageOf(`KEYCLOAK_CLIENT_ID not found.`))(keycloakConfigEnv.clientId)),
    EM.eApS('clientSecret', E.fromNullable(EM.errorMessageOf(`KEYCLOAK_CLIENT_SECRET not found.`))(keycloakConfigEnv.clientSecret)),
    EM.eApS(
      'keycloakSubdomain',
      E.fromNullable(EM.errorMessageOf(`KEYCLOAK_SUBDOMAIN not found.`))(keycloakConfigEnv.keycloakSubdomain)
    )
  )

export const appConfigOf: (appConfigEnv: AppConfigEnv) => E.Either<EM.ErrorMessage, AppConfig> = (appConfigEnv) =>
  pipe(
    E.Do,
    EM.eApS('fastifyConfig', E.mapLeft(errorMessageAddFront(`'fastifyConfig' error:\n`))(fastifyConfigOf(appConfigEnv.fastifyConfig))),
    EM.eApS(
      'keycloakConfig',
      E.mapLeft(errorMessageAddFront(`'keycloakConfig' error:\n`))(keycloakConfigOf(appConfigEnv.keycloakConfig))
    )
  )
