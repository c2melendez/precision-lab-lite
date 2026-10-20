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

describe("Algebra229 AS-A-15 expand (x+1/x)^3", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-A-15\s*\|\s*N3\s*\|/);
    expect(text).toContain("\\left(x+\\frac{1}{x}\\right)^{3}");
    expect(text).toContain("x^{3} + 3 x + \\frac{3}{x} + \\frac{1}{x^{3}}");
  });

  it("expands with negative exponents: exact difference is zero and samples (x != 0) match", () => {
    const original = parseExpression("(x+1/x)^3").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression("x^3+3*x+3/x+1/x^3").algebrite;
    expect(evaluate(`(${expanded})-(${oracle})`).trim()).toBe("0");
    // Debe haberse expandido: la potencia cúbica del binomio no puede quedar intacta.
    expect(expanded).not.toMatch(/\)\s*\^\s*3/);
    for (const x of [-3, -2, -0.5, 0.25, 1, 2, 5]) {
      const numeric = (expr: string) =>
        compileNumeric(evaluate(expr.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
