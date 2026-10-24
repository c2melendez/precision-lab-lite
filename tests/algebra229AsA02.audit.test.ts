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

describe("Algebra229 AS-A-02 expand (x-y)^3", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-A-02\s*\|\s*N1\s*\|/);
    expect(text).toContain("(x-y)^{3}");
  });

  it("expands original (x-y)^3 and matches oracle at sample pairs", () => {
    const original = parseExpression("(x-y)^3").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression("x^3-3*x^2*y+3*x*y^2-y^3").algebrite;
    for (const [xv, yv] of [
      [0, 0],
      [1, 0],
      [0, 1],
      [2, 1],
      [-1, 2],
      [3, -1],
    ] as const) {
      const numeric = (expr: string) =>
        compileNumeric(
          evaluate(expr.replace(/x/g, "(" + xv + ")").replace(/y/g, "(" + yv + ")")),
          "__no_var__",
        )(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
