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

describe("Trigonometry EC-HI-03: artanh x=ln 2 has the exact real root 3/5", () => {
  it("anchors the original equation and the exact root in the frozen 2.D matrix", () => {
    const cells = sourceRow("EC-HI-03");
    expect(cells[0]).toBe("EC-HI-03");
    expect(cells[1]).toBe(String.raw`\operatorname{artanh} x=\ln 2`);
    expect(cells[2]).toBe(String.raw`x=\frac{3}{5}`);
  });

  it("solves artanh(x)=ln(2) to exactly 3/5 through the engine", () => {
    expect(roots("artanh(x)=ln(2)")).toEqual(["3/5"]);
  });

  it("accepts the atanh alias and the reversed equality", () => {
    expect(roots("atanh(x)=ln(2)")).toEqual(["3/5"]);
    expect(roots("ln(2)=artanh(x)")).toEqual(["3/5"]);
  });

  it("keeps the exact root inside the real domain of atanh", () => {
    // Independent oracle: atanh(3/5) = 0.5*ln(4) = ln 2, and |3/5| < 1.
    const root = 3 / 5;
    expect(Math.abs(Math.atanh(root) - Math.log(2))).toBeLessThan(1e-15);
    expect(Math.abs(root)).toBeLessThan(1);
    // atanh is injective on (-1, 1), so the frozen root is unique.
    expect(Math.abs(Math.atanh(-root) - Math.log(2))).toBeGreaterThan(1e-3);
  });
});
