/**
 * EN-SG-21 (Lite R326): expression length product contract.
 *
 * Plus HTTP uses max_length=500. Lite is in-browser CAS: 500 was too tight
 * for certified audit inputs (e.g. SY-X-06). 4000 still rejects ~10k-term
 * scale payloads while preserving existing audit expressions.
 */
import { ErrorCode, type AppError } from "../types";

export const MAX_EXPRESSION_LENGTH = 4000;

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
