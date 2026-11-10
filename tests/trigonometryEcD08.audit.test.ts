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
const EXPECTED_ROOTS = ["2*pi/3", "4*pi/3"];

describe("Trigonometry EC-D-08: sec(x)=-2 on [0,2*pi)", () => {
  it("anchors the exact equation, interval and two-root oracle in the frozen matrix", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(source).toMatch(/\|\s*EC-D-08\s*\|/);
    expect(source).toContain("\\sec x=-2");
    expect(source).toContain("x\\in[0,2\\pi)");
    expect(source).toContain("\\frac{2\\pi}{3}");
    expect(source).toContain("\\frac{4\\pi}{3}");
  });

  it("returns exactly both reciprocal-cosine roots in [0,2*pi), verified in the original equation", () => {
    const parsed = parseExpression("sec(x)=-2", "RAD");
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
      expect(evaluate("simplify(1/cos(" + root + ")+2)").replace(/\s+/g, "")).toBe("0");
    }
  });
});
