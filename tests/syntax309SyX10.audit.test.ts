import { expect, it } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";

it("SY-X-10 rejects nested powers before CAS and recovers with a finite value", () => {
  const row = fixture.trim().split("\n").map(line => JSON.parse(line)).find(row => row.id === "SY-X-10");
  expect(row.entrada).toBe("10^{10^{10}}");
  expect(row.esperado).toBe("resultado simbólico o aviso de tamaño; sin intentar imprimir 10^10 dígitos");
  const parsed = parseExpression(row.entrada, "RAD").algebrite;
  expect(parsed).toContain("10");
  expect(() => evaluate(parsed)).toThrow(/Potencia anidada demasiado grande/);
  expect(evaluate(parseExpression("2+3", "RAD").algebrite)).toBe("5");
  expect(evaluate(parseExpression("2^{3^{2}}", "RAD").algebrite)).toBe("512");
});
