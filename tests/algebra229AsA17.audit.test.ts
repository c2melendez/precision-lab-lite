import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const COEFFICIENTS = [32, -80, 80, -40, 10, -1] as const;

const independentIntegerOracle = (x: number, y: number): number =>
  COEFFICIENTS.reduce((sum, coefficient, index) => sum + coefficient * x ** (5 - index) * y ** index, 0);

describe("Algebra229 AS-A-17 expand (2x-y)^5", () => {
  it("matches the exact frozen matrix contract cells", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-A-17\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 6)).toEqual([
      "AS-A-17",
      "N2",
      "`expandir`",
      "`(2x-y)^{5}`",
      "`32 x^{5} - 80 x^{4} y + 80 x^{3} y^{2} - 40 x^{2} y^{3} + 10 x y^{4} - y^{5}`",
    ]);
  });

  it("expands the fifth power and matches independent integer arithmetic", () => {
    const original = parseExpression("(2*x-y)^5").algebrite;
    const expanded = expand(original);
    expect(expanded).not.toMatch(/\)\s*\^\s*5/);

    const samples: Array<[number, number]> = [
      [-2, 1], [1, -3], [1, 1], [3, 2], [0, 2], [-1, -2], [2, -1],
    ];
    for (const [x, y] of samples) {
      const substituted = expanded.replace(/\bx\b/g, `(${x})`).replace(/\by\b/g, `(${y})`);
      expect(Number(evaluate(substituted))).toBe(independentIntegerOracle(x, y));
    }
  });
});
