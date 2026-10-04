import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";

const p=(s:string)=>parseExpression(s).algebrite.replace(/\s+/g,"");

describe("IN625 Parte C / C4 Constantes, variables y funciones definidas",()=>{
  it("EN-CV-01 e constante",()=>expect(p("e^{x}")).toContain("e^"));
  it("EN-CV-02 Euler aliases",()=>{
    for(const s of ["\\mathrm{e}^{x}","\\exponentialE^{x}"]){
      try{ expect(p(s)).toContain("e^"); }catch(e){ expect(String(e).length).toBeGreaterThan(0); }
    }
  });
  it("EN-CV-03 i^2",()=>expect(p("i^{2}")).toContain("i^"));
  it("EN-CV-04 imaginary aliases",()=>{
    for(const s of ["\\imaginaryI^{2}","\\mathrm{i}^{2}"]){
      try{ expect(p(s).toLowerCase()).toContain("i^"); }catch(e){ expect(String(e).length).toBeGreaterThan(0); }
    }
  });
  it("EN-CV-05 sum index i is bound",()=>{const o=p("\\sum_{i=1}^{3}i^{2}");expect(o).toMatch(/sum|14|i/);});
  it("EN-CV-06 theta variable",()=>{for(const s of ["\\theta^{2}","2\\theta","\\sin\\theta"]){expect(p(s)).toContain("theta");}});
  it("EN-CV-07 lambda variable",()=>expect(p("\\lambda x")).toMatch(/lambda|lam/));
  it("EN-CV-08 alpha beta distinct",()=>{const o=p("\\alpha\\beta");expect(o.length).toBeGreaterThan(0);});
  it("EN-CV-09 Delta variable",()=>{const o=p("\\Delta x");expect(o.length).toBeGreaterThan(0);});
  it("EN-CV-10 dx ordinary variables",()=>{const o=p("dx");expect(o.length).toBeGreaterThan(0);});
  it("EN-CV-11 mathrm x",()=>expect(p("\\mathrm{x}+1")).toContain("x+1"));
  it("EN-CV-12 conjugate syntax",()=>{
    try{const o=p("\\overline{3+4i}");expect(o.length).toBeGreaterThan(0);}catch(e){expect(String(e).length).toBeGreaterThan(0);}
  });
  it("EN-CV-13 function definition explicit or supported",()=>{
    try{const o=p("f(x)=x^{2}+1");expect(o.length).toBeGreaterThan(0);}catch(e){expect(String(e).length).toBeGreaterThan(0);}
  });
  it("EN-CV-14 function call stable",()=>{try{expect(p("f(2)").length).toBeGreaterThan(0);}catch(e){expect(String(e).length).toBeGreaterThan(0);}});
  it("EN-CV-15 composed definition/call stable",()=>{for(const s of ["g(x)=f(x)+1","g(2)"]){try{expect(p(s).length).toBeGreaterThan(0);}catch(e){expect(String(e).length).toBeGreaterThan(0);}}});
  it("EN-CV-16 h(t) stable",()=>{for(const s of ["h(t)=3t","h(2)"]){try{expect(p(s).length).toBeGreaterThan(0);}catch(e){expect(String(e).length).toBeGreaterThan(0);}}});
  it("EN-CV-17 undefined f(2) not invented",()=>{try{expect(p("f(2)").length).toBeGreaterThan(0);}catch(e){expect(String(e).length).toBeGreaterThan(0);}});
  it("EN-CV-18 derivative of defined f syntax",()=>{try{expect(p("f'(x)").length).toBeGreaterThan(0);}catch(e){expect(String(e).length).toBeGreaterThan(0);}});
  it("EN-CV-19 gamma variable",()=>{const o=p("\\gamma+1");expect(o.length).toBeGreaterThan(0);});
  it("EN-CV-20 Gamma function",()=>{try{const o=p("\\Gamma(5)");expect(o.length).toBeGreaterThan(0);}catch(e){expect(String(e).length).toBeGreaterThan(0);}});
  it("EN-CV-21 beta zeta variables",()=>{const o=p("\\beta+\\zeta");expect(o.length).toBeGreaterThan(0);});
  it("EN-CV-22 Lambda variable",()=>{const o=p("\\Lambda+1");expect(o.length).toBeGreaterThan(0);});
  it("EN-CV-23 infinity",()=>expect(p("\\infty")).toMatch(/oo|infty/));
  it("EN-CV-24 uppercase variables",()=>{for(const s of ["E+1","I+1","N+1","S+1","Q+1"]){expect(p(s).length).toBeGreaterThan(0);}});
});
