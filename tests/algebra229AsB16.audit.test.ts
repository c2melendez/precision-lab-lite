import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "a^3-b^3";

describe("Algebra229 AS-B-16 factor a^3-b^3", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-16\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 8)).toEqual([
      "AS-B-16",
      "N2",
      "`factorizar`",
      "`a^{3}-b^{3}`",
      "`\\left(a - b\\right) \\left(a^{2} + a b + b^{2}\\right)`",
      "",
      "",
    ]);
  });

  it("factors into (a-b)(a^2+ab+b^2) verified by independent integer arithmetic", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(evaluate(`(${factored})-((a-b)*(a^2+a*b+b^2))`).trim()).toBe("0");

    const samples: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [2, 1],
      [3, 2],
      [-1, 1],
      [4, -2],
      [-3, -1],
      [5, 3],
      [2, 2],
    ];
    for (const [a, b] of samples) {
      let substituted = factored
        .replace(/\ba\b/g, `(${a})`)
        .replace(/\bb\b/g, `(${b})`);
      const actual = compileNumeric(substituted, "__no_var__")(0);
      const expected = a ** 3 - b ** 3;
      const normalizedActual = Object.is(actual, -0) ? 0 : actual;
      expect(normalizedActual).toBe(expected);
    }
  });
});
