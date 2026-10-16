import {describe,expect,it} from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import {detectMatrixIntent} from "../src/engine/parsing/matrixIntent";
import {multiplyMatrices,toFractionMatrix,invertMatrix} from "../src/engine/matrixOps";
const source=String.raw`\begin{pmatrix}-2&1\\\frac{3}{2}&-\frac{1}{2}\end{pmatrix}`;
const b=[["1","2"],["3","4"]];
const identity=[["1","0"],["0","1"]];
const exact=(a: string[][],c: string[][])=>multiplyMatrices(toFractionMatrix(a),toFractionMatrix(c)).result.map(row=>row.map(v=>v.toFraction()));
describe("SY-R-11 official exact matrix inverse roundtrip",()=>{
 it("checks official source, both products and actual engine inverse",()=>{
  const row=fixture.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-R-11");
  expect(row.entrada).toBe(source); expect(row.esperado).toContain("identidad");
  const intent=detectMatrixIntent(row.entrada);
  expect(intent?.kind).toBe("literal");
  if(!intent||intent.kind!=="literal")throw Error("matrix not parsed");
  expect(intent.matrix).toEqual([["-2","1"],["3/2","-1/2"]]);
  expect(exact(intent.matrix,b)).toEqual(identity);
  expect(exact(b,intent.matrix)).toEqual(identity);
  expect(invertMatrix(toFractionMatrix(b)).result.map(r=>r.map(v=>v.toFraction()))).toEqual(intent.matrix);
 });
 it("rejects altered signs, fractions and row order",()=>{
  for(const changed of [[["2","1"],["3/2","-1/2"]],[["-2","1"],["3/2","1/2"]],[["-2","1"],["2/3","-1/2"]],[["3/2","-1/2"],["-2","1"]]])
    expect(exact(changed,b)).not.toEqual(identity);
 });
});
