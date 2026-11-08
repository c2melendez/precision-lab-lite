import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression } from "../src/engine/algebriteClient";
import { ErrorCode, type AppError } from "../src/types";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "1/(x-1)-1/(x+1)";
const EXPECTED = "2/((x-1)*(x+1))";
const SAMPLES = [-3, -2, 0, 2, 3, 5];

function canonical(expression: string): string {
  return expression.replace(/\s+/g, "").replace(/\*/g, "");
}

function toNumber(text: string): number {
  const fraction = /^(-?\d+)\/(\d+)$/.exec(text.replace(/\s+/g, ""));
  return fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(text.replace(/\s+/g, ""));
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

describe("Algebra229 AS-C-07 simplificar 1/(x-1)-1/(x+1)", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-07\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-07",
      "N2",
      "`simplificar`",
      "`\\frac{1}{x-1}-\\frac{1}{x+1}`",
      "`\\frac{2}{\\left(x - 1\\right) \\left(x + 1\\right)}`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("returns a simplified result equivalent to the frozen answer", () => {
    const result = simplifyExpression(INPUT);
    // The engine may keep the expanded denominator; equivalence is checked exactly, not textually.
    expect(canonical(result)).not.toBe(canonical(INPUT));
    expect(canonical(simplifyExpression(`(${INPUT})-(${EXPECTED})`))).toBe("0");
    expect(canonical(simplifyExpression(`(${result})-(${EXPECTED})`))).toBe("0");
  });

  it("independent arithmetic matches every sample outside x=1 and x=-1", () => {
    const result = simplifyExpression(INPUT);
    for (const value of SAMPLES) {
      const expected = 2 / (value * value - 1);
      expect(expected).toBeCloseTo(1 / (value - 1) - 1 / (value + 1), 12);
      const actual = toNumber(
        String(evaluate(`(1/((${value})-1))-(1/((${value})+1))`)),
      );
      expect(actual).toBeCloseTo(expected, 12);
      const substituted = result.replace(/x/g, `(${value})`);
      const fromResult = toNumber(String(evaluate(substituted)));
      expect(fromResult).toBeCloseTo(expected, 12);
    }
  });

  it("does not claim a value at excluded points x=1 or x=-1", () => {
    expectDomainError("(1/((1)-1))-(1/((1)+1))");
    expectDomainError("(1/((-1)-1))-(1/((-1)+1))");
  });
});
