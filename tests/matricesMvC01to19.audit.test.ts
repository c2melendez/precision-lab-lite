import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import Fraction from "fraction.js";
import { parseExpression } from "../src/engine/parsing";
import { simplifyExpression } from "../src/engine/algebriteClient";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FROZEN = gunzipSync(
  readFileSync(join(ROOT, "qa/certification/legacy_sources/matriz_matrices_vectores.md.gz")),
).toString("utf8");
const ALL_ROWS = readFileSync(join(ROOT, "qa/certification/matrices_ejecutables.jsonl"), "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const MV_C = ALL_ROWS.filter((row) => row.seccion === "C");

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
  scope.onmessage!({ data: { ...message, requestId: "mv-c" } });
  return scope.postMessage.mock.calls.at(-1)![0];
}

/** La tabla congelada usa LaTeX de celda; la grilla de Lite recibe fracciones ASCII. */
function cellToAscii(cell: string): string {
  const compact = cell.replace(/\s+/g, "");
  return compact.replace(/^(-?)\\frac\{([+-]?\d+)\}\{([+-]?\d+)\}$/, "$1$2/$3");
}

function matricesOf(expression: string, convert: (cell: string) => string): string[][][] {
  return [...expression.matchAll(/\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g)].map((match) =>
    match[1]
      .split(/\\\\/)
      .map((row) => row.trim())
      .filter(Boolean)
      .map((row) => row.split("&").map(convert)),
  );
}

function inputCells(row: any): string[][] {
  return matricesOf(row.entrada, cellToAscii)[0];
}

function resultCells(latex: string | null): string[][] {
  if (!latex) return [];
  return matricesOf(latex, (cell) => cell)[0] ?? [];
}

function expectedCells(row: any): string[][] {
  return matricesOf(row.esperado, (cell) => cell)[0] ?? [];
}

function toFraction(cell: string): Fraction {
  const compact = cell.replace(/\s+/g, "");
  const frac = /^(-?)\\frac\{([+-]?\d+)\}\{([+-]?\d+)\}$/.exec(compact);
  if (frac) return new Fraction(`${frac[1]}${frac[2]}/${frac[3]}`);
  return new Fraction(compact);
}

/** Acepta cualquier forma algebraicamente equivalente (convención G2). */
function expectAlgebraicallyEquivalent(actual: string, expected: string): void {
  const actualAlgebrite = parseExpression(actual).algebrite;
  const expectedAlgebrite = parseExpression(expected).algebrite;
  expect(simplifyExpression(`(${actualAlgebrite})-(${expectedAlgebrite})`)).toBe("0");
}

function dispatch(row: any): Record<string, unknown> {
  if (row.id === "MV-C-18" || row.id === "MV-C-19") {
    const cells = matricesOf(row.entrada, cellToAscii);
    return {
      type: "matrixOp",
      op: "solveEquation",
      a: cells[0],
      b: cells[1],
      xOnLeft: row.id === "MV-C-18",
    };
  }
  const cells = inputCells(row);
  if (row.id === "MV-C-14" || row.id === "MV-C-15") {
    return { type: "matrixOp", op: "adjugate", a: cells };
  }
  if (row.id === "MV-C-16") {
    return { type: "matrixOp", op: "cofactor", a: cells };
  }
  return { type: "matrixOp", op: "inverse", a: cells };
}

const SYMBOLIC_ROWS = new Set(["MV-C-08", "MV-C-10", "MV-C-11"]);

describe("Matrices/Vectores MV-C-01..19 (inversa, adjunta, cofactores y ecuaciones)", () => {
  it("derives all 153 frozen rows with the documented section counts", () => {
    expect(ALL_ROWS.length).toBe(153);
    const counts = ALL_ROWS.reduce<Record<string, number>>((acc, row) => {
      acc[row.seccion] = (acc[row.seccion] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts).toEqual({ A: 25, B: 22, C: 19, D: 17, E: 12, F: 17, G: 22, H: 12, J: 7 });
    expect(MV_C.length).toBe(19);
  });

  it("anchors every MV-C row against the frozen source", () => {
    for (const row of MV_C) {
      const line = frozenRow(row.id);
      expect(line, `${row.id} missing in frozen source`).not.toBe("");
      expect(line, `${row.id} entrada`).toContain(row.entrada);
      expect(line, `${row.id} esperado`).toContain(row.esperado);
    }
  });

  it.each(MV_C.map((row) => [row.id, row]))("%s evaluates through the real worker", (id, row: any) => {
    const reply = send(dispatch(row));

    if (row.operacion === "error") {
      expect(reply.success, JSON.stringify(reply)).toBe(false);
      expect(reply.errorCode).toBe("DOMAIN_ERROR");
      expect(String(reply.errorMessage)).toMatch(/singular|determinante 0/i);
      return;
    }

    expect(reply.success, JSON.stringify(reply)).toBe(true);
    const actual = resultCells(reply.resultLatex);
    const expected = expectedCells(row);
    expect(actual.length, JSON.stringify(reply)).toBe(expected.length);
    expect(actual[0]?.length ?? 0).toBe(expected[0]?.length ?? 0);

    for (let r = 0; r < expected.length; r += 1) {
      for (let c = 0; c < expected[r].length; c += 1) {
        if (SYMBOLIC_ROWS.has(row.id)) {
          expectAlgebraicallyEquivalent(actual[r][c], expected[r][c]);
        } else {
          expect(toFraction(actual[r][c]).equals(toFraction(expected[r][c])), `${row.id} (${r},${c})`).toBe(true);
        }
      }
    }
  });

  it("keeps the Hilbert inverse and the complex inverse exact", () => {
    const hilbert4 = send(dispatch(MV_C.find((row) => row.id === "MV-C-07")));
    expect(resultCells(hilbert4.resultLatex)[2][2].trim()).toBe("6480");
    const complex = send(dispatch(MV_C.find((row) => row.id === "MV-C-08")));
    expect(complex.resultLatex).toContain("-\\frac{i}{2}");
  });

  it("rejects singular matrices with a clear error", () => {
    for (const id of ["MV-C-12", "MV-C-13"]) {
      const reply = send(dispatch(MV_C.find((row) => row.id === id)));
      expect(reply.success).toBe(false);
      expect(reply.errorCode).toBe("DOMAIN_ERROR");
      expect(String(reply.errorMessage).length).toBeGreaterThan(20);
    }
  });

  it("solves XA=B and AX=B with the correct product order", () => {
    const left = send(dispatch(MV_C.find((row) => row.id === "MV-C-18")));
    expect(resultCells(left.resultLatex).map((row) => row.map((cell) => cell.trim()))).toEqual([["-1", "2"], ["-2", "3"]]);
    const right = send(dispatch(MV_C.find((row) => row.id === "MV-C-19")));
    expect(resultCells(right.resultLatex).map((row) => row.map((cell) => cell.trim()))).toEqual([["-3", "-4"], ["4", "5"]]);
  });
});
