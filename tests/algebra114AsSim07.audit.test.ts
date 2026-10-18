import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";

describe("AS-SIM-07 original real absolute-value oracle", () => {
  it("checks sqrt(x*x)=abs(x) on negative and positive inputs", () => {
    const expr = parseExpression("sqrt(x^2)").algebrite;
    for (const x of [-7, -2, 0, 3, 8]) {
      const output = evaluate(expr.replace(/x/g, "(" + x + ")"));
      expect(compileNumeric(output, "__no_var__")(0)).toBeCloseTo(Math.abs(x), 9);
    }
  });
});
