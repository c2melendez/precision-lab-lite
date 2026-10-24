import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
import {parseExpression} from "../src/engine/parsing";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
const original=String.raw`\left\lvert A\right\rvert`;
describe("SY-M-16 bars resolve by declared local type",()=>{
 it("asks for a type for the official unbound name",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-M-16");
  expect(row.entrada).toBe(original);
  expect(row.operacion).toBe("convencion");
  expect(row.esperado).toContain("si es escalar");
  expect(()=>detectMatrixIntent(original)).toThrow(/tipo.*matriz.*determinante.*escalar.*valor absoluto/);
 });
 it("uses determinant for matrix data and abs for scalar data, with no stale type",()=>{
  const matrix=detectMatrixIntent(original+String.raw`\ \text{con}\ A=\begin{pmatrix}1&2\\3&4\end{pmatrix}`);
  expect(matrix?.kind).toBe("determinant");
  if(!matrix||matrix.kind!=="determinant")throw Error("wrong type");
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"matrixOp",op:"determinant",a:matrix.matrix,requestId:"sym16m"}});
  expect(scope.postMessage.mock.calls.at(-1)![0].resultLatex).toBe("-2");
  const scalar=detectMatrixIntent(original+String.raw`\ \text{con}\ A=-3`);
  expect(scalar).toEqual({kind:"absolute",scalar:"-3"});
  if(!scalar||scalar.kind!=="absolute")throw Error("wrong scalar");
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"evaluate",expressionAlgebrite:"abs("+parseExpression(scalar.scalar).algebrite+")",requestId:"sym16s"}});
  expect(scope.postMessage.mock.calls.at(-1)![0].resultLatex).toBe("3");
  expect(()=>detectMatrixIntent(original)).toThrow(/tipo/);
 });
 it("rejects a different declared name and preserves ordinary numeric abs routing",()=>{
  expect(()=>detectMatrixIntent(original+String.raw`\ \text{con}\ B=-3`)).toThrow(/nombre/);
  expect(detectMatrixIntent(String.raw`\left\lvert-3\right\rvert`)).toBeNull();
 });
});
