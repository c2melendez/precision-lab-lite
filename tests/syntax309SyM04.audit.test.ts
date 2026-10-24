import {splitSystemLatex} from "../src/engine/parsing/systemSplit";
import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
import {determinant,toFractionMatrix} from "../src/engine/matrixOps";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
describe("SY-M-04 official array determinant",()=>{
 it("preserves all four cells and sends determinant through the real handler",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-M-04");
  expect(row.entrada).toBe(String.raw`\det\begin{array}{cc}1&2\\3&4\end{array}`);
  expect(row.operacion).toBe("det");
  expect(row.esperado).toBe("-2");
  const intent=detectMatrixIntent(row.entrada);
  expect(intent).toEqual({kind:"determinant",matrix:[["1","2"],["3","4"]]});
  if(!intent || intent.kind!=="determinant")throw Error("missing determinant intent");
  expect(determinant(toFractionMatrix(intent.matrix)).value.toFraction()).toBe(row.esperado);
  const requestId="sym04";
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
 it("keeps plain arrays as literals and validates the column specification",()=>{
  const array=String.raw`\begin{array}{cc}1&2\\3&4\end{array}`;
  expect(detectMatrixIntent(array)?.kind).toBe("literal");
  expect(detectMatrixIntent("\\det"+array+"+1")).toBeNull();
  expect(()=>detectMatrixIntent("\\det"+array.replace("{cc}","{c}"))).toThrow();
  expect(()=>detectMatrixIntent("\\det"+array.replace("3&4","3"))).toThrow();
  expect(detectMatrixIntent(array.replace("{cc}","{cr}"))?.kind).toBe("literal");
  expect(detectMatrixIntent(array.replace("{cc}","{xx}"))).toBeNull();
  expect(detectMatrixIntent(array.replace("\\end{array}","\\end{pmatrix}"))).toBeNull();
 }); it("routes numeric arrays away from systems but keeps relation arrays",()=>{
  const numeric=String.raw`\det\begin{array}{cc}1&2\\3&4\end{array}`;
  expect(splitSystemLatex(numeric)).toBeNull();
  const system=String.raw`\begin{array}{c}x+y=3\\x-y=1\end{array}`;
  expect(splitSystemLatex(system)).toEqual(["x+y=3","x-y=1"]);
  const inequalities=String.raw`\begin{array}{c}x\ge 0\\x\le 2\end{array}`;
  expect(splitSystemLatex(inequalities)).toHaveLength(2);
 });

});
