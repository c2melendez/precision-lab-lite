import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "lcm(48,180)";
const EXPECTED = "720";

function compact(expression: string): string {
  return expression.replace(/\s+/g, "").replace(/\*/g, "");
}

function integerGcd(a: number, b: number): number {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right !== 0) [left, right] = [right, left % right];
  return left;
}

describe("Algebra229 AS-C-21 lcm(48,180)", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-21\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-21",
      "N1",
      "`valor`",
      "`\\operatorname{lcm}(48,180)`",
      "`720`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("evaluate(lcm(48,180)) returns the frozen exact value 720", () => {
    const actual = String(evaluate(INPUT));
    expect(compact(actual)).toBe(EXPECTED);
    expect(compact(simplifyExpression("(" + actual + ")-720"))).toBe("0");
  });

  it("independent GCD/product oracle confirms the least common multiple", () => {
    const gcd = integerGcd(48, 180);
    const lcm = Math.abs(48 * 180) / gcd;
    expect(gcd).toBe(12);
    expect(lcm).toBe(720);
    expect(lcm % 48).toBe(0);
    expect(lcm % 180).toBe(0);
    expect(lcm).toBeGreaterThan(48);
    expect(lcm).toBeGreaterThan(180);
  });
});
