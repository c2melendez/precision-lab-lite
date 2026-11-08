import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression } from "../src/engine/algebriteClient";
import { ErrorCode, type AppError } from "../src/types";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "(x^5-1)/(x-1)";
const SAMPLES = [-3, -2, -1, 0, 2, 3, 4]; // exclude x=1 (domain)

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

describe("Algebra229 AS-C-16 division (x^5-1) entre (x-1)", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-16\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-16",
      "N2",
      "`division`",
      "`\\left(x^{5}-1\\right)\\div(x-1)`",
      "`q=x^{4} + x^{3} + x^{2} + x + 1,\\ r=0`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("exact polynomial identity holds: x^5-1 = (x-1)*(x^4+x^3+x^2+x+1)", () => {
    for (const x of SAMPLES) {
      expect(x ** 5 - 1).toBe((x - 1) * (x ** 4 + x ** 3 + x ** 2 + x + 1));
    }
  });

  it("engine form is equivalent to the geometric sum quotient", () => {
    expect(compact(simplifyExpression(`(${INPUT})-(x^4+x^3+x^2+x+1)`))).toBe("0");
  });

  it("engine values match the exact quotient on every sample with x != 1", () => {
    const numeric = (x: number) => toNumber(String(evaluate(`((${x})^5-1)/((${x})-1)`)));
    for (const x of SAMPLES) {
      const expected = x ** 4 + x ** 3 + x ** 2 + x + 1;
      expect(numeric(x)).toBeCloseTo(expected, 12);
    }
  });

  it("does not claim a value at the excluded point x=1", () => {
    expectDomainError("((1)^5-1)/((1)-1)");
  });
});
