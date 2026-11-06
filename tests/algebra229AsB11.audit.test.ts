import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "a*x+a*y+b*x+b*y";

describe("Algebra229 AS-B-11 factor ax+ay+bx+by", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-11\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 8)).toEqual([
      "AS-B-11",
      "N2",
      "`factorizar`",
      "`ax+ay+bx+by`",
      "`\\left(a + b\\right) \\left(x + y\\right)`",
      "Agrupación de términos.",
      "",
    ]);
  });

  it("factors by grouping into two binomials verified by independent integer arithmetic", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    // Accept commutative variants of (a+b)*(x+y)
    const normalized = factored.replace(/\*\*/g, "^");
    const acceptable = [
      "(a+b)*(x+y)",
      "(x+y)*(a+b)",
      "(b+a)*(x+y)",
      "(x+y)*(b+a)",
      "(a+b)*(y+x)",
      "(y+x)*(a+b)",
    ];
    expect(acceptable).toContain(normalized);

    // Structural identity (not numeric oracle)
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(evaluate(`(${factored})-((a+b)*(x+y))`).trim()).toBe("0");

    // Independent multi-variable integer substitutions
    const samples: [number, number, number, number][] = [
      [1, 2, 3, 4],
      [0, 0, 0, 0],
      [-1, 2, -3, 4],
      [5, -2, 0, 1],
      [2, 2, 2, 2],
      [-4, -1, 3, 0],
      [7, 0, -2, 5],
      [1, -1, 1, -1],
      [0, 3, 4, -5],
      [6, 1, -1, 2],
    ];
    for (const [a, b, x, y] of samples) {
      let substituted = factored
        .replace(/\ba\b/g, `(${a})`)
        .replace(/\bb\b/g, `(${b})`)
        .replace(/\bx\b/g, `(${x})`)
        .replace(/\by\b/g, `(${y})`);
      const actual = compileNumeric(substituted, "__no_var__")(0);
      const expected = a * x + a * y + b * x + b * y;
      const normalizedActual = Object.is(actual, -0) ? 0 : actual;
      expect(normalizedActual).toBe(expected);
    }
  });
});
