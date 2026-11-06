import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "factor(x^2-2) sobre ℝ";
const EXPECTED = "(x-sqrt(2))*(x+sqrt(2))";
const SAMPLES = [0, 1, -1, 2, -2, 3, -3, 4, 5, 10];

describe("Algebra229 AS-B-24 factor x^2-2 over the reals", () => {
  it("matches the frozen source row structure and all known contract cells", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-24\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    const slash = String.fromCharCode(92);
    const expectedNote = "Con raíces permitidas: `(x-" + slash + "sqrt(2))(x+" + slash + "sqrt(2))`.";
    expect(cells.slice(1, 7)).toEqual([
      "AS-B-24",
      "N3",
      "`factorizar`",
      "`x^{2}-2\\ \\text{sobre }\\mathbb{R}`",
      "`\\left(x - \\sqrt{2}\\right) \\left(x + \\sqrt{2}\\right)`",
      expectedNote,
    ]);
    expect(cells[7]).toBe("");
  });

  it("returns the required ASCII real-factor form without changing the contract", () => {
    const result = evaluate(INPUT).replace(/\s+/g, "");
    expect(result).toBe(EXPECTED);
    expect(result).not.toContain("i");
  });

  it("is symbolically equivalent to x^2-2", () => {
    const result = evaluate(INPUT).replace(/\s+/g, "");
    expect(evaluate(`(${result})-(x^2-2)`).trim()).toBe("0");
  });

  it("independent numeric oracle matches x^2-2 over 10 integer samples", () => {
    const result = evaluate(INPUT).replace(/\s+/g, "");
    for (const x of SAMPLES) {
      const substituted = result.replace(/\bx\b/g, `(${x})`);
      const actual = compileNumeric(substituted, "__no_var__")(0);
      const expected = x ** 2 - 2;
      expect(Number.isFinite(actual)).toBe(true);
      expect(Math.abs(actual - expected)).toBeLessThan(1e-10);
    }
    expect(2 ** 2).toBeLessThan(8);
    expect(3 ** 2).toBeGreaterThan(8);
  });
});
