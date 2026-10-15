import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";
const rows=source.trim().split("\n").map(line=>JSON.parse(line));
describe("SY-Q-07 strict quadratic inequality",()=>{
 it("preserves official fixture and excludes both roots",()=>{
  const row=rows.find(r=>r.id==="SY-Q-07");
  expect(row.entrada).toBe("x^{2}<4");
  expect(row.esperado).toBe("x\\in(-2,2)");
  expect(row.operacion).toBe("resolver");
  const diff=parseExpression("x^{2}-4").algebrite;
  expect(solveInequality(diff,"<","x").resultText).toBe("-2 < x < 2");
 });
 it("strict and non-strict operators have different boundaries",()=>{
  const diff=parseExpression("x^{2}-4").algebrite;
  expect(solveInequality(diff,"<=","x").resultText).toBe("-2 <= x <= 2");
  expect(solveInequality(diff,"<","x").resultText).not.toBe(solveInequality(diff,"<=","x").resultText);
 });
});
