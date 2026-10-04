import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

const ev=(s:string)=>evaluate(parseExpression(s).algebrite).replace(/\s+/g,"");
const zeroEq=(s:string)=>expect(ev(s)).toMatch(/^0(?:\.0+)?$/);

describe("IN625 Parte D / D3 Precisión de entrada numérica",()=>{
  it("EN-PN-01 0.1+0.2 exact",()=>expect(ev("0.1+0.2")).toMatch(/^(?:0\.3(?:0+)?|3\/10)$/));
  it("EN-PN-02 0.1*3 exact",()=>expect(ev("0.1\\cdot3")).toMatch(/^(?:0\.3(?:0+)?|3\/10)$/));
  it("EN-PN-03 4.35*100",()=>expect(ev("4.35\\cdot100")).toMatch(/^435(?:\.0+)?$/));
  it("EN-PN-04 1.005*1000",()=>expect(ev("1.005\\cdot1000")).toMatch(/^1005(?:\.0+)?$/));
  it("EN-PN-05 1.1^2",()=>expect(ev("1.1^{2}")).toMatch(/^(?:1\.21(?:0+)?|121\/100)$/));
  it("EN-PN-06 cancellation is exact zero",()=>expect(ev("0.3-0.1-0.2")).toMatch(/^0(?:\.0+)?$/));
  it("EN-PN-07 thirds sum to one",()=>expect(ev("1/3+1/3+1/3")).toBe("1"));
  it("EN-PN-08 integer above 2^53 preserved",()=>expect(ev("9007199254740993")).toBe("9007199254740993"));
  it("EN-PN-09 integer above 2^53 arithmetic exact",()=>expect(ev("9007199254740993+1")).toBe("9007199254740994"));
  it("EN-PN-10 20-digit carry exact",()=>expect(ev("99999999999999999999+1")).toBe("100000000000000000000"));
  it("EN-PN-11 30-digit literal preserved",()=>expect(ev("123456789012345678901234567890")).toBe("123456789012345678901234567890"));
  it("EN-PN-12 long decimal retains all significant digits",()=>expect(ev("0.1234567890123456789012345\\cdot10^{25}")).toBe("1234567890123456789012345"));
  it("EN-PN-13 decimal equality exact",()=>zeroEq("0.1+0.2=0.3"));
  it("EN-PN-14 sqrt identity exact",()=>zeroEq("\\sqrt{2}^{2}=2"));
  it.todo("EN-PN-15 repeating decimal 0.overline(3): support or clear error");
  it.todo("EN-PN-16 repeating decimal 0.overline(142857): support or clear error");
  it.todo("EN-PN-17 mixed repeating decimal 0.1overline(6): support or clear error");
  it("EN-PN-18 extreme exponent cancellation",()=>expect(ev("10^{400}\\cdot10^{-400}")).toBe("1"));
  it("EN-PN-19 subnormal-sized exact rational never zero",()=>expect(ev("2^{-1074}")).not.toBe("0"));
  it("EN-PN-20 2^1024 exact integer",()=>{
    const o=ev("2^{1024}");
    expect(o).not.toMatch(/Infinity|NaN/i);
    expect(o.length).toBe(309);
    expect(o.startsWith("17976931348623159")).toBe(true);
  });
});
