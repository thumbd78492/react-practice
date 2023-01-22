"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const E = require("fp-ts/Either");
const TE = require("fp-ts/TaskEither");
const config_1 = require("./type/config");
const function_1 = require("fp-ts/lib/function");
const error_1 = require("./type/error");
const errorMessage_1 = require("./type/errorMessage");
const T = require("fp-ts-std/Task");
const fs_1 = require("fs");
const PATH = require('path').join(__dirname, '..', '.env');
console.log('PATH', PATH);
require('dotenv').config({ path: PATH });
const file = (0, fs_1.readFile)(PATH, 'utf-8', (err, d) => console.log('file, ', d));
const appConfig = {
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
};
console.log(appConfig);
(0, function_1.pipe)(appConfig, config_1.appConfigOf, E.mapLeft(error_1.environmentSettingErrorOf), TE.fromEither, TE.chainW(server_1.startServer), TE.match((err) => console.log(`Start server failed, ${err._tag}:\n${(0, errorMessage_1.errorMessageFrom)(err.msg)}`), (sv) => console.log(`Start server successfully! Server is listening at ${sv.server.address}`)), T.execute);
