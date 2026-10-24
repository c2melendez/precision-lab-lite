import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
import {constantDeterminant} from "../src/engine/constantDeterminant";
import {evaluate} from "../src/engine/algebriteClient";
import {parseExpression} from "../src/engine/parsing";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
const expected=Math.E/2-Math.SQRT2*Math.PI;
describe("SY-M-09 real constant determinant",()=>{
 it("preserves the official exact expression through the worker handler",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-M-09");
  expect(row.entrada).toBe(String.raw`\det\begin{pmatrix}\frac12&\sqrt2\\\pi&e\end{pmatrix}`);
  expect(row.operacion).toBe("det");
  expect(row.esperado).toContain("-3.0837");
  const intent=detectMatrixIntent(row.entrada);
  if(!intent||intent.kind!=="determinant")throw Error("missing determinant");
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"matrixOp",op:"determinant",a:intent.matrix,requestId:"sym09"}});
  const answer=scope.postMessage.mock.calls.at(-1)![0];
  expect(answer.success,JSON.stringify(answer)).toBe(true);
  expect(answer.requestId).toBe("sym09");
  expect(Number(answer.decimalApprox)).toBeCloseTo(expected,12);
  const exact=parseExpression(answer.resultLatex).algebrite;
  expect(evaluate("simplify(("+exact+")-(e/2-sqrt(2)*pi))")).toBe("0");
  expect(answer.confidence).toBe("SYMBOLIC");
 });
 it("changes sign on row interchange and detects dependent rows",()=>{
  const a=[["1/2","sqrt(2)"],["pi","e"]];
  expect(Number(constantDeterminant([a[1],a[0]],"swap")!.decimalApprox)).toBeCloseTo(-expected,12);
  expect(Number(constantDeterminant([a[0],a[0]],"zero")!.decimalApprox)).toBe(0);
 });
 it("preserves the rational route and rejects free variables or nonreal cells",()=>{
  expect(constantDeterminant([[1,2],[3,4]],"rational")).toBeNull();
  expect(()=>constantDeterminant([["x","sqrt(2)"],["pi","e"]],"bad")).toThrow();
  expect(()=>constantDeterminant([["sqrt(-1)","sqrt(2)"],["pi","e"]],"bad")).toThrow();
 });
});
