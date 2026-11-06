import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "2*x^3-x^2-13*x-6";

describe("Algebra229 AS-B-13 factor 2x^3-x^2-13x-6", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-13\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 8)).toEqual([
      "AS-B-13",
      "N3",
      "`factorizar`",
      "`2x^{3}-x^{2}-13x-6`",
      "`\\left(x - 3\\right) \\left(x + 2\\right) \\left(2 x + 1\\right)`",
      "",
      "",
    ]);
  });

  it("factors into three linear factors verified by independent integer arithmetic", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    // Structural identity (not numeric oracle)
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(evaluate(`(${factored})-((x-3)*(x+2)*(2*x+1))`).trim()).toBe("0");

    // Independent integer substitutions
    const samples = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    for (const x of samples) {
      const substituted = factored.replace(/\bx\b/g, `(${x})`);
      const actual = compileNumeric(substituted, "__no_var__")(0);
      const expected = 2 * x ** 3 - x ** 2 - 13 * x - 6;
      const normalizedActual = Object.is(actual, -0) ? 0 : actual;
      expect(normalizedActual).toBe(expected);
    }
  });
});
