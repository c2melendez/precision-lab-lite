/**
 * Matrices/Vectores MV-E-01..12 — rango, núcleo y espacio columna.
 * Anclado a matriz_matrices_vectores.md.gz / matrices_ejecutables.jsonl.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import Fraction from "fraction.js";
import { describe, expect, it } from "vitest";
import { columnspace, nullspace, rank, type Matrix } from "../src/engine/matrixOps";

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
const MV_E = JSONL.filter((r) => r.seccion === "E");
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

/** Comprueba que cada columna-oráculo está en el span de los vectores (filas) del producto. */
function spanEquals(actual: Matrix, expectedCols: string[][][]): boolean {
  if (actual.length === 0 && expectedCols.length === 0) return true;
  const n = actual[0]?.length ?? 0;
  for (const colMat of expectedCols) {
    const target = colMat.map((row) => new Fraction(row[0]));
    const cols = actual.length;
    const m: Fraction[][] = [];
    for (let r = 0; r < n; r++) {
      m.push([...actual.map((b) => b[r]), target[r]]);
    }
    let pivot = 0;
    for (let c = 0; c < cols; c++) {
      let piv = -1;
      for (let r = pivot; r < n; r++) {
        if (!m[r][c].equals(0)) {
          piv = r;
          break;
        }
      }
      if (piv < 0) continue;
      [m[pivot], m[piv]] = [m[piv], m[pivot]];
      const div = m[pivot][c];
      m[pivot] = m[pivot].map((x) => x.div(div));
      for (let r = 0; r < n; r++) {
        if (r === pivot) continue;
        const f = m[r][c];
        if (f.equals(0)) continue;
        m[r] = m[r].map((x, j) => x.sub(f.mul(m[pivot][j])));
      }
      pivot++;
    }
    for (let r = 0; r < n; r++) {
      const allZero = m[r].slice(0, cols).every((x) => x.equals(0));
      if (allZero && !m[r][cols].equals(0)) return false;
    }
  }
  return actual.length === expectedCols.length;
}

describe("Matrices/Vectores MV-E-01..12 (rango, núcleo, Col)", () => {
  it("derives 12 E rows from the 153 frozen catalog", () => {
    expect(JSONL).toHaveLength(153);
    expect(MV_E).toHaveLength(12);
  });

  it("anchors every MV-E row against the frozen source", () => {
    for (const row of MV_E) {
      expect(FROZEN).toContain(row.id);
      expect(FROZEN).toContain(row.entrada.slice(0, 40));
    }
  });

  for (const row of MV_E.filter((r) => /^MV-E-0[1-7]$/.test(r.id))) {
    it(`${row.id} rank is exact`, () => {
      const matrix = toMatrix(matricesOf(row.entrada)[0]);
      expect(rank(matrix).value).toBe(Number(row.esperado));
    });
  }

  it("MV-E-08 parametric rank at a=±1 and generic", () => {
    const base = matricesOf(MV_E.find((r) => r.id === "MV-E-08")!.entrada)[0];
    expect(rank(toMatrix(base.map((row) => row.map((c) => c.replace("a", "0"))))).value).toBe(2);
    expect(rank(toMatrix(base.map((row) => row.map((c) => c.replace("a", "1"))))).value).toBe(1);
    expect(rank(toMatrix(base.map((row) => row.map((c) => c.replace("a", "-1"))))).value).toBe(1);
  });

  it("MV-E-09 kernel basis spans the oracle vector", () => {
    const row = MV_E.find((r) => r.id === "MV-E-09")!;
    const { vectors } = nullspace(toMatrix(matricesOf(row.entrada)[0]));
    expect(vectors.length).toBeGreaterThanOrEqual(1);
    expect(spanEquals(vectors, matricesOf(row.esperado))).toBe(true);
  });

  it("MV-E-10 column space spans the oracle pivot columns", () => {
    const row = MV_E.find((r) => r.id === "MV-E-10")!;
    const { vectors } = columnspace(toMatrix(matricesOf(row.entrada)[0]));
    expect(vectors.length).toBe(2);
    expect(spanEquals(vectors, matricesOf(row.esperado))).toBe(true);
  });

  it("MV-E-11 kernel has dimension 2 and spans the oracle", () => {
    const row = MV_E.find((r) => r.id === "MV-E-11")!;
    const { vectors } = nullspace(toMatrix(matricesOf(row.entrada)[0]));
    expect(vectors.length).toBe(2);
    expect(spanEquals(vectors, matricesOf(row.esperado))).toBe(true);
  });

  it("MV-E-12 rank-nullity equals number of columns", () => {
    const row = MV_E.find((r) => r.id === "MV-E-12")!;
    const matrix = toMatrix(matricesOf(row.entrada)[0]);
    const r = rank(matrix).value;
    const n = nullspace(matrix).vectors.length;
    expect(r + n).toBe(Number(row.esperado));
  });
});
