import { describe, expect, it } from "vitest";
import { preprocessLatex } from "../src/engine/parsing/normalize";
const n=(s:string)=>preprocessLatex(s).replace(/\s+/g,"");

describe("IN625 F3b — Wolfram/Python/Excel 11..17",()=>{
  it("EN-AS-11 Wolfram Sin/Sqrt",()=>{
    expect(n("Sin[x]^2")).toMatch(/sin\(x\)\^\(?2\)?/);
    expect(n("Sqrt[16]")).toContain("sqrt(16)");
  });
  it("EN-AS-12 Wolfram Log[E]",()=>expect(n("Log[E]")).toMatch(/ln\(e\)/));
  it("EN-AS-13 Python math",()=>{
    expect(n("math.sqrt(16)")).toContain("sqrt(16)");
    expect(n("math.pi")).toBe("pi");
  });
  it("EN-AS-14 NumPy sin",()=>expect(n("np.sin(x)")).toContain("sin(x)"));
  it("EN-AS-15 Excel =2^10",()=>expect(n("=2^10")).toMatch(/2\^\(?10\)?/));
  it("EN-AS-16 Excel español",()=>{
    const out=n("RAIZ(16)+SENO(PI()/6)");
    expect(out).toContain("sqrt(16)");
    expect(out).toContain("sin(pi/6)");
  });
  it("EN-AS-17 POTENCIA/LN/EXP",()=>{
    expect(n("POTENCIA(2,10)")).toMatch(/\(2\)\^\(10\)/);
    expect(n("LN(EXP(1))")).toContain("ln(exp(1))");
  });
});
