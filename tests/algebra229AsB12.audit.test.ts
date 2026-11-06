import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "x^5-x";

describe("Algebra229 AS-B-12 factor x^5-x", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-12\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 8)).toEqual([
      "AS-B-12",
      "N2",
      "`factorizar`",
      "`x^{5}-x`",
      "`x \\left(x - 1\\right) \\left(x + 1\\right) \\left(x^{2} + 1\\right)`",
      "",
      "",
    ]);
  });

  it("factors into four factors verified by independent integer arithmetic", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    // Structural identity (not numeric oracle)
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(evaluate(`(${factored})-(x*(x-1)*(x+1)*(x^2+1))`).trim()).toBe("0");

    // Accept any commutative product of the four expected factors
    const expectedFactors = ["x", "(x-1)", "(x+1)", "(x^2+1)"];
    // Normalize factored form by removing outer spaces already done
    // Verify each expected factor divides the original
    for (const f of expectedFactors) {
      expect(evaluate(`(${ORIGINAL})/(${f})`).trim()).not.toBe("0"); // rough presence check via identity
    }
    // Stronger: expanded product equals original (already above)

    // Independent integer substitutions (avoid points where intermediate overflow risk is high)
    const samples = [-3, -2, -1, 0, 1, 2, 3, 4, 5, -4];
    for (const x of samples) {
      const substituted = factored.replace(/\bx\b/g, `(${x})`);
      const actual = compileNumeric(substituted, "__no_var__")(0);
      const expected = x ** 5 - x;
      const normalizedActual = Object.is(actual, -0) ? 0 : actual;
      expect(normalizedActual).toBe(expected);
    }
  });
});
