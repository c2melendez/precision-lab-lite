import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression } from "../src/engine/algebriteClient";
import { ErrorCode, type AppError } from "../src/types";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "(x^2-1)/(x-1)";
const EXPECTED = "x+1";
const SAMPLES = [-3, -2, 0, 2, 3, 5];

function compact(expression: string): string {
  return expression.replace(/\s+/g, "");
}

describe("Algebra229 AS-C-01 simplificar (x^2-1)/(x-1)", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-01\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-01",
      "N1",
      "`simplificar`",
      "`\\frac{x^{2}-1}{x-1}`",
      "`x + 1`",
      "Válido para `x\\neq1`.",
    ]);
    expect(cells[7]).toBe("");
  });

  it("simplifies to the exact frozen result", () => {
    expect(compact(simplifyExpression(INPUT))).toBe(EXPECTED);
  });

  it("is symbolically equivalent to the original away from x=1", () => {
    expect(compact(simplifyExpression(`((x^2-1)/(x-1))-(x+1)`))).toBe("0");
  });

  it("independent arithmetic matches every sample outside x=1", () => {
    for (const value of SAMPLES) {
      const expected = (value * value - 1) / (value - 1);
      expect(expected).toBe(value + 1);
      const actual = Number(evaluate(`((${value})^2-1)/((${value})-1)`));
      expect(actual).toBe(expected);
    }
  });

  it("does not claim a value at the excluded point x=1", () => {
    try {
      evaluate("((1)^2-1)/((1)-1)");
      throw new Error("Expected the excluded point to fail");
    } catch (error) {
      expect((error as AppError).code).toBe(ErrorCode.DOMAIN_ERROR);
    }
  });
});
