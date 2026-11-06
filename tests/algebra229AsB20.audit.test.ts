import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "x^4+x^2*y^2+y^4";
const EXPECTED = "(x^2-x*y+y^2)*(x^2+x*y+y^2)";

describe("Algebra229 AS-B-20 factor x^4+x^2y^2+y^4", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-20\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 8)).toEqual([
      "AS-B-20",
      "N3",
      "`factorizar`",
      "`x^{4}+x^{2}y^{2}+y^{4}`",
      "`\\left(x^{2} - x y + y^{2}\\right) \\left(x^{2} + x y + y^{2}\\right)`",
      "",
      "",
    ]);
  });

  it("factors into two quadratics verified by independent integer arithmetic over pairs (x, y)", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(evaluate(`(${factored})-(${EXPECTED})`).trim()).toBe("0");

    const samples: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 3],
      [-2, 5],
      [4, -1],
      [-3, -3],
      [7, 2],
      [5, -6],
    ];
    for (const [x, y] of samples) {
      const substituted = factored
        .replace(/\bx\b/g, `(${x})`)
        .replace(/\by\b/g, `(${y})`);
      const actual = compileNumeric(substituted, "__no_var__")(0);
      const expected = x ** 4 + x ** 2 * y ** 2 + y ** 4;
      const normalizedActual = Object.is(actual, -0) ? 0 : actual;
      const normalizedExpected = Object.is(expected, -0) ? 0 : expected;
      expect(normalizedActual).toBe(normalizedExpected);
    }
  }, 120_000);

  it("bounded quartic rule does not fire on other shapes (not a general multivariable factorizer)", () => {
    const original = "x^4+x^2*y^2+y^5";
    const result = evaluate(`factor(${original})`).replace(/\s+/g, "");
    expect(evaluate(`(${result})-(${original})`).trim()).toBe("0");
    expect(result).not.toBe("(x^2-x*y+y^2)*(x^2+x*y+y^2)");
  }, 120_000);
});
