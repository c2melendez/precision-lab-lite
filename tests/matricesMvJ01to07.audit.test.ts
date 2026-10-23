/**
 * Matrices/Vectores MV-J — rotación 90°, det=1, R^4=I, reflexión, shear,
 * composición de rotaciones (identidad trig), det diagonal.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import Fraction from "fraction.js";
import { describe, expect, it } from "vitest";
import {
  determinant,
  multiplyMatrices,
  powerMatrix,
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
const MV_J = JSONL.filter((r) => r.seccion === "J");
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

describe("Matrices/Vectores MV-J (transformaciones)", () => {
  it("derives 7 J rows; catalog has A–H+J (no I)", () => {
    expect(JSONL).toHaveLength(153);
    expect(MV_J).toHaveLength(7);
    const sections = new Set(JSONL.map((r) => r.seccion));
    expect([...sections].sort().join("")).toBe("ABCDEFGHJ");
  });

  it("anchors every MV-J row against the frozen source", () => {
    for (const row of MV_J) {
      expect(FROZEN).toContain(row.id);
    }
  });

  it("MV-J-01 rotation 90° of e1", () => {
    const row = MV_J.find((r) => r.id === "MV-J-01")!;
    const mats = matricesOf(row.entrada);
    const { result } = multiplyMatrices(toMatrix(mats[0]), toMatrix(mats[1]));
    expect(matrixEquals(result, toMatrix([["0"], ["1"]]))).toBe(true);
  });

  it("MV-J-02 det(R90) = 1", () => {
    const { value } = determinant(toMatrix([["0", "-1"], ["1", "0"]]));
    expect(value.equals(1)).toBe(true);
  });

  it("MV-J-03 R90^4 = I", () => {
    const { result } = powerMatrix(toMatrix([["0", "-1"], ["1", "0"]]), 4);
    expect(
      matrixEquals(result, toMatrix([["1", "0"], ["0", "1"]])),
    ).toBe(true);
  });

  it("MV-J-04 reflection", () => {
    const row = MV_J.find((r) => r.id === "MV-J-04")!;
    const mats = matricesOf(row.entrada);
    const { result } = multiplyMatrices(toMatrix(mats[0]), toMatrix(mats[1]));
    expect(matrixEquals(result, toMatrix([["3"], ["-2"]]))).toBe(true);
  });

  it("MV-J-05 shear", () => {
    const row = MV_J.find((r) => r.id === "MV-J-05")!;
    const mats = matricesOf(row.entrada);
    const { result } = multiplyMatrices(toMatrix(mats[0]), toMatrix(mats[1]));
    expect(matrixEquals(result, toMatrix([["3"], ["1"]]))).toBe(true);
  });

  it("MV-J-06 rotation composition (numeric proxy θ=π/2, φ=π/2)", () => {
    // R(π/2)^2 = R(π) = [[-1,0],[0,-1]]
    const R90 = toMatrix([["0", "-1"], ["1", "0"]]);
    const { result } = multiplyMatrices(R90, R90);
    expect(
      matrixEquals(result, toMatrix([["-1", "0"], ["0", "-1"]])),
    ).toBe(true);
  });

  it("MV-J-07 det(diag(2,3)) = 6", () => {
    const { value } = determinant(toMatrix([["2", "0"], ["0", "3"]]));
    expect(value.equals(6)).toBe(true);
  });
});
