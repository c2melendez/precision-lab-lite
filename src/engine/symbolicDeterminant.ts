/**
 * Determinante simbólico (MV-B-16..21).
 *
 * El determinante numérico sigue viviendo en `matrixOps.determinant` con
 * Fraction.js (aritmética exacta). Este módulo es el fallback deliberado
 * cuando alguna celda no es un número racional: expande por cofactores y
 * deja que Algebrite simplifique la expresión exacta (`a*d-b*c`,
 * `sin²+cos²→1`, `i²→-1`, etc.).
 *
 * Límites acotados a propósito: la expansión por cofactores es factorial,
 * así que solo se admite hasta 4×4 (24 términos). Una celda se parsea con
 * el mismo `parseExpression` de la app, que ya normaliza LaTeX
 * (`a^{2}`→`a^2`, `\cos\theta`→`cos(theta)`) y aplica sus propios límites.
 */
import { simplifyExpression, toLatex } from "./algebriteClient";
import { parseExpression } from "./parsing";
import { ErrorCode, type AppError, type MathResult, type Step } from "../types";

const MAX_SYMBOLIC_DETERMINANT_SIZE = 4;
const MAX_SYMBOLIC_CELL_LENGTH = 128;

function parseError(message: string): AppError {
  return { code: ErrorCode.PARSE_ERROR, message };
}

function dimensionError(message: string): AppError {
  return { code: ErrorCode.DIMENSION_MISMATCH, message };
}

export function parseSymbolicCell(cell: string | number): string {
  const source = String(cell ?? "").trim();
  // Misma convención que toFractionMatrix: una celda vacía es cero.
  if (!source) return "0";
  if (source.length > MAX_SYMBOLIC_CELL_LENGTH) {
    throw parseError(`Celda demasiado larga para un determinante simbólico (máximo ${MAX_SYMBOLIC_CELL_LENGTH} caracteres).`);
  }
  const parsed = parseExpression(source);
  if (parsed.isEquation || parsed.isInequality) {
    throw parseError("Una celda de matriz no puede ser una ecuación o inecuación.");
  }
  if (!parsed.algebrite) {
    throw parseError(`No se pudo interpretar la celda "${source}".`);
  }
  return parsed.algebrite;
}

/** Expansión de Laplace por la primera fila, con signos alternos. */
function determinantExpression(rows: string[][]): string {
  const size = rows.length;
  if (size === 1) return rows[0][0];
  if (size === 2) {
    return `(${rows[0][0]})*(${rows[1][1]})-(${rows[0][1]})*(${rows[1][0]})`;
  }

  let expression = "0";
  for (let col = 0; col < size; col += 1) {
    const minor = rows.slice(1).map((row) => row.filter((_, index) => index !== col));
    const term = `(${rows[0][col]})*(${determinantExpression(minor)})`;
    expression = col % 2 === 0 ? `(${expression})+(${term})` : `(${expression})-(${term})`;
  }
  return expression;
}

/**
 * Fallback simbólico del determinante: el llamador lo usa solo después de
 * que `toFractionMatrix` haya rechazado las celdas por no ser racionales.
 * Devuelve la expresión simplificada en sintaxis Algebrite (canal exacto
 * que también usan los tests de certificación; `symbolicDeterminant` la
 * convierte a LaTeX para la UI).
 */
export function symbolicDeterminantExpression(cells: (string | number)[][]): string {
  if (cells.length === 0) {
    throw dimensionError("La matriz no puede estar vacía.");
  }
  const columns = cells[0]?.length ?? 0;
  if (columns === 0 || cells.some((row) => row.length !== columns)) {
    throw dimensionError("Todas las filas de la matriz deben tener la misma longitud.");
  }
  if (cells.length !== columns) {
    throw dimensionError("El determinante solo está definido para matrices cuadradas.");
  }
  if (cells.length > MAX_SYMBOLIC_DETERMINANT_SIZE) {
    throw {
      code: ErrorCode.UNSUPPORTED_OPERATION,
      message: `El determinante simbólico está limitado a ${MAX_SYMBOLIC_DETERMINANT_SIZE}×${MAX_SYMBOLIC_DETERMINANT_SIZE}.`,
    } as AppError;
  }

  const parsed = cells.map((row) => row.map(parseSymbolicCell));
  return simplifyExpression(determinantExpression(parsed));
}

export function symbolicDeterminant(
  cells: (string | number)[][],
  requestId: string,
): MathResult {
  const simplified = symbolicDeterminantExpression(cells);
  const latex = toLatex(simplified);
  const steps: Step[] = [
    {
      id: "determinant-symbolic",
      latex: `\\det(A) = ${latex}`,
      explanation:
        "Determinante simbólico por expansión de cofactores y simplificación exacta (Algebrite).",
    },
  ];

  return {
    success: true,
    resultLatex: latex,
    steps,
    hasDetailedSteps: true,
    confidence: "SYMBOLIC",
    requestId,
  };
}
