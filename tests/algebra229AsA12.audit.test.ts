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

describe("Algebra229 AS-A-12 expand (x^2-1)^2", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-A-12\s*\|\s*N2\s*\|/);
    expect(text).toContain("\\left(x^{2}-1\\right)^{2}");
    expect(text).toContain("x^{4} - 2 x^{2} + 1");
  });

  it("expands original binomial square and matches oracle at samples", () => {
    const original = parseExpression("(x^2-1)^2").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression("x^4-2*x^2+1").algebrite;
    for (const x of [-3, -2, -1, 0, 1, 2, 3]) {
      const numeric = (expr: string) =>
        compileNumeric(evaluate(expr.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
