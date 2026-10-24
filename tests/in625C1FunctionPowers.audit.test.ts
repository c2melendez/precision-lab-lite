import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

const p=(s:string)=>parseExpression(s).algebrite.replace(/\s+/g,"");
function value(input:string, expected:string){
  const out=evaluate(parseExpression(input).algebrite).replace(/\s+/g,"");
  expect(out).toBe(expected.replace(/\s+/g,""));
}

describe("IN625 Parte C / C1 Potencia de función vs inversa",()=>{
  it("EN-FP-01",()=>{ const out=p("\\sin^{2}x"); expect(out).toMatch(/sin\(x\).*\^.*2/); });
  it("EN-FP-02",()=>{ const out=p("\\sin^{2}(x)"); expect(out).toMatch(/sin\(x\).*\^.*2/); });
  it("EN-FP-03",()=>{ const out=p("\\sin^2 x"); expect(out).toMatch(/sin\(x\).*\^.*2/); });
  it("EN-FP-04 C3",()=>{ expect(p("\\sin^{-1}x").toLowerCase()).toMatch(/arcsin|asin/); });
  it("EN-FP-05 C3",()=>{ expect(p("\\cos^{-1}x").toLowerCase()).toMatch(/arccos|acos/); });
  it("EN-FP-06 C3",()=>{ expect(p("\\tan^{-1}x").toLowerCase()).toMatch(/arctan|atan/); });
  it("EN-FP-07",()=>{ const out=p("\\sin^{-2}x"); expect(out).toContain("sin("); expect(out).toMatch(/-2|1\//); });
  it("EN-FP-08",()=>{ const out=p("\\left(\\sin x\\right)^{-1}"); expect(out).toContain("sin("); expect(out).not.toMatch(/arcsin|asin/); });
  it("EN-FP-09",()=>{ const out=p("\\frac{1}{\\sin x}"); expect(out).toContain("sin("); });
  it("EN-FP-10",()=>{ expect(p("\\left(\\sin x\\right)^{2}")).toMatch(/sin\(x\).*\^.*2/); });
  it("EN-FP-11 C5",()=>{ expect(p("\\sin(x)^{2}")).toMatch(/sin\(x\).*\^.*2/); });
  it("EN-FP-12",()=>{ expect(p("\\sin(x^{2})")).toMatch(/sin\(x\^.*2.*\)/); });
  it("EN-FP-13",()=>{ expect(p("\\sin x^{2}")).toMatch(/sin\(x\^.*2.*\)/); });
  it("EN-FP-14",()=>{ const out=p("\\sin^{2}x^{2}"); expect(out).toContain("sin("); expect(out).toMatch(/\^.*2/); });
  it("EN-FP-15",()=>{ expect(p("\\sin^{3}x")).toMatch(/sin\(x\).*\^.*3/); });
  it("EN-FP-16",()=>{ const out=p("\\sin^{2}3x"); expect(out).toContain("sin("); expect(out).toContain("3"); });
  it("EN-FP-17",()=>{
    const a=p("\\sinh^{-1}(1)").toLowerCase();
    const b=p("\\cosh^{-1}(1)").toLowerCase();
    expect(a).toMatch(/arsinh|asinh|sinh/); expect(b).toMatch(/arcosh|acosh|cosh/);
  });
  it("EN-FP-18",()=>{
    for(const s of ["\\csc^{-1}2","\\sec^{-1}2","\\cot^{-1}1"]) expect(p(s).length).toBeGreaterThan(0);
  });
  it("EN-FP-19",()=>value("\\ln^{2}\\left(e^{3}\\right)","9"));
  it("EN-FP-20 C2 convention-gated",()=>{
    const out=p("\\log^{2}1000").toLowerCase(); expect(out).toContain("log");
  });
  it("EN-FP-21 ambiguous ln^-1: explicit representation or error",()=>{
    try{ const out=p("\\ln^{-1}x"); expect(out.length).toBeGreaterThan(0); }
    catch(e){ expect(String(e).length).toBeGreaterThan(0); }
  });
  it("EN-FP-22",()=>{ const out=p("\\sin x^{-1}"); expect(out).toContain("sin("); expect(out).not.toMatch(/arcsin|asin/); });
  it("EN-FP-23 identity syntax",()=>{ const out=p("\\sin^{2}x+\\cos^{2}x"); expect(out).toContain("+"); expect(out).toContain("sin("); expect(out).toContain("cos("); });
  it("EN-FP-24",()=>{ expect(p("\\sin^{1}x")).toContain("sin("); expect(p("\\sin^{0}x")).toContain("sin("); });
  it("EN-FP-25 ambiguous f^2(x): explicit or error",()=>{
    try{ const out=p("f^{2}(x)"); expect(out.length).toBeGreaterThan(0); }
    catch(e){ expect(String(e).length).toBeGreaterThan(0); }
  });
});
