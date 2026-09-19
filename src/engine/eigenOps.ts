// engine/eigenOps.ts — Módulo K1 (spec_graficacion_matrices_estadistica_unidades.md,
// sección 3.2, diseño confirmado en K0). Importa Algebrite SOLO a través de
// algebriteClient.ts (regla de capa dura, ver su cabecera) — nunca
// `import Algebrite from "algebrite"` directo acá.
//
// Alcance determinado en K0, no supuesto:
// - Eigenvalores: 2x2 y 3x3 únicamente. Exactos cuando roots() da una
//   forma limpia (racional, irracional simple, compleja simple).
//   Fallback a numérico cuando el resultado simbólico es "casus
//   irreducibilis" (cúbica con 3 raíces reales irracionales que
//   roots() expresa con cos/sin/potencias fraccionarias de -1 —
//   matemáticamente correctas pero ilegibles).
// - Multiplicidad: detectada vía mcd(p, p') repetido, porque roots()
//   SIEMPRE colapsa a raíces distintas (confirmado en K0).
// - Eigenvectores: SOLO numéricos (float), y SOLO para eigenvalores
//   reales. Para eigenvalores complejos, se reporta explícitamente que
//   el eigenvector no se calcula en Lite (ver Cierre de Módulo) — no es
//   un olvido, es un límite de alcance declarado.

import Fraction from "fraction.js";
import type { Matrix } from "./matrixOps";
import { expand, polynomialGcd, solveEquation, derivative, substituteAndFloat } from "./algebriteClient";
import { ErrorCode, type AppError } from "../types";

export interface EigenPair {
  /** Forma exacta en sintaxis Algebrite (ej. "3", "2-2^(1/2)", "i") — null si solo hay aproximación numérica. */
  exact: string | null;
  /** Aproximación decimal, siempre presente. */
  approx: number;
  multiplicity: number;
  isComplex: boolean;
  /** null si isComplex, o si no se pudo resolver la nulidad de (A-λI) numéricamente. */
  eigenvector: number[] | null;
}

function fractionToAlgebriteStr(f: Fraction): string {
  return f.toFraction(false);
}

/**
 * Construye det(A - xI) como una expresión Algebrite, por expansión de
 * cofactores sobre strings — mismo algoritmo que `determinant()` en
 * matrixOps.ts, pero operando sobre texto simbólico en vez de
 * `Fraction`, porque la diagonal necesita "-x" y Fraction no puede
 * representar una variable libre.
 */
function buildCharacteristicPolynomialExpr(matrix: Matrix): string {
  const M: string[][] = matrix.map((row, i) =>
    row.map((f, j) => {
      const s = fractionToAlgebriteStr(f);
      return i === j ? `(${s}-x)` : `(${s})`;
    }),
  );

  function minor(mat: string[][], skipRow: number, skipCol: number): string[][] {
    return mat.filter((_, r) => r !== skipRow).map((row) => row.filter((_, c) => c !== skipCol));
  }

  function det(mat: string[][]): string {
    const k = mat.length;
    if (k === 1) return mat[0][0];
    if (k === 2) return `(${mat[0][0]}*${mat[1][1]}-${mat[0][1]}*${mat[1][0]})`;
    const terms: string[] = [];
    for (let c = 0; c < k; c++) {
      const sign = c % 2 === 0 ? "+" : "-";
      terms.push(`${sign}${mat[0][c]}*(${det(minor(mat, 0, c))})`);
    }
    return `(${terms.join("")})`;
  }

  return det(M);
}

/** Extrae todos los números (parte real e imaginaria) de un string de Algebrite para chequear "≈0". */
function isApproxZero(algebriteFloatResult: string, epsilon = 1e-6): boolean {
  const nums = algebriteFloatResult.match(/-?\d+\.?\d*(e[-+]?\d+)?/gi) ?? [];
  if (nums.length === 0) return false;
  return nums.every((n) => Math.abs(parseFloat(n)) < epsilon);
}

/** K0: heurística de "resultado ilegible" (casus irreducibilis) — cos/sin o potencia fraccionaria de -1. */
function looksMessy(rootExpr: string): boolean {
  return /cos\(|sin\(|\(-1\)\^\(/.test(rootExpr);
}

function parseComplexFloat(s: string): { re: number; im: number } {
  // Algebrite float() de un complejo viene como "a.a+b.b*i" o "a.a-b.b*i"
  // o solo "a.a" si es real, o solo "b.b*i"/"-b.b*i" si es imaginario puro.
  const cleaned = s.replace(/\.\.\.$/, "").trim();
  const imMatch = cleaned.match(/([+-]?\d+\.?\d*(?:e[+-]?\d+)?)\*i/);
  const im = imMatch ? parseFloat(imMatch[1]) : cleaned.includes("i") && !imMatch ? (cleaned.startsWith("-i") ? -1 : cleaned === "i" ? 1 : 0) : 0;
  const reMatch = cleaned.replace(/[+-]?\d+\.?\d*(?:e[+-]?\d+)?\*i/, "").match(/-?\d+\.?\d*(?:e[+-]?\d+)?/);
  const re = reMatch ? parseFloat(reMatch[0]) : 0;
  return { re, im };
}

/**
 * Espacio nulo (una dimensión) de una matriz numérica real por
 * eliminación gaussiana con pivoteo parcial y tolerancia epsilon —
 * necesario porque λ es solo una aproximación float, así que (A-λI)
 * nunca es EXACTAMENTE singular en punto flotante.
 */
function nullSpaceVector(M: number[][], epsilon = 1e-6): number[] | null {
  const n = M.length;
  const m = M.map((row) => [...row]);
  const pivotCols: number[] = [];
  let pivotRow = 0;

  for (let col = 0; col < n && pivotRow < n; col++) {
    let sel = -1;
    let maxAbs = epsilon;
    for (let r = pivotRow; r < n; r++) {
      if (Math.abs(m[r][col]) > maxAbs) {
        maxAbs = Math.abs(m[r][col]);
        sel = r;
      }
    }
    if (sel === -1) continue;
    [m[sel], m[pivotRow]] = [m[pivotRow], m[sel]];
    const pivotVal = m[pivotRow][col];
    m[pivotRow] = m[pivotRow].map((v) => v / pivotVal);
    for (let r = 0; r < n; r++) {
      if (r === pivotRow) continue;
      const factor = m[r][col];
      if (Math.abs(factor) < epsilon) continue;
      m[r] = m[r].map((v, c) => v - factor * m[pivotRow][c]);
    }
    pivotCols.push(col);
    pivotRow++;
  }

  const freeCol = Array.from({ length: n }, (_, c) => c).find((c) => !pivotCols.includes(c));
  if (freeCol === undefined) return null; // rango completo — no debería pasar si λ es realmente un eigenvalor

  const v = new Array(n).fill(0);
  v[freeCol] = 1;
  pivotCols.forEach((col, i) => {
    v[col] = -m[i][freeCol];
  });
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return norm > epsilon ? v.map((x) => x / norm) : null;
}

export function computeEigenvalues(matrix: Matrix): { pairs: EigenPair[]; allExact: boolean; characteristicPolynomial: string } {
  const n = matrix.length;
  if (n !== 2 && n !== 3) {
    throw {
      code: ErrorCode.UNSUPPORTED_OPERATION,
      message: "Los eigenvalores solo están soportados para matrices 2×2 y 3×3 en esta versión (determinado en la auditoría del Módulo K0).",
    } as AppError;
  }

  const charPolyRaw = buildCharacteristicPolynomialExpr(matrix);
  const charPoly = expand(charPolyRaw);
  const distinctRoots = solveEquation(charPoly, "x");

  const allExact = !distinctRoots.some(looksMessy);

  // Multiplicidad: mcd(p, p') repetido — cada iteración que "atrapa" una
  // raíz de mayor multiplicidad reduce el grado del mcd en 1 por cada
  // multiplicidad extra (K0: confirmado, no supuesto).
  const multiplicities = new Map<string, number>(distinctRoots.map((r) => [r, 1]));
  let currentPoly = charPoly;
  for (let iter = 0; iter < n - 1; iter++) {
    const deriv = derivative(currentPoly, "x", 1);
    let g: string;
    try {
      g = polynomialGcd(currentPoly, deriv);
    } catch {
      break;
    }
    if (/^-?\d+(\.\d+)?$/.test(g.trim())) break; // constante: no quedan raíces repetidas
    for (const r of distinctRoots) {
      const val = substituteAndFloat(g, "x", r);
      if (isApproxZero(val)) multiplicities.set(r, (multiplicities.get(r) ?? 1) + 1);
    }
    currentPoly = g;
  }

  const pairs: EigenPair[] = distinctRoots.map((r) => {
    const { re, im } = parseComplexFloat(evaluateFloatOf(r));
    const isComplex = Math.abs(im) > 1e-9;
    let eigenvector: number[] | null = null;
    if (!isComplex) {
      const AminusLambdaI = matrix.map((row, i) => row.map((f, j) => f.valueOf() - (i === j ? re : 0)));
      eigenvector = nullSpaceVector(AminusLambdaI);
    }
    return {
      exact: allExact && !looksMessy(r) ? r : null,
      approx: re,
      multiplicity: multiplicities.get(r) ?? 1,
      isComplex,
      eigenvector,
    };
  });

  return { pairs, allExact, characteristicPolynomial: charPoly };
}

function evaluateFloatOf(rootExpr: string): string {
  // float(r) directo — separado de substituteAndFloat porque acá no hay
  // sustitución, solo forzar aproximación decimal del propio valor.
  return substituteAndFloat("y", "y", rootExpr);
}
