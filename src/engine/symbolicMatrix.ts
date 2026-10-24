/**
 * Inversa, adjunta y matriz de cofactores simbólicas (MV-C-08/10/11/14/15/16).
 *
 * El camino principal sigue siendo `matrixOps` con Fraction.js para celdas
 * racionales. Este módulo es el fallback deliberado cuando alguna celda no
 * es racional (variables, trigonométricas o la unidad imaginaria `i`):
 * reutiliza la expansión simbólica del determinante y Algebrite para
 * simplificar cada celda exactamente.
 *
 * Límite acotado a 4×4, igual que `symbolicDeterminant`: la expansión por
 * cofactores de la adjunta es factorial. Las filas MV-C solo necesitan
 * 2×2 y 3×3.
 */
import { simplifyExpression, toLatex } from "./algebriteClient";
import { parseSymbolicCell, symbolicDeterminantExpression } from "./symbolicDeterminant";
import { ErrorCode, type AppError, type MathResult, type Step } from "../types";

const MAX_SYMBOLIC_MATRIX_SIZE = 4;
type SymbolicCells = string[][];

function dimensionError(message: string): AppError {
  return { code: ErrorCode.DIMENSION_MISMATCH, message };
}

function validateSquare(cells: (string | number)[][]): void {
  if (cells.length === 0) {
    throw dimensionError("La matriz no puede estar vacía.");
  }
  const columns = cells[0]?.length ?? 0;
  if (columns === 0 || cells.some((row) => row.length !== columns)) {
    throw dimensionError("Todas las filas de la matriz deben tener la misma longitud.");
  }
  if (cells.length !== columns) {
    throw dimensionError("Esta operación solo está definida para matrices cuadradas.");
  }
  if (cells.length > MAX_SYMBOLIC_MATRIX_SIZE) {
    throw {
      code: ErrorCode.UNSUPPORTED_OPERATION,
      message: `La operación simbólica está limitada a ${MAX_SYMBOLIC_MATRIX_SIZE}×${MAX_SYMBOLIC_MATRIX_SIZE}.`,
    } as AppError;
  }
}

function parseCells(cells: (string | number)[][]): SymbolicCells {
  return cells.map((row) => row.map(parseSymbolicCell));
}

function minorCells(cells: SymbolicCells, row: number, column: number): SymbolicCells {
  return cells
    .filter((_row, r) => r !== row)
    .map((matrixRow) => matrixRow.filter((_cell, c) => c !== column));
}

/** Matriz de menores con signo ajedrez; para 1×1 el cofactor es 1. */
function cofactorExpressions(cells: SymbolicCells): SymbolicCells {
  const size = cells.length;
  if (size === 1) return [["1"]];

  return cells.map((row, i) =>
    row.map((_cell, j) => {
      const minor = symbolicDeterminantExpression(minorCells(cells, i, j));
      return (i + j) % 2 === 0 ? minor : `(-1)*(${minor})`;
    }),
  );
}

function transposeCells(cells: SymbolicCells): SymbolicCells {
  return cells[0].map((_cell, column) => cells.map((row) => row[column]));
}

function cellsToLatex(cells: SymbolicCells): string {
  const rows = cells.map((row) => row.map((cell) => toLatex(cell)).join(" & ")).join(" \\\\ ");
  return `\\begin{pmatrix} ${rows} \\end{pmatrix}`;
}

function resultFromCells(
  cells: SymbolicCells,
  requestId: string,
  stepId: string,
  explanation: string,
  extraSteps: Step[] = [],
): MathResult {
  const latex = cellsToLatex(cells);
  return {
    success: true,
    resultLatex: latex,
    steps: [
      ...extraSteps,
      { id: stepId, latex, explanation },
    ],
    hasDetailedSteps: true,
    confidence: "SYMBOLIC",
    requestId,
  };
}

export function symbolicCofactor(cells: (string | number)[][], requestId: string): MathResult {
  validateSquare(cells);
  const cofactors = cofactorExpressions(parseCells(cells));
  return resultFromCells(
    cofactors,
    requestId,
    "cofactor-symbolic",
    "Cada cofactor es el determinante simbólico del menor con el signo de su posición.",
  );
}

export function symbolicAdjugate(cells: (string | number)[][], requestId: string): MathResult {
  validateSquare(cells);
  const adjugate = transposeCells(cofactorExpressions(parseCells(cells)));
  return resultFromCells(
    adjugate,
    requestId,
    "adjugate-symbolic",
    "La adjunta simbólica es la transpuesta de la matriz de cofactores.",
  );
}

export function symbolicInverse(cells: (string | number)[][], requestId: string): MathResult {
  validateSquare(cells);
  const parsed = parseCells(cells);
  const determinant = symbolicDeterminantExpression(parsed);
  const simplifiedDeterminant = simplifyExpression(determinant);
  if (simplifiedDeterminant === "0") {
    throw { code: ErrorCode.DOMAIN_ERROR, message: "La matriz es singular (determinante 0): no tiene inversa." } as AppError;
  }

  const cofactors = cofactorExpressions(parsed);
  const adjugate = transposeCells(cofactors);
  const inverse = adjugate.map((row) =>
    row.map((cell) => simplifyExpression(`(${cell})/(${determinant})`)),
  );

  return resultFromCells(
    inverse,
    requestId,
    "inverse-symbolic",
    "Inversa simbólica A^{-1} = adj(A)/det(A), simplificada celda a celda con Algebrite.",
    [{ id: "determinant-symbolic", latex: `\\det(A) = ${toLatex(simplifiedDeterminant)}`, explanation: "Determinante simbólico exacto." }],
  );
}
