/**
 * IT-HI domain guards for definite integrals of inverse-hyperbolic integrands.
 * Called from calcDefiniteIntegral before applying the FTC.
 */
import { ErrorCode } from "../../types";
import type { AppError } from "../../types";

/**
 * Reject intervals that leave the real domain of acosh / atanh / arcoth.
 * No-op for other integrands. Throws DOMAIN_ERROR on violation.
 */
function unwrap(source: string): string {
  while (source.startsWith("(") && source.endsWith(")")) {
    let depth = 0, closesAt = -1;
    for (let i = 0; i < source.length; i++) {
      if (source[i] === "(") depth++;
      if (source[i] === ")" && --depth === 0) { closesAt = i; break; }
    }
    if (closesAt !== source.length - 1) break;
    source = source.slice(1, -1);
  }
  return source;
}

export function assertInverseHyperbolicIntegralDomain(
  exprAlgebrite: string,
  variable: string,
  lower: number,
  upper: number,
): void {
  if (!/^[A-Za-z]$/.test(variable) || !Number.isFinite(lower) || !Number.isFinite(upper)) {
    return;
  }
  const source = unwrap(exprAlgebrite.replace(/\s+/g, ""));
  const x = variable;
  const low = Math.min(lower, upper);
  const high = Math.max(lower, upper);
  if (source === `acosh(${x})` && low < 1) {
    throw {
      code: ErrorCode.DOMAIN_ERROR,
      message: "La integral de acosh sale del dominio real [1, +∞).",
    } as AppError;
  }
  if (source === `atanh(${x})` && (low < -1 || high > 1)) {
    throw {
      code: ErrorCode.DOMAIN_ERROR,
      message: "La integral de atanh sale del dominio real (-1, 1).",
    } as AppError;
  }
  if (
    (source === `atanh(1/(${x}))` || source === `atanh(1/${x})` || source === `acoth(${x})` || source === `arcoth(${x})`) &&
    low < 1 &&
    high > -1
  ) {
    throw {
      code: ErrorCode.DOMAIN_ERROR,
      message: "La integral de arcoth sale del dominio real |x| > 1.",
    } as AppError;
  }
}

/** Evaluate the one-sided finite primitive limits at logarithmic endpoints.
 * Only exact supported integrands; no principal-value extrapolation.
 * Call after assertInverseHyperbolicIntegralDomain.
 */
export function inverseHyperbolicEndpointIntegral(
  expr: string, variable: string, lower: number, upper: number,
): number | null {
  if (!/^[A-Za-z]$/.test(variable) || !Number.isFinite(lower) || !Number.isFinite(upper)) return null;
  if (Math.abs(lower) !== 1 && Math.abs(upper) !== 1) return null;
  const source = unwrap(expr.replace(/\s+/g, ""));
  const x = variable;
  const xlog = (t: number) => t === 0 ? 0 : t * Math.log(Math.abs(t));
  let primitive: (t: number) => number;
  if (source === `atanh(${x})`) {
    primitive = t => (xlog(1+t) + xlog(1-t))/2;
  } else if ([`atanh(1/(${x}))`, `atanh(1/${x})`, `acoth(${x})`, `arcoth(${x})`].includes(source)) {
    primitive = t => (xlog(t+1) - xlog(t-1))/2;
  } else return null;
  return primitive(upper) - primitive(lower);
}
