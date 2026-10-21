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

function approx(input: string): number {
  return Number(evaluate(`float(${parseExpression(input, "RAD").algebrite})`).trim().replace(/\.\.\.$/, ""));
}

describe("Trigonometry EV-I-01..06 inverse functions at documented points", () => {
  const cases: Array<[string, string, string, string, number]> = [
    ["EV-I-01", "arcsin(1/2)", "\\arcsin\\left(\\frac{1}{2}\\right)", "1/6*pi", Math.PI / 6],
    ["EV-I-02", "arccos(-1/2)", "\\arccos\\left(-\\frac{1}{2}\\right)", "2/3*pi", (2 * Math.PI) / 3],
    ["EV-I-03", "arctan(1)", "\\arctan(1)", "1/4*pi", Math.PI / 4],
    ["EV-I-04", "arctan(sqrt(3))", "\\arctan\\left(\\sqrt{3}\\right)", "1/3*pi", Math.PI / 3],
    ["EV-I-05", "arccsc(2)", "\\operatorname{arccsc}(2)", "1/6*pi", Math.PI / 6],
    ["EV-I-06", "arcsec(2)", "\\operatorname{arcsec}(2)", "1/3*pi", Math.PI / 3],
  ];

  for (const [id, input, latex, expected, value] of cases) {
    it(`${id} row and value ${input} -> ${expected}`, () => {
      const row = rowOf(id);
      expect(row).not.toBe("");
      expect(row).toContain(latex);
      expect(run(input)).toBe(expected);
      expect(approx(input)).toBeCloseTo(value, 6);
    });
  }
});

describe("Trigonometry EV-I-08 arccot(0) and EV-I-11 cos(arctan 2)", () => {
  it("EV-I-08 row and exact pi/2", () => {
    const row = rowOf("EV-I-08");
    expect(row).toContain("\\operatorname{arccot}(0)");
    expect(run("arccot(0)")).toBe("1/2*pi");
  });

  it("EV-I-11 cos(arctan(2)) is exactly 1/sqrt(5) (sqrt(5)/5)", () => {
    const row = rowOf("EV-I-11");
    expect(row).not.toBe("");
    expect(row).toContain("\\cos(\\arctan 2)");
    const got = run("cos(arctan(2))");
    // Exactness: squaring must give 1/5 and the value must be positive.
    expect(run(`(${got})^2`)).toBe("1/5");
    expect(Number(evaluate(`float(${got})`).trim().replace(/\.\.\.$/, ""))).toBeCloseTo(Math.sqrt(5) / 5, 6);
  });
});
