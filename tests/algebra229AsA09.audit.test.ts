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

describe("Algebra229 AS-A-09 expand (x+1)(x+2)(x+3)(x+4)", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-A-09\s*\|\s*N2\s*\|/);
    expect(text).toContain("(x+1)(x+2)(x+3)(x+4)");
    expect(text).toContain("x^{4} + 10 x^{3} + 35 x^{2} + 50 x + 24");
  });

  it("expands original product of linear factors and matches oracle at samples", () => {
    const original = parseExpression("(x+1)*(x+2)*(x+3)*(x+4)").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression("x^4+10*x^3+35*x^2+50*x+24").algebrite;
    for (const x of [-5, -4, -3, -2, -1, 0, 1, 2]) {
      const numeric = (expr: string) =>
        compileNumeric(evaluate(expr.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
