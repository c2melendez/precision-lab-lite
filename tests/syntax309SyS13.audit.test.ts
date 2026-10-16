import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
const row = source.trim().split("\n").map(s => JSON.parse(s)).find(r => r.id === "SY-S-13");
describe("SY-S-13 official plain-text function", () => {
 it("preserves the official source, exact value and reentry", () => {
  expect(row.entrada).toBe("sin(0)");
  expect(row.esperado).toBe("0");
  const parsed = parseExpression(row.entrada, "RAD");
  expect(parsed.freeVariables).toEqual([]);
  const result = evaluate(parsed.algebrite);
  expect(result).toBe(row.esperado);
  expect(evaluate(parseExpression(result, "RAD").algebrite)).toBe(row.esperado);
 });
});
