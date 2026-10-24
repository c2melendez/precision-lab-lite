import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
import {invertMatrix,multiplyMatrices,toFractionMatrix} from "../src/engine/matrixOps";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
const expected=[["-2","1"],["3/2","-1/2"]];
const text=(matrix:ReturnType<typeof toFractionMatrix>)=>matrix.map(row=>row.map(cell=>cell.toFraction()));
describe("SY-M-17 exact matrix inverse",()=>{
 it("uses the official source, preserves rational entries and gives both identities",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-M-17");
  expect(row.entrada).toBe(String.raw`\begin{pmatrix}1&2\\3&4\end{pmatrix}^{-1}`);
  expect(row.operacion).toBe("inversa");
  expect(detectMatrixIntent(row.esperado)).toEqual({kind:"literal",matrix:expected});
  const intent=detectMatrixIntent(row.entrada);
  if(!intent||intent.kind!=="inverse")throw Error("not inverse");
  const a=toFractionMatrix(intent.matrix);
  const inverse=invertMatrix(a).result;
  expect(text(inverse)).toEqual(expected);
  expect(text(multiplyMatrices(a,inverse).result)).toEqual([["1","0"],["0","1"]]);
  expect(text(multiplyMatrices(inverse,a).result)).toEqual([["1","0"],["0","1"]]);
 });
 it("returns a reenterable exact matrix through the real handler",()=>{
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"matrixOp",op:"inverse",a:[[1,2],[3,4]],requestId:"sym17"}});
  const reply=scope.postMessage.mock.calls.at(-1)![0];
  expect(reply.success,JSON.stringify(reply)).toBe(true);
  expect(reply.requestId).toBe("sym17");
  expect(reply.resultLatex).toContain("\\frac{3}{2}");
  expect(detectMatrixIntent(reply.resultLatex)).toEqual({kind:"literal",matrix:expected});
 });
 it("rejects singular and rectangular matrices",()=>{
  expect(()=>invertMatrix(toFractionMatrix([[1,2],[2,4]]))).toThrow();
  expect(()=>invertMatrix(toFractionMatrix([[1,2,3],[4,5,6]]))).toThrow();
 });
});
