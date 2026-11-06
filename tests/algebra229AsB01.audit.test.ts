import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "x^2-5*x+6";

describe("Algebra229 AS-B-01 factor x^2-5x+6", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-01\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 7)).toEqual([
      "AS-B-01",
      "N1",
      "`factorizar`",
      "`x^{2}-5x+6`",
      "`\\left(x - 3\\right) \\left(x - 2\\right)`",
      "",
    ]);
  });

  it("returns a product of linear factors verified by independent integer arithmetic", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(factored).toContain("*");
    expect(factored).not.toMatch(/x\^2|x\*\*2/);

    const samples = [-7, -5, -3, -1, 0, 1, 2, 3, 4, 7];
    for (const x of samples) {
      const substituted = factored.replace(/\bx\b/g, `(${x})`);
      const actual = compileNumeric(substituted, "__no_var__")(0);
      const expected = x * x - 5 * x + 6;
      expect(actual).toBe(expected);
    }
  });
});
