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

describe("Trigonometry EC-HI-05: arcoth x=ln 2 has the exact real root 5/3", () => {
  it("anchors the original equation and the exact root in the frozen 2.D matrix", () => {
    const cells = sourceRow("EC-HI-05");
    expect(cells[0]).toBe("EC-HI-05");
    expect(cells[1]).toBe(String.raw`\operatorname{arcoth} x=\ln 2`);
    expect(cells[2]).toBe(String.raw`x=\frac{5}{3}`);
  });

  it("solves arcoth(x)=ln(2) to exactly 5/3 through the engine", () => {
    expect(roots("arcoth(x)=ln(2)")).toEqual(["5/3"]);
  });

  it("accepts the acoth alias and the reversed equality", () => {
    expect(roots("acoth(x)=ln(2)")).toEqual(["5/3"]);
    expect(roots("ln(2)=arcoth(x)")).toEqual(["5/3"]);
  });

  it("keeps the exact root inside the real domain of arcoth", () => {
    // Independent oracle: coth(ln 2) = 5/3 and |x| > 1.
    expect(Math.abs(1 / Math.tanh(Math.log(2)) - 5 / 3)).toBeLessThan(1e-15);
    expect(Math.abs(5 / 3)).toBeGreaterThan(1);
    expect(Math.abs(1 / Math.tanh(Math.log(2)))).toBeGreaterThan(1);
  });
});
