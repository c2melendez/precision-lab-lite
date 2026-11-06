import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "6*x^2+5*x-4";

describe("Algebra229 AS-B-09 factor 6x^2+5x-4", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-09\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 8)).toEqual([
      "AS-B-09",
      "N2",
      "`factorizar`",
      "`6x^{2}+5x-4`",
      "`\\left(2 x - 1\\right) \\left(3 x + 4\\right)`",
      "",
      "",
    ]);
  });

  it("returns the two integer-coefficient linear factors verified by independent integer arithmetic", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(factored).toBe("(2*x-1)*(3*x+4)");

    const factors = factored.match(/\([^()]+\)/g) ?? [];
    expect(factors).toHaveLength(2);
    expect(factors).toContain("(2*x-1)");
    expect(factors).toContain("(3*x+4)");
    expect(factored).not.toMatch(/x\^2|x\*\*2/);

    const samples = [-11, -7, -3, -1, 0, 1, 2, 3, 4, 7];
    for (const x of samples) {
      const substituted = factored.replace(/\bx\b/g, `(${x})`);
      const actual = compileNumeric(substituted, "__no_var__")(0);
      const expected = 6 * x ** 2 + 5 * x - 4;
      const normalized = Object.is(actual, -0) ? 0 : actual;
      expect(normalized).toBe(expected);
    }
  });
});
