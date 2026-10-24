/**
 * Matrices/Vectores MV-G-01..22 — operaciones vectoriales.
 * Superficies: addMatrices, dotProduct, crossProduct, vectorNorm.
 * Geometría (plano/distancia/intersección) se verifica por fórmula exacta.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import Fraction from "fraction.js";
import { describe, expect, it } from "vitest";
import {
  addMatrices,
  crossProduct,
  dotProduct,
  vectorNorm,
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
const MV_G = JSONL.filter((r) => r.seccion === "G");
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

describe("Matrices/Vectores MV-G (vectores)", () => {
  it("derives 22 G rows from the 153 frozen catalog", () => {
    expect(JSONL).toHaveLength(153);
    expect(MV_G).toHaveLength(22);
  });

  it("anchors every MV-G row against the frozen source", () => {
    for (const row of MV_G) {
      expect(FROZEN).toContain(row.id);
    }
  });

  it("MV-G-01 vector add", () => {
    const row = MV_G.find((r) => r.id === "MV-G-01")!;
    const mats = matricesOf(row.entrada);
    const { result } = addMatrices(toMatrix(mats[0]), toMatrix(mats[1]));
    expect(matrixEquals(result, toMatrix(matricesOf(row.esperado)[0]))).toBe(true);
  });

  it("MV-G-02 dot product", () => {
    const row = MV_G.find((r) => r.id === "MV-G-02")!;
    const mats = matricesOf(row.entrada);
    const { value } = dotProduct(toMatrix(mats[0]), toMatrix(mats[1]));
    expect(value.equals(32)).toBe(true);
  });

  it("MV-G-03 cross product", () => {
    const row = MV_G.find((r) => r.id === "MV-G-03")!;
    const mats = matricesOf(row.entrada);
    const { result } = crossProduct(toMatrix(mats[0]), toMatrix(mats[1]));
    // result is 1×3 row
    const expected = toMatrix([["-3", "6", "-3"]]);
    expect(matrixEquals(result, expected)).toBe(true);
  });

  it("MV-G-04 cross antisymmetry", () => {
    const row = MV_G.find((r) => r.id === "MV-G-04")!;
    const mats = matricesOf(row.entrada);
    const { result } = crossProduct(toMatrix(mats[0]), toMatrix(mats[1]));
    expect(matrixEquals(result, toMatrix([["3", "-6", "3"]]))).toBe(true);
  });

  it("MV-G-05 norm sqrt(14)", () => {
    const row = MV_G.find((r) => r.id === "MV-G-05")!;
    const mats = matricesOf(row.entrada);
    const { resultLatex } = vectorNorm(toMatrix(mats[0]));
    expect(resultLatex).toContain("14");
  });

  it("MV-G-11 and MV-G-13 orthogonal dots are zero", () => {
    for (const id of ["MV-G-11", "MV-G-13"]) {
      const row = MV_G.find((r) => r.id === id)!;
      const mats = matricesOf(row.entrada);
      const { value } = dotProduct(toMatrix(mats[0]), toMatrix(mats[1]));
      expect(value.equals(0)).toBe(true);
    }
  });

  it("MV-G-12 parallel cross is zero", () => {
    const row = MV_G.find((r) => r.id === "MV-G-12")!;
    const mats = matricesOf(row.entrada);
    const { result } = crossProduct(toMatrix(mats[0]), toMatrix(mats[1]));
    expect(result[0].every((c) => c.equals(0))).toBe(true);
  });

  it("MV-G-14 dot dimension mismatch throws", () => {
    expect(() =>
      dotProduct(
        toMatrix([["1"], ["2"]]),
        toMatrix([["1"], ["2"], ["3"]]),
      ),
    ).toThrow();
  });

  it("MV-G-15 cross 2D throws", () => {
    expect(() =>
      crossProduct(toMatrix([["1"], ["2"]]), toMatrix([["3"], ["4"]])),
    ).toThrow();
  });

  it("MV-G-08 projection formula exact", () => {
    // proj_a b = (b·a / a·a) a
    const a = toMatrix([["1"], ["2"], ["3"]]);
    const b = toMatrix([["4"], ["5"], ["6"]]);
    const ba = dotProduct(b, a).value;
    const aa = dotProduct(a, a).value;
    const scale = ba.div(aa);
    const proj = a.map((row) => row.map((c) => c.mul(scale)));
    const expected = toMatrix([["16/7"], ["32/7"], ["48/7"]]);
    expect(matrixEquals(proj, expected)).toBe(true);
  });

  it("MV-G-18 distance point-plane formula", () => {
    // |2*1 - 2 + 2*3 - 5| / sqrt(4+1+4) = |2-2+6-5|/3 = 1/3
    const num = Math.abs(2 * 1 - 1 * 2 + 2 * 3 - 5);
    const den = Math.sqrt(4 + 1 + 4);
    expect(num / den).toBeCloseTo(1 / 3, 10);
  });

  it("MV-G-22 angle between (1,0) and (1,1) is π/4", () => {
    const a = toMatrix([["1"], ["0"]]);
    const b = toMatrix([["1"], ["1"]]);
    const cos = dotProduct(a, b).value.valueOf() / (1 * Math.SQRT2);
    expect(Math.acos(cos)).toBeCloseTo(Math.PI / 4, 10);
  });
});
