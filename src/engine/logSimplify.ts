/**
 * Exact simplification of logarithms with numeric arguments.
 *
 * Algebrite has no logarithm rules: `log_{b}(a)` becomes `log(a)/log(b)` and
 * stays there (e.g. `log(8)/log(2)`), and `ln(10^50)` expands to
 * `log(1000...0)`. This module applies the exact identities the frozen
 * matrix expects, only for whole-result numeric forms:
 *
 *   log(a) / log(b) = k        when a = b^k for a small rational k
 *   log(N)          = k*log(b) when N = b^k is a perfect power
 *
 * Anything else is returned untouched (no numeric approximation, no
 * guessing): the caller keeps Algebrite's exact symbolic form.
 */

const MAX_BASE = 1_000_000_000_000;
const MAX_POWER = 400;

/** Prime-exponent vector of a positive integer, or null when out of range. */
function factorize(value: number): Map<number, number> | null {
  if (!Number.isInteger(value) || value < 2 || value > MAX_BASE) return null;
  const factors = new Map<number, number>();
  let rest = value;
  for (let prime = 2; prime * prime <= rest; prime += prime === 2 ? 1 : 2) {
    while (rest % prime === 0) {
      factors.set(prime, (factors.get(prime) ?? 0) + 1);
      rest /= prime;
    }
  }
  if (rest > 1) factors.set(rest, (factors.get(rest) ?? 0) + 1);
  return factors;
}

/** Exact rational k with a = b^k (a, b small integers), or null. */
function exactLogRatio(a: number, b: number): { p: number; q: number } | null {
  const fa = factorize(a);
  const fb = factorize(b);
  if (!fa || !fb) return null;
  // Every prime of b must divide a, and the exponent ratios must match.
  let ratio: { p: number; q: number } | null = null;
  for (const [prime, exponentB] of fb) {
    const exponentA = fa.get(prime);
    if (exponentA === undefined) return null;
    const candidate = { p: exponentA, q: exponentB };
    const reduced = reduce(candidate.p, candidate.q);
    if (ratio === null) ratio = reduced;
    else if (ratio.p * reduced.q !== reduced.p * ratio.q) return null;
  }
  // No extra primes may remain in a.
  for (const prime of fa.keys()) if (!fb.has(prime)) return null;
  if (!ratio || Math.abs(ratio.p) > 1000 || ratio.q > 1000) return null;
  return ratio;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

function reduce(p: number, q: number): { p: number; q: number } {
  const g = gcd(p, q);
  const sign = q < 0 ? -1 : 1;
  return { p: (sign * p) / g, q: (sign * q) / g };
}

function formatRational(p: number, q: number): string {
  if (q === 1) return String(p);
  // Algebrite prints negative fractions as "-3/2", not "3/-2".
  return `${p}/${q}`;
}

/** log(N) -> k*log(b) when N is a perfect power b^k (b small, k bounded). */
function perfectPowerLog(digits: string): string | null {
  if (!/^\d{2,400}$/.test(digits)) return null;
  const target = BigInt(digits);
  for (let base = 2; base <= 1000; base += 1) {
    let power = BigInt(base);
    for (let exponent = 2; exponent <= MAX_POWER; exponent += 1) {
      power *= BigInt(base);
      if (power === target) {
        return exponent === 1 ? `log(${base})` : `${exponent}*log(${base})`;
      }
      if (power > target) break;
    }
  }
  return null;
}

/**
 * Simplifies a whole-result logarithm expression. Returns the original text
 * when no exact rule applies.
 */
export function simplifyLogResult(result: string): string {
  const compact = result.replace(/\s+/g, "");

  // -log(a)/log(b) or log(a)/log(b), whole result.
  const ratio = /^(-?)log\((\d+)\)\/log\((\d+)\)$/.exec(compact);
  if (ratio) {
    const sign = ratio[1] === "-" ? -1 : 1;
    const value = exactLogRatio(Number(ratio[2]), Number(ratio[3]));
    if (value) {
      return formatRational(sign * value.p, value.q);
    }
    return result;
  }

  // -log(N) or log(N), whole result.
  const single = /^(-?)log\((\d+)\)$/.exec(compact);
  if (single) {
    const sign = single[1];
    const expanded = perfectPowerLog(single[2]);
    if (expanded) return sign + expanded;
  }

  return result;
}
