/**
 * EV-E-10: exponencial de una suma de logaritmos con argumento numérico.
 *
 * Algebrite no aplica `exp(log a + log b) = a·b` y devuelve la forma simbólica
 * `exp(log(2)+log(3))`. La fila congelada EV-E-10 exige `6`.
 *
 * Este módulo aplica SOLO la identidad exacta sobre un resultado completo de la
 * forma `exp(±log(r1) ± log(r2) ...)` con racionales positivos literales.
 * Cualquier otro resultado se devuelve intacto: no hay aproximación ni
 * heurística, y todo el cálculo se hace con enteros seguros.
 */

const MAX_SAFE_PRODUCT = 1_000_000_000_000;

type SignedTerm = { sign: 1 | -1; body: string };

/** Divide una suma/resta de nivel superior respetando los paréntesis. */
function splitAdditive(input: string): SignedTerm[] | null {
  const terms: SignedTerm[] = [];
  let depth = 0;
  let start = 0;
  let sign: 1 | -1 = 1;

  const push = (end: number): boolean => {
    const body = input.slice(start, end).trim();
    if (!body) return false;
    terms.push({ sign, body });
    return true;
  };

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (char === "(") depth += 1;
    else if (char === ")") depth -= 1;
    else if (depth === 0 && (char === "+" || char === "-")) {
      if (i === 0) {
        if (char === "-") sign = -1;
        start = 1;
        continue;
      }
      if (!push(i)) return null;
      sign = char === "-" ? -1 : 1;
      start = i + 1;
    }
  }
  if (!push(input.length)) return null;
  return terms;
}

/** Racional positivo literal ("3" o "3/4"). */
function parsePositiveRational(text: string): { num: number; den: number } | null {
  const match = /^(\d+)(?:\/(\d+))?$/.exec(text);
  if (!match) return null;
  const num = Number(match[1]);
  const den = match[2] ? Number(match[2]) : 1;
  if (!Number.isSafeInteger(num) || !Number.isSafeInteger(den) || den === 0) return null;
  return { num, den };
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const rest = x % y;
    x = y;
    y = rest;
  }
  return x === 0 ? 1 : x;
}

/**
 * Simplifica `exp(<suma de logaritmos de racionales positivos>)` a su valor
 * exacto. Devuelve el resultado original si la forma no está soportada.
 */
export function simplifyExpLogResult(result: string): string {
  const compact = result.replace(/\s+/g, "");
  const outer = /^exp\((.*)\)$/.exec(compact);
  if (!outer) return result;

  const terms = splitAdditive(outer[1]);
  if (!terms || terms.length < 2) return result;

  let num = 1;
  let den = 1;
  for (const term of terms) {
    const logArg = /^log\(([^()]+)\)$/.exec(term.body);
    if (!logArg) return result;
    const fraction = parsePositiveRational(logArg[1]);
    if (!fraction) return result;
    if (term.sign > 0) {
      num *= fraction.num;
      den *= fraction.den;
    } else {
      num *= fraction.den;
      den *= fraction.num;
    }
    if (
      !Number.isSafeInteger(num) ||
      !Number.isSafeInteger(den) ||
      num > MAX_SAFE_PRODUCT ||
      den > MAX_SAFE_PRODUCT ||
      den === 0
    ) {
      return result;
    }
  }

  const divisor = gcd(num, den);
  const finalNum = num / divisor;
  const finalDen = den / divisor;
  return finalDen === 1 ? String(finalNum) : `${finalNum}/${finalDen}`;
}
