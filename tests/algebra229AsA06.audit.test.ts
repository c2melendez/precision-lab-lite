import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");

describe("Algebra229 AS-A-06 expand (x+y+z)^2", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-A-06\s*\|\s*N2\s*\|/);
    expect(text).toContain("(x+y+z)");
    expect(text).toContain("x^{2} + 2 x y + 2 x z + y^{2} + 2 y z + z^{2}");
  });

  it("expands original (x+y+z)^2 and matches multinomial oracle at samples", () => {
    const original = parseExpression("(x+y+z)^2").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression("x^2+2*x*y+2*x*z+y^2+2*y*z+z^2").algebrite;
    const samples: Array<[number, number, number]> = [
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
      [2, -1, 3],
      [-2, 4, -1],
      [1, 2, 3],
    ];
    for (const [xv, yv, zv] of samples) {
      const subst = (expr: string) =>
        expr
          .replace(/\bx\b/g, "(" + xv + ")")
          .replace(/\by\b/g, "(" + yv + ")")
          .replace(/\bz\b/g, "(" + zv + ")");
      const numeric = (expr: string) =>
        compileNumeric(evaluate(subst(expr)), "__no_var__")(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
