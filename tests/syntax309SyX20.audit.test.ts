import { describe, expect, it } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { ErrorCode } from "../src/types";

describe("SY-X-20 — invalid supplementary Unicode character", () => {
  it("preserves the original fixture, rejects it clearly, and parses a valid recovery", () => {
    const row = fixture.trim().split("\n").map(line => JSON.parse(line))
      .find(row => row.id === "SY-X-20");
    expect(row.entrada).toBe("😀+1");
    expect([...row.entrada].map(char => char.codePointAt(0))).toEqual([0x1f600, 0x2b, 0x31]);
    expect(row.esperado).toBe("error claro de carácter no válido");
    expect(() => parseExpression(row.entrada)).toThrowError(
      expect.objectContaining({
        code: ErrorCode.PARSE_ERROR,
        message: expect.stringMatching(/car[aá]cter|inv[aá]lid|permitid|reconocid/i),
      }),
    );
    expect(() => parseExpression("2+3")).not.toThrow();
    expect(() => parseExpression("5")).not.toThrow();
  });
});
