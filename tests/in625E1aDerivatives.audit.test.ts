import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

const ev=(s:string)=>evaluate(parseExpression(s).algebrite).replace(/\s+/g,"");

describe("IN625 E1a — derivadas en notación natural",()=>{
  it("EN-CA-12 d/dx x^2 -> 2x",()=>{
    expect(ev("\\frac{d}{dx}x^{2}")).toMatch(/^2\*?x$/);
  });
  it("EN-CA-13 d/dx (x^2) -> 2x",()=>{
    expect(ev("\\frac{d}{dx}\\left(x^{2}\\right)")).toMatch(/^2\*?x$/);
  });
  it("EN-CA-14 d/dx sin x -> cos x",()=>{
    expect(ev("\\frac{d}{dx}\\sin x")).toMatch(/^cos\(?x\)?$/);
  });
  it.todo("EN-CA-15 dy/dx aislada conserva intención de derivada de y");
  it.todo("EN-CA-16 segunda derivada de y respecto de x");
  it.todo("EN-CA-17 primas y', y'', y''', y^(4)");
  it.todo("EN-CA-18 macros prime/primeprime");
  it.todo("EN-CA-19 derivada parcial en notaciones equivalentes");
});
