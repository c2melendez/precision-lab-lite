import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
const row = source.trim().split("\n").map(line => JSON.parse(line)).find(x => x.id === "SY-V-23");
describe("SY-V-23 conjugate Lite", () => {
  it("evaluates the original source and reentry", () => {
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("\\overline{3+4i}");
    const raw = evaluate(parseExpression(row.entrada).algebrite);
    const expected = evaluate(parseExpression("3-4i").algebrite);
    expect(evaluate("(" + raw + ")-(" + expected + ")")).toBe("0");
    expect(evaluate("(" + parseExpression(raw).algebrite + ")-(" + expected + ")")).toBe("0");
  });
  it("controls the sign and negative real part", () => {
    for (const [source, expected] of [["\\overline{3-4i}", "3+4i"], ["\\overline{-2+5i}", "-2-5i"]] as const) {
      const actual = evaluate(parseExpression(source).algebrite);
      expect(evaluate("(" + actual + ")-(" + parseExpression(expected).algebrite + ")")).toBe("0");
    }
  });
});
