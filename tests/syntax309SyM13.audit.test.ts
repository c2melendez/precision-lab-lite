import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
describe("SY-M-13 explicit canonical basis",()=>{
 it("preserves the official source and computes the three coordinates",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-M-13");
  expect(row.entrada).toBe(String.raw`\mathbf{i}+2\mathbf{j}-\mathbf{k}`);
  expect(row.operacion).toBe("vectores");
  expect(row.esperado).toBe("(1,2,-1)");
  const intent=detectMatrixIntent(row.entrada);
  expect(intent).toEqual({kind:"basis",matrix:[["1","2","-1"]]});
  if(!intent||intent.kind!=="basis")throw Error("missing basis");
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"matrixOp",op:"power",a:intent.matrix,exponent:1,requestId:"sym13"}});
  const reply=scope.postMessage.mock.calls.at(-1)![0];
  expect(reply.success,JSON.stringify(reply)).toBe(true);
  expect(reply.resultLatex.replace(/\s/g,"")).toBe("1,2,-1");
  expect(reply.requestId).toBe("sym13");
 });
 it("sums repeated basis terms and preserves axis order",()=>{
  expect(detectMatrixIntent(String.raw`-\mathbf{k}+2\mathbf{j}+\mathbf{i}`)).toEqual({kind:"basis",matrix:[["1","2","-1"]]});
  expect(detectMatrixIntent(String.raw`2\mathbf{i}-\mathbf{i}+0\mathbf{k}`)).toEqual({kind:"basis",matrix:[["1","0","0"]]});
 });
 it("does not redefine ordinary imaginary i and rejects unsupported terms",()=>{
  expect(detectMatrixIntent("i+2j-k")).toBeNull();
  expect(()=>detectMatrixIntent(String.raw`\mathbf{i}+x\mathbf{j}`)).toThrow(/enteros/);
 });
});
