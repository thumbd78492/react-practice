import * as E from 'fp-ts/Either';
import * as EM from './errorMessage';
export type FastifyConfig = {
    host: string;
    port: number;
    logLevel: string;
};
export type FastifyConfigEnv = {
    host?: string;
    port?: string;
    logLevel?: string;
};
export type KeycloakConfig = {
    appOrigin: string;
    keycloakSubdomain: string;
    clientId: string;
    clientSecret: string;
};
export type KeycloakConfigEnv = Partial<KeycloakConfig>;
export type AppConfig = {
    fastifyConfig: FastifyConfig;
    keycloakConfig: KeycloakConfig;
};
export type AppConfigEnv = {
    fastifyConfig: FastifyConfigEnv;
    keycloakConfig: KeycloakConfigEnv;
};
export declare const fastifyConfigOf: (fastifyConfigEnv: FastifyConfigEnv) => E.Either<EM.ErrorMessage, FastifyConfig>;
export declare const keycloakConfigOf: (keycloakConfigEnv: KeycloakConfigEnv) => E.Either<EM.ErrorMessage, KeycloakConfig>;
export declare const appConfigOf: (appConfigEnv: AppConfigEnv) => E.Either<EM.ErrorMessage, AppConfig>;
