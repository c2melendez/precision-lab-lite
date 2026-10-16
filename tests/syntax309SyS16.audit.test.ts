import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate, toDecimalApprox } from "../src/engine/algebriteClient";
const row = source.trim().split("\n").map(s => JSON.parse(s)).find(r => r.id === "SY-S-16");
describe("SY-S-16 official plain-text function", () => {
 it("preserves the official source, exact value and reentry", () => {
  expect(row.entrada).toBe("log(100)");
  expect(row.esperado).toBe("2");
  const parsed = parseExpression(row.entrada, "RAD");
  expect(parsed.freeVariables).toEqual([]);
  const result = evaluate(parsed.algebrite);
  expect(result).toBe(row.esperado);
  expect(evaluate(parseExpression(result, "RAD").algebrite)).toBe(row.esperado);
 });
});

describe("SY-S-16 logarithm conventions", () => {
 it.each([
  ["log(10)", "1"],
  ["log(1000)", "3"],
  ["ln(e)", "1"],
  ["log(8,2)", "3"],
  ["log(100)+ln(e)", "3"],
 ])("evaluates %s as %s without changing explicit bases", (input, expected) => {
  const value = evaluate(parseExpression(input, "RAD").algebrite);
  expect(Number(toDecimalApprox(value) ?? value)).toBe(Number(expected));
 });
});

