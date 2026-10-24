import {describe,expect,it} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
import {evaluate} from "../src/engine/algebriteClient";
const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-S-07");
describe("SY-S-07 Spanish arcctg",()=>{
 it("preserves exact inverse cotangent in radians",()=>{
  expect(row.entrada).toBe(String.raw`\operatorname{arcctg}1`);
  expect(row.esperado).toBe(String.raw`\frac{\pi}{4}`);
  const actual=evaluate(parseExpression(row.entrada,"RAD").algebrite);
  const expected=evaluate(parseExpression(row.esperado,"RAD").algebrite);
  expect(evaluate("("+actual+")-("+expected+")")).toBe("0");
 });
});
