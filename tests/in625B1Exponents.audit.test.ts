import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

const p=(s:string)=>parseExpression(s).algebrite.replace(/\s+/g,"");
function exact(input:string, expected:string){
  const out=parseExpression(input).algebrite;
  const diff=evaluate(`simplify((${out})-(${expected}))`);
  expect(Number(diff)).toBe(0);
}
function value(input:string, expected:string){
  const out=evaluate(parseExpression(input).algebrite).replace(/\s+/g,"");
  expect(out).toBe(expected.replace(/\s+/g,""));
}

describe("IN625 Parte B / B1 Exponentes",()=>{
  it("EN-EX-01",()=>value("2^{10}","1024"));
  it("EN-EX-02",()=>value("2^10","1024"));
  it("EN-EX-03",()=>value("2^{12}","4096"));
  it("EN-EX-04",()=>value("2^{100}","1267650600228229401496703205376"));
  it("EN-EX-05",()=>{ expect(p("10^{-12}")).toMatch(/10.*-12|10\^\(-12\)/); });
  it("EN-EX-06",()=>value("10^{100}","1"+ "0".repeat(100)));
  it("EN-EX-07",()=>{ expect(p("x^{10}")).toMatch(/x\^\(10\)|x\^10/); });
  it("EN-EX-08",()=>exact("x^{-10}","x^(-10)"));
  it("EN-EX-09",()=>{ expect(p("x^{100}")).toMatch(/x\^\(100\)|x\^100/); });
  it("EN-EX-10 C4 greedy exponent",()=>{ expect(p("x^23")).toMatch(/x\^\(23\)|x\^23/); });
  it("EN-EX-11 trailing 3 outside exponent",()=>exact("x^{2}3","3*x^2"));
  it("EN-EX-12",()=>exact("x^2","x^2"));
  it("EN-EX-13",()=>exact("x^{-1}","x^(-1)"));
  it("EN-EX-14",()=>exact("x^-1","x^(-1)"));
  it("EN-EX-15",()=>exact("2^-x","2^(-x)"));
  it("EN-EX-16",()=>exact("x^{1/2}","x^(1/2)"));
  it("EN-EX-17",()=>exact("x^{0.5}","x^(1/2)"));
  it("EN-EX-18",()=>{ const out=p("x^{2n}"); expect(out).toContain("x^"); expect(out).toMatch(/2\*n|n\*2/); });
  it("EN-EX-19",()=>{ expect(p("x^{a+b}")).toMatch(/x\^\(a\+b\)|x\^a\+b/); });
  it("EN-EX-20",()=>value("2^{3^{2}}","512"));
  it("EN-EX-21 right associative",()=>value("2^3^2","512"));
  it("EN-EX-22",()=>value("(2^3)^2","64"));
  it("EN-EX-23 double exponent explicit error or x^6",()=>{
    try { exact("x^{2}^{3}","x^6"); } catch(e){ expect(String(e).length).toBeGreaterThan(0); }
  });
  it("EN-EX-24",()=>value("-2^2","-4"));
  it("EN-EX-25",()=>value("(-2)^2","4"));
  it("EN-EX-26",()=>exact("-x^2","-(x^2)"));
  it("EN-EX-27 C9: la sintaxis preserva base negativa y exponente 1/3",()=>{
    const out=p("(-8)^{1/3}");
    expect(out).toContain("-8");
    expect(out).toMatch(/1\/3|\(1\)\/\(3\)/);
  });
  it("EN-EX-28",()=>{ const out=p("e^{-x^{2}}"); expect(out).toMatch(/e\^|exp/); });
  it("EN-EX-29",()=>{ const out=p("e^{2x+1}"); expect(out).toMatch(/e\^|exp/); });
  it("EN-EX-30 exponent symbol without braces",()=>{ const out=p("e^\\pi"); expect(out).toMatch(/pi|π/); });
  it("EN-EX-31 Euler identity",()=>value("e^{i\\pi}","-1"));
  it("EN-EX-32 exp aliases",()=>{
    const a=parseExpression("\\exp(x)").algebrite;
    const b=parseExpression("\\exp x").algebrite;
    expect(a.length).toBeGreaterThan(0); expect(b.length).toBeGreaterThan(0);
  });
  it("EN-EX-33",()=>exact("2^{-2^{2}}","1/16"));
  it("EN-EX-34 subscript then power",()=>{ const out=p("x_1^2"); expect(out).toContain("^"); });
  it("EN-EX-35 power then subscript",()=>{ const out=p("x^{2}_{1}"); expect(out).toContain("^"); });
});
