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
  it("rows and exact values", () => {
    expect(rowOf("EV-H-01")).toContain("\\sinh(0)");
    expect(rowOf("EV-H-02")).toContain("\\cosh(0)");
    expect(rowOf("EV-H-03")).toContain("\\tanh(0)");
    expect(run("sinh(0)")).toBe("0");
    expect(run("cosh(0)")).toBe("1");
    expect(run("tanh(0)")).toBe("0");
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
  it("rows exist with documented approximations", () => {
    expect(rowOf("EV-H-10")).toContain("\\sinh(1)");
    expect(rowOf("EV-H-10")).toContain("1.175201194");
    expect(rowOf("EV-H-11")).toContain("\\cosh(1)");
    expect(rowOf("EV-H-11")).toContain("1.543080635");
    expect(rowOf("EV-H-12")).toContain("\\cosh^{2}(1)-\\sinh^{2}(1)");
  });

  it("values match at the documented precision", () => {
    expect(numeric("sinh(1)")).toBeCloseTo(1.175201194, 6);
    expect(numeric("cosh(1)")).toBeCloseTo(1.543080635, 6);
    expect(numeric("cosh(1)^2-sinh(1)^2")).toBeCloseTo(1, 6);
  });
});
