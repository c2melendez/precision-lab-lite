/**
 * EN-SG-21 (Lite R326): expression length product contract.
 *
 * SY-X-06 certifies processing a 10000-character sum ("1+".repeat(4999)+"11").
 * Bound must be > 10000. 12000 still refuses larger ~10k-term / multi-block
 * payloads while preserving that audit.
 */
import { ErrorCode, type AppError } from "../types";

export const MAX_EXPRESSION_LENGTH = 12000;

function toAppError(code: ErrorCode, message: string): AppError {
  return { code, message };
}

/** Throw COMPLEXITY_LIMIT when latex exceeds MAX_EXPRESSION_LENGTH. */
export function assertExpressionLength(expressionLatex: string): void {
  if (expressionLatex.length > MAX_EXPRESSION_LENGTH) {
    throw toAppError(
      ErrorCode.COMPLEXITY_LIMIT,
      `Expresión demasiado larga (máximo ${MAX_EXPRESSION_LENGTH} caracteres).`,
    );
  }
}
