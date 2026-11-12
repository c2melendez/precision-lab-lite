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

describe("Trigonometry EC-H-09: cosh x=1/2 has no real solution", () => {
  it("anchors the exact equation and the no-real-solution expectation in the frozen matrix", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(source).toMatch(/\|\s*EC-H-09\s*\|/);
    expect(source).toContain(String.raw`\cosh x=\frac{1}{2}`);
    expect(source.toLowerCase()).toContain("sin solución real");
  });

  it("returns the empty real solution set and a contradiction verdict", () => {
    const parsed = parseExpression("cosh(x)=1/2", "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(0);
    expect(result.truth).toBe("contradiction");

    // Independent range check: cosh(x) >= 1 for every real x, so cosh(x)=1/2 is impossible.
    for (const probe of ["0", "1", "-1", "2", "-3", "10"]) {
      const value = Number(evaluate("float(cosh(" + probe + "))").trim().replace(/\.\.\.$/, ""));
      expect(value).toBeGreaterThanOrEqual(1);
    }
  });
});
