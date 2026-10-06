import { describe, expect, it } from "vitest";
import { preprocessLatex } from "../src/engine/parsing/normalize";
const n=(s:string)=>preprocessLatex(s).replace(/\s+/g,"");

describe("IN625 F3a — ASCII/Python básico 01..10",()=>{
  it("EN-AS-01/02 potencias ASCII/Python",()=>{
    expect(n("x^2+1")).toMatch(/x\^\(?2\)?\+1/);
    const py=n("x**2+1");
    expect(py.includes("**") || py.includes("^")).toBe(true);
  });
  it("EN-AS-03 sqrt",()=>expect(n("sqrt(16)")).toContain("sqrt(16)"));
  it("EN-AS-04 potencias parentizadas",()=>{
    expect(n("2^(10)")).toContain("2^(10)");
    expect(n("2^(-1)")).toContain("2^(-1)");
  });
  it("EN-AS-05/06 expresiones exponenciales",()=>{
    expect(n("x^(1/2)")).toContain("x^(1/2)");
    expect(n("e^(-x^2)")).toContain("e^(-x^2)");
  });
  it("EN-AS-07 constantes ascii",()=>{
    expect(n("pi")).toBe("pi");
    for(const s of ["inf","oo","infinity"]) expect(()=>n(s)).not.toThrow();
  });
  it("EN-AS-08 logs básicos",()=>{
    expect(n("ln(1)")).toContain("ln(1)");
    expect(n("log(100)")).toMatch(/log/);
  });
  it("EN-AS-09 log base segundo argumento",()=>{
    expect(n("log(100,10)")).toMatch(/log/);
    expect(n("log(8,2)")).toMatch(/log/);
  });
  it("EN-AS-10 log10/log2",()=>{
    expect(n("log10(1000)")).toContain("log10");
    expect(()=>n("log2(8)")).not.toThrow();
  });
});
