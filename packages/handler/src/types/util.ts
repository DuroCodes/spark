// https://dev.to/vborodulin/ts-how-to-override-properties-with-type-intersection-554l
export type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export type DefinitelyDefined<T, K extends keyof T = keyof T> = {
  [L in K]-?: T[L] extends Record<string, unknown>
  ? DefinitelyDefined<T[L], keyof T[L]>
  : Required<T>[L];
} & T;
