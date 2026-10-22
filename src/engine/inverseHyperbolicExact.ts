/**
 * EV-T-09/EV-T-10: reducciones exactas de composiciones hiperbólicas inversas
 * que el CAS (Algebrite) deja sin resolver.
 *
 * Algebrite no evalúa asinh/acosh/atanh —ni con `float()`— y además el
 * reintento `float()` de `algebriteClient` degradaba formas exactas a
 * decimales espurios (`asinh(1.175201...)`, `2.718282...^(atanh(0.5))`).
 * Este módulo restituye el valor exacto de dos composiciones auditadas sin
 * aproximar ni heurísticar:
 *
 * 1. `asinh/acosh/atanh` de una expresión puramente numérica cuyo valor
 *    real es exactamente entero: devuelve ese entero. Caso EV-T-09:
 *    `asinh((e-e^{-1})/2) = asinh(sinh 1) = 1`.
 * 2. `exp(atanh(a/b))` con enteros `0 <= a < b`: identidad exacta
 *    `exp(atanh x) = sqrt((1+x)/(1-x))`, así que
 *    `exp(atanh(a/b)) = ((b+a)/(b-a))^(1/2)`. Caso EV-T-10:
 *    `exp(atanh(1/2)) = 3^(1/2) = sqrt(3)`.
 *
 * Cualquier otra forma se devuelve intacta: no hay aproximación ni
 * sustitución silenciosa.
 */

import { compileNumeric } from "./numericFallback";

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

/** `((num)/(den))^(1/2)` en la sintaxis nativa de Algebrite. */
function exactRationalSqrt(num: number, den: number): string {
  const divisor = gcd(num, den);
  const finalNum = num / divisor;
  const finalDen = den / divisor;
  if (finalDen === 1) {
    const root = Math.sqrt(finalNum);
    return Number.isInteger(root) ? String(root) : `${finalNum}^(1/2)`;
  }
  return `(${finalNum}/${finalDen})^(1/2)`;
}

export function simplifyInverseHyperbolicExact(result: string): string {
  const compact = result.replace(/\s+/g, "");

  // 1. asinh/acosh/atanh de un argumento numérico con valor entero exacto.
  const whole = /^(asinh|acosh|atanh)\((.+)\)$/.exec(compact);
  if (whole) {
    try {
      const numeric = compileNumeric(compact, "__none__")(0);
      if (Number.isFinite(numeric) && Number.isInteger(numeric)) {
        return String(numeric);
      }
    } catch {
      // La forma no es evaluable numéricamente: se conserva intacta.
    }
    return result;
  }

  // 2. exp(atanh(a/b)) con literales enteros 0 <= a < b.
  const expAtanh = /^exp\(atanh\((\d+)(?:\/(\d+))?\)\)$/.exec(compact);
  if (expAtanh) {
    const a = Number(expAtanh[1]);
    const b = expAtanh[2] ? Number(expAtanh[2]) : 1;
    if (
      Number.isSafeInteger(a) &&
      Number.isSafeInteger(b) &&
      b > 0 &&
      a >= 0 &&
      a < b
    ) {
      return exactRationalSqrt(b + a, b - a);
    }
  }

  return result;
}
