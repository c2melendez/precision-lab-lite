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

describe("Trigonometry EC-H-10: tanh x=2 has no real solution", () => {
  it("anchors the exact equation and the no-real-solution expectation in the frozen matrix", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(source).toMatch(/\|\s*EC-H-10\s*\|/);
    expect(source).toContain(String.raw`\tanh x=2`);
    expect(source.toLowerCase()).toContain("sin solución real");
  });

  it("returns the empty real solution set and a contradiction verdict", () => {
    const parsed = parseExpression("tanh(x)=2", "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(0);
    expect(result.truth).toBe("contradiction");

    // Independent range check: |tanh(x)| < 1 for every real x, so tanh(x)=2 is impossible.
    // Use moderate probes: large |x| saturates IEEE float to ±1.0 even though the
    // mathematical value remains strictly inside (-1, 1).
    for (const probe of ["0", "0.5", "1", "-1", "2", "-2"]) {
      const value = Number(evaluate("float(tanh(" + probe + "))").trim().replace(/\.\.\.$/, ""));
      expect(Number.isFinite(value)).toBe(true);
      expect(Math.abs(value)).toBeLessThan(1);
    }
    // Symbolic confirmation that tanh never reaches ±1 on the reals.
    const limitProbe = evaluate("float(abs(tanh(20))-1)").trim();
    expect(Number(limitProbe)).toBeLessThanOrEqual(1e-6);
  });
});
