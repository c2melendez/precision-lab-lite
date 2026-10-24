import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import Fraction from "fraction.js";
import { detectMatrixIntent } from "../src/engine/parsing/matrixIntent";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FROZEN = gunzipSync(
  readFileSync(join(ROOT, "qa/certification/legacy_sources/matriz_matrices_vectores.md.gz")),
).toString("utf8");
const ALL_ROWS = readFileSync(join(ROOT, "qa/certification/matrices_ejecutables.jsonl"), "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const MV_A = ALL_ROWS.filter((row) => row.seccion === "A");

const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => {
  vi.stubGlobal("self", scope);
  await import("../src/workers/compute.worker");
});
afterAll(() => vi.unstubAllGlobals());

function frozenRow(id: string): string {
  return FROZEN.split("\n").find((line) => new RegExp(`\\|\\s*${id}\\s*\\|`).test(line)) ?? "";
}

function send(message: Record<string, unknown>): any {
  scope.postMessage.mockClear();
  scope.onmessage!({ data: { ...message, requestId: "mv-a" } });
  return scope.postMessage.mock.calls.at(-1)![0];
}

/** La tabla congelada usa LaTeX de celda; el módulo Matrices recibe razones ASCII. */
function cellToAscii(cell: string): string {
  const compact = cell.replace(/\s+/g, "");
  return compact.replace(/^(-?)\\frac\{([+-]?\d+)\}\{([+-]?\d+)\}$/, "$1$2/$3");
}

function matricesOf(expression: string): string[][][] {
  return [...expression.matchAll(/\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g)].map((match) =>
    match[1]
      .split(/\\\\/)
      .map((row) => row.trim())
      .filter(Boolean)
      .map((row) => row.split("&").map(cellToAscii)),
  );
}

function parseLatexMatrix(latex: string): Fraction[][] {
  const body = /\\begin\{[pb]matrix\}([\s\S]*?)\\end\{[pb]matrix\}/.exec(latex);
  if (!body) throw new Error(`not a matrix: ${latex}`);
  return body[1]
    .split(/\\\\/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => row.split("&").map((cell) => toFraction(cell)));
}

function toFraction(cell: string): Fraction {
  const compact = cell.replace(/\s+/g, "");
  const frac = /^(-?)\\frac\{([+-]?\d+)\}\{([+-]?\d+)\}$/.exec(compact);
  if (frac) return new Fraction(`${frac[1]}${frac[2]}/${frac[3]}`);
  return new Fraction(compact);
}

/** Normalizes the three result channels used by the worker: pmatrix, "a, b | c, d", scalar. */
function resultValue(reply: any): Fraction[][] | Fraction {
  const latex = String(reply.resultLatex ?? "");
  if (latex.startsWith("\\begin{pmatrix}") || latex.startsWith("\\begin{bmatrix}")) {
    return parseLatexMatrix(latex);
  }
  if (latex.includes("|")) {
    return latex.split("|").map((row) => row.split(",").map((cell) => toFraction(cell)));
  }
  return toFraction(latex);
}

function dispatch(row: any): Record<string, unknown> {
  const expression: string = row.entrada;
  const matrices = matricesOf(expression);
  if (row.id === "MV-A-24") {
    return {
      type: "matrixExpression",
      expression: "(A+B)^2-(A^2+2*A*B+B^2)",
      matrices: { A: [[1, 2], [3, 4]], B: [[0, 1], [1, 0]], C: [], D: [], E: [], F: [] },
    };
  }
  if (row.operacion === "error") {
    if (row.id === "MV-A-20") return { type: "matrixOp", op: "add", a: matrices[0], b: matrices[1] };
    if (row.id === "MV-A-21") return { type: "matrixOp", op: "multiply", a: matrices[0], b: matrices[1] };
    if (row.id === "MV-A-22") return { type: "matrixOp", op: "inverse", a: matrices[0] };
    return { type: "matrixOp", op: "power", a: matrices[0], exponent: 2 };
  }
  if (row.operacion === "suma") {
    const subtract = /\\end\{pmatrix\}\s*-/.test(expression);
    return { type: "matrixOp", op: subtract ? "subtract" : "add", a: matrices[0], b: matrices[1] };
  }
  if (row.operacion === "producto") {
    const prefix = expression.split("\\begin{pmatrix}")[0].trim();
    if (prefix) {
      const intent = detectMatrixIntent(expression);
      if (intent?.kind !== "scale") throw new Error(`${row.id}: missing scale intent`);
      return { type: "matrixOp", op: "scale", a: matrices[0], scalar: intent.scalar };
    }
    return { type: "matrixOp", op: "multiply", a: matrices[0], b: matrices[1] };
  }
  if (row.operacion === "potencia") {
    if (expression.includes("^{T}")) return { type: "matrixOp", op: "transpose", a: matrices[0] };
    const exponent = /\^\{(-?\d+)\}/.exec(expression);
    return { type: "matrixOp", op: "power", a: matrices[0], exponent: exponent ? Number(exponent[1]) : 1 };
  }
  if (row.operacion === "valor") return { type: "matrixOp", op: "trace", a: matrices[0] };
  if (row.operacion === "matriz") {
    if (expression.trimStart().startsWith("\\operatorname{tr}")) {
      return { type: "matrixOp", op: "trace", a: matrices[0] };
    }
    if (expression.includes("^{T}")) return { type: "matrixOp", op: "transpose", a: matrices[0] };
    if (expression.includes("\\cdot")) return { type: "matrixOp", op: "multiply", a: matrices[0], b: matrices[1] };
    const subtract = /\\end\{pmatrix\}\s*-/.test(expression);
    return { type: "matrixOp", op: subtract ? "subtract" : "add", a: matrices[0], b: matrices[1] };
  }
  throw new Error(`${row.id}: unsupported operation ${row.operacion}`);
}

function expectSame(actual: Fraction[][] | Fraction, expected: Fraction[][] | Fraction): void {
  if (actual instanceof Fraction || expected instanceof Fraction) {
    expect(actual instanceof Fraction).toBe(true);
    expect(expected instanceof Fraction).toBe(true);
    expect((actual as Fraction).equals(expected as Fraction)).toBe(true);
    return;
  }
  expect(actual.length).toBe(expected.length);
  for (let row = 0; row < expected.length; row += 1) {
    expect(actual[row].length).toBe(expected[row].length);
    for (let col = 0; col < expected[row].length; col += 1) {
      expect(actual[row][col].equals(expected[row][col])).toBe(true);
    }
  }
}

describe("Matrices/Vectores MV-A-01..25 (operaciones básicas)", () => {
  it("derives all 153 frozen rows with the documented section counts", () => {
    expect(ALL_ROWS.length).toBe(153);
    const counts = ALL_ROWS.reduce<Record<string, number>>((acc, row) => {
      acc[row.seccion] = (acc[row.seccion] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts).toEqual({ A: 25, B: 22, C: 19, D: 17, E: 12, F: 17, G: 22, H: 12, J: 7 });
    expect(MV_A.length).toBe(25);
  });

  it("anchors every MV-A row against the frozen source", () => {
    for (const row of MV_A) {
      expect(frozenRow(row.id), `${row.id} missing in frozen source`).toContain(row.entrada);
      expect(frozenRow(row.id)).toContain(row.esperado);
    }
  });

  it.each(MV_A.map((row) => [row.id, row]))("%s evaluates through the real worker", (id, row: any) => {
    const reply = send(dispatch(row));
    if (row.operacion === "error") {
      expect(reply.success, JSON.stringify(reply)).toBe(false);
      expect(reply.errorCode).toBe("DIMENSION_MISMATCH");
      expect(String(reply.errorMessage).length).toBeGreaterThan(20);
      return;
    }
    expect(reply.success, JSON.stringify(reply)).toBe(true);
    const expected = row.esperado.startsWith("\\begin") ? parseLatexMatrix(row.esperado) : toFraction(row.esperado);
    expectSame(resultValue(reply), expected);
  });

  it("keeps the scalar channel exact (1/2*A and trace)", () => {
    const scale = send(dispatch(MV_A.find((row) => row.id === "MV-A-04")));
    expect(scale.resultLatex).toContain("\\frac{1}{2}");
    const trace = send(dispatch(MV_A.find((row) => row.id === "MV-A-10")));
    expect(trace.resultLatex).toBe("5");
  });

  it("keeps negative powers exact and rejects the singular case", () => {
    const inverseSquared = send(dispatch(MV_A.find((row) => row.id === "MV-A-13")));
    expectSame(resultValue(inverseSquared), parseLatexMatrix("\\begin{pmatrix}\\frac{11}{2}&-\\frac{5}{2}\\\\-\\frac{15}{4}&\\frac{7}{4}\\end{pmatrix}"));
    const singular = send({ type: "matrixOp", op: "power", a: [["1", "2"], ["2", "4"]], exponent: -1 });
    expect(singular.success).toBe(false);
    expect(singular.errorCode).toBe("DOMAIN_ERROR");
  });
});
