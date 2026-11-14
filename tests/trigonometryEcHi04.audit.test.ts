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

describe("Trigonometry EC-HI-04: arcosh x=ln 2 has the exact real root 5/4", () => {
  it("anchors the original equation and the exact root in the frozen 2.D matrix", () => {
    const cells = sourceRow("EC-HI-04");
    expect(cells[0]).toBe("EC-HI-04");
    expect(cells[1]).toBe(String.raw`\operatorname{arcosh} x=\ln 2`);
    expect(cells[2]).toBe(String.raw`x=\frac{5}{4}`);
  });

  it("solves arcosh(x)=ln(2) to exactly 5/4 through the engine", () => {
    expect(roots("arcosh(x)=ln(2)")).toEqual(["5/4"]);
  });

  it("accepts the acosh alias and the reversed equality", () => {
    expect(roots("acosh(x)=ln(2)")).toEqual(["5/4"]);
    expect(roots("ln(2)=arcosh(x)")).toEqual(["5/4"]);
  });

  it("keeps the exact root inside the real domain of arcosh", () => {
    // Independent oracle: cosh(ln 2) = (2 + 1/2)/2 = 5/4, and 5/4 >= 1.
    expect(Math.abs(Math.cosh(Math.log(2)) - 5 / 4)).toBeLessThan(1e-15);
    expect(5 / 4).toBeGreaterThanOrEqual(1);
    // cosh is strictly increasing on [1, ∞), so arcosh(5/4)=ln 2 is unique.
    expect(Math.abs(Math.acosh(5 / 4) - Math.log(2))).toBeLessThan(1e-12);
  });
});
