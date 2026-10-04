import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

const parse=(s:string)=>parseExpression(s).algebrite.replace(/\s+/g,"");
const evalExpr=(s:string)=>evaluate(parseExpression(s).algebrite).replace(/\s+/g,"");

describe("IN625 Parte D / D1 Decimales y separadores — invariantes automáticos",()=>{
  it("EN-NM-01 3.5",()=>expect(evalExpr("3.5")).toMatch(/^3\.5/));
  it("EN-NM-03 .5 -> 0.5",()=>expect(evalExpr(".5")).toMatch(/^0?\.5|^1\/2$/));
  it("EN-NM-05 5. -> 5",()=>expect(evalExpr("5.")).toBe("5"));
  it("EN-NM-06 -.5 -> -0.5",()=>expect(evalExpr("-.5")).toMatch(/^-0?\.5|^-1\/2$/));
  it("EN-NM-07 0.50 -> 0.5",()=>expect(evalExpr("0.50")).toMatch(/^0?\.5|^1\/2$/));
  it("EN-NM-08 007 is decimal seven, never octal",()=>expect(evalExpr("007")).toBe("7"));
  it("EN-NM-09 MathLive explicit decimal comma 3{,}5",()=>expect(evalExpr("3{,}5")).toMatch(/^3\.5/));
  it("EN-NM-12 thin-space thousands",()=>expect(evalExpr("1\\,234.56")).toMatch(/^1234\.56/));
  it("EN-NM-23 rejects two decimal points",()=>expect(()=>parse("1.2.3")).toThrow());
  it("EN-NM-24 rejects repeated decimal point",()=>expect(()=>parse("3..5")).toThrow());
  it("EN-NM-25 grouped thousands by space -> 1000",()=>expect(evalExpr("1 000")).toBe("1000"));
  it("EN-NM-26 ordinary digit space is not silently concatenated",()=>expect(()=>parse("3 4")).toThrow());
});
describe("IN625 D1 — configuración regional/manual",()=>{
  for(const id of ["02","04","10","11","13","14","15","16","17","18","19","20","21","22"]){
    it.todo(`EN-NM-${id} locale/config dependent`);
  }
});
