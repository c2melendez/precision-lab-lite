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

function solve(expr: string) {
  const parsed = parseExpression(expr, "RAD");
  expect(parsed.isEquation).toBe(true);
  expect(parsed.freeVariables).toEqual(["x"]);
  return solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
}

describe("Trigonometry EC-HI-07: arcosh x=arsinh x has no real solution", () => {
  it("anchors the original equation and the frozen empty result", () => {
    const cells = sourceRow("EC-HI-07");
    expect(cells[0]).toBe("EC-HI-07");
    expect(cells[1]).toBe(String.raw`\operatorname{arcosh} x=\operatorname{arsinh} x`);
    expect(cells[2].toLowerCase()).toContain("sin soluci");
  });

  it("reports a contradiction with an empty real solution set", () => {
    const frozen = solve("arcosh(x)=arsinh(x)");
    expect(frozen.solutionsAlgebrite).toEqual([]);
    expect(frozen.truth).toBe("contradiction");

    const aliases = solve("acosh(x)=asinh(x)");
    expect(aliases.solutionsAlgebrite).toEqual([]);
    expect(aliases.truth).toBe("contradiction");

    const reversed = solve("arsinh(x)=arcosh(x)");
    expect(reversed.solutionsAlgebrite).toEqual([]);
    expect(reversed.truth).toBe("contradiction");
  });

  it("confirms the contradiction with an independent oracle", () => {
    // cosh(x) - sinh(x) = e^{-x} > 0, so cosh(x) > sinh(x) and, inverting,
    // acosh(v) < asinh(v) for every v >= 1: the graphs never meet.
    for (const probe of [1, 1.5, 2, 5, 10]) {
      expect(Math.acosh(probe)).toBeLessThan(Math.asinh(probe));
    }
    expect(Math.sinh(1) - Math.cosh(1)).toBeLessThan(0);
    expect(Math.asinh(1) - Math.acosh(1)).toBeGreaterThan(0.8);
  });
});
