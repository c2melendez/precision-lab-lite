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

describe("Trigonometry EC-HI-02: arcosh x=0 has the exact real root 1", () => {
  it("anchors the original equation and the exact root in the frozen 2.D matrix", () => {
    const cells = sourceRow("EC-HI-02");
    expect(cells[0]).toBe("EC-HI-02");
    expect(cells[1]).toBe(String.raw`\operatorname{arcosh} x=0`);
    expect(cells[2]).toBe(String.raw`x=1`);
  });

  it("solves acosh(x)=0 to exactly 1 through the engine", () => {
    const parsed = parseExpression("acosh(x)=0", "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(1);
    expect(result.solutionsAlgebrite[0].replace(/\s+/g, "")).toBe("1");
    expect(result.truth).toBeUndefined();
  });

  it("accepts the frozen arcosh spelling and the reversed equality", () => {
    const alias = parseExpression("arcosh(x)=0", "RAD");
    const aliasResult = solveAlgebra(alias.leftAlgebrite, alias.rightAlgebrite, "x");
    expect(aliasResult.solutionsAlgebrite).toHaveLength(1);
    expect(aliasResult.solutionsAlgebrite[0].replace(/\s+/g, "")).toBe("1");

    const reversed = parseExpression("0=acosh(x)", "RAD");
    const reversedResult = solveAlgebra(reversed.leftAlgebrite, reversed.rightAlgebrite, "x");
    expect(reversedResult.solutionsAlgebrite).toHaveLength(1);
    expect(reversedResult.solutionsAlgebrite[0].replace(/\s+/g, "")).toBe("1");
  });

  it("satisfies the original equation with the exact root", () => {
    // Independent oracle: acosh(1) = 0.
    expect(Math.acosh(1)).toBe(0);
  });
});
