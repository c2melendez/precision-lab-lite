import { evaluate } from "./algebriteClient";
import { splitTopLevelArgs } from "./statFunctions";
import { ErrorCode, type AppError } from "../types";

/**
 * S20: limita sumatorias finitas antes de entregarlas a Algebrite.
 * Plus ya aplica el mismo techo contractual de 10,000 términos.
 *
 * Devuelve false cuando la expresión no es una sumatoria; para una sumatoria
 * válida solo valida el rango y deja que el motor normal haga el cálculo.
 */
export function validateFiniteSumRange(expr: string): boolean {
  if (!expr.startsWith("sum(") || !expr.endsWith(")")) return false;
  const args = splitTopLevelArgs(expr.slice("sum(".length, -1));
  if (args.length !== 4) {
    throw { code: ErrorCode.PARSE_ERROR, message: "Sumatoria requiere cuerpo, índice, inicio y fin." } as AppError;
  }

  const [, variable, lowerRaw, upperRaw] = args.map((x) => x.trim());
  if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(variable)) {
    throw { code: ErrorCode.PARSE_ERROR, message: "Índice inválido en sumatoria." } as AppError;
  }

  const lower = Number(evaluate(`float(${lowerRaw})`));
  const upper = Number(evaluate(`float(${upperRaw})`));
  if (!Number.isInteger(lower) || !Number.isInteger(upper)) {
    throw { code: ErrorCode.PARSE_ERROR, message: "Los límites de la sumatoria deben ser enteros." } as AppError;
  }

  if (Math.abs(upper - lower) > 10_000) {
    throw {
      code: ErrorCode.COMPLEXITY_LIMIT,
      message: "El rango de la sumatoria excede 10,000 términos.",
    } as AppError;
  }
  return true;
}
