import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");

describe("Algebra229 AS-A-13 expand (x+h)^3-x^3", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-A-13\s*\|\s*N2\s*\|/);
    expect(text).toContain("(x+h)^{3}-x^{3}");
    expect(text).toContain("h^{3} + 3 h^{2} x + 3 h x^{2}");
  });

  it("expands original difference of cubes quotient numerator and matches oracle at samples", () => {
    const original = parseExpression("(x+h)^3-x^3").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression("h^3+3*h^2*x+3*h*x^2").algebrite;
    const numeric = (expr: string, x: number, h: number) =>
      compileNumeric(
        evaluate(expr.replace(/x/g, "(" + x + ")").replace(/h/g, "(" + h + ")")),
        "__no_var__"
      )(0);
    for (const [x, h] of [
      [1, 2],
      [0, -1],
      [-2, 3],
      [2, 0],
      [-3, -2],
    ]) {
      expect(numeric(expanded, x, h)).toBeCloseTo(numeric(oracle, x, h), 9);
    }
  });
});
