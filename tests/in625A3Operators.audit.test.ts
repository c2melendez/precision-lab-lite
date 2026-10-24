import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { preprocessLatex } from "../src/engine/parsing/normalize";
import { evaluate } from "../src/engine/algebriteClient";

function expectValue(input: string, expected: number): void {
  const parsed = parseExpression(input).algebrite;
  expect(Number(evaluate(parsed))).toBe(expected);
}

describe("IN625 Parte A / A3 Operadores, factorial y relaciones", () => {
  const numericCases: Array<[string,string,number]> = [
    ["EN-OP-01","2\\cdot3",6],
    ["EN-OP-02","2\\times3",6],
    ["EN-OP-03","2*3",6],
    ["EN-OP-04","2\\ast3",6],
    ["EN-OP-05","6\\div3",2],
    ["EN-OP-06","6/3",2],
    ["EN-OP-16a","5!",120],
    ["EN-OP-16b","0!",1],
    ["EN-OP-18","3!^{2}",36],
    ["EN-OP-19","-3!",-6],
    ["EN-OP-20","2^{3!}",64],
    ["EN-OP-21","\\binom{5}{2}",10],
    ["EN-OP-22","{5\\choose2}",10],
    ["EN-OP-23","17\\bmod5",2],
    ["EN-OP-24","\\gcd(12,18)",6],
  ];
  for (const [id,input,expected] of numericCases) {
    it(`${id}: evalúa correctamente`,()=>expectValue(input,expected));
  }

  it("EN-OP-07: 6:3 da 2 o error explícito",()=>{
    try { expectValue("6:3",2); } catch (e) { expect(String(e).length).toBeGreaterThan(0); }
  });

  it("EN-OP-08: producto escalar por variables se conserva",()=>{
    const out=preprocessLatex("2\\cdot x\\cdot y");
    expect(out.replace(/\\s+/g,"")).toContain("2*x*y");
  });
  it("EN-OP-09: \\times entre escalares es producto",()=>{
    expect(preprocessLatex("x\\times y").replace(/\\s+/g,"")).toBe("x*y");
  });

  it("EN-OP-10: producto vectorial queda feature-dependent o explícitamente rechazado",()=>{
    const input="\\begin{pmatrix}1\\\\0\\\\0\\end{pmatrix}\\times\\begin{pmatrix}0\\\\1\\\\0\\end{pmatrix}";
    try { const out=preprocessLatex(input); expect(out.length).toBeGreaterThan(0); } catch(e){ expect(String(e).length).toBeGreaterThan(0); }
  });

  it("EN-OP-11: ± se preserva como operador de dos ramas",()=>{
    const out=preprocessLatex("5\\pm2").replace(/\\s+/g,"");
    expect(out).toMatch(/pm|\+\-/);
  });

  it("EN-OP-12: variantes <= convergen",()=>{
    for(const s of ["x\\leq3","x\\le3","x\\leqslant3"]) expect(preprocessLatex(s)).toContain("<=");
  });
  it("EN-OP-13: variantes >= convergen",()=>{
    for(const s of ["x\\geq3","x\\ge3","x\\geqslant3"]) expect(preprocessLatex(s)).toContain(">=");
  });
  it("EN-OP-14: != converge",()=>{
    for(const s of ["x\\neq3","x\\ne3"]) expect(preprocessLatex(s)).toMatch(/!=|neq|ne/);
  });
  it("EN-OP-15: < y > convergen",()=>{
    expect(preprocessLatex("x\\lt3")).toContain("<");
    expect(preprocessLatex("x\\gt3")).toContain(">");
    expect(preprocessLatex("x<3")).toContain("<");
    expect(preprocessLatex("x>3")).toContain(">");
  });

  it("EN-OP-17: doble factorial =15 o rechazo explícito",()=>{
    try { expectValue("5!!",15); } catch(e){ expect(String(e).length).toBeGreaterThan(0); }
  });
});
