import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");
const MATRIX = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");

function rowOf(id: string): string {
  return MATRIX.split("\n").find((line) => new RegExp(`\\|\\s*${id}\\s*\\|`).test(line)) ?? "";
}

function run(input: string): string {
  return evaluate(parseExpression(input, "RAD").algebrite).replace(/\s+/g, "");
}

/** Lite's hyperbolic channel prints up to 6 decimals (may end with "..."). */
function numeric(input: string): number {
  return Number(evaluate(parseExpression(input, "RAD").algebrite).replace(/\.\.\.$/, "").replace(/[^0-9eE+\-.]/g, ""));
}

describe("Trigonometry EV-H-01..03 hyperbolic origin", () => {
  it.each([
    ["EV-H-01", "sinh(0)", "\\sinh(0)", "0"],
    ["EV-H-02", "cosh(0)", "\\cosh(0)", "1"],
    ["EV-H-03", "tanh(0)", "\\tanh(0)", "0"],
  ])("%s row and exact value", (id, input, literal, expected) => {
    expect(rowOf(id)).toContain(literal);
    expect(run(input)).toBe(expected);
  });
});

describe("Trigonometry EV-H-04..09 hyperbolic values at ln 2", () => {
  const cases: Array<[string, string, string, number]> = [
    ["EV-H-04", "sinh(ln(2))", "\\sinh(\\ln 2)", 3 / 4],
    ["EV-H-05", "cosh(ln(2))", "\\cosh(\\ln 2)", 5 / 4],
    ["EV-H-06", "tanh(ln(2))", "\\tanh(\\ln 2)", 3 / 5],
    ["EV-H-07", "csch(ln(2))", "\\operatorname{csch}(\\ln 2)", 4 / 3],
    ["EV-H-08", "sech(ln(2))", "\\operatorname{sech}(\\ln 2)", 4 / 5],
    ["EV-H-09", "coth(ln(2))", "\\coth(\\ln 2)", 5 / 3],
  ];

  for (const [id, input, latex, expected] of cases) {
    it(`${id} row and numeric value ${input}`, () => {
      const row = rowOf(id);
      expect(row).not.toBe("");
      expect(row).toContain(latex);
      // 6-decimal numeric channel: tolerance 1e-6 (protocol rule for floats).
      expect(numeric(input)).toBeCloseTo(expected, 6);
    });
  }
});

describe("Trigonometry EV-H-10..12 hyperbolic approximations and identity", () => {
  const cases: Array<[string, string, string, string, number]> = [
    ["EV-H-10", "sinh(1)", "\\sinh(1)", "1.175201194", 1.175201194],
    ["EV-H-11", "cosh(1)", "\\cosh(1)", "1.543080635", 1.543080635],
    ["EV-H-12", "cosh(1)^2-sinh(1)^2", "\\cosh^{2}(1)-\\sinh^{2}(1)", "", 1],
  ];
  it.each(cases)("%s row and numeric value", (id, input, literal, documented, expected) => {
    expect(rowOf(id)).toContain(literal);
    if (documented) expect(rowOf(id)).toContain(documented);
    expect(numeric(input)).toBeCloseTo(expected, 6);
  });
});
