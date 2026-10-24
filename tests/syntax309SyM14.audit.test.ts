import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
import {splitFreeSystemLatex} from "../src/engine/parsing/systemSplit";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
const official="\\vec{u}\\cdot\\vec{v}\\ \\text{con}\\ \\vec{u}=(1,2,3),\\ \\vec{v}=(4,5,6)";
describe("SY-M-14 locally declared vectors",()=>{
 it("reads the official source as local vector data and computes 32",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-M-14");
  expect(row.entrada).toBe(official);
  expect(row.operacion).toBe("vectores");
  expect(row.esperado).toBe("32");
  expect(splitFreeSystemLatex(row.entrada)).toBeNull();
  const intent=detectMatrixIntent(row.entrada);
  expect(intent).toEqual({kind:"dot",left:[["1","2","3"]],right:[["4","5","6"]]});
  if(!intent||intent.kind!=="dot")throw Error("missing dot");
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"matrixOp",op:"dot",a:intent.left,b:intent.right,requestId:"sym14"}});
  const result=scope.postMessage.mock.calls.at(-1)![0];
  expect(result.success,JSON.stringify(result)).toBe(true);
  expect(result.resultLatex).toBe("32");
  expect(result.requestId).toBe("sym14");
 });
 it("uses current declarations and leaves no persistent named values",()=>{
  expect(detectMatrixIntent(official.replace("(4,5,6)","(0,1,0)"))).toEqual({kind:"dot",left:[["1","2","3"]],right:[["0","1","0"]]});
  expect(detectMatrixIntent(String.raw`\vec{u}\cdot\vec{v}`)).toBeNull();
  expect(splitFreeSystemLatex("x=1,y=2")).toEqual(["x=1","y=2"]);
 });
 it("rejects duplicate, missing and unequal declarations",()=>{
  expect(()=>detectMatrixIntent(official.replace("\\vec{v}=(4,5,6)","\\vec{u}=(4,5,6)"))).toThrow(/nombres distintos/);
  expect(()=>detectMatrixIntent(official.replace("\\vec{v}=(4,5,6)","\\vec{w}=(4,5,6)"))).toThrow(/Faltan/);
  expect(()=>detectMatrixIntent(official.replace("(4,5,6)","(4,5)"))).toThrow(/misma longitud/);
 });
});
