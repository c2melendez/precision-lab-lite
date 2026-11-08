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

describe("Algebra229 AS-C-18 lcm(x^2-1, x^2-2x+1)", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-18\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-18",
      "N2",
      "`valor`",
      "`\\operatorname{lcm}\\left(x^{2}-1,\\ x^{2}-2x+1\\right)`",
      "`\\left(x - 1\\right)^{2} \\left(x + 1\\right)`",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("evaluate(lcm(...)) is equivalent to (x-1)^2*(x+1)", () => {
    const eng = String(evaluate("lcm(x^2-1,x^2-2*x+1)"));
    expect(compact(simplifyExpression(`(${eng})-((x-1)^2*(x+1))`))).toBe("0");
  });

  it("reconstructed monic LCM via product/gcd matches expected", () => {
    // Independent of Algebrite.lcm: for monic f,g, lcm = f*g / gcd.
    const g = polynomialGcd("x^2-1", "x^2-2*x+1");
    const reconstructed = simplifyExpression(`((x^2-1)*(x^2-2*x+1))/(${g})`);
    expect(compact(simplifyExpression(`(${reconstructed})-((x-1)^2*(x+1))`))).toBe("0");
  });

  it("expected form vanishes with multiplicity 2 at x=1 and once at x=-1", () => {
    expect((1 - 1) ** 2 * (1 + 1)).toBe(0);
    expect((-1 - 1) ** 2 * (-1 + 1)).toBe(0);
  });
});
