import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
const row = source.trim().split("\n").map(line => JSON.parse(line)).find(x => x.id === "SY-V-25");
describe("SY-V-25 exponential evaluation under explicit x=0", () => {
  it("preserves the fixture and evaluates the supplied condition", () => {
    expect(row.entrada).toBe("\\mathrm{e}^{x}\\ \\text{con}\\ x=0");
    expect(row.esperado).toBe("1");
    const symbolic = parseExpression("\\mathrm{e}^{x}").algebrite;
    const substituted = symbolic.replace(/\bx\b/g, "(0)");
    expect(evaluate(substituted)).toBe("1");
    expect(evaluate(parseExpression("1").algebrite)).toBe("1");
  });
  it("does not silently discard x substitution", () => {
    const parsed = parseExpression("e^x").algebrite;
    const numeric = (n: number) => evaluate(parsed.replace(/\bx\b/g, "(" + n + ")"));
    expect(numeric(0)).toBe("1");
    expect(numeric(1)).not.toBe("1");
  });
});
