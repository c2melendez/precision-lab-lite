import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import Fraction from "fraction.js";
import { parseExpression } from "../src/engine/parsing";
import { simplifyExpression, toLatex } from "../src/engine/algebriteClient";
import { symbolicDeterminantExpression } from "../src/engine/symbolicDeterminant";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FROZEN = gunzipSync(
  readFileSync(join(ROOT, "qa/certification/legacy_sources/matriz_matrices_vectores.md.gz")),
).toString("utf8");
const ALL_ROWS = readFileSync(join(ROOT, "qa/certification/matrices_ejecutables.jsonl"), "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const MV_B = ALL_ROWS.filter((row) => row.seccion === "B");

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
  scope.onmessage!({ data: { ...message, requestId: "mv-b" } });
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

function toFraction(cell: string): Fraction {
  const compact = cell.replace(/\s+/g, "");
  const frac = /^(-?)\\frac\{([+-]?\d+)\}\{([+-]?\d+)\}$/.exec(compact);
  if (frac) return new Fraction(`${frac[1]}${frac[2]}/${frac[3]}`);
  return new Fraction(compact);
}

function expectedFraction(row: any): Fraction {
  return toFraction(row.esperado);
}

function determinantCells(row: any): string[][] {
  return matricesOf(row.entrada, cellToAscii)[0];
}

function symbolicCells(row: any): string[][] {
  return matricesOf(row.entrada, (cell) => cell)[0];
}

function dispatch(row: any): Record<string, unknown> {
  if (row.id === "MV-B-13") {
    return {
      type: "matrixExpression",
      expression: "det(2*A)",
      matrices: { A: [[1, 2], [3, 4]] },
    };
  }
  if (row.id === "MV-B-14") {
    return {
      type: "matrixExpression",
      expression: "det(A*B)",
      matrices: { A: [[1, 2], [3, 4]], B: [[0, 1], [1, 0]] },
    };
  }
  if (row.id === "MV-B-16" || row.id === "MV-B-17" || row.id === "MV-B-18" ||
      row.id === "MV-B-19" || row.id === "MV-B-20" || row.id === "MV-B-21") {
    return { type: "matrixOp", op: "determinant", a: symbolicCells(row) };
  }
  return { type: "matrixOp", op: "determinant", a: determinantCells(row) };
}

/** Acepta cualquier forma algebraicamente equivalente (convención G2). */
function expectAlgebraicallyEquivalent(actual: string, expectedLatex: string): void {
  const expected = parseExpression(expectedLatex).algebrite;
  expect(simplifyExpression(`(${actual})-(${expected})`)).toBe("0");
}

describe("Matrices/Vectores MV-B-01..22 (determinantes)", () => {
  it("derives all 153 frozen rows with the documented section counts", () => {
    expect(ALL_ROWS.length).toBe(153);
    const counts = ALL_ROWS.reduce<Record<string, number>>((acc, row) => {
      acc[row.seccion] = (acc[row.seccion] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts).toEqual({ A: 25, B: 22, C: 19, D: 17, E: 12, F: 17, G: 22, H: 12, J: 7 });
    expect(MV_B.length).toBe(22);
  });

  it("anchors every MV-B row against the frozen source", () => {
    for (const row of MV_B) {
      expect(frozenRow(row.id), `${row.id} missing in frozen source`).toContain(row.entrada);
      expect(frozenRow(row.id)).toContain(row.esperado);
    }
  });

  it.each(MV_B.map((row) => [row.id, row]))("%s evaluates through the real worker", (id, row: any) => {
    const reply = send(dispatch(row));

    if (row.operacion === "error") {
      expect(reply.success, JSON.stringify(reply)).toBe(false);
      expect(reply.errorCode).toBe("DIMENSION_MISMATCH");
      expect(String(reply.errorMessage).length).toBeGreaterThan(20);
      return;
    }

    expect(reply.success, JSON.stringify(reply)).toBe(true);

    if (row.id === "MV-B-13" || row.id === "MV-B-14") {
      expect(toFraction(reply.resultLatex).equals(expectedFraction(row))).toBe(true);
      return;
    }

    if (["MV-B-16", "MV-B-17", "MV-B-18", "MV-B-19", "MV-B-20", "MV-B-21"].includes(row.id)) {
      const cells = symbolicCells(row);
      const exact = symbolicDeterminantExpression(cells);
      expect(reply.resultLatex).toBe(toLatex(exact));
      expectAlgebraicallyEquivalent(exact, row.esperado);
      return;
    }

    expect(toFraction(reply.resultLatex).equals(expectedFraction(row))).toBe(true);
  });

  it("keeps exact arithmetic in the rational/irrational numeric rows", () => {
    const hilbert4 = send(dispatch(MV_B.find((row) => row.id === "MV-B-09")));
    expect(hilbert4.resultLatex).toBe("1/6048000");
    const hilbert5 = send(dispatch(MV_B.find((row) => row.id === "MV-B-10")));
    expect(hilbert5.resultLatex).toBe("1/266716800000");
    const decimals = send(dispatch(MV_B.find((row) => row.id === "MV-B-15")));
    expect(decimals.resultLatex).toBe("-1/50");
  });

  it("simplifies the trig and complex symbolic rows exactly", () => {
    const trig = send(dispatch(MV_B.find((row) => row.id === "MV-B-20")));
    expect(trig.resultLatex).toBe("1");
    const complex = send(dispatch(MV_B.find((row) => row.id === "MV-B-21")));
    expect(complex.resultLatex).toBe("0");
  });

  it("rejects a non-square symbolic determinant with a clear dimension error", () => {
    const reply = send({ type: "matrixOp", op: "determinant", a: [["a", "b", "c"], ["d", "e", "f"]] });
    expect(reply.success).toBe(false);
    expect(reply.errorCode).toBe("DIMENSION_MISMATCH");
    expect(String(reply.errorMessage)).toContain("cuadradas");
  });
});
