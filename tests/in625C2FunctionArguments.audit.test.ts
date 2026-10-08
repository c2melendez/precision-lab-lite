import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";

const p=(s:string,mode:"RAD"|"GRAD"="RAD")=>parseExpression(s,mode).algebrite.replace(/\s+/g,"");
function num(input:string,mode:"RAD"|"GRAD"="RAD"):number{
  const expr=parseExpression(input,mode).algebrite;
  return compileNumeric(expr,"__unused__")(0);
}
describe("IN625 Parte C / C2 Argumento sin paréntesis",()=>{
  it("EN-FA-01",()=>expect(p("\\sin x")).toContain("sin(x)"));
  it("EN-FA-02",()=>{const o=p("\\sin 2x");expect(o).toContain("sin(");expect(o).toContain("2");expect(o).toContain("x");});
  it("EN-FA-03",()=>{const o=p("\\sin2x");expect(o).toContain("sin(");expect(o).toContain("2");expect(o).toContain("x");});
  it("EN-FA-04",()=>{const o=p("\\sin x+1");expect(o).toContain("sin(x)+1");});
  it("EN-FA-05",()=>{const o=p("\\sin x\\cos x");expect(o).toContain("sin(x)");expect(o).toContain("cos(x)");expect(o).toContain("*");});
  it("EN-FA-06",()=>{const o=p("\\sin 2x\\cos 3x");expect(o).toContain("sin(");expect(o).toContain("cos(");});
  it("EN-FA-07",()=>{const o=p("\\sin\\frac{\\pi}{6}");expect(o).toContain("sin(");expect(o).toContain("pi");});
  it("EN-FA-08",()=>{const o=p("\\sin\\pi x");expect(o).toContain("sin(");expect(o).toContain("pi");expect(o).toContain("x");});
  it("EN-FA-09",()=>{const o=p("\\sin 2\\pi x");expect(o).toContain("sin(");expect(o).toContain("pi");});
  it("EN-FA-10",()=>{const o=p("\\sin x/2");expect(o).toContain("sin(x)");expect(o).toContain("/2");});
  it("EN-FA-11 composition",()=>{const o=p("\\sin\\cos x");expect(o).toContain("sin(cos(x))");});
  it("EN-FA-12 composition",()=>{const o=p("\\sin\\sin x");expect(o).toContain("sin(sin(x))");});
  it("EN-FA-13",()=>{const o=p("\\ln x^{2}");expect(o).toMatch(/ln\(x\^.*2.*\)/);});
  it("EN-FA-14",()=>{const o=p("\\ln 2x");expect(o).toContain("ln(");expect(o).toContain("2");expect(o).toContain("x");});
  it("EN-FA-15",()=>{const o=p("\\ln x+1");expect(o).toContain("ln(x)+1");});
  it("EN-FA-16 cdot termina argumento",()=>{const o=p("\\sin x\\cdot2");expect(o).toContain("sin(x)*2");});
  it("EN-FA-17",()=>{const o=p("\\cos 2x^{2}");expect(o).toContain("cos(");expect(o).toContain("2");expect(o).toMatch(/x\^.*2/);});
  it("EN-FA-18",()=>{expect(p("\\sin(\\pi/6)")).toContain("sin(");});
  it("EN-FA-19 operatorname sin",()=>{expect(p("\\operatorname{sin}x")).toContain("sin(x)");});
  it("EN-FA-20 explicit degree independent of mode",()=>{
    const a=num("\\sin 30^{\\circ}","RAD"); const b=num("\\sin 30^{\\circ}","GRAD");
    expect(a).toBeCloseTo(0.5,9); expect(b).toBeCloseTo(0.5,9);
  });
  it("EN-FA-21 explicit degree parenthesized",()=>{
    const a=num("\\cos\\left(60^{\\circ}\\right)","RAD");
    const b=num("\\cos\\left(60^{\\circ}\\right)","GRAD");
    expect(a).toBeCloseTo(0.5,9); expect(b).toBeCloseTo(0.5,9);
  });
  it("EN-FA-22 mode-sensitive bare angle",()=>{
    const rad=num("\\sin 30","RAD"); const deg=num("\\sin 30","GRAD");
    expect(rad).toBeCloseTo(-0.988031624,8); expect(deg).toBeCloseTo(0.5,9);
  });
  it("EN-FA-23 C5",()=>{const o=p("\\sin(x+1)^{2}");expect(o).toMatch(/sin\(x\+1\).*\^.*2/);});
});
