import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
import {determinant,toFractionMatrix} from "../src/engine/matrixOps";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
describe("SY-M-05 official wrapped matrix determinant",()=>{
 it("preserves all four cells and sends determinant through the real handler",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-M-05");
  expect(row.entrada).toBe(String.raw`\det\left[\begin{matrix}1&2\\3&4\end{matrix}\right]`);
  expect(row.operacion).toBe("det");
  expect(row.esperado).toBe("-2");
  const intent=detectMatrixIntent(row.entrada);
  expect(intent).toEqual({kind:"determinant",matrix:[["1","2"],["3","4"]]});
  if(!intent || intent.kind!=="determinant")throw Error("missing determinant intent");
  expect(determinant(toFractionMatrix(intent.matrix)).value.toFraction()).toBe(row.esperado);
  const requestId="sym05";
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"matrixOp",op:"determinant",a:intent.matrix,requestId}});
  const reply=scope.postMessage.mock.calls.at(-1)![0];
  expect(reply.success,JSON.stringify(reply)).toBe(true);
  expect(reply.resultLatex).toBe(row.esperado);
  expect(reply.requestId).toBe(requestId);
  expect(reply.steps.length).toBeGreaterThan(0);
 });
 it.each([
  [[[3,4],[1,2]],"2"],
  [[[1,3],[2,4]],"-2"],
  [[[1,2],[2,4]],"0"],
  [[[1,2],[3,5]],"-1"],
 ])("uses entries and row orientation: %j",(matrix,expected)=>{
  expect(determinant(toFractionMatrix(matrix)).value.toFraction()).toBe(expected);
 });
 it("rejects a rectangular determinant",()=>{
  expect(()=>determinant(toFractionMatrix([[1,2,3],[4,5,6]]))).toThrow();
 });
 it("requires matching external brackets and preserves matrix literal intent",()=>{
  const wrapped=String.raw`\left[\begin{matrix}1&2\\3&4\end{matrix}\right]`;
  expect(detectMatrixIntent(wrapped)).toEqual({kind:"literal",matrix:[["1","2"],["3","4"]]});
  expect(detectMatrixIntent("\\det"+wrapped+"+1")).toBeNull();
  expect(detectMatrixIntent(wrapped.replace("\\right]","\\right)"))).toBeNull();
  expect(detectMatrixIntent(wrapped.replace("\\right]",""))).toBeNull();
  expect(detectMatrixIntent(wrapped.replace("\\end{matrix}","\\end{pmatrix}"))).toBeNull();
  expect(()=>detectMatrixIntent("\\det"+wrapped.replace("3&4","3"))).toThrow();
 });
});
