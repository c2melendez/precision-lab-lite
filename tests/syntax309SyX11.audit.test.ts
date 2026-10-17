import { expect, it } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
it("SY-X-11 refuses 9^(9^9) before CAS, retaining small powers", () => {
  const row=fixture.trim().split("\n").map(line=>JSON.parse(line)).find(row=>row.id==="SY-X-11");
  expect(row.entrada).toBe("9^{9^{9}}");
  expect(row.esperado).toBe("ídem (el número tiene unos 369 millones de dígitos)");
  expect(()=>evaluate(parseExpression(row.entrada,"RAD").algebrite)).toThrow(/Potencia anidada demasiado grande/);
  expect(evaluate(parseExpression("2^{3^{2}}","RAD").algebrite)).toBe("512");
  expect(evaluate(parseExpression("2+3","RAD").algebrite)).toBe("5");
});
