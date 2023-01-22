import * as N from 'newtype-ts'
import * as Semi from 'fp-ts/Semigroup'
import * as Apply from 'fp-ts/Apply'
import * as S from 'fp-ts/string'
import * as E from 'fp-ts/Either'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { pipe } from 'fp-ts/lib/function'

export type ErrorMessage = N.Newtype<{ readonly ErrorMessage: unique symbol }, string>

export const errorMessageOf: (msg: string) => ErrorMessage = N.iso<ErrorMessage>().wrap

export const errorMessageFrom: (msg: ErrorMessage) => string = N.iso<ErrorMessage>().unwrap

export const semiErrorMessage: Semi.Semigroup<ErrorMessage> = {
  concat: (msg1, msg2) => errorMessageOf(errorMessageFrom(msg1) + '\n' + errorMessageFrom(msg2)),
}

export const errorMessageAddFront: (msg: string) => (em: ErrorMessage) => ErrorMessage = (msg) => (em) =>
  pipe(
    em,
    errorMessageFrom,
    (oldMsg) => msg + oldMsg + '\n',
    S.split('\n'),
    (x) => x.join('\n\t'),
    errorMessageOf
  )

export const eApV = E.getApplicativeValidation(semiErrorMessage)
export const eApS = Apply.apS(eApV)
