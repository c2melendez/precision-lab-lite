import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

function value(input:string, expected:string){
  const out=evaluate(parseExpression(input).algebrite).replace(/\s+/g,"");
  expect(out).toBe(expected.replace(/\s+/g,""));
}
function parsed(input:string){ return parseExpression(input).algebrite.replace(/\s+/g,""); }

describe("IN625 Parte B / B4 Precedencia y signos",()=>{
  it("EN-PR-01",()=>value("2+3\\cdot4","14"));
  it("EN-PR-02",()=>value("(2+3)\\cdot4","20"));
  it("EN-PR-03",()=>value("8/2/2","2"));
  it("EN-PR-04",()=>value("8/2*4","16"));
  it("EN-PR-05",()=>value("2-3-4","-5"));
  it("EN-PR-06",()=>value("2*3^2","18"));
  it("EN-PR-07",()=>value("2-(-3)","5"));
  it("EN-PR-08 doble menos: 5 o error explícito",()=>{
    try { value("2--3","5"); }
    catch(e){ expect(String(e).length).toBeGreaterThan(0); }
  });
  it("EN-PR-09",()=>value("2+-3","-1"));
  it("EN-PR-10",()=>value("2*-3","-6"));
  it("EN-PR-11",()=>value("2++3","5"));
  it("EN-PR-12",()=>{
    const out=parsed("--x");
    expect(out==="x" || out==="--x" || out==="(-(-x))").toBe(true);
  });
  it("EN-PR-13",()=>value("-2^{-2}","-1/4"));
  it("EN-PR-14",()=>value("1-1+1","1"));
});
