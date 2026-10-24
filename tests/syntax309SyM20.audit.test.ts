import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
describe("SY-M-20 exact scalar matrix product",()=>{
 it("uses the official fixture and expected matrix",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-M-20");
  expect(row.entrada).toBe(String.raw`2\begin{pmatrix}1&2\\3&4\end{pmatrix}`);
  const intent=detectMatrixIntent(row.entrada);
  expect(intent).toEqual({kind:"scale",scalar:"2",matrix:[["1","2"],["3","4"]]});
  if(!intent||intent.kind!=="scale")throw Error("not scale");
  scope.onmessage!({data:{type:"matrixOp",op:"scale",a:intent.matrix,scalar:intent.scalar,requestId:"sym20"}});
  const reply=scope.postMessage.mock.calls.at(-1)![0];
  expect(reply.success).toBe(true);
  expect(detectMatrixIntent(reply.resultLatex)).toEqual(detectMatrixIntent(row.esperado));
 });
 it.each([
  ["-1/2",[["1","-2","3"],["4","5","6"]],[["-1/2","1","-3/2"],["-2","-5/2","-3"]]],
  ["0",[["1","-2","3"],["4","5","6"]],[["0","0","0"],["0","0","0"]]],
 ])("preserves rectangular shape and exact entries for %s",(scalar,a,expected)=>{
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"matrixOp",op:"scale",a,scalar,requestId:"control20"}});
  const reply=scope.postMessage.mock.calls.at(-1)![0];
  expect(reply.success,JSON.stringify(reply)).toBe(true);
  expect(reply.requestId).toBe("control20");
  expect(detectMatrixIntent(reply.resultLatex)).toEqual({kind:"literal",matrix:expected});
 });
 it("normalizes signed LaTeX fractions and rejects a zero denominator",()=>{
  const matrix=String.raw`\begin{pmatrix}1&2\\3&4\end{pmatrix}`;
  expect(detectMatrixIntent(String.raw`-\frac{1}{2}`+matrix)).toEqual({kind:"scale",scalar:"-1/2",matrix:[["1","2"],["3","4"]]});
  expect(()=>detectMatrixIntent("1/0"+matrix)).toThrow(/finito/);
  expect(detectMatrixIntent("2"+matrix+"x")).toBeNull();
  expect(detectMatrixIntent("2x")).toBeNull();
 });
});
