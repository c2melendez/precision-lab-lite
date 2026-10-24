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

describe("Algebra229 AS-A-08 expand (x-1)^5", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-A-08\s*\|\s*N2\s*\|/);
    expect(text).toContain("(x-1)");
    expect(text).toContain("x^{5} - 5 x^{4} + 10 x^{3} - 10 x^{2} + 5 x - 1");
  });

  it("expands original (x-1)^5 and matches binomial oracle at samples", () => {
    const original = parseExpression("(x-1)^5").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression("x^5-5*x^4+10*x^3-10*x^2+5*x-1").algebrite;
    for (const x of [-2, -1, 0, 1, 2, 3, 5]) {
      const numeric = (expr: string) =>
        compileNumeric(evaluate(expr.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
