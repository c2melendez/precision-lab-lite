import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression } from "../src/engine/algebriteClient";
import { ErrorCode, type AppError } from "../src/types";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "(x^2+3*x+2)/(x^2-x-2)";
const EXPECTED = "(x+2)/(x-2)";
const SAMPLES = [-5, -3, 0, 1, 3, 5];

function compact(expression: string): string {
  return expression.replace(/\s+/g, "");
}

// Accepts an exact "a/b" fraction or decimal text returned by the engine.
function toNumber(text: string): number {
  const fraction = /^(-?\d+)\/(\d+)$/.exec(compact(text));
  return fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(compact(text));
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

describe("Algebra229 AS-C-03 simplificar (x^2+3x+2)/(x^2-x-2)", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-03\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-03",
      "N2",
      "`simplificar`",
      "`\\frac{x^{2}+3x+2}{x^{2}-x-2}`",
      "`\\frac{x + 2}{x - 2}`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("simplifies to the exact frozen result", () => {
    expect(compact(simplifyExpression(INPUT))).toBe(EXPECTED);
  });

  it("is symbolically equivalent to the original away from x=2 and x=-1", () => {
    expect(compact(simplifyExpression("((x^2+3*x+2)/(x^2-x-2))-((x+2)/(x-2))"))).toBe("0");
  });

  it("independent arithmetic matches every sample outside x=2 and x=-1", () => {
    for (const value of SAMPLES) {
      const expected = (value ** 2 + 3 * value + 2) / (value ** 2 - value - 2);
      expect(expected).toBeCloseTo((value + 2) / (value - 2), 12);
      const actual = toNumber(String(evaluate(`((${value})^2+3*(${value})+2)/((${value})^2-(${value})-2)`)));
      expect(actual).toBeCloseTo(expected, 12);
    }
  });

  it("does not claim a value at the excluded points x=2 and x=-1", () => {
    expectDomainError("((2)^2+3*(2)+2)/((2)^2-(2)-2)");
    expectDomainError("((-1)^2+3*(-1)+2)/((-1)^2-(-1)-2)");
  });
});
