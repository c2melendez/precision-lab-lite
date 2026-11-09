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

import { ErrorCode, type AppError } from "../types";
import { compileNumeric } from "./numericFallback";

function toAppError(code: ErrorCode, message: string): AppError {
  return { code, message };
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

  // 2. EV-HI-10: sinh(asinh(u)) = u para todo u real. Algebrite deja la
  // composición sin resolver (`sinh(asinh(3.0))`). Solo se reduce cuando el
  // argumento es puramente numérico; una forma simbólica sigue intacta.
  const sinhAsinh = /^sinh\(asinh\((.+)\)\)$/.exec(compact);
  if (sinhAsinh) {
    try {
      const inner = compileNumeric(sinhAsinh[1], "__none__")(0);
      if (Number.isFinite(inner)) {
        return String(inner);
      }
    } catch {
      // La forma no es evaluable numéricamente: se conserva intacta.
    }
    return result;
  }

  // 3. exp(atanh(a/b)) con literales enteros 0 <= a < b.
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

/**
 * EV-HI-04..09/EV-HI-11/12: Algebrite deja `asinh(1.0)`, `acosh(2.0)` y
 * `atanh(0.5)` sin evaluar incluso después del reintento `float()`. Cuando la
 * salida es exactamente una inversa hiperbólica de un argumento numérico, se
 * evalúa con el canal numérico propio respetando el dominio real:
 *
 * - acosh exige argumento >= 1;
 * - atanh exige |argumento| < 1.
 *
 * Fuera de dominio se lanza DOMAIN_ERROR en vez de devolver un complejo o un
 * eco de la llamada. Cualquier forma simbólica o no reconocida se conserva.
 */
export function resolveInverseHyperbolicNumeric(result: string): string {
  const compact = result.replace(/\s+/g, "");
  const match = /^(asinh|acosh|atanh)\((.+)\)$/.exec(compact);
  if (!match) return result;
  const [, name, argument] = match;

  let argumentValue: number;
  try {
    argumentValue = compileNumeric(argument, "__none__")(0);
  } catch {
    return result;
  }
  if (!Number.isFinite(argumentValue)) return result;

  if (name === "acosh" && argumentValue < 1) {
    throw toAppError(
      ErrorCode.DOMAIN_ERROR,
      "acosh no está definida fuera del dominio real [1, +∞).",
    );
  }
  if (name === "atanh" && Math.abs(argumentValue) >= 1) {
    throw toAppError(
      ErrorCode.DOMAIN_ERROR,
      "atanh no está definida fuera del dominio real (-1, 1).",
    );
  }

  const value =
    name === "asinh"
      ? Math.asinh(argumentValue)
      : name === "acosh"
        ? Math.acosh(argumentValue)
        : Math.atanh(argumentValue);
  if (!Number.isFinite(value)) return result;
  return String(value);
}
