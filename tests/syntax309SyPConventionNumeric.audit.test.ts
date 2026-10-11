import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_sy_p_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

type Case = { id: string; entrada: string; operacion: string };
const byId = Object.fromEntries(source.trim().split("\n").map(line => {
  const row = JSON.parse(line) as Case;
  return [row.id, row];
}));

describe("Syntax309 SY-P — Lite numeric precedence convention", () => {
  for (const [id, expected] of [["SY-P-18", 16], ["SY-P-19", 9]] as const) {
    it(`${id}: verify actual implicit-division interpretation numerically`, () => {
      const row = byId[id];
      expect(row.operacion).toBe("convencion");
      const parsed = parseExpression(row.entrada).algebrite;
      const result = Number(evaluate(parsed));
      expect(Number.isFinite(result)).toBe(true);
      expect(result).toBeCloseTo(expected, 9);
    });
  }
  it("SY-P-21: 1/2x at x=6 must have an explicit numeric interpretation", () => {
    const row = byId["SY-P-21"];
    expect(row.operacion).toBe("convencion");
    const parsed = parseExpression(row.entrada).algebrite;
    const substituted = parsed.replace(/\\bx\\b/g, "(6)");
    const exact = evaluate(substituted);
    const direct = Number(exact);
    const result = Number.isFinite(direct) ? direct : Number(evaluate(`float(${substituted})`));
    expect(Number.isFinite(result), `SY-P-21 parsed=${parsed}, substituted=${substituted}, exact=${exact}`).toBe(true);
    expect(result).toBeCloseTo(3, 9);
  });
});
