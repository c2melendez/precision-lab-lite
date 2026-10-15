import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
const row = source.trim().split("\n").map(line => JSON.parse(line)).find(x => x.id === "SY-V-28");
describe("SY-V-28 Greek alpha symbolic addition", () => {
 it("preserves the official fixture and simplifies equal Greek symbols", () => {
   expect(row.entrada).toBe("\\alpha+\\alpha");
   expect(row.esperado).toBe("2\\alpha");
   const parsed = parseExpression(row.entrada).algebrite;
   expect(parsed).toBe("alpha+alpha");
   const actual = evaluate(parsed);
   expect(actual.replace(/\s/g, "")).toBe("2*alpha");
   expect(evaluate(parseExpression(actual).algebrite).replace(/\s/g, "")).toBe("2*alpha");
 });
 it("does not merge unlike Greek variables", () => {
   const unlike = evaluate(parseExpression("\\alpha+\\beta").algebrite);
   expect(unlike).not.toBe("2*alpha");
 });
});
