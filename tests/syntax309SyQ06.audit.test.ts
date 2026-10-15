import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";

const rows = source.trim().split("\n").map(line => JSON.parse(line));
describe("SY-Q-06 quadratic non-strict inequality — Lite actual solver", () => {
 it("preserves the official fixture and includes both boundaries", () => {
  const row = rows.find(r => r.id === "SY-Q-06");
  expect(row.entrada).toBe("x^{2}\\le4");
  expect(row.operacion).toBe("resolver");
  expect(row.esperado).toBe("x\\in[-2,2]");
  const diff = parseExpression("x^{2}-4").algebrite;
  const result = solveInequality(diff, "<=", "x");
  expect(result.resultText).toBe("-2 <= x <= 2");
 });
 it("distinguishes strict inequality boundaries", () => {
  const diff = parseExpression("x^{2}-4").algebrite;
  expect(solveInequality(diff, "<", "x").resultText).toBe("-2 < x < 2");
 });
});
