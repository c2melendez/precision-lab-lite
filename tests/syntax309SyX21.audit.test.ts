import { describe, expect, it } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { ErrorCode } from "../src/types";

const row = fixture.trim().split("\n").map(line => JSON.parse(line))
  .find(candidate => candidate.id === "SY-X-21");

describe("SY-X-21 — zero-width Unicode between arithmetic tokens", () => {
  it("retains the official Unicode fixture, returns 3 or a clear parse rejection, and recovers", () => {
    expect(row.entrada).toBe("1\u200b+\u200b2");
    expect([...row.entrada].map(char => char.codePointAt(0))).toEqual([49, 0x200b, 43, 0x200b, 50]);
    expect(row.esperado).toBe("3\\ \\text{o error claro}");
    try {
      const parsed = parseExpression(row.entrada);
      expect(parsed.isEquation).toBe(false);
      expect(parsed.algebrite).toBe("1+2");
    } catch (error) {
      expect(error).toEqual(expect.objectContaining({
        code: ErrorCode.PARSE_ERROR,
        message: expect.stringMatching(/car[aá]cter|inv[aá]lid|reconocid|permitid|sintaxis/i),
      }));
    }
    expect(parseExpression("2+3").algebrite).toBe("2+3");
  });
});
