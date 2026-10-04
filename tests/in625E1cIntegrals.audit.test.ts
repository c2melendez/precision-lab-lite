import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";

const p=(s:string)=>parseExpression(s).algebrite.replace(/\s+/g,"");

describe("IN625 E1c — integrales en notación natural",()=>{
  it("EN-CA-01 integral indefinida con \\,dx",()=>expect(p("\\int x^{2}\\,dx")).toMatch(/^integral\(/));
  it("EN-CA-02 dx sin espacio fino sigue siendo diferencial",()=>expect(p("\\int x^{2}dx")).toMatch(/^integral\(/));
  it("EN-CA-03 forma compacta x^2 dx",()=>expect(p("\\int x^2 dx")).toMatch(/^integral\(/));
  it("EN-CA-04 definida con límites entre llaves",()=>expect(p("\\int_{0}^{1}x^{2}\\,dx")).toMatch(/^defintegral\(/));
  it("EN-CA-05 definida con límites sin llaves",()=>expect(p("\\int_0^1 x^2\\,dx")).toMatch(/^defintegral\(/));
  it("EN-CA-06 definida 0..pi",()=>expect(p("\\int_{0}^{\\pi}\\sin x\\,dx")).toMatch(/^defintegral\(/));
  it("EN-CA-08 acepta \\mathrm{d}x",()=>expect(p("\\int\\frac{1}{x}\\mathrm{d}x")).toMatch(/^integral\(/));
  it("EN-CA-09 acepta \\differentialD x",()=>expect(p("\\int\\frac{1}{x}\\differentialD x")).toMatch(/^integral\(/));
  it("EN-CA-10 detecta variable t desde dt",()=>expect(p("\\int t\\,dt")).toMatch(/^integral\(.*?,t\)$/));
  it.todo("EN-CA-07 integral impropia 0..infinity requiere ruta explícita");
  it.todo("EN-CA-11 integral doble xy dx dy requiere soporte estructural");
});
