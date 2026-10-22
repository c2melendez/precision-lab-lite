import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import Fraction from "fraction.js";
import { parseExpression } from "../src/engine/parsing";
import { splitSystemLatex } from "../src/engine/parsing/systemSplit";
import { simplifyExpression } from "../src/engine/algebriteClient";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FROZEN = gunzipSync(
  readFileSync(join(ROOT, "qa/certification/legacy_sources/matriz_matrices_vectores.md.gz")),
).toString("utf8");
const ALL_ROWS = readFileSync(join(ROOT, "qa/certification/matrices_ejecutables.jsonl"), "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const MV_D = ALL_ROWS.filter((row) => row.seccion === "D");
const SYSTEM_ROWS = MV_D.filter((row) => row.operacion === "resolver");

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
  scope.onmessage!({ data: { ...message, requestId: "mv-d" } });
  return scope.postMessage.mock.calls.at(-1)![0];
}

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

function expectEquivalent(actual: string, expected: string): void {
  const actualAlgebrite = parseExpression(actual).algebrite;
  const expectedAlgebrite = parseExpression(expected).algebrite;
  expect(
    simplifyExpression(`(${actualAlgebrite})-(${expectedAlgebrite})`),
    `${actual} != ${expected}`,
  ).toBe("0");
}

function systemVariables(row: any): string[] {
  const match = /\(([a-z](?:\s*,\s*[a-z])*)\)=/.exec(row.esperado);
  if (match) return match[1].split(",").map((name) => name.trim());
  if (row.id === "MV-D-05" || row.id === "MV-D-10") return ["x", "y"];
  return [];
}

function systemEquations(row: any): string[] {
  const rows = splitSystemLatex(row.entrada);
  expect(rows, `${row.id} split`).not.toBeNull();
  return rows!.map((equation) => {
    // La fila D-13 usa `ay` como producto; el resto de filas ya es sintaxis
    // Algebrite válida o LaTeX que el parser normaliza.
    const normalized = row.id === "MV-D-13" ? equation.replace(/\bay\b/g, "a*y") : equation;
    return parseExpression(normalized).algebrite;
  });
}

function tupleFromEquals(source: string): string[] | null {
  const match = /\\left\(([^()]*)\\right\)=\\left\(([\s\S]*?)\\right\)/.exec(source);
  if (match) return match[2].split(/,\\?\s+/).map((value) => value.trim()).filter(Boolean);
  const afterEquals = /=([\s\S]*)$/.exec(source);
  if (!afterEquals) return null;
  const left = /\\left\(([\s\S]*?)\\right\)/.exec(afterEquals[1]);
  return left ? left[1].split(/,\\?\s+/).map((value) => value.trim()).filter(Boolean) : null;
}

function expectedTuple(row: any): string[] | null {
  if (row.id === "MV-D-13") return null;
  const afterEquals = /=([\s\S]*)$/.exec(row.esperado);
  if (!afterEquals) return null;
  const left = /\\left\(([\s\S]*?)\\right\)/.exec(afterEquals[1]);
  return left ? left[1].split(/,\\?\s+/).map((value) => value.trim()).filter(Boolean) : null;
}

function assignments(latex: string): Map<string, string> {
  const result = new Map<string, string>();
  const pattern = /([a-zA-Z])\s*=\s*(.+?)(?=,\\?\s*[a-zA-Z]\s*=|$)/g;
  for (const match of latex.matchAll(pattern)) result.set(match[1], match[2].trim());
  return result;
}

function dispatch(row: any): Record<string, unknown> {
  if (row.operacion === "resolver") {
    return {
      type: "solveSystem",
      equationsAlgebrite: systemEquations(row),
      variables: systemVariables(row),
    };
  }
  if (row.id === "MV-D-14" || row.id === "MV-D-15") {
    return { type: "matrixOp", op: "rref", a: matricesOf(row.entrada, cellToAscii)[0] };
  }
  if (row.id === "MV-D-16") {
    return { type: "matrixOp", op: "lu", a: matricesOf(row.entrada, cellToAscii)[0] };
  }
  const vectors = [...row.entrada.matchAll(/\(([0-9]+(?:\s*,\s*[0-9]+)+)\)/g)].map((match) =>
    match[1].split(",").map((cell: string) => cell.trim()),
  );
  return { type: "matrixOp", op: "gramSchmidt", a: vectors };
}

function assertUnique(row: any, reply: any): void {
  const actual = assignments(reply.resultLatex);
  const expected = expectedTuple(row);
  expect(expected, `${row.id} expected tuple`).not.toBeNull();
  const variables = systemVariables(row);
  expect(variables.length).toBe(expected!.length);
  variables.forEach((variable, index) => {
    expect(actual.has(variable), `${row.id} missing ${variable}`).toBe(true);
    expectEquivalent(actual.get(variable)!, expected![index]);
  });
}

function assertParametric(row: any, reply: any): void {
  const actual = tupleFromEquals(reply.resultLatex);
  const expected = expectedTuple(row);
  expect(actual, `${row.id} actual tuple`).not.toBeNull();
  expect(expected, `${row.id} expected tuple`).not.toBeNull();
  expect(actual!.length).toBe(expected!.length);
  actual!.forEach((value, index) => expectEquivalent(value, expected![index]));
}

describe("Matrices/Vectores MV-D-01..17 (sistemas, rref, LU y Gram-Schmidt)", () => {
  it("derives all 153 frozen rows with the documented section counts", () => {
    expect(ALL_ROWS.length).toBe(153);
    const counts = ALL_ROWS.reduce<Record<string, number>>((acc, row) => {
      acc[row.seccion] = (acc[row.seccion] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts).toEqual({ A: 25, B: 22, C: 19, D: 17, E: 12, F: 17, G: 22, H: 12, J: 7 });
    expect(MV_D.length).toBe(17);
    expect(SYSTEM_ROWS.length).toBe(13);
  });

  it("anchors every MV-D row against the frozen source", () => {
    for (const row of MV_D) {
      const line = frozenRow(row.id);
      expect(line, `${row.id} missing in frozen source`).not.toBe("");
      expect(line, `${row.id} entrada`).toContain(row.entrada);
      expect(line, `${row.id} esperado`).toContain(row.esperado);
    }
  });

  it.each(MV_D.map((row) => [row.id, row]))("%s evaluates through the real worker", (id, row: any) => {
    const reply = send(dispatch(row));
    expect(reply.success, JSON.stringify(reply)).toBe(true);

    if (row.id === "MV-D-05" || row.id === "MV-D-10") {
      expect(String(reply.resultLatex)).toMatch(/sin solución|incompatible/i);
      return;
    }

    if (row.id === "MV-D-13") {
      expect(row.esperado).toContain("a\\neq1");
      expect(row.esperado).toContain("(x,y)=(0,1)");
      expect(row.esperado).toContain("x+y=1");
      const [generic, special] = String(reply.resultLatex).split(";\\quad ");
      expect(generic).toContain("a \\neq 1");
      expect(special).toContain("a = 1");
      expect(special).toMatch(/infinitas soluciones/);
      const genericTuple = tupleFromEquals(generic);
      expect(genericTuple).not.toBeNull();
      expect(genericTuple!.length).toBe(2);
      expectEquivalent(genericTuple![0], "0");
      expectEquivalent(genericTuple![1], "1");
      const specialTuple = tupleFromEquals(special);
      expect(specialTuple).not.toBeNull();
      expectEquivalent(`(${specialTuple![0]})+(${specialTuple![1]})`, "1");
      return;
    }

    if (row.id === "MV-D-14" || row.id === "MV-D-15") {
      const actual = matricesOf(String(reply.resultLatex), (cell) => cell)[0];
      const expected = matricesOf(row.esperado, (cell) => cell)[0];
      expect(actual.length).toBe(expected.length);
      for (let r = 0; r < expected.length; r += 1) {
        for (let c = 0; c < expected[r].length; c += 1) {
          expect(toFraction(actual[r][c]).equals(toFraction(expected[r][c]))).toBe(true);
        }
      }
      return;
    }

    if (row.id === "MV-D-16") {
      const actual = matricesOf(String(reply.resultLatex), (cell) => cell);
      const expected = matricesOf(row.esperado, (cell) => cell);
      expect(actual.length).toBe(2);
      expect(expected.length).toBe(2);
      expected.forEach((matrix, index) => {
        for (let r = 0; r < matrix.length; r += 1) {
          for (let c = 0; c < matrix[r].length; c += 1) {
            expect(toFraction(actual[index][r][c]).equals(toFraction(matrix[r][c]))).toBe(true);
          }
        }
      });
      return;
    }

    if (row.id === "MV-D-17") {
      const actual = matricesOf(String(reply.resultLatex), (cell) => cell)[0];
      const expectedColumns = matricesOf(row.esperado, (cell) => cell);
      expect(actual.length).toBe(expectedColumns.length);
      expectedColumns.forEach((column, index) => {
        expect(column.length).toBe(3);
        expect(column.every((row) => row.length === 1)).toBe(true);
        expect(actual[index].length).toBe(column.length);
        actual[index].forEach((cell, coordinate) => {
          expect(toFraction(cell).equals(toFraction(column[coordinate][0]))).toBe(true);
        });
      });
      return;
    }

    if (row.esperado.includes("t\\in\\mathbb{R}")) assertParametric(row, reply);
    else assertUnique(row, reply);
  });

  it("reports an explicit error when LU would need row pivoting", () => {
    const reply = send({ type: "matrixOp", op: "lu", a: [["0", "1"], ["1", "0"]] });
    expect(reply.success).toBe(false);
    expect(reply.errorCode).toBe("DOMAIN_ERROR");
    expect(String(reply.errorMessage)).toMatch(/pivote|pivoteo/i);
  });

  it("rejects Gram-Schmidt vectors of different dimensions", () => {
    const reply = send({ type: "matrixOp", op: "gramSchmidt", a: [["1", "0"], ["1"]] });
    expect(reply.success).toBe(false);
    expect(reply.errorCode).toBe("DIMENSION_MISMATCH");
  });
});
