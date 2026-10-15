import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import { evaluate } from "../src/engine/algebriteClient";
const row = source.trim().split("\n").map(line => JSON.parse(line)).find(x => x.id === "SY-Q-01");
describe("SY-Q-01 quadratic equation has both roots", () => {
 it("uses official equation fixture and returns exactly two distinct roots", () => {
   expect(row.entrada).toBe("x^{2}=4");
   expect(row.operacion).toBe("resolver");
   const parsed = parseExpression(row.entrada);
   const left = parseExpression("x^{2}").algebrite;
   const right = parseExpression("4").algebrite;
   expect(parsed).toBeDefined();
   const solved = solveAlgebra(left, right, "x");
   const roots = solved.solutionsAlgebrite.map(v => Number(evaluate(v))).sort((a,b) => a-b);
   expect(roots).toEqual([-2,2]);
   for (const x of roots) expect(Number(evaluate("("+x+")^2-4"))).toBe(0);
 });
});
