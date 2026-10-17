import { describe, it, expect } from "vitest";
import { parseExpression } from "../src/engine/parsing";

describe("SY-X-22: large integer input", () => {
  it("rejects excessive length clearly or preserves all decimal digits", () => {
    const digits = "9".repeat(10000);
    try {
      const result = parseExpression(digits + "+1");
      expect(result.algebrite).toContain(digits);
      expect(result.algebrite).not.toMatch(/[eE][+-]?[0-9]+/);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(String(error)).toMatch(/longitud|length|size|limit|caracter|expresi|parse|sintaxis/i);
    }
    expect(parseExpression("2+3").algebrite).toBe("2+3");
  });
});
