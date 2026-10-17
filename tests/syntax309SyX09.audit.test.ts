import { expect, it } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";

it("SY-X-09 rejects the original oversized power before Algebrite and preserves finite recovery", () => {
  const row = fixture.trim().split("\n").map(line => JSON.parse(line)).find(row => row.id === "SY-X-09");
  expect(row.entrada).toBe("99999999999^{99999999999}");
  expect(row.esperado).toBe("límite de tiempo o memoria anunciado; nunca bloqueo ni valor falso");
  const expression = parseExpression(row.entrada, "RAD").algebrite;
  expect(expression).toContain("99999999999");
  expect(() => evaluate(expression)).toThrow(/Exponente entero fuera de rango/);
  expect(evaluate(parseExpression("2+3", "RAD").algebrite)).toBe("5");
  expect(evaluate(parseExpression("5", "RAD").algebrite)).toBe("5");
});
