import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "(x^2+1)^2-4*x^2";
const EXPECTED = "(x-1)^2*(x+1)^2";

describe("Algebra229 AS-B-21 factor (x^2+1)^2-4x^2", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-21\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 8)).toEqual([
      "AS-B-21",
      "N3",
      "`factorizar`",
      "`\\left(x^{2}+1\\right)^{2}-4x^{2}`",
      "`\\left(x - 1\\right)^{2} \\left(x + 1\\right)^{2}`",
      "",
      "",
    ]);
  });

  it("factors into (x-1)^2(x+1)^2 verified by independent integer arithmetic over 10 samples", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(evaluate(`(${factored})-(${EXPECTED})`).trim()).toBe("0");

    const samples = [0, 1, -1, 2, -2, 3, -3, 4, 5, 10];
    for (const x of samples) {
      const substituted = factored.replace(/\bx\b/g, `(${x})`);
      const actual = compileNumeric(substituted, "__no_var__")(0);
      const expected = (x ** 2 + 1) ** 2 - 4 * x ** 2;
      const normalizedActual = Object.is(actual, -0) ? 0 : actual;
      const normalizedExpected = Object.is(expected, -0) ? 0 : expected;
      expect(normalizedActual).toBe(normalizedExpected);
    }
  });

  it("irreducible guard: x^2+1 does not become a product of factors (AS-B-22 regression)", () => {
    const result = evaluate("factor(x^2+1)").replace(/\s+/g, "");
    expect(result).not.toMatch(/\)\*\(/);
  });
});
