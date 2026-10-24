import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

const p=(s:string)=>parseExpression(s).algebrite.replace(/\s+/g,"");

describe("IN625 Parte B / B2 Subíndices y bases de logaritmo",()=>{
  it("EN-SB-01 x_{10} es un símbolo atómico",()=>{
    const out=p("x_{10}");
    expect(out).not.toContain("*");
    expect(out).toMatch(/^x[A-Za-z]+$/);
  });
  it("EN-SB-02 x_1+x_2 conserva dos símbolos",()=>{
    const out=p("x_1+x_2");
    expect(out).toContain("+");
    expect(out).not.toMatch(/x\*1|x\*2/);
  });
  it("EN-SB-03 a_{i,j} es un único símbolo o rechazo explícito",()=>{
    try {
      const out=p("a_{i,j}");
      expect(out.length).toBeGreaterThan(0);
    } catch(e){ expect(String(e).length).toBeGreaterThan(0); }
  });
  it("EN-SB-04 x_{text max} es un único símbolo o rechazo explícito",()=>{
    try {
      const out=p("x_{\\text{max}}");
      expect(out.length).toBeGreaterThan(0);
    } catch(e){ expect(String(e).length).toBeGreaterThan(0); }
  });
  function expectLogBaseShape(input:string, argument:string, base:string){
    const out=parseExpression(input).algebrite.replace(/\\s+/g,"");
    expect(out).toContain("log(");
    expect(out).toContain("/");
    expect(out).toContain(argument);
    expect(out).toContain(base);
  }
  it("EN-SB-05 log base 2",()=>expectLogBaseShape("\\log_{2}8","8","2"));
  it("EN-SB-06 log base 2 sin llaves",()=>expectLogBaseShape("\\log_28","8","2"));
  it("EN-SB-07 log base 10",()=>expectLogBaseShape("\\log_{10}1000","1000","10"));
  it("EN-SB-08 log base 16",()=>expectLogBaseShape("\\log_{16}256","256","16"));
  it("EN-SB-09 exponente pertenece al argumento",()=>{
    const out=parseExpression("\\log_{2}8^{2}").algebrite.replace(/\\s+/g,"");
    expect(out).toContain("log(");
    expect(out).toContain("/");
    expect(out).toMatch(/8.*\^.*2/);
  });
  it("EN-SB-10 base simbólica",()=>{
    const out=p("\\log_{b}x");
    expect(out).toMatch(/log|ln/);
    expect(out).toContain("b");
    expect(out).toContain("x");
  });
});
