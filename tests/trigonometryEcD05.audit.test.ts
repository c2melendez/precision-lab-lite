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
const EXPECTED_ROOTS = ["0", "pi/2"];

describe("Trigonometry EC-D-05: sin(x)+cos(x)=1 on [0,2*pi)", () => {
  it("anchors the equation, interval and exact two-root oracle in the frozen matrix", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(source).toMatch(/\|\s*EC-D-05\s*\|/);
    expect(source).toContain("\\sin x+\\cos x=1");
    expect(source).toContain("x\\in[0,2\\pi)");
    expect(source).toContain("x=0");
    expect(source).toContain("\\frac{\\pi}{2}");
  });

  it("returns exactly 0 and pi/2 in [0,2*pi), verified in the original equation", () => {
    const parsed = parseExpression("sin(x)+cos(x)=1", "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(2);

    const matches = result.solutionsAlgebrite.map((root) =>
      EXPECTED_ROOTS.find((expected) =>
        evaluate("simplify((" + root + ")-(" + expected + "))").replace(/\s+/g, "") === "0",
      ) ?? "UNMATCHED:" + root,
    );
    expect(matches.sort()).toEqual([...EXPECTED_ROOTS].sort());

    const numericRoots = result.solutionsAlgebrite.map((root) =>
      Number(evaluate("float(" + root + ")").trim().replace(/\.\.\.$/, "")),
    );
    expect(numericRoots.every((value) => Number.isFinite(value) && value >= 0 && value < 2 * Math.PI)).toBe(true);

    for (const root of result.solutionsAlgebrite) {
      expect(evaluate("simplify(sin(" + root + ")+cos(" + root + ")-1)").replace(/\s+/g, "")).toBe("0");
    }
  });
});
