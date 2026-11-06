import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "factor(4294967297)";
const ORIGINAL = 4294967297;
const EXPECTED = "641*6700417";
type PrimePower = readonly [number, number];

function trialDivisionFactorization(value: number): PrimePower[] {
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

function isPrimeByTrialDivision(value: number): boolean {
  if (!Number.isSafeInteger(value) || value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor++) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function parsePrimePowers(expression: string): PrimePower[] {
  return [...expression.matchAll(/(\\d+)(?:\\^(\\d+))?/g)].map((match) => [
    Number(match[1]),
    Number(match[2] ?? "1"),
  ] as const);
}

describe("Algebra229 AS-B-28 factor entero 4294967297", () => {
  it("matches the frozen matrix row cells exactly", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\\r?\\n/).find((line) => /^\\|\\s*AS-B-28\\s*\\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-B-28",
      "N3",
      "`factorizar`",
      "`\\\\text{factorizar el entero }4294967297`",
      "`641\\\\cdot 6700417`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("returns the exact ASCII prime factorization", () => {
    expect(evaluate(INPUT).replace(/\\s+/g, "")).toBe(EXPECTED);
  });

  it("independent trial-division oracle proves prime factors, multiplicities, and product", () => {
    const result = evaluate(INPUT).replace(/\\s+/g, "");
    const expected = trialDivisionFactorization(ORIGINAL);
    const actual = parsePrimePowers(result);
    expect(expected).toEqual([[641, 1], [6700417, 1]]);
    expect(actual).toEqual(expected);
    for (const [prime, exponent] of actual) {
      expect(isPrimeByTrialDivision(prime)).toBe(true);
      expect(exponent).toBe(1);
    }
    const product = actual.reduce((total, [prime, exponent]) => total * prime ** exponent, 1);
    expect(product).toBe(ORIGINAL);
  });

  it("result remains symbolically equivalent to the original integer", () => {
    const result = evaluate(INPUT).replace(/\\s+/g, "");
    expect(evaluate(`(${result})-${ORIGINAL}`).trim()).toBe("0");
  });
});
