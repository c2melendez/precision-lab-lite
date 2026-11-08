import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression } from "../src/engine/algebriteClient";
import { ErrorCode, type AppError } from "../src/types";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "(x^2-y^2)/((x-y)^2)";
const EXPECTED = "(x+y)/(x-y)";
const SAMPLES: Array<[number, number]> = [
  [3, 1],
  [-2, 5],
  [0, 4],
  [7, -3],
  [1, -1],
];

// Whitespace and the "*" product sign are notation only; the expectation stays (x+y)/(x-y).
function canonical(expression: string): string {
  return expression.replace(/\s+/g, "").replace(/\*/g, "");
}

// Accepts an exact "a/b" fraction or decimal text returned by the engine.
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

describe("Algebra229 AS-C-12 simplificar (x^2-y^2)/(x-y)^2", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-12\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-12",
      "N2",
      "`simplificar`",
      "`\\frac{x^{2}-y^{2}}{(x-y)^{2}}`",
      "`\\frac{x + y}{x - y}`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("simplifies to the exact frozen result (x+y)/(x-y)", () => {
    expect(canonical(simplifyExpression(INPUT))).toBe(EXPECTED);
  });

  it("is symbolically equivalent to the original away from x=y", () => {
    expect(canonical(simplifyExpression("((x^2-y^2)/((x-y)^2))-((x+y)/(x-y))"))).toBe("0");
  });

  it("independent arithmetic matches every sample with x not equal to y", () => {
    for (const [x, y] of SAMPLES) {
      const expected = (x * x - y * y) / ((x - y) * (x - y));
      expect(expected).toBeCloseTo((x + y) / (x - y), 12);
      const actual = toNumber(String(evaluate(`((${x})^2-(${y})^2)/(((${x})-(${y}))^2)`)));
      expect(actual).toBeCloseTo(expected, 12);
    }
  });

  it("does not claim a value at the excluded points x=y", () => {
    expectDomainError("((3)^2-(3)^2)/(((3)-(3))^2)");
    expectDomainError("((-2)^2-(-2)^2)/(((-2)-(-2))^2)");
  });
});
