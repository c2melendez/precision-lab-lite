import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
import {determinant,toFractionMatrix} from "../src/engine/matrixOps";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
describe("SY-M-03 official vmatrix determinant",()=>{
 it("preserves all four cells and sends determinant through the real handler",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-M-03");
  expect(row.entrada).toBe(String.raw`\begin{vmatrix}1&2\\3&4\end{vmatrix}`);
  expect(row.operacion).toBe("det");
  expect(row.esperado).toBe("-2");
  const intent=detectMatrixIntent(row.entrada);
  expect(intent).toEqual({kind:"determinant",matrix:[["1","2"],["3","4"]]});
  if(!intent || intent.kind!=="determinant")throw Error("missing determinant intent");
  expect(determinant(toFractionMatrix(intent.matrix)).value.toFraction()).toBe(row.esperado);
  const requestId="sym03";
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
 it("treats bars as determinant without a prefix while brackets remain a literal",()=>{
  const bars=String.raw`\begin{vmatrix}1&2\\3&4\end{vmatrix}`;
  expect(detectMatrixIntent(bars)?.kind).toBe("determinant");
  expect(detectMatrixIntent(bars.replaceAll("vmatrix","bmatrix"))?.kind).toBe("literal");
  expect(detectMatrixIntent(bars+"+1")).toBeNull();
  expect(detectMatrixIntent(bars.replace("\\end{vmatrix}","\\end{pmatrix}"))).toBeNull();
 });
 it("rejects ragged rows inside determinant bars",()=>{
  expect(()=>detectMatrixIntent(String.raw`\begin{vmatrix}1&2\\3\end{vmatrix}`)).toThrow();
 });
});
