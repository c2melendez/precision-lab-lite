import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "x^2-2";
const SAMPLES = [0, 1, -1, 2, -2, 3, -3, 4, 5, 10];

describe("Algebra229 AS-B-23 factor x^2-2 stays irreducible over Q", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-23\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 8)).toEqual([
      "AS-B-23",
      "N2",
      "`factorizar`",
      "`x^{2}-2`",
      "`x^{2} - 2`",
      "Irreducible sobre ℚ: debe quedar igual.",
      "",
    ]);
  });

  it("result is unchanged: equivalent to x^2-2 and not a product of rational factors", () => {
    const result = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(evaluate(`(${result})-(${ORIGINAL})`).trim()).toBe("0");
    expect(result).not.toMatch(/\(/);
    expect(result).not.toMatch(/\*/);
    expect(result).not.toMatch(/\)\*\(/);
  });

  it("independent integer oracle over 10 samples and non-square discriminant", () => {
    const result = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    for (const x of SAMPLES) {
      const substituted = result.replace(/\bx\b/g, `(${x})`);
      const actual = compileNumeric(substituted, "__no_var__")(0);
      const expected = x ** 2 - 2;
      expect(Object.is(actual, -0) ? 0 : actual).toBe(expected);
    }
    const discriminant = 0 ** 2 - 4 * 1 * -2;
    expect(discriminant).toBe(8);
    expect(2 ** 2).toBeLessThan(discriminant);
    expect(discriminant).toBeLessThan(3 ** 2);
  });
});
