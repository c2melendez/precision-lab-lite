/**
 * EN-SG-21 (Lite R326): expression length product contract.
 * Aligned with Plus max_length=500 (HTTP 422 there; COMPLEXITY_LIMIT here).
 */
import { ErrorCode, type AppError } from "../types";

export const MAX_EXPRESSION_LENGTH = 500;

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
