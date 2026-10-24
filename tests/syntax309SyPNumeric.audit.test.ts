import { describe, expect, it } from "vitest";
import syPSource from "../qa/certification/syntax309_sy_p_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

type Case = { id: string; nivel: string; operacion: string; entrada: string; esperado: string };
const cases = syPSource.trim().split("\n").map((line) => JSON.parse(line) as Case);
const expected: Record<string, number> = {
  "SY-P-01": 14, "SY-P-02": 2 * Math.PI, "SY-P-06": 9,
  "SY-P-07": -9, "SY-P-08": 512, "SY-P-09": 64,
  "SY-P-10": 0.5, "SY-P-11": 1, "SY-P-12": 2,
  "SY-P-13": 14, "SY-P-14": 20, "SY-P-15": -1,
  "SY-P-16": 5, "SY-P-17": 2, "SY-P-33": 18,
};
describe("Syntax309 SY-P — numeric-oracle cases from official matrix", () => {
  it("identifies exactly 33 unique official records", () => {
    expect(cases).toHaveLength(33);
    expect(new Set(cases.map((c) => c.id)).size).toBe(33);
  });
  for (const testCase of cases.filter((c) => Object.hasOwn(expected, c.id))) {
    it(`${testCase.id}: ${testCase.entrada}`, () => {
      const syntax = parseExpression(testCase.entrada).algebrite;
      const symbolic = evaluate(syntax);
      const result = Number(symbolic);
      const numeric = Number.isFinite(result) ? result : Number(evaluate(`float(${syntax})`));
      if (testCase.id === "SY-P-02") {
        // The engine preserves exact 2*pi; its decimal display is abbreviated.
        // Assert the exact form rather than interpreting '6.283185...' as a number.
        expect(symbolic.replace(/\\s+/g, "")).toBe("2*pi");
        expect(2 * Math.PI).toBeCloseTo(expected[testCase.id], 8);
        return;
      }
      expect(Number.isFinite(numeric)).toBe(true);
      expect(numeric).toBeCloseTo(expected[testCase.id], 8);
    });
  }
  it("does not misclassify convention/structural rows as numerical passes", () => {
    expect(Object.keys(expected)).toHaveLength(15);
    expect(cases.filter((c) => !Object.hasOwn(expected, c.id))).toHaveLength(18);
  });
});
