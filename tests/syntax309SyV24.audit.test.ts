import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
const row = source.trim().split("\n").map(line => JSON.parse(line)).find(x => x.id === "SY-V-24");
describe("SY-V-24 complex modulus Lite", () => {
  it("evaluates original absolute-value LaTeX exactly and reenters", () => {
    expect(row.entrada).toBe("\\lvert3+4i\\rvert");
    expect(row.operacion).toBe("valor");
    expect(row.esperado).toBe("5");
    const parsed = parseExpression(row.entrada).algebrite;
    const raw = evaluate(parsed);
    expect(evaluate("(" + raw + ")-(5)")).toBe("0");
    expect(evaluate(parseExpression(raw).algebrite)).toBe("5");
  });
  it("distinguishes modulus from real part and sign of imaginary part", () => {
    for (const expr of ["\\lvert3-4i\\rvert", "\\lvert-3+4i\\rvert", "\\lvert-3-4i\\rvert"]) {
      const actual = evaluate(parseExpression(expr).algebrite);
      expect(evaluate("(" + actual + ")-5"), expr).toBe("0");
    }
    expect(evaluate(parseExpression("\\lvert5+12i\\rvert").algebrite)).toBe("13");
  });
});
