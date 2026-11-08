import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression } from "../src/engine/algebriteClient";
import { ErrorCode, type AppError } from "../src/types";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const NUMERATOR = "x^3+2*x^2-x+3";
const INPUT = `(${NUMERATOR})/(x-2)`;
const SAMPLES = [-4, -1, 0, 1, 3, 5];

// Independent Ruffini synthetic division by (x - 2): coefficients from highest degree.
function ruffini(coefficients: number[], root: number): { quotient: number[]; remainder: number } {
  const out: number[] = [];
  let carry = 0;
  for (const c of coefficients) {
    carry = carry * root + c;
    out.push(carry);
  }
  const remainder = out.pop() as number;
  return { quotient: out, remainder };
}

// Accepts an exact "a/b" fraction or decimal text returned by the engine.
function toNumber(text: string): number {
  const fraction = /^(-?\d+)\/(\d+)$/.exec(text.replace(/\s+/g, ""));
  return fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(text.replace(/\s+/g, ""));
}

function compact(expression: string): string {
  return expression.replace(/\s+/g, "").replace(/\*/g, "");
}

function expectDomainError(expression: string): void {
  try {
    evaluate(expression);
  } catch (error) {
    expect((error as AppError).code).toBe(ErrorCode.DOMAIN_ERROR);
    return;
  }
  throw new Error(`Expected ${expression} to fail with DOMAIN_ERROR`);
}

describe("Algebra229 AS-C-13 division (x^3+2x^2-x+3) entre (x-2)", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-13\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-13",
      "N2",
      "`division`",
      "`\\left(x^{3}+2x^{2}-x+3\\right)\\div(x-2)`",
      "`q=x^{2} + 4 x + 7,\\ r=17`",
      "Cociente y resto; coincide con la regla de Ruffini.",
    ]);
    expect(cells[7]).toBe("");
  });

  it("Ruffini gives quotient x^2+4x+7 and remainder 17", () => {
    const { quotient, remainder } = ruffini([1, 2, -1, 3], 2);
    expect(quotient).toEqual([1, 4, 7]);
    expect(remainder).toBe(17);
  });

  it("exact polynomial identity holds: numerator = (x-2)*q(x) + r", () => {
    for (const x of SAMPLES) {
      expect(x ** 3 + 2 * x ** 2 - x + 3).toBe((x - 2) * (x * x + 4 * x + 7) + 17);
    }
  });

  it("engine quotient form is equivalent to q(x) + 17/(x-2) away from x=2", () => {
    expect(compact(simplifyExpression(`(${INPUT})-(x^2+4*x+7+17/(x-2))`))).toBe("0");
  });

  it("engine values match q(x) + 17/(x-2) on every sample with x != 2", () => {
    const result = simplifyExpression(INPUT);
    const numeric = (x: number) => toNumber(String(evaluate(`((${x})^3+2*(${x})^2-(${x})+3)/((${x})-2)`)));
    for (const x of SAMPLES) {
      const expected = x * x + 4 * x + 7 + 17 / (x - 2);
      expect(numeric(x)).toBeCloseTo(expected, 12);
    }
    expect(result).toBeTruthy();
  });

  it("does not claim a value at the excluded point x=2", () => {
    expectDomainError("((2)^3+2*(2)^2-(2)+3)/((2)-2)");
  });
});
