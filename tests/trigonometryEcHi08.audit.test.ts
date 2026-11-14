import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");

function sourceRow(id: string): string[] {
  const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
  const line = source.split(/\r?\n/).find((candidate) => candidate.includes(`| ${id} |`));
  expect(line, `missing frozen source row ${id}`).toBeTruthy();
  const cells = (line as string)
    .split("|")
    .map((cell) => cell.trim().replace(/^`|`$/g, ""))
    .filter((cell) => cell.length > 0);
  expect(cells).toHaveLength(3);
  return cells;
}

function roots(expr: string): string[] {
  const parsed = parseExpression(expr, "RAD");
  expect(parsed.isEquation).toBe(true);
  expect(parsed.freeVariables).toEqual(["x"]);
  return solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x").solutionsAlgebrite.map(
    (solution) => solution.replace(/\s+/g, ""),
  );
}

describe("Trigonometry EC-HI-08: artanh x=2 has the exact real root tanh 2", () => {
  it("anchors the original equation and the exact root in the frozen 2.D matrix", () => {
    const cells = sourceRow("EC-HI-08");
    expect(cells[0]).toBe("EC-HI-08");
    expect(cells[1]).toBe(String.raw`\operatorname{artanh} x=2`);
    expect(cells[2]).toContain(String.raw`x=\tanh 2`);
    expect(cells[2]).toContain("0.964027580");
  });

  it("solves artanh(x)=2 to exactly tanh 2 through the engine", () => {
    expect(roots("artanh(x)=2")).toEqual(["tanh(2)"]);
  });

  it("accepts the atanh alias and the reversed equality", () => {
    expect(roots("atanh(x)=2")).toEqual(["tanh(2)"]);
    expect(roots("2=artanh(x)")).toEqual(["tanh(2)"]);
  });

  it("confirms the root inside the real domain of artanh", () => {
    const root = Math.tanh(2);
    expect(Math.abs(root - 0.964027580)).toBeLessThan(1e-9);
    expect(Math.abs(root)).toBeLessThan(1);
    // Independent oracle: atanh(tanh 2) = 2.
    expect(Math.abs(Math.atanh(root) - 2)).toBeLessThan(1e-12);
  });
});
