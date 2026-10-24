import {describe,expect,it} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
describe("SY-M-12 tuple convention: explicit clarification",()=>{
 it("uses the officially allowed clear notice instead of guessing a tuple meaning",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-M-12");
  expect(row.entrada).toBe(String.raw`(1,2,3)\cdot(4,5,6)`);
  expect(row.operacion).toBe("convencion");
  expect(row.esperado).toContain("o aviso");
  expect(row.nota).toContain("declarar");
  expect(()=>detectMatrixIntent(row.entrada)).toThrow(/tuplas.*ambiguas.*producto escalar.*ángulos/);
 });
 it("also clarifies sized tuples and two-coordinate tuples",()=>{
  for(const expression of [
   String.raw`\left(1,2,3\right)\cdot\left(4,5,6\right)`,
   String.raw`(1,2)\cdot(3,4)`
  ])expect(()=>detectMatrixIntent(expression)).toThrow(/tuplas.*ambiguas/);
 });
 it("keeps explicit angle vectors valid and ordinary parenthesized arithmetic separate",()=>{
  expect(detectMatrixIntent(String.raw`\langle1,2,3\rangle\cdot\langle4,5,6\rangle`)?.kind).toBe("dot");
  expect(detectMatrixIntent(String.raw`(1+2)\cdot(3+4)`)).toBeNull();
 });
});
