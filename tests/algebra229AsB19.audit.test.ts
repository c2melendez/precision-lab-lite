import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "x^2*y-x*y^2";

describe("Algebra229 AS-B-19 factor x^2y-xy^2", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-19\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 8)).toEqual([
      "AS-B-19",
      "N2",
      "`factorizar`",
      "`x^{2}y-xy^{2}`",
      "`x y \\left(x - y\\right)`",
      "",
      "",
    ]);
  });

  it("factors into x*y*(x-y) verified by independent integer arithmetic over pairs (x, y)", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(evaluate(`(${factored})-(x*y*(x-y))`).trim()).toBe("0");

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
      const expected = x ** 2 * y - x * y ** 2;
      const normalizedActual = Object.is(actual, -0) ? 0 : actual;
      const normalizedExpected = Object.is(expected, -0) ? 0 : expected;
      expect(normalizedActual).toBe(normalizedExpected);
    }
  });
});
