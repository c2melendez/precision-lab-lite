import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
const rows=source.trim().split("\n").map(line=>JSON.parse(line));
describe("SY-Q-04 identity versus contradiction",()=>{
 it("preserves the official identity fixture and reports unlimited solutions",()=>{
  const row=rows.find(r=>r.id==="SY-Q-04");
  expect(row.entrada).toBe("x=x");
  expect(row.operacion).toBe("resolver");
  const result=solveAlgebra(parseExpression("x").algebrite,parseExpression("x").algebrite,"x");
  expect(result.truth).toBe("identity");
  expect(result.solutionsAlgebrite).toEqual([]);
 });
 it("does not mistake an inconsistent equation for identity",()=>{
  const result=solveAlgebra(parseExpression("x").algebrite,parseExpression("x+1").algebrite,"x");
  expect(result.truth).toBe("contradiction");
  expect(result.solutionsAlgebrite).toEqual([]);
 });
});
