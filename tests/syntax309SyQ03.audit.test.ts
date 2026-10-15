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
describe("SY-Q-03 unknown on RHS", () => {
 it("preserves the official fixture and both roots", () => {
  const row = rows.find(r => r.id === "SY-Q-03");
  expect(row.entrada).toBe("4=x^{2}");
  expect(row.operacion).toBe("resolver");
  expect(row.nota).toMatch(/miembro derecho/);
  expect(roots("4", "x^{2}")).toEqual([-2, 2]);
 });
 it("is equivalent to SY-Q-01 and SY-Q-02", () => {
  const reversed = roots("4", "x^{2}");
  expect(reversed).toEqual(roots("x^{2}", "4"));
  expect(reversed).toEqual(roots("x^{2}-4", "0"));
  for (const x of reversed) expect(Number(evaluate("4-("+x+")^2"))).toBe(0);
 });
});
