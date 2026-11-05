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
  it("matches the exact frozen source row", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-A-15\s*\|/.test(line))?.trim();
    const expectedRow = "| AS-A-15 | N3 | `expandir` | `\\left(x+\\frac{1}{x}\\right)^{3}` | `x^{3} + 3 x + \\frac{3}{x} + \\frac{1}{x^{3}}` |  |";
    expect(sourceRow).toBe(expectedRow);
  });

  it("expands the negative-exponent binomial and matches independent arithmetic for seven nonzero samples", () => {
    const original = parseExpression("(x+1/x)^3").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression("x^3+3*x+3/x+1/x^3").algebrite;
    expect(evaluate(`(${expanded})-(${oracle})`).trim()).toBe("0");
    expect(expanded).not.toMatch(/\)\s*\^\s*3/);

    for (const x of [-3, -2, -0.5, 0.25, 1, 2, 5]) {
      const actual = compileNumeric(
        evaluate(expanded.replace(/\bx\b/g, `(${x})`)),
        "__no_var__",
      )(0);
      const expected = x ** 3 + 3 * x + 3 / x + 1 / x ** 3;
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
