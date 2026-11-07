import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression } from "../src/engine/algebriteClient";
import { ErrorCode, type AppError } from "../src/types";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "((1/x)-(1/y))/(x-y)";
const EXPECTED = "-1/(x*y)";
const SAMPLES: Array<[number, number]> = [
  [1, 2],
  [-3, 2],
  [2, -5],
  [3, 4],
  [-4, -7],
];

// Whitespace and the "*" product sign are notation only.
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

describe("Algebra229 AS-C-06 simplificar ((1/x)-(1/y))/(x-y)", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-06\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-06",
      "N2",
      "`simplificar`",
      "`\\frac{\\frac{1}{x}-\\frac{1}{y}}{x-y}`",
      "`- \\frac{1}{x y}`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("simplifies to the canonical result -1/(xy)", () => {
    expect(canonical(simplifyExpression(INPUT))).toBe(canonical(EXPECTED));
  });

  it("is symbolically equivalent to the original away from x=0, y=0 and x=y", () => {
    expect(canonical(simplifyExpression(`(${INPUT})-(-1/(x*y))`))).toBe("0");
  });

  it("independent arithmetic matches every sample with x, y nonzero and x!=y", () => {
    for (const [x, y] of SAMPLES) {
      const expected = (1 / x - 1 / y) / (x - y);
      expect(expected).toBeCloseTo(-1 / (x * y), 12);
      const actual = toNumber(
        String(evaluate(`((1/(${x}))-(1/(${y})))/((${x})-(${y}))`)),
      );
      expect(actual).toBeCloseTo(expected, 12);
    }
  });

  it("does not claim a value at excluded points x=0, y=0 or x=y", () => {
    expectDomainError("((1/(0))-(1/(2)))/((0)-(2))");
    expectDomainError("((1/(2))-(1/(0)))/((2)-(0))");
    expectDomainError("((1/(3))-(1/(3)))/((3)-(3))");
  });
});
