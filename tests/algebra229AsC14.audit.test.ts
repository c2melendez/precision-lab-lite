import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const NUMERATOR = "x^4-1";
const DENOMINATOR = "x^2+1";
const INPUT = `(${NUMERATOR})/(${DENOMINATOR})`;
const SAMPLES = [-3, -2, -1, 0, 1, 2, 3, 4];

// Accepts an exact "a/b" fraction or decimal text returned by the engine.
function toNumber(text: string): number {
  const fraction = /^(-?\d+)\/(\d+)$/.exec(text.replace(/\s+/g, ""));
  return fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(text.replace(/\s+/g, ""));
}

function compact(expression: string): string {
  return expression.replace(/\s+/g, "").replace(/\*/g, "");
}

describe("Algebra229 AS-C-14 division (x^4-1) entre (x^2+1)", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-14\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-14",
      "N2",
      "`division`",
      "`\\left(x^{4}-1\\right)\\div\\left(x^{2}+1\\right)`",
      "`q=x^{2} - 1,\\ r=0`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("exact polynomial identity holds: numerator = (x^2+1)*q(x) + r with r=0", () => {
    for (const x of SAMPLES) {
      expect(x ** 4 - 1).toBe((x * x + 1) * (x * x - 1) + 0);
    }
  });

  it("engine form is equivalent to the exact quotient x^2-1", () => {
    // Difference of the simplified engine result and the independent quotient must be 0.
    expect(compact(simplifyExpression(`(${INPUT})-(x^2-1)`))).toBe("0");
  });

  it("engine values match the exact quotient on every sample", () => {
    const numeric = (x: number) =>
      toNumber(String(evaluate(`((${x})^4-1)/((${x})^2+1)`)));
    for (const x of SAMPLES) {
      const expected = x * x - 1;
      expect(numeric(x)).toBeCloseTo(expected, 12);
    }
  });

  it("remainder is identically zero (exact division)", () => {
    // Independent arithmetic confirmation that the remainder term vanishes.
    for (const x of SAMPLES) {
      const left = x ** 4 - 1;
      const right = (x * x + 1) * (x * x - 1);
      expect(left - right).toBe(0);
    }
  });
});
