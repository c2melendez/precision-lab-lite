// engine/matrixOps.ts — spec v10 §8/§9. Aritmética EXACTA con fraction.js
// (nunca floats) para que los resultados de sistemas y matrices se puedan
// expresar como fracción propia/impropia/mixta, según §11.
//
// Se centraliza aquí porque tanto el Modo Sistemas de ecuaciones (Módulo 5,
// resuelve por matriz aumentada) como el futuro Modo Matrices (Módulo 6)
// necesitan las mismas operaciones de fila — evita duplicar Gauss-Jordan.

import Fraction from "fraction.js";
import { ErrorCode, type AppError, type Step } from "../types";
import { fractionToLatex } from "./fractions";

export type Matrix = Fraction[][];

export type SystemSolutionKind = "unique" | "infinite" | "none";

/** Un término `coeficiente · parámetro` de una solución paramétrica exacta. */
export interface ParametricTerm {
  parameter: string;
  coefficient: Fraction;
}

/**
 * Expresión lineal exacta de una variable en función de los parámetros
 * libres. Se guarda estructurada (no como texto) para que el worker y los
 * tests puedan comparar valores sin depender del formato de presentación.
 */
export interface ParametricValue {
  constant: Fraction;
  terms: ParametricTerm[];
}

export interface ParametricSolution {
  parameters: string[];
  /** Un valor por variable, en el mismo orden que `variables`. */
  values: ParametricValue[];
}

export interface SystemCase {
  /** Restricción sobre el parámetro, en sintaxis Algebrite (ej. `a!=1`). */
  conditionAlgebrite: string;
  /** La misma restricción en LaTeX (ej. `a \\neq 1`). */
  conditionLatex: string;
  kind: SystemSolutionKind;
  /** Solo para kind === "unique" cuando la solución es numérica exacta. */
  values?: Fraction[];
  /** Solo para kind === "unique" cuando la solución es simbólica. */
  symbolicValues?: string[];
  /** Solo para kind === "infinite". */
  parametric?: ParametricSolution;
  explanation: string;
}

export interface SystemSolution {
  kind: SystemSolutionKind;
  /** Solo con sentido si kind === "unique": valor de cada variable en el mismo orden que se pasó `variables`. */
  values?: Fraction[];
  /** Solo con sentido si kind === "infinite": parametrización exacta. */
  parametric?: ParametricSolution;
  /**
   * Análisis por casos cuando el sistema depende de un parámetro externo
   * (MV-D-13). `kind` describe el caso genérico y `cases` recorre todas las
   * ramas, incluida la genérica.
   */
  cases?: SystemCase[];
  steps: Step[];
}

/** Formatea una expresión paramétrica exacta como LaTeX. */
export function parametricValueToLatex(value: ParametricValue): string {
  const parts: string[] = [];
  if (!value.constant.equals(0) || value.terms.length === 0) {
    parts.push(fractionToLatex(value.constant));
  }
  for (const term of value.terms) {
    const coefficient = term.coefficient;
    if (coefficient.equals(0)) continue;
    const magnitude = coefficient.abs();
    const coefficientLatex =
      magnitude.equals(1) ? "" : `${fractionToLatex(magnitude)}`;
    const body = `${coefficientLatex}${term.parameter}`;
    if (parts.length === 0) {
      parts.push(coefficient.s < 0 ? `-${body}` : body);
    } else {
      parts.push(coefficient.s < 0 ? `- ${body}` : `+ ${body}`);
    }
  }
  if (parts.length === 0) return "0";
  return parts.join(" ");
}

/** Formatea una expresión paramétrica exacta como texto Algebrite. */
export function parametricValueToAlgebrite(value: ParametricValue): string {
  const parts: string[] = [];
  if (!value.constant.equals(0) || value.terms.length === 0) {
    parts.push(value.constant.toFraction());
  }
  for (const term of value.terms) {
    if (term.coefficient.equals(0)) continue;
    const coefficient = term.coefficient.toFraction();
    const body =
      coefficient === "1"
        ? term.parameter
        : coefficient === "-1"
          ? `-${term.parameter}`
          : `(${coefficient})*${term.parameter}`;
    if (parts.length === 0) parts.push(body);
    else parts.push(coefficient.startsWith("-") ? body : `+${body}`);
  }
  return parts.length === 0 ? "0" : parts.join("");
}

function fmt(f: Fraction): string {
  return f.toFraction(true);
}

function matrixToLatex(m: Matrix): string {
  const rows = m.map((row) => row.map(fmt).join(" & ")).join(" \\\\ ");
  return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
}

function cloneMatrix(m: Matrix): Matrix {
  return m.map((row) => row.map((f) => new Fraction(f)));
}

/**
 * Gauss-Jordan sobre una matriz aumentada [A | b]. `variables` solo se usa
 * para las explicaciones de los pasos, no afecta el cálculo.
 */
export function gaussJordan(augmented: Matrix, variables: string[]): SystemSolution {
  const m = cloneMatrix(augmented);
  const rows = m.length;
  const cols = m[0].length; // incluye la columna aumentada
  const steps: Step[] = [
    { id: "initial", latex: matrixToLatex(m), explanation: "Matriz aumentada inicial [A | b]." },
  ];

  let pivotRow = 0;
  const pivotCols: number[] = [];

  for (let col = 0; col < cols - 1 && pivotRow < rows; col++) {
    // Buscar fila con entrada no nula en esta columna, desde pivotRow hacia abajo.
    let sel = -1;
    for (let r = pivotRow; r < rows; r++) {
      if (!m[r][col].equals(0)) {
        sel = r;
        break;
      }
    }
    if (sel === -1) continue; // columna sin pivote posible, variable libre

    if (sel !== pivotRow) {
      [m[sel], m[pivotRow]] = [m[pivotRow], m[sel]];
      steps.push({
        id: `swap-${pivotRow}-${sel}`,
        latex: matrixToLatex(m),
        explanation: `Se intercambia fila ${pivotRow + 1} con fila ${sel + 1} para obtener un pivote no nulo.`,
      });
    }

    const pivotValue = m[pivotRow][col];
    if (!pivotValue.equals(1)) {
      m[pivotRow] = m[pivotRow].map((v) => v.div(pivotValue));
      steps.push({
        id: `normalize-${pivotRow}`,
        latex: matrixToLatex(m),
        explanation: `Se divide la fila ${pivotRow + 1} entre ${fmt(pivotValue)} para que el pivote sea 1.`,
      });
    }

    for (let r = 0; r < rows; r++) {
      if (r === pivotRow) continue;
      const factor = m[r][col];
      if (factor.equals(0)) continue;
      m[r] = m[r].map((v, c) => v.sub(factor.mul(m[pivotRow][c])));
      steps.push({
        id: `eliminate-${r}-${pivotRow}`,
        latex: matrixToLatex(m),
        explanation: `Se elimina la columna de "${variables[col] ?? `var${col}`}" en la fila ${r + 1} usando la fila ${pivotRow + 1}.`,
      });
    }

    pivotCols.push(col);
    pivotRow++;
  }

  const rank = pivotRow;

  // Inconsistencia: fila [0 0 ... 0 | c] con c != 0.
  for (let r = rank; r < rows; r++) {
    const allZeroCoeffs = m[r].slice(0, cols - 1).every((v) => v.equals(0));
    if (allZeroCoeffs && !m[r][cols - 1].equals(0)) {
      steps.push({
        id: "inconsistent",
        latex: matrixToLatex(m),
        explanation: `La fila ${r + 1} equivale a "0 = ${fmt(m[r][cols - 1])}", una contradicción: el sistema no tiene solución.`,
      });
      return { kind: "none", steps };
    }
  }

  const numVariables = cols - 1;
  if (rank < numVariables) {
    // Las columnas sin pivote son las variables libres. Se nombran t, t1, t2…
    // (con un solo grado de libertad, el oráculo MV-D usa exactamente `t`).
    const freeCols = Array.from({ length: numVariables }, (_, col) => col).filter(
      (col) => !pivotCols.includes(col),
    );
    const parameters = freeCols.map((_col, index) =>
      freeCols.length === 1 ? "t" : `t${index + 1}`,
    );
    const parametricValues: ParametricValue[] = Array.from({ length: numVariables }, (_, col) => {
      const pivotIndex = pivotCols.indexOf(col);
      if (pivotIndex === -1) {
        const freeIndex = freeCols.indexOf(col);
        return {
          constant: new Fraction(0),
          terms: [{ parameter: parameters[freeIndex], coefficient: new Fraction(1) }],
        };
      }
      const constant = new Fraction(m[pivotIndex][cols - 1]);
      const terms: ParametricTerm[] = [];
      for (let freeIndex = 0; freeIndex < freeCols.length; freeIndex++) {
        const coefficient = m[pivotIndex][freeCols[freeIndex]].neg();
        if (!coefficient.equals(0)) {
          terms.push({ parameter: parameters[freeIndex], coefficient });
        }
      }
      return { constant, terms };
    });
    const parametric: ParametricSolution = { parameters, values: parametricValues };
    steps.push({
      id: "infinite",
      latex: parameters
        .map((parameter) => `${parameter} \\in \\mathbb{R}`)
        .join(",\\ "),
      explanation: `El rango (${rank}) es menor que el número de variables (${numVariables}): el sistema es compatible indeterminado.`,
    });
    steps.push({
      id: "parametric",
      latex: `${variables.map((v, index) => `${v} = ${parametricValueToLatex(parametricValues[index])}`).join(",\\ ")}`,
      explanation: "Parametrización exacta usando las variables libres de la forma reducida.",
    });
    return { kind: "infinite", parametric, steps };
  }

  const values = pivotCols.map((_col, r) => m[r][cols - 1]);
  steps.push({
    id: "unique",
    latex: variables.map((v, i) => `${v} = ${fmt(values[i])}`).join(",\\quad "),
    explanation: "Solución única leída directamente de la forma reducida.",
  });
  return { kind: "unique", values, steps };
}

export function toFractionMatrix(values: (string | number)[][]): Matrix {
  return values.map((row) =>
    row.map((v) => {
      // Celda vacía se trata como 0 (bug detectado en revisión: antes una
      // celda en blanco —muy común al dejar los ceros de una matriz dispersa
      // sin escribir— hacía fallar todo el cálculo con PARSE_ERROR).
      const normalized = typeof v === "string" && v.trim() === "" ? 0 : v;
      try {
        return new Fraction(normalized);
      } catch {
        throw {
          code: ErrorCode.PARSE_ERROR,
          message: `Valor no numérico en la matriz: "${v}".`,
        } as AppError;
      }
    }),
  );
}

// ---------------------------------------------------------------------------
// Operaciones de matrices (Módulo 6, spec v10 §9). Reutilizan el mismo tipo
// Matrix (Fraction[][]) y el mismo helper matrixToLatex definido arriba.
// ---------------------------------------------------------------------------

function dims(m: Matrix): { rows: number; cols: number } {
  return { rows: m.length, cols: m[0]?.length ?? 0 };
}

function dimensionError(expected: string, got: string): AppError {
  return { code: ErrorCode.DIMENSION_MISMATCH, message: `Dimensiones incompatibles: se esperaba ${expected}, se recibió ${got}.` };
}

export function addMatrices(a: Matrix, b: Matrix): { result: Matrix; steps: Step[] } {
  const da = dims(a);
  const db = dims(b);
  if (da.rows !== db.rows || da.cols !== db.cols) {
    throw dimensionError(`misma dimensión que A (${da.rows}x${da.cols})`, `B de ${db.rows}x${db.cols}`);
  }
  const result = a.map((row, r) => row.map((v, c) => v.add(b[r][c])));
  return { result, steps: [{ id: "sum", latex: matrixToLatex(result), explanation: "Suma elemento a elemento." }] };
}

export function subtractMatrices(a: Matrix, b: Matrix): { result: Matrix; steps: Step[] } {
  const da = dims(a);
  const db = dims(b);
  if (da.rows !== db.rows || da.cols !== db.cols) {
    throw dimensionError(`misma dimensión que A (${da.rows}x${da.cols})`, `B de ${db.rows}x${db.cols}`);
  }
  const result = a.map((row, r) => row.map((v, c) => v.sub(b[r][c])));
  return { result, steps: [{ id: "diff", latex: matrixToLatex(result), explanation: "Resta elemento a elemento." }] };
}

export function multiplyMatrices(a: Matrix, b: Matrix): { result: Matrix; steps: Step[] } {
  const da = dims(a);
  const db = dims(b);
  if (da.cols !== db.rows) {
    throw dimensionError(`A de RxC y B de CxM (columnas de A = filas de B)`, `A de ${da.rows}x${da.cols} y B de ${db.rows}x${db.cols}`);
  }
  const result: Matrix = [];
  for (let r = 0; r < da.rows; r++) {
    const row: Fraction[] = [];
    for (let c = 0; c < db.cols; c++) {
      let sum = new Fraction(0);
      for (let k = 0; k < da.cols; k++) sum = sum.add(a[r][k].mul(b[k][c]));
      row.push(sum);
    }
    result.push(row);
  }
  return { result, steps: [{ id: "product", latex: matrixToLatex(result), explanation: "Producto matricial A·B." }] };
}

export function transposeMatrix(a: Matrix): { result: Matrix; steps: Step[] } {
  const { cols } = dims(a);
  const result: Matrix = [];
  for (let c = 0; c < cols; c++) {
    result.push(a.map((row) => row[c]));
  }
  return { result, steps: [{ id: "transpose", latex: matrixToLatex(result), explanation: "Filas y columnas intercambiadas." }] };
}

/** Determinante exacto por eliminación gaussiana.
 * M21: reemplaza expansión de cofactores (crecimiento factorial) para
 * escalar de forma segura a matrices 5×5/6×6 manteniendo Fraction exacto. */
export function determinant(a: Matrix): { value: Fraction; steps: Step[] } {
  const { rows, cols } = dims(a);
  if (rows !== cols) {
    throw { code: ErrorCode.DIMENSION_MISMATCH, message: "El determinante solo está definido para matrices cuadradas." } as AppError;
  }

  const m = cloneMatrix(a);
  let sign = 1;
  let det = new Fraction(1);

  for (let col = 0; col < rows; col++) {
    let pivotRow = -1;
    for (let r = col; r < rows; r++) {
      if (!m[r][col].equals(0)) {
        pivotRow = r;
        break;
      }
    }

    if (pivotRow === -1) {
      det = new Fraction(0);
      break;
    }

    if (pivotRow !== col) {
      [m[pivotRow], m[col]] = [m[col], m[pivotRow]];
      sign *= -1;
    }

    const pivot = m[col][col];
    det = det.mul(pivot);

    for (let r = col + 1; r < rows; r++) {
      if (m[r][col].equals(0)) continue;
      const factor = m[r][col].div(pivot);
      for (let k = col; k < cols; k++) {
        m[r][k] = m[r][k].sub(factor.mul(m[col][k]));
      }
    }
  }

  if (sign < 0) det = det.neg();

  return {
    value: det,
    steps: [
      {
        id: "determinant",
        latex: `\\det(A) = ${det.toFraction(true)}`,
        explanation: "Calculado por eliminación gaussiana exacta; los intercambios de fila ajustan el signo.",
      },
    ],
  };
}

/** Inversa por Gauss-Jordan sobre [A | I]. */
export function invertMatrix(a: Matrix): { result: Matrix; steps: Step[] } {
  const { rows, cols } = dims(a);
  if (rows !== cols) {
    throw { code: ErrorCode.DIMENSION_MISMATCH, message: "Solo las matrices cuadradas tienen inversa." } as AppError;
  }

  const { value: det } = determinant(a);
  if (det.equals(0)) {
    throw { code: ErrorCode.DOMAIN_ERROR, message: "La matriz es singular (determinante 0): no tiene inversa." } as AppError;
  }

  const augmented: Matrix = a.map((row, r) => [
    ...row.map((v) => new Fraction(v)),
    ...Array.from({ length: rows }, (_, c) => new Fraction(r === c ? 1 : 0)),
  ]);

  const m = cloneMatrix(augmented);
  const steps: Step[] = [{ id: "initial", latex: matrixToLatex(m), explanation: "Matriz aumentada [A | I]." }];

  for (let col = 0; col < rows; col++) {
    let sel = -1;
    for (let r = col; r < rows; r++) {
      if (!m[r][col].equals(0)) {
        sel = r;
        break;
      }
    }
    if (sel === -1) {
      throw { code: ErrorCode.DOMAIN_ERROR, message: "La matriz es singular: no tiene inversa." } as AppError;
    }
    if (sel !== col) [m[sel], m[col]] = [m[col], m[sel]];

    const pivot = m[col][col];
    m[col] = m[col].map((v) => v.div(pivot));

    for (let r = 0; r < rows; r++) {
      if (r === col) continue;
      const factor = m[r][col];
      if (factor.equals(0)) continue;
      m[r] = m[r].map((v, c) => v.sub(factor.mul(m[col][c])));
    }
  }
  steps.push({ id: "reduced", latex: matrixToLatex(m), explanation: "Forma [I | A⁻¹] tras Gauss-Jordan completo." });

  const result = m.map((row) => row.slice(rows));
  return { result, steps };
}

/**
 * Matriz de cofactores (MV-C-16). El menor (i,j) se calcula con el mismo
 * `determinant` exacto que el resto del módulo y se le aplica el signo
 * ajedrez. Para 1×1 el único cofactor es 1 por convención (el menor es la
 * matriz vacía, que `determinant` no puede recibir).
 */
export function cofactorMatrix(a: Matrix): { result: Matrix; steps: Step[] } {
  const { rows, cols } = dims(a);
  if (rows !== cols) {
    throw { code: ErrorCode.DIMENSION_MISMATCH, message: "La matriz de cofactores solo está definida para matrices cuadradas." } as AppError;
  }
  if (rows === 1) {
    const result: Matrix = [[new Fraction(1)]];
    return { result, steps: [{ id: "cofactor", latex: matrixToLatex(result), explanation: "Cofactor de una matriz 1×1: por convención es 1." }] };
  }

  const result = a.map((_, i) =>
    a.map((_, j) => {
      const minor = a
        .filter((_row, r) => r !== i)
        .map((row) => row.filter((_cell, c) => c !== j));
      const value = determinant(minor).value;
      return (i + j) % 2 === 0 ? value : value.neg();
    }),
  );
  return {
    result,
    steps: [{
      id: "cofactor",
      latex: matrixToLatex(result),
      explanation: "Cada cofactor es el determinante del menor con el signo (+/-) según su posición.",
    }],
  };
}

/** Adjunta: transpuesta de la matriz de cofactores (MV-C-14/15). */
export function adjugateMatrix(a: Matrix): { result: Matrix; steps: Step[] } {
  const cofactors = cofactorMatrix(a);
  const result = transposeMatrix(cofactors.result).result;
  return {
    result,
    steps: [{
      id: "adjugate",
      latex: matrixToLatex(result),
      explanation: "La adjunta es la transpuesta de la matriz de cofactores.",
    }],
  };
}

/**
 * Resuelve una ecuación matricial con A cuadrada e invertible:
 *   - xOnLeft=true  -> X·A = B, por tanto X = B·A^{-1}
 *   - xOnLeft=false -> A·X = B, por tanto X = A^{-1}·B
 * El orden del producto es deliberado (MV-C-18/19): la inversa no conmuta.
 */
export function solveMatrixEquation(
  a: Matrix,
  b: Matrix,
  xOnLeft: boolean,
): { result: Matrix; steps: Step[] } {
  const da = dims(a);
  const db = dims(b);
  if (da.rows !== da.cols) {
    throw { code: ErrorCode.DIMENSION_MISMATCH, message: "La ecuación matricial requiere una matriz A cuadrada." } as AppError;
  }

  if (xOnLeft) {
    if (db.cols !== da.rows) {
      throw dimensionError(`B con ${da.rows} columnas (X·A = B)`, `B de ${db.rows}x${db.cols}`);
    }
  } else if (db.rows !== da.rows) {
    throw dimensionError(`B con ${da.rows} filas (A·X = B)`, `B de ${db.rows}x${db.cols}`);
  }

  const inverse = invertMatrix(a);
  const result = (xOnLeft
    ? multiplyMatrices(b, inverse.result)
    : multiplyMatrices(inverse.result, b)).result;

  return {
    result,
    steps: [
      ...inverse.steps,
      {
        id: "solve-matrix-equation",
        latex: matrixToLatex(result),
        explanation: xOnLeft
          ? "X·A = B se despeja como X = B·A^{-1} (la inversa multiplica por la derecha)."
          : "A·X = B se despeja como X = A^{-1}·B (la inversa multiplica por la izquierda).",
      },
    ],
  };
}

/** Potencia entera (spec v10 §9): exponente negativo usa la inversa de A. */
export function powerMatrix(a: Matrix, n: number): { result: Matrix; steps: Step[] } {
  const { rows, cols } = dims(a);
  if (rows !== cols) {
    throw { code: ErrorCode.DIMENSION_MISMATCH, message: "La potencia de matrices solo está definida para matrices cuadradas." } as AppError;
  }
  if (!Number.isInteger(n)) {
    throw { code: ErrorCode.UNSUPPORTED_OPERATION, message: "El exponente matricial debe ser un entero." } as AppError;
  }
  const steps: Step[] = [];
  let base = a;
  if (n < 0) {
    const inverse = invertMatrix(a);
    base = inverse.result;
    steps.push(...inverse.steps);
    steps.push({ id: "power-inverse", latex: `A^{-1} = ${matrixToLatex(base)}`, explanation: "Exponente negativo: se parte de la inversa de A." });
  }
  const exponent = Math.abs(n);
  let result: Matrix = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: rows }, (_, c) => new Fraction(r === c ? 1 : 0)),
  );
  for (let i = 0; i < exponent; i++) {
    result = multiplyMatrices(result, base).result;
  }
  steps.push({
    id: "power",
    latex: `A^{${n}} = ${matrixToLatex(result)}`,
    explanation: n < 0
      ? `Multiplicación repetida de A⁻¹ por sí misma ${exponent} veces.`
      : `Multiplicación repetida de A por sí misma ${n} veces.`,
  });
  return { result, steps };
}

// ---------------------------------------------------------------------------
// Fase C (spec UX estilo ClassCalc §4): ref/rref/producto de Kronecker.
// ref/rref reutilizan la misma mecánica de eliminación de gaussJordan (por
// eso vive todo en este archivo — evita una tercera copia de Gauss-Jordan).
// ---------------------------------------------------------------------------

/** Forma escalonada (ref): pivotes no necesariamente 1, sin reducción hacia arriba de cada pivote. */
export function ref(a: Matrix): { result: Matrix; steps: Step[] } {
  const m = cloneMatrix(a);
  const rows = m.length;
  const cols = dims(a).cols;
  const steps: Step[] = [{ id: "initial", latex: matrixToLatex(m), explanation: "Matriz original." }];
  let pivotRow = 0;
  for (let col = 0; col < cols && pivotRow < rows; col++) {
    let sel = -1;
    for (let r = pivotRow; r < rows; r++) {
      if (!m[r][col].equals(0)) {
        sel = r;
        break;
      }
    }
    if (sel === -1) continue;
    if (sel !== pivotRow) {
      [m[sel], m[pivotRow]] = [m[pivotRow], m[sel]];
      steps.push({ id: `swap-${pivotRow}`, latex: matrixToLatex(m), explanation: `Se intercambia fila ${pivotRow + 1} con fila ${sel + 1}.` });
    }
    for (let r = pivotRow + 1; r < rows; r++) {
      const factor = m[r][col].div(m[pivotRow][col]);
      if (factor.equals(0)) continue;
      m[r] = m[r].map((v, c) => v.sub(factor.mul(m[pivotRow][c])));
      steps.push({
        id: `eliminate-${r}-${pivotRow}`,
        latex: matrixToLatex(m),
        explanation: `Se elimina la columna ${col + 1} en la fila ${r + 1} usando la fila ${pivotRow + 1}.`,
      });
    }
    pivotRow++;
  }
  steps.push({ id: "ref", latex: matrixToLatex(m), explanation: "Forma escalonada (ref)." });
  return { result: m, steps };
}

/** Forma escalonada reducida (rref): cada pivote es 1, sin entradas distintas de 0 arriba o abajo de él. */
export function rref(a: Matrix): { result: Matrix; steps: Step[] } {
  const m = cloneMatrix(a);
  const rows = m.length;
  const cols = dims(a).cols;
  const steps: Step[] = [{ id: "initial", latex: matrixToLatex(m), explanation: "Matriz original." }];
  let pivotRow = 0;
  for (let col = 0; col < cols && pivotRow < rows; col++) {
    let sel = -1;
    for (let r = pivotRow; r < rows; r++) {
      if (!m[r][col].equals(0)) {
        sel = r;
        break;
      }
    }
    if (sel === -1) continue;
    if (sel !== pivotRow) {
      [m[sel], m[pivotRow]] = [m[pivotRow], m[sel]];
      steps.push({ id: `swap-${pivotRow}`, latex: matrixToLatex(m), explanation: `Se intercambia fila ${pivotRow + 1} con fila ${sel + 1}.` });
    }
    const pivotValue = m[pivotRow][col];
    if (!pivotValue.equals(1)) {
      m[pivotRow] = m[pivotRow].map((v) => v.div(pivotValue));
      steps.push({ id: `normalize-${pivotRow}`, latex: matrixToLatex(m), explanation: `Se divide la fila ${pivotRow + 1} entre ${fmt(pivotValue)}.` });
    }
    for (let r = 0; r < rows; r++) {
      if (r === pivotRow) continue;
      const factor = m[r][col];
      if (factor.equals(0)) continue;
      m[r] = m[r].map((v, c) => v.sub(factor.mul(m[pivotRow][c])));
      steps.push({ id: `eliminate-${r}-${pivotRow}`, latex: matrixToLatex(m), explanation: `Se elimina la columna ${col + 1} en la fila ${r + 1}.` });
    }
    pivotRow++;
  }
  steps.push({ id: "rref", latex: matrixToLatex(m), explanation: "Forma escalonada reducida (rref)." });
  return { result: m, steps };
}

// Módulo L0 (spec_graficacion_matrices_estadistica_unidades.md, sección
// 5): rango y traza expuestos como operaciones con resultado visible.
// `rank` reutiliza `ref()` (la misma eliminación que ya usa `gaussJordan`
// internamente para clasificar sistemas) en vez de reimplementarla — se
// cuentan las filas no nulas de la forma escalonada resultante, sin
// tocar `ref()` ni `gaussJordan` mismos.

export function trace(a: Matrix): { value: Fraction; steps: Step[] } {
  const { rows, cols } = dims(a);
  if (rows !== cols) {
    throw { code: ErrorCode.DIMENSION_MISMATCH, message: "La traza solo está definida para matrices cuadradas." } as AppError;
  }
  let sum = new Fraction(0);
  for (let i = 0; i < rows; i++) sum = sum.add(a[i][i]);
  return {
    value: sum,
    steps: [{ id: "trace", latex: `\\operatorname{tr}(A) = ${sum.toFraction(true)}`, explanation: "Suma de los elementos de la diagonal principal." }],
  };
}

export function rank(a: Matrix): { value: number; steps: Step[] } {
  const { result, steps: refSteps } = ref(a);
  const value = result.filter((row) => row.some((v) => !v.equals(0))).length;
  return {
    value,
    steps: [
      ...refSteps,
      { id: "rank", latex: `\\operatorname{rango}(A) = ${value}`, explanation: "Número de filas no nulas en la forma escalonada (ref)." },
    ],
  };
}

// ---------------------------------------------------------------------------
// MV-D-16/17: descomposición LU sin pivoteo y Gram-Schmidt sin normalizar.
// Ambas rutas son exactas (Fraction) y no comparten estado con las
// operaciones anteriores.
// ---------------------------------------------------------------------------

export interface LUDecomposition {
  l: Matrix;
  u: Matrix;
  steps: Step[];
}

function zeroMatrix(rows: number, cols: number): Matrix {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => new Fraction(0)),
  );
}

function identityMatrix(size: number): Matrix {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => new Fraction(row === col ? 1 : 0)),
  );
}

/**
 * Descomposición A = L·U por eliminación de Doolittle **sin intercambio de
 * filas**. Si aparece un pivote nulo, se informa explícitamente: no se
 * simula pivoteo ni se devuelve una factorización parcial.
 */
export function luDecomposition(a: Matrix): LUDecomposition {
  const rows = a.length;
  const cols = a[0]?.length ?? 0;
  if (rows === 0 || cols === 0) {
    throw { code: ErrorCode.DIMENSION_MISMATCH, message: "La matriz no puede estar vacía." } as AppError;
  }
  const working = cloneMatrix(a);
  const l = identityMatrix(rows);
  const u = zeroMatrix(rows, cols);
  const steps: Step[] = [
    { id: "initial", latex: matrixToLatex(a), explanation: "Matriz original para la descomposición LU." },
  ];
  const limit = Math.min(rows, cols);

  for (let k = 0; k < limit; k++) {
    const pivot = working[k][k];
    if (pivot.equals(0)) {
      throw {
        code: ErrorCode.DOMAIN_ERROR,
        message:
          `LU sin pivoteo no es posible: el pivote en la posición (${k + 1},${k + 1}) es 0. ` +
          "Se requiere intercambio de filas (pivoteo), que esta operación no realiza.",
      } as AppError;
    }
    for (let col = k; col < cols; col++) u[k][col] = new Fraction(working[k][col]);
    for (let row = k + 1; row < rows; row++) {
      const factor = working[row][k].div(pivot);
      l[row][k] = factor;
      if (factor.equals(0)) continue;
      for (let col = k; col < cols; col++) {
        working[row][col] = working[row][col].sub(factor.mul(working[k][col]));
      }
      steps.push({
        id: `lu-${row}-${k}`,
        latex: `F_{${row + 1}} \\leftarrow F_{${row + 1}} - (${fmt(factor)})F_{${k + 1}}`,
        explanation: `Se guarda L[${row + 1},${k + 1}] = ${fmt(factor)} y se elimina la columna ${k + 1}.`,
      });
    }
  }

  const product = multiplyMatrices(l, u).result;
  const verified = product.every((row, r) =>
    row.every((value, c) => value.equals(a[r][c])),
  );
  if (!verified) {
    throw {
      code: ErrorCode.UNSUPPORTED_OPERATION,
      message: "No se pudo verificar la descomposición LU de esta matriz.",
    } as AppError;
  }

  steps.push({
    id: "lu-result",
    latex: `L = ${matrixToLatex(l)},\\quad U = ${matrixToLatex(u)}`,
    explanation: "Factorización verificada exactamente: L es triangular inferior unitaria y U triangular superior.",
  });
  return { l, u, steps };
}

/**
 * Ortonormalización de Gram-Schmidt **sin normalizar** (solo ortogonaliza).
 * Cada fila de `vectors` es un vector de entrada; el resultado conserva el
 * mismo orden y también usa filas.
 */
export function gramSchmidt(vectors: Matrix): { result: Matrix; steps: Step[] } {
  const count = vectors.length;
  const dimension = vectors[0]?.length ?? 0;
  if (count === 0 || dimension === 0) {
    throw { code: ErrorCode.DIMENSION_MISMATCH, message: "Se requiere al menos un vector no vacío." } as AppError;
  }
  if (vectors.some((row) => row.length !== dimension)) {
    throw {
      code: ErrorCode.DIMENSION_MISMATCH,
      message: "Todos los vectores deben tener la misma dimensión.",
    } as AppError;
  }

  const result: Matrix = [];
  const steps: Step[] = [
    {
      id: "initial",
      latex: matrixToLatex(vectors),
      explanation: "Vectores de entrada (cada fila es un vector).",
    },
  ];

  for (let index = 0; index < count; index++) {
    const original = vectors[index].map((value) => new Fraction(value));
    let current = original.map((value) => new Fraction(value));
    for (let previous = 0; previous < result.length; previous++) {
      const basis = result[previous];
      let numerator = new Fraction(0);
      let denominator = new Fraction(0);
      for (let coordinate = 0; coordinate < dimension; coordinate++) {
        numerator = numerator.add(original[coordinate].mul(basis[coordinate]));
        denominator = denominator.add(basis[coordinate].mul(basis[coordinate]));
      }
      if (denominator.equals(0)) continue;
      const factor = numerator.div(denominator);
      if (factor.equals(0)) continue;
      current = current.map((value, coordinate) =>
        value.sub(factor.mul(basis[coordinate])),
      );
      steps.push({
        id: `gs-${index}-${previous}`,
        latex: `v_{${index + 1}} \\leftarrow v_{${index + 1}} - (${fmt(factor)})u_{${previous + 1}}`,
        explanation: `Se resta la proyección sobre el vector ortogonal u_${previous + 1}.`,
      });
    }
    result.push(current);
  }

  // Verificación exacta de ortogonalidad (el resultado no se publica si la
  // aritmética exacta no la confirma).
  for (let i = 0; i < result.length; i++) {
    for (let j = i + 1; j < result.length; j++) {
      let dot = new Fraction(0);
      for (let k = 0; k < dimension; k++) dot = dot.add(result[i][k].mul(result[j][k]));
      if (!dot.equals(0)) {
        throw {
          code: ErrorCode.UNSUPPORTED_OPERATION,
          message: "No se pudo verificar la ortogonalidad del resultado de Gram-Schmidt.",
        } as AppError;
      }
    }
  }

  steps.push({
    id: "gs-result",
    latex: matrixToLatex(result),
    explanation: "Vectores mutuamente ortogonales (sin normalizar).",
  });
  return { result, steps };
}


/** Producto de Kronecker A⊗B. */
export function kroneckerProduct(a: Matrix, b: Matrix): { result: Matrix; steps: Step[] } {
  const da = dims(a);
  const db = dims(b);
  const result: Matrix = [];
  for (let i = 0; i < da.rows; i++) {
    for (let bi = 0; bi < db.rows; bi++) {
      const row: Fraction[] = [];
      for (let j = 0; j < da.cols; j++) {
        for (let bj = 0; bj < db.cols; bj++) {
          row.push(a[i][j].mul(b[bi][bj]));
        }
      }
      result.push(row);
    }
  }
  return { result, steps: [{ id: "kron", latex: matrixToLatex(result), explanation: "Producto de Kronecker A⊗B." }] };
}

// ---------------------------------------------------------------------------
// P5 (spec v2 §6): Vectores en Matrices — dot/cross/norm. Un vector es una
// matriz 1xn o nx1 — no se crea componente de entrada nuevo (spec
// explícita), se reutiliza MatrixGridInput configurado con 1 fila o 1
// columna.
//
// `norm` rompe deliberadamente la regla "aritmética EXACTA con
// fraction.js (nunca floats)" del encabezado de este archivo: una raíz
// cuadrada normalmente NO es racional (ej. norm([1,1]) = sqrt(2)). La
// suma de cuadrados se calcula exacta en Fraction; solo el paso final
// (la raíz) se aproxima a decimal, y únicamente cuando no es un cuadrado
// perfecto. Documentado aquí explícitamente para que quede claro que es
// una excepción deliberada, no un descuido.
// ---------------------------------------------------------------------------

function toVector(m: Matrix): Fraction[] {
  const { rows, cols } = dims(m);
  if (rows === 1) return m[0];
  if (cols === 1) return m.map((row) => row[0]);
  throw {
    code: ErrorCode.DIMENSION_MISMATCH,
    message: `Se esperaba un vector (1 fila o 1 columna), se recibió una matriz de ${rows}x${cols}.`,
  } as AppError;
}

export function dotProduct(a: Matrix, b: Matrix): { value: Fraction; steps: Step[] } {
  const va = toVector(a);
  const vb = toVector(b);
  if (va.length !== vb.length) {
    throw dimensionError(`vector de la misma longitud que A (${va.length})`, `vector de longitud ${vb.length}`);
  }
  let sum = new Fraction(0);
  for (let i = 0; i < va.length; i++) sum = sum.add(va[i].mul(vb[i]));
  return {
    value: sum,
    steps: [{ id: "dot", latex: `A \\cdot B = ${sum.toFraction(true)}`, explanation: "Suma de los productos componente a componente." }],
  };
}

/** Válido únicamente para vectores de 3 componentes (spec v2 §6) —
 * dimensión inválida reutiliza el mismo AppError/ErrorCode.DIMENSION_MISMATCH
 * que el resto de las operaciones de matrices, no un código nuevo. */
export function crossProduct(a: Matrix, b: Matrix): { result: Matrix; steps: Step[] } {
  const va = toVector(a);
  const vb = toVector(b);
  if (va.length !== 3 || vb.length !== 3) {
    throw dimensionError("vectores de 3 componentes", `A de ${va.length} y B de ${vb.length}`);
  }
  const [a1, a2, a3] = va;
  const [b1, b2, b3] = vb;
  const result: Matrix = [[a2.mul(b3).sub(a3.mul(b2)), a3.mul(b1).sub(a1.mul(b3)), a1.mul(b2).sub(a2.mul(b1))]];
  return {
    result,
    steps: [{ id: "cross", latex: matrixToLatex(result), explanation: "Producto cruz A×B (solo definido en 3 dimensiones)." }],
  };
}

/** Magnitud/norma euclidiana. No requiere matriz B (como transpose/
 * determinant/inverse) — ver comentario de sección arriba sobre por qué
 * no es aritmética 100% exacta. */
export function vectorNorm(a: Matrix): { resultLatex: string; steps: Step[] } {
  const v = toVector(a);
  let sumSquares = new Fraction(0);
  for (const x of v) sumSquares = sumSquares.add(x.mul(x));

  const decimalSumSquares = sumSquares.valueOf();
  const sqrtValue = Math.sqrt(decimalSumSquares);
  const roundedSqrt = Math.round(sqrtValue);
  const isPerfectSquare = Number.isInteger(decimalSumSquares) && roundedSqrt * roundedSqrt === decimalSumSquares;

  const resultLatex = isPerfectSquare
    ? String(roundedSqrt)
    : `\\sqrt{${sumSquares.toFraction(true)}} \\approx ${Number(sqrtValue.toPrecision(12))}`;

  return {
    resultLatex,
    steps: [
      {
        id: "sumsq",
        latex: `\\|v\\|^2 = ${sumSquares.toFraction(true)}`,
        explanation: "Suma de los cuadrados de cada componente (exacta).",
      },
      {
        id: "norm",
        latex: `\\|v\\| = ${resultLatex}`,
        explanation: isPerfectSquare
          ? "Raíz cuadrada exacta (cuadrado perfecto)."
          : "Raíz cuadrada aproximada a 12 cifras (no es un cuadrado perfecto — ver nota de la sección sobre aritmética no exacta).",
      },
    ],
  };
}
