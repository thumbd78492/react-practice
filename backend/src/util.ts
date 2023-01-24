import * as O from 'fp-ts/Option'

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}
