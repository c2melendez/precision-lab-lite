import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "x^2-9";

describe("Algebra229 AS-B-02 factor x^2-9", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-02\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 7)).toEqual([
      "AS-B-02",
      "N1",
      "`factorizar`",
      "`x^{2}-9`",
      "`\\left(x - 3\\right) \\left(x + 3\\right)`",
      "",
    ]);
  });

  it("returns two factors and matches independent integer arithmetic", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(factored).toContain("*");
    expect(factored).not.toMatch(/x\^2|x\*\*2/);

    const samples = [-7, -5, -3, -1, 0, 1, 3, 4, 7, 11];
    for (const x of samples) {
      const substituted = factored.replace(/\bx\b/g, `(${x})`);
      const actual = compileNumeric(substituted, "__no_var__")(0);
      const expected = x * x - 9;
      const normalized = Object.is(actual, -0) ? 0 : actual;
      expect(normalized).toBe(expected);
    }
  });
});
