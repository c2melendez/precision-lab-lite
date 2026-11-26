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
export function assertInverseHyperbolicIntegralDomain(
  exprAlgebrite: string,
  variable: string,
  lower: number,
  upper: number,
): void {
  if (!/^[A-Za-z]$/.test(variable) || !Number.isFinite(lower) || !Number.isFinite(upper)) {
    return;
  }
  let source = exprAlgebrite.replace(/\s+/g, "");
  while (source.startsWith("(") && source.endsWith(")")) {
    let depth = 0,
      closesAt = -1;
    for (let i = 0; i < source.length; i++) {
      if (source[i] === "(") depth++;
      if (source[i] === ")" && --depth === 0) {
        closesAt = i;
        break;
      }
    }
    if (closesAt !== source.length - 1) break;
    source = source.slice(1, -1);
  }
  const x = variable;
  const low = Math.min(lower, upper);
  const high = Math.max(lower, upper);
  if (source === `acosh(${x})` && low < 1) {
    throw {
      code: ErrorCode.DOMAIN_ERROR,
      message: "La integral de acosh sale del dominio real [1, +∞).",
    } as AppError;
  }
  if (source === `atanh(${x})` && (low <= -1 || high >= 1)) {
    throw {
      code: ErrorCode.DOMAIN_ERROR,
      message: "La integral de atanh sale del dominio real (-1, 1).",
    } as AppError;
  }
  if (
    (source === `atanh(1/(${x}))` || source === `(atanh(1/(${x})))`) &&
    low <= 1 &&
    high >= -1
  ) {
    throw {
      code: ErrorCode.DOMAIN_ERROR,
      message: "La integral de arcoth sale del dominio real |x| > 1.",
    } as AppError;
  }
}
