import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
const ev=(s:string)=>evaluate(parseExpression(s).algebrite).replace(/\s+/g,"");

describe("IN625 Parte D / D2 Notación científica y porcentaje",()=>{
  it("EN-CI-01 1.5×10^3",()=>expect(ev("1.5\\times10^{3}")).toMatch(/^1500(?:\.0+)?$/));
  it("EN-CI-02 1.5·10^3",()=>expect(ev("1.5\\cdot10^{3}")).toMatch(/^1500(?:\.0+)?$/));
  it("EN-CI-03 negative scientific exponent",()=>expect(ev("1.5\\times10^{-3}")).toMatch(/^(?:0\.0015(?:0+)?|3\/2000)$/));
  it("EN-CI-05 e-notation lowercase",()=>expect(ev("1.5e3")).toMatch(/^1500(?:\.0+)?$/));
  it("EN-CI-06 2e3",()=>expect(ev("2e3")).toBe("2000"));
  it("EN-CI-07 signed e-notation",()=>{
    expect(ev("1e-3")).toMatch(/^(?:0\.001(?:0+)?|1\/1000)$/);
    expect(ev("1E+3")).toBe("1000");
  });
  it("EN-CI-08 chained scientific notation",()=>expect(ev("2\\times10^{-3}\\times3\\times10^{2}")).toMatch(/^(?:0\.6(?:0+)?|3\/5)$/));
  it("EN-CI-09 huge positive exponent stays exact",()=>expect(ev("1\\times10^{400}")).toSatisfy((o:string)=>! /Infinity|NaN/i.test(o) && (o.length > 300 || /10\^\(?400\)?|1e\+?400/i.test(o))));
  it("EN-CI-10 huge negative exponent stays exact",()=>expect(ev("1\\times10^{-400}")).toSatisfy((o:string)=>o !== "0" && ! /Infinity|NaN/i.test(o) && (o.length > 300 || /10\^\(?-400\)?|1e-400/i.test(o))));
  it("EN-PC-01 50 percent",()=>expect(ev("50\\%")).toMatch(/^1\/2$|^0\.5$/));
  it("EN-PC-02 15 percent",()=>expect(ev("15\\%")).toMatch(/^0\.15|^3\/20$/));
  it("EN-PC-03 plain 15%",()=>expect(ev("15%")).toMatch(/^0\.15|^3\/20$/));
  it("EN-PC-04 200*15%",()=>expect(ev("200\\cdot15\\%")).toBe("30"));
  it("EN-PC-05 additive percent follows C7 arithmetic convention",()=>expect(ev("100+15\\%")).toMatch(/^100\.15|^2003\/20$/));
  it("EN-PC-06 explicit commercial increase",()=>expect(ev("100\\cdot\\left(1+15\\%\\right)")).toBe("115"));
  it("EN-PC-07 percent boundaries",()=>{
    expect(ev("0.5\\%")).toMatch(/^0\.005|^1\/200$/);
    expect(ev("100\\%")).toBe("1");
  });
  it("EN-PC-08 symbolic percent",()=>expect(parseExpression("x\\%").algebrite.replace(/\s+/g,"")).toMatch(/x.*100|100.*x/));
  it.todo("EN-PC-09 7%3 ambiguous postfix percent requires warning or explicit error at UI layer");
  it.todo("EN-CI-04 Avogadro-sized exact rendering requires display-layer verification");
});
