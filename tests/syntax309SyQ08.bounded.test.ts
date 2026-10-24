import { describe, it, expect } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { solveBoundedChain } from "../src/engine/boundedChain";
describe("SY-Q-08 bounded chained inequality solver",()=>{
 it("matches the exact official fixture and preserves the closed upper endpoint",()=>{
  const row=source.trim().split("\n").map(x=>JSON.parse(x)).find(x=>x.id==="SY-Q-08");
  expect(row.entrada).toBe("1<x\\le3");
  const actual=solveBoundedChain(row.entrada);
  expect(actual).toMatchObject({variable:"x",lower:1,upper:3,lowerInclusive:false,upperInclusive:true,resultText:"1 < x <= 3"});
 });
 it("rejects unsupported nonlinear chains rather than guessing",()=>{
  expect(()=>solveBoundedChain("1<x^2<=3")).toThrow();
  expect(()=>solveBoundedChain("3<x<=1")).toThrow();
 });
});
