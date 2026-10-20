import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORACLE = "32*x^5-80*x^4*y+80*x^3*y^2-40*x^2*y^3+10*x*y^4-y^5";

describe("Algebra229 AS-A-17 expand (2x-y)^5", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-A-17\s*\|\s*N2\s*\|/);
    expect(text).toContain("(2x-y)^{5}");
    expect(text).toContain("32 x^{5} - 80 x^{4} y + 80 x^{3} y^{2} - 40 x^{2} y^{3} + 10 x y^{4} - y^{5}");
  });

  it("expands the fifth power to the exact binomial polynomial", () => {
    const original = parseExpression("(2*x-y)^5").algebrite;
    const expanded = expand(original);
    expect(evaluate(`(${expanded})-(${ORACLE})`).trim()).toBe("0");
    expect(expanded).not.toMatch(/\)\s*\^\s*5/);
    for (const [x, y] of [[-2, 1], [0.5, -3], [1, 1], [3, 2]]) {
      const numeric = (expr: string) => evaluate(expr.replace(/x/g, "(" + x + ")").replace(/y/g, "(" + y + ")"));
      expect(Number(numeric(expanded))).toBeCloseTo(Number(numeric(ORACLE)), 9);
    }
  });
});
