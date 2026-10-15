import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
const rows=source.trim().split("\n").map(line=>JSON.parse(line));
describe("SY-Q-05 inconsistent equation has empty solution set",()=>{
 it("preserves the source fixture and returns contradiction",()=>{
  const row=rows.find(r=>r.id==="SY-Q-05");
  expect(row.entrada).toBe("x=x+1");
  expect(row.operacion).toBe("resolver");
  const solution=solveAlgebra(parseExpression("x").algebrite,parseExpression("x+1").algebrite,"x");
  expect(solution.truth).toBe("contradiction");
  expect(solution.solutionsAlgebrite).toEqual([]);
 });
 it("distinguishes contradiction from identity in either member order",()=>{
  const inverse=solveAlgebra(parseExpression("x+1").algebrite,parseExpression("x").algebrite,"x");
  const identity=solveAlgebra(parseExpression("x").algebrite,parseExpression("x").algebrite,"x");
  expect(inverse.truth).toBe("contradiction");
  expect(inverse.solutionsAlgebrite).toEqual([]);
  expect(identity.truth).toBe("identity");
 });
});
