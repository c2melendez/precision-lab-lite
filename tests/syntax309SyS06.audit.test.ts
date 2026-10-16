import {describe,expect,it} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
import {evaluate} from "../src/engine/algebriteClient";
const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-S-06");
describe("SY-S-06 Spanish arctg",()=>{
 it("maps official alias to exact inverse tangent in radians",()=>{
  expect(row.entrada).toBe(String.raw`\operatorname{arctg}1`);
  expect(row.esperado).toBe(String.raw`\frac{\pi}{4}`);
  const actual=evaluate(parseExpression(row.entrada,"RAD").algebrite);
  const expected=parseExpression(row.esperado,"RAD").algebrite;
  expect(evaluate("("+actual+")-("+expected+")")).toBe("0");
 });
});
