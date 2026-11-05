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
  it("matches the exact frozen source row", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-A-07\s*\|/.test(line))?.trim();
    const expectedRow = "| AS-A-07 | N2 | `expandir` | `(2x-3)^{4}` | `16 x^{4} - 96 x^{3} + 216 x^{2} - 216 x + 81` |  |";
    expect(sourceRow).toBe(expectedRow);
  });

  it("expands the original and matches independent arithmetic at seven signed samples", () => {
    const original = parseExpression("(2*x-3)^4").algebrite;
    const expanded = expand(original);
    const samples = [-2, -1, 0, 1, 2, 3, 5];
    for (const x of samples) {
      const atPoint = expanded.replace(/\bx\b/g, `(${x})`);
      const actual = compileNumeric(evaluate(atPoint), "__no_var__")(0);
      const expected = Math.pow(2 * x - 3, 4);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
