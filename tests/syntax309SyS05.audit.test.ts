import {describe,expect,it} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
import {evaluate} from "../src/engine/algebriteClient";
const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-S-05");
describe("SY-S-05 Spanish inverse sine",()=>{
 it("interprets the official fraction as a single function argument",()=>{
  expect(row.entrada).toBe(String.raw`\operatorname{arcsen}\frac{1}{2}`);
  expect(row.esperado).toBe(String.raw`\frac{\pi}{6}`);
  const parsed=parseExpression(row.entrada,"RAD");
  expect(parsed.freeVariables.filter(name=>name!=="pi")).toEqual([]);
  const actual=evaluate(parsed.algebrite);
  const expected=parseExpression(row.esperado,"RAD").algebrite;
  expect(evaluate("("+actual+")-("+expected+")")).toBe("0");
 });
 it("grouping does not change inverse sine",()=>{
  const original=parseExpression(row.entrada,"RAD");
  const grouped=parseExpression(String.raw`\operatorname{arcsen}\left(\frac{1}{2}\right)`,"RAD");
  expect(evaluate("("+evaluate(original.algebrite)+")-("+evaluate(grouped.algebrite)+")")).toBe("0");
 });
});