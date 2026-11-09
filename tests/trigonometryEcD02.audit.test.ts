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
const INPUT_LATEX = String.raw\`2\cos\left(x\right)-1=0\`;
const EXPECTED_ROOTS = ["pi/3", "5*pi/3"];

describe("Trigonometry EC-D-02: 2*cos(x)-1 = 0 on [0, 2*pi)", () => {
  it("anchors the equation and exact solution set in the frozen matrix", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(source).toMatch(/\|\s*EC-D-02\s*\|/);
    expect(source).toContain(String.raw\`2\cos x-1=0\`);
    expect(source).toContain(String.raw\`x=\frac{\pi}{3}\`);
    expect(source).toContain(String.raw\`\frac{5\pi}{3}\`);
  });

  it("solves the official equation to both exact roots in the stated interval", () => {
    const parsed = parseExpression(INPUT_LATEX, "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(2);

    const matchedExpectedRoots = result.solutionsAlgebrite.map((root) => {
      const match = EXPECTED_ROOTS.find((expected) =>
        evaluate("simplify((" + root + ")-(" + expected + "))").replace(/\s+/g, "") === "0",
      );
      return match ?? "UNMATCHED:" + root;
    });
    expect(matchedExpectedRoots.sort()).toEqual([...EXPECTED_ROOTS].sort());

    const numericRoots = result.solutionsAlgebrite.map((root) =>
      Number(evaluate("float(" + root + ")").trim().replace(/\.\.\.$/, "")),
    );
    expect(numericRoots.every((value) => Number.isFinite(value) && value >= 0 && value < 2 * Math.PI)).toBe(true);

    for (const root of result.solutionsAlgebrite) {
      expect(evaluate("simplify(2*cos(" + root + ")-1)").replace(/\s+/g, "")).toBe("0");
    }
  });
});
