import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression } from "../src/engine/algebriteClient";
import { ErrorCode, type AppError } from "../src/types";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "(x^3-1)/(x^2-1)";
const EXPECTED = "(x^2+x+1)/(x+1)";
const SAMPLES = [-3, -2, 0, 2, 3, 5];

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

describe("Algebra229 AS-C-02 simplificar (x^3-1)/(x^2-1)", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-02\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-02",
      "N2",
      "`simplificar`",
      "`\\frac{x^{3}-1}{x^{2}-1}`",
      "`\\frac{x^{2} + x + 1}{x + 1}`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("simplifies to the exact frozen result", () => {
    expect(compact(simplifyExpression(INPUT))).toBe(EXPECTED);
  });

  it("is symbolically equivalent to the original away from x=1 and x=-1", () => {
    expect(compact(simplifyExpression("((x^3-1)/(x^2-1))-((x^2+x+1)/(x+1))"))).toBe("0");
  });

  it("independent arithmetic matches every sample outside x=1 and x=-1", () => {
    for (const value of SAMPLES) {
      const expected = (value ** 3 - 1) / (value ** 2 - 1);
      expect(expected).toBeCloseTo((value ** 2 + value + 1) / (value + 1), 12);
      const actual = toNumber(String(evaluate(`((${value})^3-1)/((${value})^2-1)`)));
      expect(actual).toBeCloseTo(expected, 12);
    }
  });

  it("does not claim a value at the excluded points x=1 and x=-1", () => {
    expectDomainError("((1)^3-1)/((1)^2-1)");
    expectDomainError("((-1)^3-1)/((-1)^2-1)");
  });
});
