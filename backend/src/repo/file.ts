import * as minio from 'minio'
import * as TE from 'fp-ts/TaskEither'
import * as AsyncStream from 'fp-ts-stream/AsyncStream'
import * as EM from '../type/errorMessage'
import { MultipartFile } from '@fastify/multipart'
import { pipe } from 'fp-ts/lib/function'
import { UploadFile } from '../type/file'
import { MinioConfig } from '../type/config'
import { MinioError, minioErrorOf } from '../type/error'

type MinioInstance = {
  client: minio.Client
  bucketName: string
}
let minioInstance: MinioInstance

export const initMinio: (minioConfig: MinioConfig) => MinioInstance = (minioConfig) => {
  const client = new minio.Client(minioConfig.clientConfig)
  const bucketName = minioConfig.otherConfig.bucketName
  minioInstance = {
    client,
    bucketName,
  }

  return minioInstance
}

const getInstance: () => TE.TaskEither<EM.ErrorMessage, MinioInstance> = () =>
  pipe(
    minioInstance,
    TE.fromNullable(EM.errorMessageOf(`minio instance has not been initialized. please initMinio(MinioConfig) first`))
  )

export const uploadFile: (file: MultipartFile) => (fileId: string) => TE.TaskEither<MinioError, minio.UploadedObjectInfo> =
  (file) => (fileId) =>
    pipe(
      TE.Do,
      TE.bind('instance', () => getInstance()),
      TE.bind('fileBuffer', () =>
        TE.tryCatch(
          () => file.toBuffer(),
          (e) => EM.errorMessageOf(`minio putObject error when file.toBuffer(): ${e}`)
        )
      ),
      TE.chain(({ instance, fileBuffer }) =>
        TE.tryCatch(
          () => instance.client.putObject(instance.bucketName, fileId, fileBuffer),
          (e) => EM.errorMessageOf(`minio putObject error: ${e}`)
        )
      ),
      TE.mapLeft(minioErrorOf)
    )
