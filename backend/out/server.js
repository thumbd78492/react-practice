"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const fastify_1 = require("fastify");
const TE = require("fp-ts/TaskEither");
const EM = require("./type/errorMessage");
const error_1 = require("./type/error");
const function_1 = require("fp-ts/lib/function");
const serverListen = (server) => (fastifyConfig) => (0, function_1.pipe)(TE.tryCatch(() => server.listen(fastifyConfig), (em) => EM.errorMessageOf(`server listen error: ${em}`)), TE.map((_) => server));
const startServer = (appConfig) => {
    const server = (0, fastify_1.default)({
        logger: {
            transport: {
                target: 'pino-pretty',
            },
            level: appConfig.fastifyConfig.logLevel,
        },
    });
    server.get('/ping', async (request, reply) => {
        return reply.status(200).send({
            message: 'pong',
        });
    });
    return (0, function_1.pipe)(appConfig.fastifyConfig, serverListen(server), TE.mapLeft(error_1.serverListenErrorOf));
};
exports.startServer = startServer;
