import { describe, expect, it } from "vitest";
import { evaluate, simplifyExpression, substituteExact } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "x^3-3*x+1";

function compact(expression: string): string {
  return expression.replace(/\s+/g, "").replace(/\*/g, "");
}

describe("Algebra229 AS-C-23 p(2) with p(x)=x^3-3x+1", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-23\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-23",
      "N2",
      "`valor`",
      "`p(2)\\ \\text{con}\\ p(x)=x^{3}-3x+1`",
      "`3`",
      "Evaluar un polinomio en un punto.",
    ]);
    expect(cells[7]).toBe("");
  });

  it("substitution at x=2 returns the frozen value 3", () => {
    const actual = compact(String(substituteExact(INPUT, "x", "2")));
    expect(actual).toBe("3");
  });

  it("simplify preserves the polynomial value at the frozen point", () => {
    const simplified = String(simplifyExpression(INPUT));
    expect(compact(simplified)).toBe(compact(String(evaluate(INPUT))));
    expect(compact(String(substituteExact(simplified, "x", "2")))).toBe("3");
  });

  it("independent direct and Horner oracles confirm the point evaluation", () => {
    const direct = 2 ** 3 - 3 * 2 + 1;
    const horner = ((2 - 0) * 2 - 3) * 2 + 1;
    expect(direct).toBe(3);
    expect(horner).toBe(3);
  });
});
