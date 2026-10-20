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

describe("Algebra229 AS-A-03 expand (a+b)(a-b)", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-A-03\s*\|\s*N1\s*\|/);
    expect(text).toContain("(a+b)(a-b)");
    expect(text).toContain("a^{2} - b^{2}");
  });

  it("expands original (a+b)(a-b) and matches a^2-b^2 at sample pairs", () => {
    const original = parseExpression("(a+b)*(a-b)").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression("a^2-b^2").algebrite;
    for (const [av, bv] of [
      [0, 0],
      [1, 0],
      [0, 1],
      [2, 1],
      [-3, 2],
      [5, -4],
    ] as const) {
      const numeric = (expr: string) =>
        compileNumeric(
          evaluate(expr.replace(/a/g, "(" + av + ")").replace(/b/g, "(" + bv + ")")),
          "__no_var__",
        )(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
