/**
 * AS-B-30: bounded primality answer for the frozen matrix `valor` row.
 *
 * The matrix row is a yes/no question in Spanish. Only the frozen LaTeX
 * question and a short functional form are recognised; this is not a general
 * natural-language layer. The answer uses deterministic Miller-Rabin with the
 * first twelve primes as witnesses, exact for every value <= 2^64-1.
 */

export const MAX_PRIMALITY_VALUE = (1n << 64n) - 1n;

const WITNESSES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];

function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  let result = 1n;
  let factor = base % modulus;
  let power = exponent;
  while (power > 0n) {
    if (power & 1n) result = (result * factor) % modulus;
    factor = (factor * factor) % modulus;
    power >>= 1n;
  }
  return result;
}

export function parsePrimalityQuery(expression: string): bigint | null {
  const compact = expression.replace(/\s+/g, "");
  const textMatch = /^\\text\{¿esprimo\}(\d+)\?$/.exec(compact);
  const callMatch = /^(?:primo|esprimo)\((\d+)\)$/.exec(compact);
  const match = textMatch ?? callMatch;
  return match ? BigInt(match[1]) : null;
}

export function isPrime(value: bigint): boolean {
  if (value < 2n) return false;
  for (const prime of WITNESSES) {
    if (value % prime === 0n) return value === prime;
  }
  let remainder = value - 1n;
  let shifts = 0;
  while (remainder % 2n === 0n) {
    remainder /= 2n;
    shifts++;
  }
  for (const base of WITNESSES) {
    let candidate = modPow(base, remainder, value);
    if (candidate === 1n || candidate === value - 1n) continue;
    let witnessed = false;
    for (let round = 1; round < shifts; round++) {
      candidate = (candidate * candidate) % value;
      if (candidate === value - 1n) {
        witnessed = true;
        break;
      }
    }
    if (!witnessed) return false;
  }
  return true;
}

export function primalityAnswer(value: bigint): string {
  if (value < 2n) return "no, no es primo";
  return isPrime(value) ? "sí, es primo" : "no, es compuesto";
}
