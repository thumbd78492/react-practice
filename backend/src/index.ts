import { startServer } from './server'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { AppConfigEnv, appConfigOf } from './type/config'
import { pipe } from 'fp-ts/lib/function'
import { environmentSettingErrorOf } from './type/error'
import { errorMessageFrom } from './type/errorMessage'
import * as T from 'fp-ts-std/Task'

require('dotenv').config()

const appConfig: AppConfigEnv = {
  fastifyConfig: {
    host: process.env.FASTIFY_HOST,
    port: process.env.FASTIFY_PORT,
    logLevel: process.env.FASTIFY_LOG_LEVEL,
  },
  keycloakConfig: {
    appOrigin: process.env.KEYCLOAK_APP_ORIGIN,
    keycloakSubdomain: process.env.KEYCLOAK_SUBDOMAIN,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
  },
  minioConfig: {
    clientConfig: {
      endPoint: process.env.MINIO_END_POINT,
      port: process.env.MINIO_PORT,
      useSSL: process.env.MINIO_USESSL,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    },
    otherConfig: {
      bucketName: process.env.MINIO_BUCKET_NAME,
    },
  },
}

pipe(
  appConfig,
  appConfigOf,
  E.mapLeft(environmentSettingErrorOf),
  TE.fromEither,
  TE.chainW(startServer),
  TE.match(
    (err) => console.log(`Start server failed, ${err._tag}:\n${errorMessageFrom(err.msg)}`),
    (sv) => console.log(`Start server successfully! Server is listening at ${JSON.stringify(sv.server.address())}`)
  ),
  T.execute
)
