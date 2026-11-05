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
  it("matches the exact frozen source row including the radical-result note", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-A-14\s*\|/.test(line))?.trim();
    const expectedRow = "| AS-A-14 | N2 | `expandir` | `\\left(\\sqrt{2}+\\sqrt{3}\\right)^{2}` | `2 \\sqrt{6} + 5` | Resultado con radical: `5+2\\sqrt{6}`. |";
    expect(sourceRow).toBe(expectedRow);
  });

  it("expands the radical square with exact symbolic equality and an independent Math.sqrt oracle", () => {
    const original = parseExpression("(sqrt(2)+sqrt(3))^2").algebrite;
    const expanded = expand(original);
    const symbolicOracle = parseExpression("5+2*sqrt(6)").algebrite;
    expect(evaluate(`(${expanded})-(${symbolicOracle})`).trim()).toBe("0");
    const actual = compileNumeric(evaluate(expanded), "__no_var__")(0);
    expect(actual).toBeCloseTo(5 + 2 * Math.sqrt(6), 9);
  });
});
