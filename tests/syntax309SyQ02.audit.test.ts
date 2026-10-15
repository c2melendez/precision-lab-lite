import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import { evaluate } from "../src/engine/algebriteClient";
const rows = source.trim().split("\n").map(line => JSON.parse(line));
function roots(lhs: string, rhs: string): number[] {
 const out = solveAlgebra(parseExpression(lhs).algebrite, parseExpression(rhs).algebrite, "x");
 return out.solutionsAlgebrite.map(s => Number(evaluate(s))).sort((a,b)=>a-b);
}
describe("SY-Q-02 standard form quadratic equation", () => {
 it("preserves the official fixture and obtains both roots", () => {
  const row=rows.find(r=>r.id==="SY-Q-02");
  expect(row.entrada).toBe("x^{2}-4=0");
  expect(row.operacion).toBe("resolver");
  expect(roots("x^{2}-4","0")).toEqual([-2,2]);
 });
 it("matches the equivalent SY-Q-01 equation without losing roots", () => {
  expect(roots("x^{2}-4","0")).toEqual(roots("x^{2}","4"));
  for(const x of roots("x^{2}-4","0")) expect(Number(evaluate("("+x+")^2-4"))).toBe(0);
 });
});
