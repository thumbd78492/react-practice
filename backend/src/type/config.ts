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

type MinioClientConfig = {
  endPoint: string
  port: number
  useSSL: boolean
  accessKey: string
  secretKey: string
}
type MinioOtherConfig = {
  bucketName: string
}

export type MinioConfig = {
  clientConfig: MinioClientConfig
  otherConfig: MinioOtherConfig
}

type MinioClientConfigEnv = {
  endPoint?: string
  port?: string
  useSSL?: string
  accessKey?: string
  secretKey?: string
}
type MinioOtherConfigEnv = {
  bucketName?: string
}

export type MinioConfigEnv = {
  clientConfig: MinioClientConfigEnv
  otherConfig: MinioOtherConfigEnv
}

export type AppConfig = {
  fastifyConfig: FastifyConfig
  keycloakConfig: KeycloakConfig
  minioConfig: MinioConfig
}

export type AppConfigEnv = {
  fastifyConfig: FastifyConfigEnv
  keycloakConfig: KeycloakConfigEnv
  minioConfig: MinioConfigEnv
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

const minioClientConfigOf: (minioClientConfigEnv: MinioClientConfigEnv) => E.Either<EM.ErrorMessage, MinioClientConfig> = (
  minioClientConfigEnv
) =>
  pipe(
    E.Do,
    EM.eApS('endPoint', E.fromNullable(EM.errorMessageOf(`MINIO_END_POINT not found.`))(minioClientConfigEnv.endPoint)),
    EM.eApS(
      'port',
      pipe(
        minioClientConfigEnv.port,
        E.fromNullable(EM.errorMessageOf(`MINIO_PORT not found.`)),
        E.chain(
          E.fromPredicate(
            (p) => Number.isInteger(Number(p)) && Number(p) > 0,
            (p) => EM.errorMessageOf(`MINIO_PORT is not a port: ${p}.`)
          )
        ),
        E.map(parseInt)
      )
    ),
    EM.eApS(
      'useSSL',
      pipe(
        minioClientConfigEnv.useSSL,
        O.fromNullable,
        O.match(
          () => false,
          (useSSL) => (useSSL ? true : false)
        ),
        E.right
      )
    ),
    EM.eApS('accessKey', E.fromNullable(EM.errorMessageOf(`MINIO_ACCESS_KEY not found.`))(minioClientConfigEnv.accessKey)),
    EM.eApS('secretKey', E.fromNullable(EM.errorMessageOf(`MINIO_SECRET_KEY not found.`))(minioClientConfigEnv.secretKey))
  )

const minioOtherConfigOf: (minioOtherConfigEnv: MinioOtherConfigEnv) => E.Either<EM.ErrorMessage, MinioOtherConfig> = (
  minioOtherConfigEnv
) =>
  pipe(E.Do, EM.eApS('bucketName', E.fromNullable(EM.errorMessageOf(`MINIO_BUCKET_NAME not found.`))(minioOtherConfigEnv.bucketName)))

export const minioConfigOf: (minioConfigEnv: MinioConfigEnv) => E.Either<EM.ErrorMessage, MinioConfig> = (minioConfigEnv) =>
  pipe(
    E.Do,
    EM.eApS('clientConfig', minioClientConfigOf(minioConfigEnv.clientConfig)),
    EM.eApS('otherConfig', minioOtherConfigOf(minioConfigEnv.otherConfig))
  )

export const appConfigOf: (appConfigEnv: AppConfigEnv) => E.Either<EM.ErrorMessage, AppConfig> = (appConfigEnv) =>
  pipe(
    E.Do,
    EM.eApS('fastifyConfig', E.mapLeft(errorMessageAddFront(`'fastifyConfig' error:\n`))(fastifyConfigOf(appConfigEnv.fastifyConfig))),
    EM.eApS(
      'keycloakConfig',
      E.mapLeft(errorMessageAddFront(`'keycloakConfig' error:\n`))(keycloakConfigOf(appConfigEnv.keycloakConfig))
    ),
    EM.eApS('minioConfig', E.mapLeft(errorMessageAddFront(`'minioConfig' error:\n`))(minioConfigOf(appConfigEnv.minioConfig)))
  )
