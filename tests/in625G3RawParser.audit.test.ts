import { describe, it, expect } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { ErrorCode } from "../src/types";

describe("IN625 G3 — raw inputs canonicalizados por MathLive", () => {
  const rawCases = [
    ["EN-ER-05", "2^"],
    ["EN-ER-15", "\\foo{x}"],
    ["EN-ER-19", "{x+1"],
    ["EN-ER-20", "x+1}"],
    ["EN-ER-26", "=3"],
    ["EN-ER-27", "x^{}"],
    ["EN-ER-31", "\\text{hola}"],
  ] as const;

  for (const [id, input] of rawCases) {
    it(id + " rechaza la entrada cruda antes del CAS", () => {
      expect(() => parseExpression(input)).toThrowError(
        expect.objectContaining({ code: ErrorCode.PARSE_ERROR }),
      );
    });
  }
});
