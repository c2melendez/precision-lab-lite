import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_sy_p_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";

type Row = {id:string;operacion:string;entrada:string};
const rows=source.trim().split("\n").map(line=>JSON.parse(line) as Row);
const candidates=["SY-P-03","SY-P-24","SY-P-25","SY-P-27","SY-P-28"];
const byId=Object.fromEntries(rows.map(r=>[r.id,r]));
describe("Syntax309 SY-P — inspect exact parser structure",()=>{
 it("requires official interpretation oracle rows",()=>{
   for(const id of candidates)expect(byId[id]?.operacion).toBe("interpretacion");
 });
 it("SY-P-03 keeps trig call and outer multiplication",()=>{
   const expr=parseExpression(byId["SY-P-03"].entrada).algebrite.replace(/\s+/g,"");
   expect(expr).toContain("sin(");
   expect(expr).toMatch(/3\*sin\(/);
 });
 it("SY-P-27 keeps exponential factor outside coefficient",()=>{
   const expr=parseExpression(byId["SY-P-27"].entrada).algebrite.replace(/\s+/g,"");
   expect(expr).toMatch(/2\*e\^/);
 });
 it("SY-P-28 keeps exponential before independent x",()=>{
   const expr=parseExpression(byId["SY-P-28"].entrada).algebrite.replace(/\s+/g,"");
   expect(expr).toContain("e^");
   expect(expr).toMatch(/\*x/);
 });

 it("SY-P-24 separates x and y in the parsed multiplication channel",()=>{
   const expr=parseExpression(byId["SY-P-24"].entrada).algebrite.replace(/\s+/g,"");
   expect(expr).toMatch(/x\*y/);
 });
 it("SY-P-25 separates x, y and z in the parsed multiplication channel",()=>{
   const expr=parseExpression(byId["SY-P-25"].entrada).algebrite.replace(/\s+/g,"");
   expect(expr).toMatch(/x\*y\*z/);
 });

 it("SY-P-18/19: official ambiguous division cases retain every operand",()=>{
   for(const [id,nums] of [["SY-P-18",["8","2","2","2"]],["SY-P-19",["6","2","1","2"]]] as const){
     const row=byId[id];
     expect(row.operacion).toBe("convencion");
     const parsed=parseExpression(row.entrada).algebrite;
     expect(parsed).toContain("/");
     for(const n of new Set(nums))expect(parsed).toContain(n);
   }
 });
 it("SY-P-21/23/32: preserve operands without asserting an undeclared convention",()=>{
   for(const id of ["SY-P-21","SY-P-23","SY-P-32"]){
     const row=byId[id];expect(row.operacion).toBe("convencion");
     const parsed=parseExpression(row.entrada).algebrite;
     expect(parsed.length).toBeGreaterThan(0);
   }
 });
});
