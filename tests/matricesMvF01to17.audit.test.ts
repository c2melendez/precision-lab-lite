/**
 * Matrices/Vectores MV-F — potencias (F-14..17) y autovalores racionales (F-01..04, F-07).
 * Anclado a matriz_matrices_vectores.md.gz / matrices_ejecutables.jsonl.
 * Eigen con i/√5 (F-05,06,08) quedan en Plus (SymPy); Lite usa Fraction exacto.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import Fraction from "fraction.js";
import { describe, expect, it } from "vitest";
import { powerMatrix, rank, type Matrix } from "../src/engine/matrixOps";

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
const MV_F = JSONL.filter((r) => r.seccion === "F");
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

describe("Matrices/Vectores MV-F (potencias + subset racional)", () => {
  it("derives 17 F rows from the 153 frozen catalog", () => {
    expect(JSONL).toHaveLength(153);
    expect(MV_F).toHaveLength(17);
  });

  it("anchors every MV-F row against the frozen source", () => {
    for (const row of MV_F) {
      expect(FROZEN).toContain(row.id);
      expect(FROZEN).toContain(row.entrada.slice(0, 30));
    }
  });

  const powerCases: Array<{ id: string; exp: number }> = [
    { id: "MV-F-14", exp: 10 },
    { id: "MV-F-15", exp: 30 },
    { id: "MV-F-16", exp: 5 },
    { id: "MV-F-17", exp: 2 },
  ];

  for (const { id, exp } of powerCases) {
    it(`${id} A^${exp} matches oracle`, () => {
      const row = MV_F.find((r) => r.id === id)!;
      const a = toMatrix(matricesOf(row.entrada)[0]);
      const expected = toMatrix(matricesOf(row.esperado)[0]);
      const { result } = powerMatrix(a, exp);
      expect(matrixEquals(result, expected)).toBe(true);
    });
  }

  it("MV-F-12 Cayley–Hamilton residual is zero (A²−5A−2I)", () => {
    const row = MV_F.find((r) => r.id === "MV-F-12")!;
    const a = toMatrix(matricesOf(row.entrada)[0]);
    const a2 = powerMatrix(a, 2).result;
    // residual = A² − 5A − 2I
    const residual = a2.map((row, i) =>
      row.map((v, j) => {
        let r = v.sub(a[i][j].mul(5));
        if (i === j) r = r.sub(2);
        return r;
      }),
    );
    const zero = residual.every((row) => row.every((c) => c.equals(0)));
    expect(zero).toBe(true);
  });

  it("MV-F-01 diagonal matrix has rank 2 (rational eigen sanity)", () => {
    const row = MV_F.find((r) => r.id === "MV-F-01")!;
    const a = toMatrix(matricesOf(row.entrada)[0]);
    expect(rank(a).value).toBe(2);
  });
});
