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

describe("Algebra229 AS-A-13 expand (x+h)^3-x^3", () => {
  it("matches the exact frozen source row", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-A-13\s*\|/.test(line))?.trim();
    const expectedRow = "| AS-A-13 | N2 | `expandir` | `(x+h)^{3}-x^{3}` | `h^{3} + 3 h^{2} x + 3 h x^{2}` |  |";
    expect(sourceRow).toBe(expectedRow);
  });

  it("expands the original difference and matches independent integer arithmetic at eight signed samples", () => {
    const original = parseExpression("(x+h)^3-x^3").algebrite;
    const expanded = expand(original);
    const samples: Array<[number, number]> = [
      [1, 2], [0, -1], [-2, 3], [2, 0],
      [-3, -2], [4, -1], [-1, 4], [3, 1],
    ];
    for (const [x, h] of samples) {
      const atPoint = expanded
        .replace(/\bx\b/g, `(${x})`)
        .replace(/\bh\b/g, `(${h})`);
      const actual = compileNumeric(evaluate(atPoint), "__no_var__")(0);
      const expected = h * h * h + 3 * h * h * x + 3 * h * x * x;
      expect(actual).toBeCloseTo(expected, 6);
    }
  });
});
