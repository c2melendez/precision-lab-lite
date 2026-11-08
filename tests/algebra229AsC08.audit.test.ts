import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression } from "../src/engine/algebriteClient";
import { ErrorCode, type AppError } from "../src/types";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "(x+1)/(x^2-1)-1/(x-1)";
const SAMPLES = [-3, -2, 0, 2, 3, 5];

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

describe("Algebra229 AS-C-08 simplificar (x+1)/(x^2-1)-1/(x-1)", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-08\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-08",
      "N2",
      "`simplificar`",
      "`\\frac{x+1}{x^{2}-1}-\\frac{1}{x-1}`",
      "`0`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("simplifies to exact zero", () => {
    expect(simplifyExpression(INPUT).trim()).toBe("0");
  });

  it("independent arithmetic is zero at every sample outside x=1 and x=-1", () => {
    for (const value of SAMPLES) {
      const expected = (value + 1) / (value * value - 1) - 1 / (value - 1);
      expect(Math.abs(expected)).toBeLessThan(1e-12);
      const expression = `(((${value})+1)/(((${value})^2)-1))-(1/((${value})-1))`;
      expect(Math.abs(toNumber(String(evaluate(expression))))).toBeLessThan(1e-12);
    }
  });

  it("does not claim zero at excluded points x=1 or x=-1", () => {
    expectDomainError("(((1)+1)/(((1)^2)-1))-(1/((1)-1))");
    expectDomainError("(((-1)+1)/(((-1)^2)-1))-(1/((-1)-1))");
  });
});
