import { describe, expect, it } from "vitest";
import { splitFreeSystemLatex } from "../src/engine/parsing/systemSplit";
import { parseExpression } from "../src/engine/parsing";
import { solveLinearSystem } from "../src/engine/stepEngine/linearSystem";

const variants=[
  "x+y=3\\\\x-y=1",
  "x+y=3,\\ x-y=1",
  "x+y=3;\\ x-y=1",
  "x+y=3\\text{ y }x-y=1",
  "x+y=3\nx-y=1",
];

describe("IN625 E3b — sistemas libres",()=>{
  it.each(variants)("separa dos ecuaciones: %s",(input)=>{
    expect(splitFreeSystemLatex(input)).toEqual(["x+y=3","x-y=1"]);
  });

  it("L2 resuelve todos como (2,1)",()=>{
    for(const input of variants){
      const rows=splitFreeSystemLatex(input)!;
      const parsed=rows.map(r=>parseExpression(r));
      const result=solveLinearSystem(parsed.map(p=>p.algebrite),["x","y"]);
      expect(result.kind).toBe("unique");
      if(result.kind==="unique") expect(result.values).toEqual(["2","1"]);
    }
  });
});
