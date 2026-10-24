import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

const fixture = source.trim().split("\n").map(line => JSON.parse(line)).find(row => row.id === "SY-V-22");

describe("SY-V-22 — explicit imaginary-unit convention (Lite)", () => {
  it("uses the official i^2 fixture, not an invented variable-mode toggle", () => {
    expect(fixture.entrada).toBe("i^{2}");
    expect(fixture.operacion).toBe("convencion");
    expect(fixture.nota).toMatch(/unidad imaginaria|variable/);
    expect(evaluate(parseExpression(fixture.entrada).algebrite)).toBe("-1");
  });
  it("preserves the distinction between reserved i and another free variable", () => {
    expect(evaluate(parseExpression("i^2").algebrite)).toBe("-1");
    expect(evaluate(parseExpression("(-i)^2").algebrite)).toBe("-1");
    const variable = parseExpression("x^2");
    expect(variable.freeVariables).toContain("x");
    expect(evaluate(variable.algebrite)).not.toBe("-1");
  });
});
