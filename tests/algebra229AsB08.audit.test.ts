import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "x^4-5*x^2+4";

describe("Algebra229 AS-B-08 factor x^4-5x^2+4", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-08\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 8)).toEqual([
      "AS-B-08",
      "N2",
      "`factorizar`",
      "`x^{4}-5x^{2}+4`",
      "`\\left(x - 2\\right) \\left(x - 1\\right) \\left(x + 1\\right) \\left(x + 2\\right)`",
      "",
      "",
    ]);
  });

  it("returns four linear factors verified by independent integer arithmetic", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(factored).toBe("(x-2)*(x-1)*(x+1)*(x+2)");

    const factors = factored.split("*");
    expect(factors).toHaveLength(4);
    expect(factors.every((factor) => /^\(x[+-]\d+\)$/.test(factor))).toBe(true);
    expect(factors).toContain("(x-2)");
    expect(factors).toContain("(x-1)");
    expect(factors).toContain("(x+1)");
    expect(factors).toContain("(x+2)");
    expect(factored).not.toMatch(/x\^2|x\^3|x\^4|x\*\*2|x\*\*3|x\*\*4/);

    const samples = [-11, -7, -3, -1, 0, 1, 2, 3, 4, 7];
    for (const x of samples) {
      const substituted = factored.replace(/\bx\b/g, `(${x})`);
      const actual = compileNumeric(substituted, "__no_var__")(0);
      const expected = x ** 4 - 5 * x ** 2 + 4;
      const normalized = Object.is(actual, -0) ? 0 : actual;
      expect(normalized).toBe(expected);
    }
  });
});
