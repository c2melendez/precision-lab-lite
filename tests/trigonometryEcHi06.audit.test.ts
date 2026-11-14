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

describe("Trigonometry EC-HI-06: artanh x=arsinh x has the exact real root 0", () => {
  it("anchors the original equation and the exact root in the frozen 2.D matrix", () => {
    const cells = sourceRow("EC-HI-06");
    expect(cells[0]).toBe("EC-HI-06");
    expect(cells[1]).toBe(String.raw`\operatorname{artanh} x=\operatorname{arsinh} x`);
    expect(cells[2]).toBe(String.raw`x=0`);
  });

  it("solves artanh(x)=arsinh(x) to exactly 0 through the engine", () => {
    expect(roots("artanh(x)=arsinh(x)")).toEqual(["0"]);
  });

  it("accepts the atanh/asinh aliases and the reversed equality", () => {
    expect(roots("atanh(x)=asinh(x)")).toEqual(["0"]);
    expect(roots("arsinh(x)=artanh(x)")).toEqual(["0"]);
  });

  it("confirms the root and its uniqueness with an independent oracle", () => {
    expect(Math.atanh(0)).toBe(0);
    expect(Math.asinh(0)).toBe(0);
    // atanh grows strictly faster than asinh on (0, 1), so they only meet at 0.
    for (const probe of [0.1, 0.25, 0.5, 0.75, 0.9]) {
      expect(Math.atanh(probe)).toBeGreaterThan(Math.asinh(probe));
    }
    for (const probe of [-0.1, -0.5, -0.9]) {
      expect(Math.atanh(probe)).toBeLessThan(Math.asinh(probe));
    }
  });
});
