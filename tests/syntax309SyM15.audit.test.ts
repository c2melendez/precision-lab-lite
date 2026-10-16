import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
describe("SY-M-15 named vector cross convention",()=>{
 it("declares cross-product semantics and missing components for the official source",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-M-15");
  expect(row.entrada).toBe(String.raw`\vec{u}\times\vec{v}`);
  expect(row.operacion).toBe("convencion");
  expect(row.esperado).toContain("producto cruz");
  expect(row.nota).toContain("producto cruz");
  expect(()=>detectMatrixIntent(row.entrada)).toThrow(/producto cruz.*3D.*componentes/);
 });
 it("does not reinterpret ordinary scalar multiplication",()=>{
  expect(detectMatrixIntent(String.raw`2\times3`)).toBeNull();
  expect(()=>detectMatrixIntent(String.raw`\vec{a}\ \times\ \vec{b}`)).toThrow(/producto cruz/);
 });
 it("keeps the existing cross and dot worker operations distinct",()=>{
  for(const [op,expected] of [["cross","-3,6,-3"],["dot","32"]]){
   scope.postMessage.mockClear();
   scope.onmessage!({data:{type:"matrixOp",op,a:[[1,2,3]],b:[[4,5,6]],requestId:"sym15-"+op}});
   const result=scope.postMessage.mock.calls.at(-1)![0];
   expect(result.success,JSON.stringify(result)).toBe(true);
   expect(result.resultLatex.replace(/\s/g,"")).toBe(expected);
  }
 });
});
