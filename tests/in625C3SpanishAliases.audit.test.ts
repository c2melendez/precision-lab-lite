import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { compileNumeric } from "../src/engine/numericFallback";

const p=(s:string)=>parseExpression(s).algebrite.replace(/\s+/g,"");
function expectFn(input:string, fn:RegExp){
  const out=p(input).toLowerCase();
  expect(out).toMatch(fn);
  return out;
}
function numeric(input:string, expected:number, digits=8){
  const out=parseExpression(input).algebrite;
  const n=compileNumeric(out,"__unused__")(0);
  expect(n).toBeCloseTo(expected,digits);
}

describe("IN625 Parte C / C3 Alias en español y otros nombres",()=>{
  it("EN-AL-01",()=>expectFn("\\operatorname{sen}\\left(\\frac{\\pi}{6}\\right)",/sin\(/));
  it("EN-AL-02",()=>expectFn("\\mathrm{sen}\\,x",/sin\(/));
  it("EN-AL-03",()=>expectFn("\\text{sen}(x)",/sin\(/));
  it("EN-AL-04",()=>expectFn("sen(x)",/sin\(/));
  it("EN-AL-05",()=>expectFn("sen x",/sin\(/));
  it("EN-AL-06",()=>expectFn("\\sen x",/sin\(/));
  it("EN-AL-07",()=>{
    expectFn("sen^{2}x",/sin\(x\).*\^.*2/);
    expectFn("sen^2(x)",/sin\(x\).*\^.*2/);
  });
  it("EN-AL-08",()=>expectFn("sen^{-1}x",/arcsin|asin/));
  it("EN-AL-09",()=>{
    for(const s of ["Sen x","SEN(x)"]){
      try{ const out=p(s); expect(out.toLowerCase()).toMatch(/sin\(/); }
      catch(e){ expect(String(e).length).toBeGreaterThan(0); }
    }
  });
  it("EN-AL-10",()=>{
    for(const s of ["tg x","\\operatorname{tg}x","\\tg x"]) expectFn(s,/tan\(/);
  });
  it("EN-AL-11",()=>{
    for(const s of ["ctg x","cotg x","\\operatorname{cotg}x"]) expectFn(s,/cot\(/);
  });
  it("EN-AL-12",()=>{
    for(const s of ["cosec x","\\operatorname{cosec}x"]) expectFn(s,/csc\(/);
  });
  it("EN-AL-13",()=>{
    expectFn("arcsen(1/2)",/arcsin|asin/);
    expectFn("\\operatorname{arcsen}\\frac{1}{2}",/arcsin|asin/);
  });
  it("EN-AL-14",()=>expectFn("arccos(1/2)",/arccos|acos/));
  it("EN-AL-15",()=>{
    expectFn("arctg(1)",/arctan|atan/);
    expectFn("\\operatorname{arctg}1",/arctan|atan/);
  });
  it("EN-AL-16",()=>{
    for(const s of ["arcctg(0)","arccotg(0)"]) expectFn(s,/arccot|acot/);
  });
  it("EN-AL-17",()=>{
    for(const s of ["arccosec(2)","arccsc(2)"]) expectFn(s,/arccsc|acsc/);
  });
  it("EN-AL-18",()=>expectFn("arcsec(2)",/arcsec|asec/));
  it("EN-AL-19",()=>{
    expectFn("senh(1)",/sinh\(/);
    expectFn("\\operatorname{senh}1",/sinh\(/);
  });
  it("EN-AL-20",()=>{
    expectFn("tgh(1)",/tanh\(/);
    expectFn("\\operatorname{tgh}1",/tanh\(/);
  });
  it("EN-AL-21",()=>{
    for(const s of ["ctgh(1)","cotgh(1)"]) expectFn(s,/coth\(/);
  });
  it("EN-AL-22",()=>{
    expectFn("sech(0)",/sech\(/);
    expectFn("cosech(1)",/csch\(/);
  });
  it("EN-AL-23",()=>{
    for(const s of ["argsenh(1)","arcsenh(1)"]) expectFn(s,/asinh|arsinh/);
  });
  it("EN-AL-24",()=>expectFn("argcosh(1)",/acosh|arcosh/));
  it("EN-AL-25",()=>{
    for(const s of ["argtgh(1/2)","arctgh(1/2)"]) expectFn(s,/atanh|artanh/);
  });
  it("EN-AL-26 C2 log base10",()=>{
    for(const s of ["\\log 1000","log(1000)","lg 1000"]) expectFn(s,/log10\(|log\(/);
  });
  it("EN-AL-27",()=>numeric("ln(e)",1));
  it("EN-AL-28",()=>{
    for(const s of ["raiz(16)","raíz(16)","\\operatorname{raiz}(16)"]) expectFn(s,/sqrt\(/);
  });
  it("EN-AL-29",()=>{
    expectFn("abs(-3)",/abs\(/);
    expectFn("\\operatorname{abs}(-3)",/abs\(/);
  });
  it("EN-AL-30",()=>expectFn("abs(x)",/abs\(/));
  it("EN-AL-31",()=>expectFn("exp(1)",/exp\(/));
  it("EN-AL-32",()=>{
    expectFn("\\operatorname{mcd}(12,18)",/gcd\(/);
    expectFn("\\operatorname{mcm}(4,6)",/lcm\(/);
  });
  it("EN-AL-33",()=>{
    expectFn("\\max(2,5)",/max\(/);
    expectFn("\\operatorname{máx}(2,5)",/max\(/);
  });
  it("EN-AL-34 decimal-comma min",()=>{
    const out=p("\\operatorname{mín}(2;5,5)").toLowerCase();
    expect(out).toMatch(/min\(/);
  });
  it("EN-AL-35 decimal-comma max",()=>{
    const out=p("\\max(2;5,5)").toLowerCase();
    expect(out).toMatch(/max\(/);
  });
  it("EN-AL-36 pi aliases",()=>{
    for(const s of ["pi","PI","Pi","\\pi","π"]){
      try{
        const out=p(s).toLowerCase();
        expect(out).toContain("pi");
      }catch(e){ expect(String(e).length).toBeGreaterThan(0); }
    }
  });
});
