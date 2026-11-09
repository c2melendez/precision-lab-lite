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
const INPUT_LATEX = "\\sin\\left(x\\right)=\\frac{1}{2}";
const EXPECTED_ROOTS = ["pi/6", "5*pi/6"];

describe("Trigonometry EC-D-01: sin(x) = 1/2 on [0, 2*pi)", () => {
  it("anchors the equation and exact solution set in the frozen matrix", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(source).toMatch(/\|\s*EC-D-01\s*\|/);
    expect(source).toContain("\\sin x=\\frac{1}{2}");
    expect(source).toContain("\\frac{\\pi}{6}");
    expect(source).toContain("\\frac{5\\pi}{6}");
  });

  it("solves the official equation to both exact roots in the stated interval", () => {
    const parsed = parseExpression(INPUT_LATEX, "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(2);

    const actualAsExpectedDifferences = result.solutionsAlgebrite
      .map((root) => EXPECTED_ROOTS.map((expected) =>
        evaluate("simplify((" + root + ")-(" + expected + "))").replace(/\s+/g, ""),
      ))
      .sort((a, b) => a.join(",").localeCompare(b.join(",")));

    expect(actualAsExpectedDifferences).toEqual([["0", "0"], ["0", "0"]]);

    for (const root of result.solutionsAlgebrite) {
      expect(evaluate("simplify(sin(" + root + ")-1/2)").replace(/\s+/g, "")).toBe("0");
    }
  });
});
