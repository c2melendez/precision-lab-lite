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

describe("Trigonometry EC-I-09: arcsin(x)=2 has no real solution", () => {
  it("anchors the exact equation and the no-real-solution expectation in the frozen matrix", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(source).toMatch(/\|\s*EC-I-09\s*\|/);
    expect(source).toContain(String.raw`\arcsin x=2`);
    expect(source.toLowerCase()).toContain("sin solución real");
  });

  it("returns the empty real solution set and a contradiction verdict", () => {
    const parsed = parseExpression("arcsin(x)=2", "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(0);
    expect(result.truth).toBe("contradiction");

    // Independent range check: arcsin is bounded by [-pi/2, pi/2] on the reals.
    for (const probe of ["0", "1", "-1", "1/2", "-1/2"]) {
      const value = Number(evaluate("float(arcsin(" + probe + "))").trim().replace(/\.\.\.$/, ""));
      expect(value).toBeGreaterThanOrEqual(-Math.PI / 2 - 1e-9);
      expect(value).toBeLessThanOrEqual(Math.PI / 2 + 1e-9);
    }
  });
});
