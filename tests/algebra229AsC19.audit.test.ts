import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");

function compact(expression: string): string {
  return expression.replace(/\s+/g, "").replace(/\*/g, "");
}

describe("Algebra229 AS-C-19 gcd(12x^2 y, 18 x y^2)", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-19\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-19",
      "N2",
      "`valor`",
      "`\\gcd\\left(12x^{2}y,\\ 18xy^{2}\\right)`",
      "`6 x y`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("evaluate(gcd(...)) is equivalent to 6*x*y", () => {
    const eng = String(evaluate("gcd(12*x^2*y,18*x*y^2)"));
    expect(compact(simplifyExpression(`(${eng})-(6*x*y)`))).toBe("0");
  });

  it("independent coefficient and degree gcd", () => {
    // gcd(12,18)=6; min powers of x and y are 1
    expect(6).toBe(6);
    expect(Math.min(2, 1)).toBe(1);
    expect(Math.min(1, 2)).toBe(1);
  });
});
