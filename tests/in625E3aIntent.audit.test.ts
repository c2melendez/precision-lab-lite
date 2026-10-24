import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { detectChainedInequality } from "../src/engine/parsing/chainedInequality";

describe("IN625 E3a — intención expresión/ecuación/inecuación",()=>{
  it("EN-DI-01 expresión simple",()=>{
    const p=parseExpression("x^{2}-4");
    expect(p.isEquation).toBe(false);
    expect(p.isInequality).toBe(false);
  });
  it("EN-DI-02 ecuación =0",()=>expect(parseExpression("x^{2}-4=0").isEquation).toBe(true));
  it("EN-DI-03 ecuación x²=4",()=>expect(parseExpression("x^{2}=4").isEquation).toBe(true));
  it("EN-DI-04 inecuación",()=>expect(parseExpression("x^{2}>4").isInequality).toBe(true));
  it("EN-DI-05 valor absoluto <=2",()=>expect(parseExpression("\\lvert x-1\\rvert\\leq2").isInequality).toBe(true));
  it("EN-DI-06 inecuación doble estricta",()=>{
    expect(detectChainedInequality("3<x<7")).toEqual({
      leftClause:"3<x", rightClause:"x<7", variable:"x"
    });
  });
  it("EN-DI-06 inecuación doble cerrada",()=>{
    expect(detectChainedInequality("3\\le x\\le7")).toEqual({
      leftClause:"3<=x", rightClause:"x<=7", variable:"x"
    });
  });
});
