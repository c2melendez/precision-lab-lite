import { describe, it, expect } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { ErrorCode } from "../src/types";

describe("IN625 G3 — raw inputs canonicalizados por MathLive", () => {
  const rawCases = [
    ["EN-ER-01", "(2+3"],
    ["EN-ER-02", "2+3)"],
    ["EN-ER-03", "\\frac{1}{"],
    ["EN-ER-04", "\\frac{1}"],
    ["EN-ER-05", "2^"],
    ["EN-ER-06", "^2"],
    ["EN-ER-07", "2+"],
    ["EN-ER-08", "*3"],
    ["EN-ER-09", "2*/3"],
    ["EN-ER-12", "()"],
    ["EN-ER-13", "\\sin"],
    ["EN-ER-14", "\\sin()"],
    ["EN-ER-15", "\\foo{x}"],
    ["EN-ER-16", "\\left(x+1\\right]"],
    ["EN-ER-17", "\\left(x+1"],
    ["EN-ER-18", "x+1\\right)"],
    ["EN-ER-19", "{x+1"],
    ["EN-ER-20", "x+1}"],
    ["EN-ER-25", "x="],
    ["EN-ER-26", "=3"],
    ["EN-ER-27", "x^{}"],
    ["EN-ER-28", "\\frac{}{2}"],
    ["EN-ER-29", "\\sqrt{}"],
    ["EN-ER-30", "\\placeholder{}"],
    ["EN-ER-31", "\\text{hola}"],
    ["EN-ER-33", "x++"],
  ] as const;

  for (const [id, input] of rawCases) {
    it(id + " rechaza la entrada cruda antes del CAS", () => {
      expect(() => parseExpression(input)).toThrowError(
        expect.objectContaining({ code: ErrorCode.PARSE_ERROR }),
      );
    });
  }
});
