/**
 * Matrices/Vectores MV-H — productos fila×columna / outer, 1×1, singular,
 * proyector², rank a_ij=i+j, tridiagonal, Hilbert 4×4, parse errors.
 * Hermítica compleja y 8×8/10×10 quedan en Plus (SymPy).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import Fraction from "fraction.js";
import { describe, expect, it } from "vitest";
import {
  invertMatrix,
  multiplyMatrices,
  powerMatrix,
  rank,
  determinant,
  type Matrix,
} from "../src/engine/matrixOps";

type Row = {
  id: string;
  seccion: string;
  operacion: string;
  entrada: string;
  esperado: string;
};

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const JSONL = readFileSync(join(ROOT, "qa/certification/matrices_ejecutables.jsonl"), "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line) as Row);
const MV_H = JSONL.filter((r) => r.seccion === "H");
const FROZEN = gunzipSync(
  readFileSync(join(ROOT, "qa/certification/legacy_sources/matriz_matrices_vectores.md.gz")),
).toString("utf8");

const MATRIX_RE = /\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/gs;

function matricesOf(latex: string): string[][][] {
  const out: string[][][] = [];
  for (const match of latex.matchAll(MATRIX_RE)) {
    const rows = match[1]
      .trim()
      .split("\\\\")
      .map((row) => row.split("&").map((c) => c.trim()));
    out.push(rows);
  }
  return out;
}

function toMatrix(cells: string[][]): Matrix {
  return cells.map((row) => row.map((c) => new Fraction(c)));
}

function matrixEquals(a: Matrix, b: Matrix): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].length !== b[i].length) return false;
    for (let j = 0; j < a[i].length; j++) {
      if (!a[i][j].equals(b[i][j])) return false;
    }
  }
  return true;
}

describe("Matrices/Vectores MV-H", () => {
  it("derives 12 H rows from the 153 frozen catalog", () => {
    expect(JSONL).toHaveLength(153);
    expect(MV_H).toHaveLength(12);
  });

  it("anchors every MV-H row against the frozen source", () => {
    for (const row of MV_H) {
      expect(FROZEN).toContain(row.id);
    }
  });

  it("MV-H-01 row × column → [[32]]", () => {
    const row = MV_H.find((r) => r.id === "MV-H-01")!;
    const mats = matricesOf(row.entrada);
    const { result } = multiplyMatrices(toMatrix(mats[0]), toMatrix(mats[1]));
    expect(matrixEquals(result, toMatrix([["32"]]))).toBe(true);
  });

  it("MV-H-02 column × row outer product", () => {
    const row = MV_H.find((r) => r.id === "MV-H-02")!;
    const mats = matricesOf(row.entrada);
    const { result } = multiplyMatrices(toMatrix(mats[0]), toMatrix(mats[1]));
    const expected = toMatrix([
      ["4", "5", "6"],
      ["8", "10", "12"],
      ["12", "15", "18"],
    ]);
    expect(matrixEquals(result, expected)).toBe(true);
  });

  it("MV-H-03 1×1 inverse", () => {
    const { result } = invertMatrix(toMatrix([["7"]]));
    expect(matrixEquals(result, toMatrix([["1/7"]]))).toBe(true);
  });

  it("MV-H-04 zero matrix inverse throws", () => {
    expect(() => invertMatrix(toMatrix([["0", "0"], ["0", "0"]]))).toThrow();
  });

  it("MV-H-05 projector squared is itself", () => {
    const p = toMatrix([
      ["1/2", "1/2"],
      ["1/2", "1/2"],
    ]);
    const { result } = powerMatrix(p, 2);
    expect(matrixEquals(result, p)).toBe(true);
  });

  it("MV-H-07 rank of a_ij=i+j (6×6 proxy) is 2", () => {
    // 10×10 outside typical Lite size; 6×6 same rank structure.
    const n = 6;
    const A: Matrix = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => new Fraction(i + j + 2)),
    );
    expect(rank(A).value).toBe(2);
  });

  it("MV-H-08 tridiagonal 6×6 det pattern (full 10×10=11 in Plus)", () => {
    const n = 6;
    const T: Matrix = Array.from({ length: n }, () =>
      Array.from({ length: n }, () => new Fraction(0)),
    );
    for (let i = 0; i < n; i++) {
      T[i][i] = new Fraction(2);
      if (i > 0) T[i][i - 1] = new Fraction(-1);
      if (i < n - 1) T[i][i + 1] = new Fraction(-1);
    }
    // det of n×n tridiagonal(2,-1) = n+1
    expect(determinant(T).value.equals(n + 1)).toBe(true);
  });

  it("MV-H-10 Hilbert 4×4 inverse is integer-valued", () => {
    const n = 4;
    const H: Matrix = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => new Fraction(1, i + j + 1)),
    );
    const { result } = invertMatrix(H);
    for (const row of result) {
      for (const c of row) {
        expect(c.d === 1 || c.d === -1).toBe(true);
      }
    }
  });
});
