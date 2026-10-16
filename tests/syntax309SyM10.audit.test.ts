import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
describe("SY-M-10 explicit matrix-vector dot product",()=>{
 it("routes the official source to dot and returns 32 through the worker handler",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-M-10");
  expect(row.entrada).toBe("\\begin{pmatrix}1\\\\2\\\\3\\end{pmatrix}\\cdot\\begin{pmatrix}4\\\\5\\\\6\\end{pmatrix}");
  expect(row.operacion).toBe("vectores");
  expect(row.esperado).toBe("32");
  const intent=detectMatrixIntent(row.entrada);
  expect(intent).toEqual({kind:"dot",left:[["1"],["2"],["3"]],right:[["4"],["5"],["6"]]});
  if(!intent||intent.kind!=="dot")throw Error("missing dot");
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"matrixOp",op:"dot",a:intent.left,b:intent.right,requestId:"sym10"}});
  const result=scope.postMessage.mock.calls.at(-1)![0];
  expect(result.success,JSON.stringify(result)).toBe(true);
  expect(result.resultLatex).toBe("32");
  expect(result.requestId).toBe("sym10");
 });
 it("keeps ordinary adjacency as matrix multiplication",()=>{
  expect(detectMatrixIntent(String.raw`\begin{pmatrix}1&2\end{pmatrix}\begin{pmatrix}3\\4\end{pmatrix}`)?.kind).toBe("multiply");
 });
 it("rejects unequal lengths or nonvector matrices",()=>{
  for(const input of [
   String.raw`\begin{pmatrix}1\\2\end{pmatrix}\cdot\begin{pmatrix}3\end{pmatrix}`,
   String.raw`\begin{pmatrix}1&2\\3&4\end{pmatrix}\cdot\begin{pmatrix}1\\2\end{pmatrix}`
  ])expect(()=>detectMatrixIntent(input)).toThrow(/vectores/);
 });
});
