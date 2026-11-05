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

describe("Algebra229 AS-A-11 expand (a+b+c)^3", () => {
  it("matches the exact frozen source row", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-A-11\s*\|/.test(line))?.trim();
    const expectedRow = "| AS-A-11 | N2 | `expandir` | `(a+b+c)^{3}` | `a^{3} + 3 a^{2} b + 3 a^{2} c + 3 a b^{2} + 6 a b c + 3 a c^{2} + b^{3} + 3 b^{2} c + 3 b c^{2} + c^{3}` |  |";
    expect(sourceRow).toBe(expectedRow);
  });

  it("expands the original multinomial cube and matches independent arithmetic at eight signed triples", () => {
    const original = parseExpression("(a+b+c)^3").algebrite;
    const expanded = expand(original);
    const samples: Array<[number, number, number]> = [
      [1, 2, 3],
      [0, -1, 2],
      [-2, 1, -1],
      [2, 2, 2],
      [-1, -1, -1],
      [3, 0, -2],
      [-3, 2, 1],
      [4, -2, 0],
    ];
    for (const [a, b, c] of samples) {
      const atPoint = expanded
        .replace(/\ba\b/g, `(${a})`)
        .replace(/\bb\b/g, `(${b})`)
        .replace(/\bc\b/g, `(${c})`);
      const actual = compileNumeric(evaluate(atPoint), "__no_var__")(0);
      const expected = Math.pow(a + b + c, 3);
      expect(actual).toBeCloseTo(expected, 6);
    }
  });
});
