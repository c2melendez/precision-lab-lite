import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
import {transposeMatrix,toFractionMatrix} from "../src/engine/matrixOps";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
const text=(matrix:ReturnType<typeof toFractionMatrix>)=>matrix.map(row=>row.map(cell=>cell.toFraction()));
describe("SY-M-19 exact transpose",()=>{
 it("transposes the official fixture and restores it on a second transpose",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-M-19");
  expect(row.entrada).toBe(String.raw`\begin{pmatrix}1&2\\3&4\end{pmatrix}^{\top}`);
  const intent=detectMatrixIntent(row.entrada);
  expect(intent).toEqual({kind:"transpose",matrix:[["1","2"],["3","4"]]});
  if(!intent||intent.kind!=="transpose")throw Error("not transpose");
  const a=toFractionMatrix(intent.matrix),t=transposeMatrix(a).result;
  expect(text(t)).toEqual([["1","3"],["2","4"]]);
  expect(detectMatrixIntent(row.esperado)).toEqual({kind:"literal",matrix:text(t)});
  expect(text(transposeMatrix(t).result)).toEqual(text(a));
 });
 it.each([
  [[["1","2"],["3","4"]],[["1","3"],["2","4"]]],
  [[["-1/2","2","3"],["4","5/3","-6"]],[["-1/2","4"],["2","5/3"],["3","-6"]]],
 ])("preserves exact shape and entries through the real worker: %j",(a,expected)=>{
  scope.postMessage.mockClear();
  const latex="\\begin{pmatrix}"+a.map(row=>row.join("&")).join("\\\\")+"\\end{pmatrix}^{\\top}";
  const intent=detectMatrixIntent(latex);
  if(!intent||intent.kind!=="transpose")throw Error("not transpose");
  scope.onmessage!({data:{type:"matrixOp",op:intent.kind,a:intent.matrix,requestId:"sym19"}});
  const reply=scope.postMessage.mock.calls.at(-1)![0];
  expect(reply.success,JSON.stringify(reply)).toBe(true);
  expect(reply.requestId).toBe("sym19");
  expect(detectMatrixIntent(reply.resultLatex)).toEqual({kind:"literal",matrix:expected});
 });
 it("accepts unbraced top and rejects incomplete or extended suffixes",()=>{
  const matrix=String.raw`\begin{pmatrix}1&2\\3&4\end{pmatrix}`;
  expect(detectMatrixIntent(matrix+String.raw`^\top`)?.kind).toBe("transpose");
  for(const suffix of [String.raw`^{\top`,String.raw`^{\top}x`,String.raw`^\topology`]){
   expect(detectMatrixIntent(matrix+suffix)).toBeNull();
  }
 });
});
