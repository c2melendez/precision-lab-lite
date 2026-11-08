import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression } from "../src/engine/algebriteClient";
import { ErrorCode, type AppError } from "../src/types";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "a/b+b/a";
const EXPECTED = "(a^2+b^2)/(a*b)";
const SAMPLES: Array<[number, number]> = [
  [1, 2],
  [-3, 2],
  [2, -5],
  [3, 4],
  [-4, -7],
];

function canonical(expression: string): string {
  return expression.replace(/\s+/g, "").replace(/\*/g, "");
}

function toNumber(text: string): number {
  const fraction = /^(-?\d+)\/(\d+)$/.exec(text.replace(/\s+/g, ""));
  return fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(text.replace(/\s+/g, ""));
}

function substitute(expression: string, a: number, b: number): string {
  return expression.replace(/\b[ab]\b/g, (name) => (name === "a" ? `(${a})` : `(${b})`));
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

describe("Algebra229 AS-C-09 simplificar a/b+b/a", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-09\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-09",
      "N2",
      "`simplificar`",
      "`\\frac{a}{b}+\\frac{b}{a}`",
      "`\\frac{a^{2} + b^{2}}{a b}`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("simplifies to one combined fraction over a common denominator", () => {
    const result = simplifyExpression(INPUT);
    expect(canonical(result)).toBe(canonical(EXPECTED));
    expect(canonical(simplifyExpression(`(${INPUT})-(${EXPECTED})`))).toBe("0");
  });

  it("independent arithmetic matches every sample with a and b nonzero", () => {
    const simplified = simplifyExpression(INPUT);
    for (const [a, b] of SAMPLES) {
      const expected = a / b + b / a;
      expect(expected).toBeCloseTo((a * a + b * b) / (a * b), 12);
      expect(toNumber(String(evaluate(substitute(INPUT, a, b))))).toBeCloseTo(expected, 12);
      expect(toNumber(String(evaluate(substitute(simplified, a, b))))).toBeCloseTo(expected, 12);
    }
  });

  it("does not claim a value at excluded points a=0 or b=0", () => {
    expectDomainError(substitute(INPUT, 0, 2));
    expectDomainError(substitute(INPUT, 2, 0));
    expectDomainError(substitute(INPUT, 0, 0));
  });
});
