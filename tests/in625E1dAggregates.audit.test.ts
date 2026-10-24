import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

const ev=(s:string)=>evaluate(parseExpression(s).algebrite).replace(/\s+/g,"");

describe("IN625 E1d — sumatorias, productorias y evaluación estructurada",()=>{
  it("EN-CA-26 sum k=1..10",()=>expect(ev("\\sum_{k=1}^{10}k")).toBe("55"));
  it("EN-CA-28 sum k^2=1..10",()=>expect(ev("\\sum_{k=1}^{10}k^{2}")).toBe("385"));
  it("EN-CA-30 prod k=1..5",()=>expect(ev("\\prod_{k=1}^{5}k")).toBe("120"));
  it.todo("EN-CA-27 suma simbólica 1..n requiere forma cerrada");
  it.todo("EN-CA-29 serie infinita geométrica requiere ruta de serie");
  it.todo("EN-CA-31 evaluación F(x)|_a^b requiere operador estructurado");
  it.todo("EN-CA-32 sumatoria hasta 10^9 debe usar forma cerrada, no iteración");
});
