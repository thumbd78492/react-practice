import * as N from 'newtype-ts';
import * as Semi from 'fp-ts/Semigroup';
import * as E from 'fp-ts/Either';
export type ErrorMessage = N.Newtype<{
    readonly ErrorMessage: unique symbol;
}, string>;
export declare const errorMessageOf: (msg: string) => ErrorMessage;
export declare const errorMessageFrom: (msg: ErrorMessage) => string;
export declare const semiErrorMessage: Semi.Semigroup<ErrorMessage>;
export declare const errorMessageAddFront: (msg: string) => (em: ErrorMessage) => ErrorMessage;
export declare const eApV: import("fp-ts/lib/Applicative").Applicative2C<"Either", ErrorMessage>;
export declare const eApS: <N extends string, A, B>(name: Exclude<N, keyof A>, fb: E.Either<ErrorMessage, B>) => (fa: E.Either<ErrorMessage, A>) => E.Either<ErrorMessage, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B; }>;
