import { describe, expect, it } from "vitest";
import cases from "../qa/certification/syntax309_cases.jsonl?raw";
import { splitFreeSystemLatex } from "../src/engine/parsing/systemSplit";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

describe("SY-Q-12 comma-separated systems", () => {
  it("splits the exact official fixture without modifying its operands", () => {
    const row = cases.split("\n").filter(Boolean).map(line => JSON.parse(line)).find(x => x.id === "SY-Q-12");
    expect(row.esperado).toBe("(x,y)=(2,1)");
    const equations = splitFreeSystemLatex(row.entrada);
    expect(equations).toEqual(["x+y=3", "x-y=1"]);
    const parsed = equations!.map(e => parseExpression(e));
    expect(parsed.every(e => e.isEquation)).toBe(true);
    for (const p of parsed) {
      const evaluated = p.algebrite.replace(/\bx\b/g, "(2)").replace(/\by\b/g, "(1)");
      expect(evaluate(evaluated)).toBe("0");
    }
  });
});
