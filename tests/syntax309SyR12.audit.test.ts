import {describe,expect,it} from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectChainedInequality} from "../src/engine/parsing/chainedInequality";
import {preprocessLatex} from "../src/engine/parsing/normalize";
import {parseExpression} from "../src/engine/parsing";
describe("SY-R-12 invalid prose rejection",()=>{
 it("pins official example",()=>{
  const row=fixture.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-R-12");
  expect(row.entrada).toBe(String.raw`\text{no existe}`);
  expect(row.operacion).toBe("error");
  expect(row.esperado).toContain("error claro");
 });
 it.each([String.raw`\text{no existe}`,"no existe",String.raw`\mathrm{no existe}`])("rejects invalid literal %s",(input)=>{
  expect(()=>parseExpression(input)).toThrow();
 });
 it("routes normalization rejection back to the scalar error handler",()=>{
  const input=String.raw`\text{no existe}`;
  expect(()=>preprocessLatex(input)).toThrow();
  expect(detectChainedInequality(input)).toBeNull();
  expect(()=>parseExpression(input)).toThrow("Entrada no matemática");
 });
 it("declines malformed input without changing valid chained inequalities",()=>{
  expect(detectChainedInequality(String.raw`\frac{}{}`)).toBeNull();
  expect(detectChainedInequality("-1<x<2")).toEqual({
   leftClause:"-1<x",rightClause:"x<2",variable:"x",
  });
 });
});