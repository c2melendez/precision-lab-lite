import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";

const p=(s:string)=>parseExpression(s).algebrite.replace(/\s+/g,"");

describe("IN625 E1b — límites en notación natural",()=>{
  it("EN-CA-20 lim x->0 sin(x)/x",()=>expect(p("\\lim_{x\\to0}\\frac{\\sin x}{x}")).toMatch(/^limit\(/));
  it("EN-CA-21 acepta \\rightarrow",()=>expect(p("\\lim_{x\\rightarrow0}\\frac{\\sin x}{x}")).toMatch(/^limit\(/));
  it("EN-CA-22 lateral derecho con llaves",()=>expect(p("\\lim_{x\\to0^{+}}\\frac{1}{x}")).toMatch(/,x,0,1\)$/));
  it("EN-CA-23 lateral izquierdo sin llaves",()=>expect(p("\\lim_{x\\to0^-}\\frac{1}{x}")).toMatch(/,x,0,-1\)$/));
  it("EN-CA-24 infinito",()=>expect(p("\\lim_{x\\to\\infty}\\frac{1}{x}")).toMatch(/,x,oo\)$/));
  it("EN-CA-25 tolera \\displaystyle",()=>expect(p("\\displaystyle\\lim_{x\\to0}\\frac{\\sin x}{x}")).toMatch(/^limit\(/));
});
