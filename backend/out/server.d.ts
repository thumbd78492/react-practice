import { FastifyInstance } from 'fastify';
import * as TE from 'fp-ts/TaskEither';
import { ServerError } from './type/error';
import { AppConfig } from './type/config';
declare const startServer: (appConfig: AppConfig) => TE.TaskEither<ServerError, FastifyInstance>;
export { startServer };
