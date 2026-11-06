import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "factor(360)";
const EXPECTED = "2^3*3^2*5";

type PrimePower = readonly [number, number];

function independentPrimeFactorization(value: number): PrimePower[] {
  if (!Number.isSafeInteger(value) || value < 2) throw new Error("Expected a safe integer >= 2");
  let remaining = value;
  const factors: PrimePower[] = [];
  for (let divisor = 2; divisor * divisor <= remaining; divisor++) {
    if (remaining % divisor !== 0) continue;
    let exponent = 0;
    while (remaining % divisor === 0) {
      remaining /= divisor;
      exponent++;
    }
    factors.push([divisor, exponent]);
  }
  if (remaining > 1) factors.push([remaining, 1]);
  return factors;
}

function parsePrimePowers(expression: string): PrimePower[] {
  return [...expression.matchAll(/(\d+)(?:\^(\d+))?/g)].map((match) => [
    Number(match[1]),
    Number(match[2] ?? "1"),
  ] as const);
}

describe("Algebra229 AS-B-26 factor entero 360", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-26\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-B-26",
      "N2",
      "`factorizar`",
      "`\\text{factorizar el entero }360`",
      "`2^{3}\\cdot 3^{2}\\cdot 5`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("returns the exact ASCII prime factorization", () => {
    expect(evaluate(INPUT).replace(/\s+/g, "")).toBe(EXPECTED);
  });

  it("independent trial-division prime oracle validates multiplicities and product", () => {
    const result = evaluate(INPUT).replace(/\s+/g, "");
    const actual = parsePrimePowers(result);
    const expected = independentPrimeFactorization(360);
    expect(actual).toEqual(expected);
    expect(actual).toEqual([[2, 3], [3, 2], [5, 1]]);
    const product = actual.reduce((total, [prime, exponent]) => total * prime ** exponent, 1);
    expect(product).toBe(360);
  });

  it("result is symbolically equivalent to the original integer", () => {
    const result = evaluate(INPUT).replace(/\s+/g, "");
    expect(evaluate(`(${result})-360`).trim()).toBe("0");
  });
});
