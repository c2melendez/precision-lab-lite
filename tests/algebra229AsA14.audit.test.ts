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

describe("Algebra229 AS-A-14 expand (sqrt2+sqrt3)^2", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-A-14\s*\|\s*N2\s*\|/);
    expect(text).toContain("\\left(\\sqrt{2}+\\sqrt{3}\\right)^{2}");
    expect(text).toContain("2 \\sqrt{6} + 5");
  });

  it("expands radical square: exact difference with oracle is zero and numeric value matches", () => {
    const original = parseExpression("(sqrt(2)+sqrt(3))^2").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression("5+2*sqrt(6)").algebrite;
    // equivalencia_simbolica: la diferencia con el esperado se simplifica a 0 (exacto, sin muestreo).
    expect(evaluate(`(${expanded})-(${oracle})`).trim()).toBe("0");
    // y el valor numérico coincide con 5+2*sqrt(6) a tolerancia 1e-9.
    const value = compileNumeric(evaluate(expanded), "__no_var__")(0);
    expect(value).toBeCloseTo(5 + 2 * Math.sqrt(6), 9);
  });
});
