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

});
