import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "x^3+3*x^2+3*x+1";

describe("Algebra229 AS-B-10 factor x^3+3x^2+3x+1", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-10\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 8)).toEqual([
      "AS-B-10",
      "N2",
      "`factorizar`",
      "`x^{3}+3x^{2}+3x+1`",
      "`\\left(x + 1\\right)^{3}`",
      "",
      "",
    ]);
  });

  it("returns the perfect cube of a linear factor verified by independent integer arithmetic", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    // Accept either (x+1)^3 or (x+1)**3 style; normalize carets
    const normalized = factored.replace(/\*\*/g, "^");
    expect(normalized === "(x+1)^3" || normalized === "(1+x)^3").toBe(true);

    // Algebraic identity via CAS only as structural check (not numeric oracle)
    expect(evaluate(`(${factored})-((x+1)^3)`).trim()).toBe("0");
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");

    const samples = [-11, -7, -3, -1, 0, 1, 2, 3, 4, 7];
    for (const x of samples) {
      const substituted = factored.replace(/\bx\b/g, `(${x})`);
      const actual = compileNumeric(substituted, "__no_var__")(0);
      const expected = x ** 3 + 3 * x ** 2 + 3 * x + 1;
      const normalizedActual = Object.is(actual, -0) ? 0 : actual;
      expect(normalizedActual).toBe(expected);
    }
  });
});
