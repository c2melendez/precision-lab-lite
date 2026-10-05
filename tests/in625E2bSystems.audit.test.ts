import { describe, expect, it } from "vitest";
import { splitSystemLatex } from "../src/engine/parsing/systemSplit";
import { parseExpression } from "../src/engine/parsing";
import { solveLinearSystem } from "../src/engine/stepEngine/linearSystem";

const expected=["x+y=3","x-y=1"];
const variants=[
  "\\begin{cases}x+y=3\\\\x-y=1\\end{cases}",
  "\\begin{aligned}x+y&=3\\\\x-y&=1\\end{aligned}",
  "\\begin{array}{l}x+y=3\\\\x-y=1\\end{array}",
];

describe("IN625 E2b — sistemas equivalentes",()=>{
  it("EN-MT-11 cases",()=>expect(splitSystemLatex(variants[0])).toEqual(expected));
  it("EN-MT-12 aligned ignora &",()=>expect(splitSystemLatex(variants[1])).toEqual(expected));
  it("EN-MT-13 array equivalente",()=>expect(splitSystemLatex(variants[2])).toEqual(expected));
  it("L2 resuelve (x,y)=(2,1)",()=>{
    const rows=splitSystemLatex(variants[0])!;
    const parsed=rows.map(r=>parseExpression(r));
    const result=solveLinearSystem(parsed.map(p=>p.algebrite),["x","y"]);
    expect(result.kind).toBe("unique");
    expect(result.values?.map(v=>v.toFraction())).toEqual(["2","1"]);
  });
});
