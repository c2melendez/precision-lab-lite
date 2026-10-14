import { describe, expect, it } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { compileNumeric } from "../src/engine/numericFallback";

const rows = fixture.trim().split("\n").map(line => JSON.parse(line));
const byId = Object.fromEntries(rows.map(row => [row.id, row]));

describe("Syntax309 SY-E initial exponent witnesses", () => {
  it("SY-E-01: two to a braced two-digit exponent is 1024", () => {
    const row = byId["SY-E-01"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("2^{10}");
    const parsed = parseExpression(row.entrada).algebrite;
    const actual = compileNumeric(parsed, "__unused__")(0);
    expect(Number.isFinite(actual), "SY-E-01 parsed=" + parsed).toBe(true);
    expect(actual).toBe(1024);
  });
  it("SY-E-02: ASCII two-digit exponent binds completely", () => {
    const row = byId["SY-E-02"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("2^10");
    const parsed = parseExpression(row.entrada).algebrite;
    const actual = compileNumeric(parsed, "__unused__")(0);
    expect(Number.isFinite(actual), "SY-E-02 parsed=" + parsed).toBe(true);
    expect(actual).toBe(1024);
    expect(actual).not.toBe(0);
  });

  it("SY-E-03: x to the twelfth at x=2 yields 4096", () => {
    const row = byId["SY-E-03"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toContain("x^{12}");
    expect(row.entrada).toContain("x=2");
    // The fixture contains a natural-language substitution annotation, not
    // one standalone expression accepted by the scientific parser.
    const parsed = parseExpression("x^{12}").algebrite;
    const actual = compileNumeric(parsed, "x")(2);
    expect(Number.isFinite(actual), "SY-E-03 parsed=" + parsed).toBe(true);
    expect(actual).toBe(4096);
  });

  it("SY-E-04: source LaTeX ten to negative three is one thousandth", () => {
    const row = byId["SY-E-04"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("10^{-3}");
    const parsed = parseExpression(row.entrada).algebrite;
    const actual = compileNumeric(parsed, "__unused__")(0);
    expect(Number.isFinite(actual), "SY-E-04 parsed=" + parsed).toBe(true);
    expect(actual).toBeCloseTo(0.001, 12);
  });

  it("SY-E-05: nested braced powers preserve exponent grouping", () => {
    const row = byId["SY-E-05"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("2^{2^{2}}");
    expect(row.esperado).toBe("16");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(compileNumeric(parsed, "__unused__")(0)).toBe(16);
    // Unequal exponents distinguish 2^(3^2)=512 from (2^3)^2=64.
    const nested = parseExpression("2^{3^{2}}").algebrite;
    const grouped = parseExpression("(2^{3})^{2}").algebrite;
    expect(compileNumeric(nested, "__unused__")(0)).toBe(512);
    expect(compileNumeric(grouped, "__unused__")(0)).toBe(64);
  });
  it("SY-E-06: fractional exponent matches square root on nonnegative reals", () => {
    const row = byId["SY-E-06"];
    expect(row.operacion).toBe("equivalente");
    expect(row.entrada).toBe("x^{\\frac{1}{2}}");
    expect(row.esperado).toBe("\\sqrt{x}");
    const power = compileNumeric(parseExpression(row.entrada).algebrite, "x");
    const root = compileNumeric(parseExpression(row.esperado).algebrite, "x");
    // Independent known values, including zero and fractional bases.
    for (const [x, expected] of [[0, 0], [1 / 16, 0.25], [0.25, 0.5], [1, 1], [4, 2], [9, 3], [16, 4], [100, 10]]) {
      expect(power(x), "fractional exponent at x=" + x).toBeCloseTo(expected, 12);
      expect(root(x), "square root at x=" + x).toBeCloseTo(expected, 12);
    }
    // This finite real-domain witness does not certify complex branches.
  });

  it("SY-E-07: decimal exponent matches square root on nonnegative reals", () => {
    const row = byId["SY-E-07"];
    expect(row.operacion).toBe("equivalente");
    expect(row.entrada).toBe("x^{0.5}");
    expect(row.esperado).toBe("\\sqrt{x}");
    const power = compileNumeric(parseExpression(row.entrada).algebrite, "x");
    const root = compileNumeric(parseExpression(row.esperado).algebrite, "x");
    for (const [x, expected] of [[0, 0], [1 / 16, 0.25], [0.25, 0.5], [1, 1], [4, 2], [9, 3], [16, 4], [100, 10]]) {
      expect(power(x), "decimal exponent at x=" + x).toBeCloseTo(expected, 12);
      expect(root(x), "square root at x=" + x).toBeCloseTo(expected, 12);
    }
  });

  it("SY-E-08: original source and expected form match independent real anchors", () => {
    const row = byId["SY-E-08"];
    expect(row.operacion).toBe("equivalente");
    expect(row.entrada).toBe("x^{-1}");
    expect(row.esperado).toBe("\\frac{1}{x}");
    const entered = compileNumeric(parseExpression(row.entrada).algebrite, "x");
    const expectedForm = compileNumeric(parseExpression(row.esperado).algebrite, "x");
    const anchors: Array<[number, number]> = [[-4,-0.25],[-1,-1],[-0.25,-4],[0.25,4],[1,1],[4,0.25]];
    for (const [x, expected] of anchors) {
      expect(entered(x), "SY-E-08 source at x=" + x).toBeCloseTo(expected, 12);
      expect(expectedForm(x), "SY-E-08 expected form at x=" + x).toBeCloseTo(expected, 12);
    }
    // Finite real-domain witnesses; no claim of UI or general symbolic proof.
    // x=0 is excluded; the zero-base error contract is covered by SY-E-20.
  });

  it("SY-E-09: original source and expected form match independent real anchors", () => {
    const row = byId["SY-E-09"];
    expect(row.operacion).toBe("equivalente");
    expect(row.entrada).toBe("\\left(x^{2}\\right)^{3}");
    expect(row.esperado).toBe("x^{6}");
    const entered = compileNumeric(parseExpression(row.entrada).algebrite, "x");
    const expectedForm = compileNumeric(parseExpression(row.esperado).algebrite, "x");
    const anchors: Array<[number, number]> = [[-3,729],[-2,64],[-1,1],[0,0],[0.5,0.015625],[2,64],[3,729]];
    for (const [x, expected] of anchors) {
      expect(entered(x), "SY-E-09 source at x=" + x).toBeCloseTo(expected, 12);
      expect(expectedForm(x), "SY-E-09 expected form at x=" + x).toBeCloseTo(expected, 12);
    }
    // Finite real-domain witnesses; no claim of UI or general symbolic proof.
  });

  it("SY-E-10: original source and expected form match independent real anchors", () => {
    const row = byId["SY-E-10"];
    expect(row.operacion).toBe("equivalente");
    expect(row.entrada).toBe("x^{2^{3}}");
    expect(row.esperado).toBe("x^{8}");
    const entered = compileNumeric(parseExpression(row.entrada).algebrite, "x");
    const expectedForm = compileNumeric(parseExpression(row.esperado).algebrite, "x");
    const anchors: Array<[number, number]> = [[-3,6561],[-2,256],[-1,1],[0,0],[0.5,0.00390625],[2,256],[3,6561]];
    for (const [x, expected] of anchors) {
      expect(entered(x), "SY-E-10 source at x=" + x).toBeCloseTo(expected, 12);
      expect(expectedForm(x), "SY-E-10 expected form at x=" + x).toBeCloseTo(expected, 12);
    }
    // Finite real-domain witnesses; no claim of UI or general symbolic proof.
  });

});
