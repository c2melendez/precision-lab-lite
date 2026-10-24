import {describe,expect,it} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
describe("SY-M-07 unequal matrix rows",()=>{
 it("rejects the exact official source with a clear row-length error",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-M-07");
  expect(row.entrada).toBe(String.raw`\begin{pmatrix}1&2\\3\end{pmatrix}`);
  expect(row.operacion).toBe("error");
  expect(row.esperado).toContain("filas de distinta longitud");
  expect(()=>detectMatrixIntent(row.entrada)).toThrow(/filas.*misma longitud/);
 });
 it("does not convert an editor-padded missing cell to zero",()=>{
  expect(()=>detectMatrixIntent(String.raw`\begin{pmatrix}1&2\\3&\end{pmatrix}`)).toThrow(/completa|longitud/);
 });
 it("accepts the corrected matrix after a rejection",()=>{
  expect(()=>detectMatrixIntent(String.raw`\begin{pmatrix}1&2\\3\end{pmatrix}`)).toThrow();
  expect(detectMatrixIntent(String.raw`\det\begin{pmatrix}1&2\\3&4\end{pmatrix}`)).toEqual({kind:"determinant",matrix:[["1","2"],["3","4"]]});
 });
});
