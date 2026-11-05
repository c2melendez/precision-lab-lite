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
  it("matches the exact frozen source row", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-A-09\s*\|/.test(line))?.trim();
    const expectedRow = "| AS-A-09 | N2 | `expandir` | `(x+1)(x+2)(x+3)(x+4)` | `x^{4} + 10 x^{3} + 35 x^{2} + 50 x + 24` |  |";
    expect(sourceRow).toBe(expectedRow);
  });

  it("expands the original product and matches independent arithmetic at eight signed samples", () => {
    const original = parseExpression("(x+1)*(x+2)*(x+3)*(x+4)").algebrite;
    const expanded = expand(original);
    const samples = [-5, -4, -3, -2, -1, 0, 1, 2];
    for (const x of samples) {
      const atPoint = expanded.replace(/\bx\b/g, `(${x})`);
      const actual = compileNumeric(evaluate(atPoint), "__no_var__")(0);
      const expected = (x + 1) * (x + 2) * (x + 3) * (x + 4);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
