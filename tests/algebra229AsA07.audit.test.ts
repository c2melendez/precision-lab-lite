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

describe("Algebra229 AS-A-07 expand (2x-3)^4", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-A-07\s*\|\s*N2\s*\|/);
    expect(text).toContain("(2x-3)");
    expect(text).toContain("16 x^{4} - 96 x^{3} + 216 x^{2} - 216 x + 81");
  });

  it("expands original (2x-3)^4 and matches binomial oracle at samples", () => {
    const original = parseExpression("(2*x-3)^4").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression("16*x^4-96*x^3+216*x^2-216*x+81").algebrite;
    for (const x of [-2, -1, 0, 1, 2, 3, 5]) {
      const numeric = (expr: string) =>
        compileNumeric(evaluate(expr.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
