import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

const p=(s:string)=>parseExpression(s).algebrite.replace(/\s+/g,"");
function value(input:string, expected:string){
  expect(evaluate(parseExpression(input).algebrite).replace(/\s+/g,"")).toBe(expected.replace(/\s+/g,""));
}

describe("IN625 Parte B / B3 Multiplicación implícita",()=>{
  it("EN-MI-01",()=>{ expect(p("2x")).toMatch(/2\*x|x\*2/); });
  it("EN-MI-02",()=>value("2(3)","6"));
  it("EN-MI-03",()=>value("(2)(3)","6"));
  it("EN-MI-04",()=>{ const out=p("(x+1)(x-1)"); expect(out).toContain("*"); });
  it("EN-MI-05",()=>{ const out=p("x(x+1)"); expect(out).toContain("*("); });
  it("EN-MI-06",()=>{ const out=p("2x^2"); expect(out).toMatch(/2\*x\^/); });
  it("EN-MI-07",()=>{ const out=p("-2x^2"); expect(out).toMatch(/-2\*x\^|\(-2\)\*x\^/); });
  it("EN-MI-08",()=>{ const out=p("3x^2y"); expect(out).toMatch(/3\*x\^.*\*y/); });

  it("EN-MI-09 C10 convention-gated",()=>{ expect(p("xy").length).toBeGreaterThan(0); });
  it("EN-MI-10 C10 convention-gated",()=>{ expect(p("xyz").length).toBeGreaterThan(0); });

  it("EN-MI-11",()=>{ expect(p("2\\pi")).toMatch(/2\*pi|pi\*2/); });
  it("EN-MI-12",()=>{ const out=p("2\\pi x"); expect(out).toContain("pi"); expect(out).toContain("x"); });
  it("EN-MI-13",()=>{ const out=p("\\pi r^{2}"); expect(out).toContain("pi"); expect(out).toContain("r^"); });
  it("EN-MI-14",()=>{ const out=p("3\\sqrt{2}"); expect(out).toContain("sqrt(2)"); expect(out).toContain("*"); });
  it("EN-MI-15",()=>{ const out=p("2e"); expect(out).toMatch(/2\*e|e\*2/); });
  it("EN-MI-16",()=>{ const out=p("2e^{x}"); expect(out).toContain("2*"); expect(out).toContain("e^"); });
  it("EN-MI-17",()=>{ const out=p("xe^{x}"); expect(out).toContain("x*"); expect(out).toContain("e^"); });
  it("EN-MI-18 C10 convention-gated",()=>{ expect(p("ex").length).toBeGreaterThan(0); });

  it("EN-MI-19 sin sin paréntesis es llamada",()=>{
    const out=p("2\\sin x").toLowerCase();
    expect(out).toContain("sin(");
    expect(out).toContain("2*");
  });
  it("EN-MI-20 x sin x conserva llamada y producto",()=>{
    const out=p("x\\sin x").toLowerCase();
    expect(out).toContain("sin(");
    expect(out).toContain("x*");
  });
  it("EN-MI-21 sin x cos x conserva dos llamadas",()=>{
    const out=p("\\sin x\\cos x").toLowerCase();
    expect((out.match(/sin\(/g)??[]).length).toBe(1);
    expect((out.match(/cos\(/g)??[]).length).toBe(1);
  });

  it("EN-MI-22",()=>{ expect(p("(a+b)c")).toContain("*c"); });
  it("EN-MI-23",()=>value("2(3)(4)","24"));
  it("EN-MI-24",()=>value("2(3)^{2}","18"));
  it("EN-MI-25",()=>{ const out=p("3(x+1)^{2}"); expect(out).toContain("3*"); expect(out).toContain("^"); });

  it("EN-MI-26 x2 es producto, no subíndice",()=>{
    const out=p("x2");
    expect(out).toMatch(/x\*2|2\*x/);
    expect(out).not.toContain("SUB");
  });

  for(const [id,input] of [
    ["EN-MI-27","1/2x"],["EN-MI-28","1/2\\pi"],["EN-MI-29","2/3x"],
    ["EN-MI-30","a/bc"],["EN-MI-31","6/2(1+2)"],["EN-MI-32","6\\div2(1+2)"],
  ] as const){
    it(`${id} C1 convention-gated: conserva operandos y división`,()=>{
      const out=p(input);
      expect(out).toContain("/");
      expect(out.length).toBeGreaterThan(2);
    });
  }

  it("EN-MI-33 C8 convention-gated",()=>{
    const out=p("2\\frac{1}{2}");
    expect(out).toContain("2");
    expect(out).toContain("/");
  });
  it("EN-MI-34",()=>value("2\\left(3+4\\right)","14"));
  it("EN-MI-35",()=>value("\\left(3+4\\right)2","14"));
  it("EN-MI-36",()=>{ expect(p("3\\,x")).toMatch(/3\*x|x\*3/); });
});
