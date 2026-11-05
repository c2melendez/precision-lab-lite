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

describe("Algebra229 AS-A-10 expand (x^2+x+1)^3", () => {
  it("matches the exact frozen source row", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-A-10\s*\|/.test(line))?.trim();
    const expectedRow = "| AS-A-10 | N2 | `expandir` | `\\left(x^{2}+x+1\\right)^{3}` | `x^{6} + 3 x^{5} + 6 x^{4} + 7 x^{3} + 6 x^{2} + 3 x + 1` |  |";
    expect(sourceRow).toBe(expectedRow);
  });

  it("expands the original trinomial cube and matches independent arithmetic at eight signed samples", () => {
    const original = parseExpression("(x^2+x+1)^3").algebrite;
    const expanded = expand(original);
    const samples = [-4, -3, -2, -1, 0, 1, 2, 3];
    for (const x of samples) {
      const atPoint = expanded.replace(/\bx\b/g, `(${x})`);
      const actual = compileNumeric(evaluate(atPoint), "__no_var__")(0);
      const expected = Math.pow(x * x + x + 1, 3);
      expect(actual).toBeCloseTo(expected, 6);
    }
  });
});
