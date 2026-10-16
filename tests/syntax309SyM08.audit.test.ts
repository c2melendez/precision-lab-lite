import {describe,expect,it} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
describe("SY-M-08 empty matrix",()=>{
 it("rejects the official empty matrix clearly",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-M-08");
  expect(row.entrada).toBe(String.raw`\begin{pmatrix}\end{pmatrix}`);
  expect(row.operacion).toBe("error");
  expect(row.esperado).toContain("matriz vacía");
  expect(()=>detectMatrixIntent(row.entrada)).toThrow(/matriz.*vacía/);
 });
 it("recognizes an empty editor grid without assuming zero",()=>{
  for(const body of ["&"+String.raw`\\`+"&",String.raw`\placeholder{}&\placeholder{}\\\placeholder{}&\placeholder{}`]){
   expect(()=>detectMatrixIntent("\\begin{pmatrix}"+body+"\\end{pmatrix}")).toThrow(/matriz.*vacía/);
  }
 });
 it("accepts an explicit zero matrix and recovers to a valid determinant",()=>{
  expect(detectMatrixIntent(String.raw`\begin{pmatrix}0&0\\0&0\end{pmatrix}`)?.kind).toBe("literal");
  expect(detectMatrixIntent(String.raw`\det\begin{pmatrix}1&2\\3&4\end{pmatrix}`)).toEqual({kind:"determinant",matrix:[["1","2"],["3","4"]]});
 });
});
