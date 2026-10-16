import {describe,expect,it} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
import {evaluate} from "../src/engine/algebriteClient";
const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-S-08");
describe("SY-S-08 senh numeric oracle",()=>{
 it("evaluates the official hyperbolic sine alias",()=>{
  expect(row.entrada).toBe(String.raw`\operatorname{senh}1`);
  expect(row.esperado).toBe("1.175201194");
  const value=Number(evaluate(parseExpression(row.entrada,"RAD").algebrite));
  expect(Number.isFinite(value)).toBe(true);
  expect(Math.abs(value-Number(row.esperado))).toBeLessThan(5e-10);
 });
});
