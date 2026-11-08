import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression } from "../src/engine/algebriteClient";
import { ErrorCode, type AppError } from "../src/types";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "(1-1/x^2)/(1-1/x)";
const EXPECTED = "(x+1)/x";
const SAMPLES = [-3, -2, 2, 3, 5];

function canonical(expression: string): string {
  return expression.replace(/\s+/g, "").replace(/\*/g, "");
}

function toNumber(text: string): number {
  const fraction = /^(-?\d+)\/(\d+)$/.exec(text.replace(/\s+/g, ""));
  return fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(text.replace(/\s+/g, ""));
}

function substituteX(expression: string, value: number): string {
  return expression.replace(/\bx\b/g, `(${value})`);
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

describe("Algebra229 AS-C-10 simplificar (1-1/x^2)/(1-1/x)", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-10\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-10",
      "N2",
      "`simplificar`",
      "`\\frac{1-\\frac{1}{x^{2}}}{1-\\frac{1}{x}}`",
      "`\\frac{x + 1}{x}`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("returns a simplified result equivalent to the frozen answer", () => {
    const result = simplifyExpression(INPUT);
    // The engine simplifies to the equivalent 1+1/x; equivalence is checked exactly.
    expect(canonical(result)).not.toBe(canonical(INPUT));
    expect(canonical(simplifyExpression(`(${INPUT})-(${EXPECTED})`))).toBe("0");
    expect(canonical(simplifyExpression(`(${result})-(${EXPECTED})`))).toBe("0");
  });

  it("independent arithmetic matches every sample outside x=0 and x=1", () => {
    const simplified = simplifyExpression(INPUT);
    for (const value of SAMPLES) {
      const expected = (1 - 1 / (value * value)) / (1 - 1 / value);
      expect(expected).toBeCloseTo((value + 1) / value, 12);
      expect(toNumber(String(evaluate(substituteX(INPUT, value))))).toBeCloseTo(expected, 12);
      expect(toNumber(String(evaluate(substituteX(simplified, value))))).toBeCloseTo(expected, 12);
    }
  });

  it("does not claim a value at excluded points x=0 or x=1", () => {
    expectDomainError(substituteX(INPUT, 0));
    expectDomainError(substituteX(INPUT, 1));
  });
});
