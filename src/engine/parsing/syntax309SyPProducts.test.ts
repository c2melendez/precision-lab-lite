import { describe, expect, it } from "vitest";
// The upstream algebrite package has no bundled TypeScript declarations.
// @ts-expect-error TS7016: runtime import is covered by the numeric assertion below.
import Algebrite from "algebrite";
import { parseExpression } from "./index";
import { tokenize } from "./tokenize";
import { insertImplicitMultiplication } from "./implicitMultiplication";

// SY-P-24/25: numeric witnesses for the original input, not an edited
// expression with explicit multiplication inserted in the fixture.
describe("Syntax309 SY-P-24/25 concatenated variable products", () => {
  for (const { id, expression, substitutions, expected } of [
    { id: "SY-P-24", expression: "xy", substitutions: { x: 2, y: 3 }, expected: 6 },
    { id: "SY-P-25", expression: "xyz", substitutions: { x: 2, y: 3, z: 5 }, expected: 30 },
  ]) {
    it(`${id}: original expression evaluates as product of its variables`, () => {
      const parsed = parseExpression(expression);
      expect(parsed.isEquation).toBe(false);
      expect(parsed.freeVariables).toEqual(Object.keys(substitutions));
      expect(parsed.algebrite).toBe(Object.keys(substitutions).join("*"));
      const substituted = Object.entries(substitutions).reduce(
        (expr, [name, value]) => expr.replace(new RegExp(name, "g"), String(value)),
        parsed.algebrite,
      );
      expect(Number(Algebrite.run(substituted))).toBe(expected);
      const tokens = insertImplicitMultiplication(tokenize(expression));
      expect(tokens.map(t => t.value).join("")).toBe(Object.keys(substitutions).join("*"));
    });
  }
});

describe("Syntax309 SY-P-24/25 independent numeric witnesses", () => {
  const witnesses = [
    { id: "SY-P-24", expression: "xy", values: { x: -4, y: 5 }, expected: -20 },
    { id: "SY-P-24", expression: "xy", values: { x: 0, y: 7 }, expected: 0 },
    { id: "SY-P-25", expression: "xyz", values: { x: -2, y: 3, z: 4 }, expected: -24 },
    { id: "SY-P-25", expression: "xyz", values: { x: 5, y: 0, z: 7 }, expected: 0 },
  ];
  for (const { id, expression, values, expected } of witnesses) {
    it(`${id}: ${expression} retains product semantics with ${JSON.stringify(values)}`, () => {
      const parsed = parseExpression(expression);
      const substituted = Object.entries(values).reduce(
        (expr, [symbol, value]) => expr.replace(new RegExp(symbol, "g"), String(value)),
        parsed.algebrite,
      );
      expect(Number(Algebrite.run(substituted))).toBe(expected);
    });
  }
});
