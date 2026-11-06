import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "x^3-8";

describe("Algebra229 AS-B-03 factor x^3-8", () => {
  it("matches every frozen source-row contract cell including its irreducibility note", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-03\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 7)).toEqual([
      "AS-B-03",
      "N1",
      "`factorizar`",
      "`x^{3}-8`",
      "`\\left(x - 2\\right) \\left(x^{2} + 2 x + 4\\right)`",
      "Diferencia de cubos: factor cuadrático irreducible.",
    ]);
  });

  it("returns a linear times irreducible quadratic factor and matches independent integer arithmetic", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(factored).toContain("*");
    expect(factored).toMatch(/x\^2/);
    expect(factored).not.toMatch(/x\^3|x\*\*3/);

    const samples = [-7, -5, -2, -1, 0, 1, 2, 3, 4, 7];
    for (const x of samples) {
      const substituted = factored.replace(/\bx\b/g, `(${x})`);
      const actual = compileNumeric(substituted, "__no_var__")(0);
      const expected = x * x * x - 8;
      const normalized = Object.is(actual, -0) ? 0 : actual;
      expect(normalized).toBe(expected);
    }
  });
});
