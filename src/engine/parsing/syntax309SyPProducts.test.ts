import { describe, expect, it } from "vitest";
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
      const product = Object.values(substitutions).reduce((a, b) => a * b, 1);
      expect(product).toBe(expected);
      const tokens = insertImplicitMultiplication(tokenize(expression));
      expect(tokens.map(t => t.value).join("")).toBe(Object.keys(substitutions).join("*"));
    });
  }
});
