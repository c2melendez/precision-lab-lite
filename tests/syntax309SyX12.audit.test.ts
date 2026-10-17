import { expect, it } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { calcIndefiniteIntegral } from "../src/engine/stepEngine/calculus";

it("SY-X-12 never invents a primitive for the original non-elementary integral", () => {
  const row = fixture.trim().split("\n").map(line => JSON.parse(line)).find(row => row.id === "SY-X-12");
  expect(row.entrada).toBe("\\int\\sin\\left(x^{x}\\right)dx");
  expect(row.esperado).toBe("sin forma elemental: aviso claro; no una antiderivada inventada");
  // Integral body from the exact original fixture; use the same parsing and
  // calculation path as the dedicated calculus mode, without a fake CAS.
  const body = parseExpression("\\sin\\left(x^{x}\\right)", "RAD").algebrite;
  expect(body).toContain("sin");
  expect(() => calcIndefiniteIntegral(body, "x")).toThrow(/integral|resolver|integrar|soluci/i);
  const finite = calcIndefiniteIntegral(parseExpression("x", "RAD").algebrite, "x");
  expect(finite.confidence).toBe("SYMBOLIC");
  expect(finite.resultLatex).toContain("C");
});
