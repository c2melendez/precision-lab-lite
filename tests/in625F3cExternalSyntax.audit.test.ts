import { describe, expect, it } from "vitest";
import { preprocessLatex } from "../src/engine/parsing/normalize";
const n=(s:string)=>preprocessLatex(s).replace(/\s+/g,"");

describe("IN625 F3c — SymPy y relaciones 18..26",()=>{
  it("EN-AS-18 sympy latex polynomial",()=>{
    expect(n("x^{2} + 2 x + 1")).toContain("x^(2)+2x+1");
  });
  it("EN-AS-19 sympy sin latex",()=>{
    expect(n("\\sin{\\left(x \\right)}")).toContain("sin(x)");
  });
  it("EN-AS-20 operatorname asin/acos/atan",()=>{
    expect(n("\\operatorname{asin}{\\left(x \\right)}")).toContain("arcsin(x)");
    expect(n("\\operatorname{acos}{\\left(x \\right)}")).toContain("arccos(x)");
    expect(n("\\operatorname{atan}{\\left(x \\right)}")).toContain("arctan(x)");
  });
  it("EN-AS-21 x!=3 no factorial",()=>{
    const out=n("x!=3");
    expect(out).toContain("!=");
    expect(out).not.toContain("factorial");
  });
  it("EN-AS-22 <= >=",()=>{
    expect(n("x<=3")).toBe("x<=3");
    expect(n("x>=3")).toBe("x>=3");
  });
  it("EN-AS-23 <> -> !=",()=>expect(n("x<>3")).toBe("x!=3"));
  it("EN-AS-24 == -> =",()=>expect(n("x==3")).toBe("x=3"));
  it("EN-AS-25 lim external syntax",()=>{
    expect(n("lim(x->0, sin(x)/x)")).toContain("limit");
  });
  it("EN-AS-26 sympy log latex obeys calculator log10 contract",()=>{
    expect(n("\\log{\\left(x \\right)}")).toContain("log10(x)");
  });
});
