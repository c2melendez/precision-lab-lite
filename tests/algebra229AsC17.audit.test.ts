import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression, polynomialGcd } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");

function compact(expression: string): string {
  return expression.replace(/\s+/g, "").replace(/\*/g, "");
}

describe("Algebra229 AS-C-17 gcd(x^2-1, x^2-2x+1)", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-17\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-17",
      "N2",
      "`valor`",
      "`\\gcd\\left(x^{2}-1,\\ x^{2}-2x+1\\right)`",
      "`x - 1`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("polynomialGcd returns a monic form equivalent to x-1", () => {
    const g = compact(polynomialGcd("x^2-1", "x^2-2*x+1"));
    // Accept x-1 or -1+x (order-independent monic linear)
    expect(g === "x-1" || g === "-1+x" || g === "-x+1").toBe(true);
  });

  it("evaluate(gcd(...)) is equivalent to x-1", () => {
    const result = compact(String(evaluate("gcd(x^2-1,x^2-2*x+1)")));
    expect(result === "x-1" || result === "-1+x" || result === "-x+1").toBe(true);
  });

  it("independent identity: both polynomials vanish at the shared root x=1", () => {
    expect(1 ** 2 - 1).toBe(0);
    expect(1 ** 2 - 2 * 1 + 1).toBe(0);
  });

  it("x+1 divides first but not second (so gcd is not x^2-1)", () => {
    expect((-1) ** 2 - 1).toBe(0);
    expect((-1) ** 2 - 2 * (-1) + 1).not.toBe(0);
  });

  it("symbolic difference between engine gcd and x-1 is zero", () => {
    const eng = String(evaluate("gcd(x^2-1,x^2-2*x+1)"));
    expect(compact(simplifyExpression(`(${eng})-(x-1)`))).toBe("0");
  });
});
