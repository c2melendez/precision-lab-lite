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

describe("Algebra229 AS-A-11 expand (a+b+c)^3", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    // Verified against frozen source fixture: AS-A-11 is level N2 (not N3).
    expect(text).toMatch(/\|\s*AS-A-11\s*\|\s*N2\s*\|/);
    expect(text).toContain("(a+b+c)^{3}");
    expect(text).toContain(
      "a^{3} + 3 a^{2} b + 3 a^{2} c + 3 a b^{2} + 6 a b c + 3 a c^{2} + b^{3} + 3 b^{2} c + 3 b c^{2} + c^{3}"
    );
  });

  it("expands original multinomial cube and matches oracle at samples", () => {
    const original = parseExpression("(a+b+c)^3").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression(
      "a^3+3*a^2*b+3*a^2*c+3*a*b^2+6*a*b*c+3*a*c^2+b^3+3*b^2*c+3*b*c^2+c^3"
    ).algebrite;
    const numeric = (expr: string, a: number, b: number, c: number) =>
      compileNumeric(
        evaluate(
          expr
            .replace(/a/g, "(" + a + ")")
            .replace(/b/g, "(" + b + ")")
            .replace(/c/g, "(" + c + ")")
        ),
        "__no_var__"
      )(0);
    for (const [a, b, c] of [
      [1, 2, 3],
      [0, -1, 2],
      [-2, 1, -1],
      [2, 2, 2],
    ]) {
      expect(numeric(expanded, a, b, c)).toBeCloseTo(numeric(oracle, a, b, c), 9);
    }
  });
});
