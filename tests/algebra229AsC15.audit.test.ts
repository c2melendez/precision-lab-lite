import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const NUMERATOR = "2*x^3+3*x^2-5*x+7";
const DENOMINATOR = "x^2+1";
const INPUT = `(${NUMERATOR})/(${DENOMINATOR})`;
const SAMPLES = [-3, -2, -1, 0, 1, 2, 3, 4];

function toNumber(text: string): number {
  const fraction = /^(-?\d+)\/(\d+)$/.exec(text.replace(/\s+/g, ""));
  return fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(text.replace(/\s+/g, ""));
}

function compact(expression: string): string {
  return expression.replace(/\s+/g, "").replace(/\*/g, "");
}

describe("Algebra229 AS-C-15 division (2x^3+3x^2-5x+7) entre (x^2+1)", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-15\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-15",
      "N3",
      "`division`",
      "`\\left(2x^{3}+3x^{2}-5x+7\\right)\\div\\left(x^{2}+1\\right)`",
      "`q=2 x + 3,\\ r=4 - 7 x`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("exact polynomial identity holds: numerator = (x^2+1)*q(x) + r(x)", () => {
    for (const x of SAMPLES) {
      const num = 2 * x ** 3 + 3 * x ** 2 - 5 * x + 7;
      const q = 2 * x + 3;
      const r = 4 - 7 * x;
      expect(num).toBe((x * x + 1) * q + r);
    }
  });

  it("engine form is equivalent to q(x) + r(x)/(x^2+1)", () => {
    expect(
      compact(simplifyExpression(`(${INPUT})-(2*x+3+(4-7*x)/(x^2+1))`)),
    ).toBe("0");
  });

  it("engine values match q(x) + r(x)/(x^2+1) on every sample", () => {
    const numeric = (x: number) =>
      toNumber(String(evaluate(`(2*(${x})^3+3*(${x})^2-5*(${x})+7)/((${x})^2+1)`)));
    for (const x of SAMPLES) {
      const expected = 2 * x + 3 + (4 - 7 * x) / (x * x + 1);
      expect(numeric(x)).toBeCloseTo(expected, 12);
    }
  });

  it("remainder is the linear polynomial 4-7x (not zero)", () => {
    for (const x of SAMPLES) {
      const num = 2 * x ** 3 + 3 * x ** 2 - 5 * x + 7;
      const qPart = (x * x + 1) * (2 * x + 3);
      expect(num - qPart).toBe(4 - 7 * x);
    }
  });
});
