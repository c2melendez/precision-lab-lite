import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
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

describe("Trigonometry EC-HI-01: arsinh x=1 has the exact real root sinh 1", () => {
  it("anchors the original equation and the exact root in the frozen 2.D matrix", () => {
    const cells = sourceRow("EC-HI-01");
    expect(cells[0]).toBe("EC-HI-01");
    expect(cells[1]).toBe(String.raw`\operatorname{arsinh} x=1`);
    expect(cells[2]).toBe(String.raw`x=\sinh 1\approx 1.175201194`);
  });

  it("solves asinh(x)=1 to exactly sinh(1) through the engine", () => {
    const parsed = parseExpression("asinh(x)=1", "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(1);
    expect(result.solutionsAlgebrite[0].replace(/\s+/g, "")).toBe("sinh(1)");
    expect(result.truth).toBeUndefined();
  });

  it("accepts the frozen arsinh spelling and the reversed equality", () => {
    const alias = parseExpression("arsinh(x)=1", "RAD");
    const aliasResult = solveAlgebra(alias.leftAlgebrite, alias.rightAlgebrite, "x");
    expect(aliasResult.solutionsAlgebrite).toHaveLength(1);
    expect(aliasResult.solutionsAlgebrite[0].replace(/\s+/g, "")).toBe("sinh(1)");

    const reversed = parseExpression("1=asinh(x)", "RAD");
    const reversedResult = solveAlgebra(reversed.leftAlgebrite, reversed.rightAlgebrite, "x");
    expect(reversedResult.solutionsAlgebrite).toHaveLength(1);
    expect(reversedResult.solutionsAlgebrite[0].replace(/\s+/g, "")).toBe("sinh(1)");
  });

  it("matches the frozen numeric value and satisfies the original equation", () => {
    // The frozen 9-decimal value is the rounding of the exact real root sinh 1.
    expect(Math.round(Math.sinh(1) * 1e9) / 1e9).toBe(1.175201194);

    // Independent oracle: substituting x = sinh 1 into asinh(x)=1.
    // Algebrite cannot evaluate symbolic asinh compositions, so the
    // substitution oracle uses IEEE double semantics directly.
    expect(Math.abs(Math.asinh(Math.sinh(1)) - 1)).toBeLessThan(1e-15);

    // The engine's own numeric path agrees with the exact root to its precision.
    const numericRoot = evaluate("float(sinh(1))").trim();
    expect(numericRoot.startsWith("1.175201")).toBe(true);
  });
});
