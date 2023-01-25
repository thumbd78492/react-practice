import * as minio from 'minio'
import * as T from 'fp-ts/Task'
import * as A from 'fp-ts/Array'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as IO from 'fp-ts/IO'
import * as Date from 'fp-ts/Date'
import * as Random from 'fp-ts/Random'
import * as repo from '../repo/file'
import { MinioError } from '../type/error'
import * as AsyncStream from 'fp-ts-stream/AsyncStream'
import { MultipartFile } from '@fastify/multipart'
import { identity, pipe } from 'fp-ts/lib/function'
import { UploadFile } from '../type/file'
import { AuthorizedUser } from '../type/user'

export const uploadFile: (user: AuthorizedUser) => (file: MultipartFile) => TE.TaskEither<MinioError, UploadFile> = (user) => (file) =>
  pipe(
    IO.Do,
    IO.apS('currDate', Date.create),
    IO.apS('rnd', Random.randomInt(0, 65535)),
    IO.bind('fileId', ({ currDate, rnd }) => IO.of(currDate.getTime().toString(16).padStart(16) + rnd.toString(16).padStart(16))),
    TE.fromIO,
    TE.bindW('uploadedFile', ({ fileId }) => repo.uploadFile(file)(fileId)),
    TE.map((obj) => ({
      fileName: file.filename,
      uploader: user.name,
      uploaderAccount: user.account,
      uploadTime: obj.currDate.toLocaleString('zh'),
      fileId: obj.fileId,
    }))
  )

export const uploadFiles: (
  user: AuthorizedUser
) => (files: AsyncStream.AsyncStream<MultipartFile>) => TE.TaskEither<MinioError, Array<UploadFile>> = (user) => (files) =>
  pipe(
    files,
    AsyncStream.chain((file) => AsyncStream.fromTask(uploadFile(user)(file))),
    AsyncStream.toTask,
    T.map(A.traverse(E.Applicative)(identity))
  )
