import { ErrorCode, type AppError } from "../types";

/** Bare numeric P(n,r) only. Local definitions are handled before this call. */
export function parsePermutationAlias(source: string): { n: number; r: number } | null {
  const match = source.match(/^\s*P\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*\)\s*$/);
  if (!match) return null;
  const n = Number(match[1]), r = Number(match[2]);
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n || n > 170) {
    throw {code: ErrorCode.DOMAIN_ERROR, message: "Permutaciones: se requiere 0 <= r <= n <= 170, con enteros."} as AppError;
  }
  return { n, r };
}

export function tryPermutationAlias(expr: string): { value: string; n: number; r: number } | null {
  const match = expr.match(/^permutationalias\((\d{1,3}),(\d{1,3})\)$/);
  if (!match) return null;
  const args = parsePermutationAlias("P(" + match[1] + "," + match[2] + ")")!;
  let value = 1n;
  for (let k = args.n - args.r + 1; k <= args.n; k++) value *= BigInt(k);
  return { value: value.toString(), ...args };
}
