import { describe, expect, it } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { ErrorCode } from "../src/types";

const rows = Object.fromEntries(fixture.trim().split("\n").map(line => {
  const row = JSON.parse(line);
  return [row.id, row];
}));

describe("Syntax309 SY-E-11..13 source-level exponent validation", () => {
  it("rejects a second superscript on the same ungrouped base with a clear error", () => {
    const row = rows["SY-E-11"];
    expect(row.operacion).toBe("error");
    expect(row.entrada).toBe("x^{2}^{3}");
    expect(() => parseExpression(row.entrada)).toThrowError(
      expect.objectContaining({ code: ErrorCode.PARSE_ERROR, message: expect.stringMatching(/superíndice|exponente/i) }),
    );
  });
  it.each(["SY-E-09", "SY-E-10"])("%s preserves explicit grouping", id => {
    expect(() => parseExpression(rows[id].entrada)).not.toThrow();
  });
  it.each(["x^{2} ^{3}", "x^{2^{3}}^{4}", "x^{y^{2}^{3}}"])("rejects repeated superscripts in %s", input => {
    expect(() => parseExpression(input)).toThrowError(expect.objectContaining({ code: ErrorCode.PARSE_ERROR, message: expect.stringMatching(/superíndice|exponente/i) }));
  });

  it("SY-E-12: rejects the official empty exponent with a clear error", () => {
    const row = rows["SY-E-12"];
    expect(row.operacion).toBe("error");
    expect(row.entrada).toBe("x^{}");
    expect(() => parseExpression(row.entrada)).toThrowError(expect.objectContaining({ code: ErrorCode.PARSE_ERROR, message: expect.stringMatching(/vacío|vacio|exponente/i) }));
  });
  it("SY-E-13: rejects the official exponent without a base", () => {
    const row = rows["SY-E-13"];
    expect(row.operacion).toBe("error");
    expect(row.entrada).toBe("^{2}");
    expect(() => parseExpression(row.entrada)).toThrowError(expect.objectContaining({ code: ErrorCode.PARSE_ERROR, message: expect.stringMatching(/base|operando|izquierdo/i) }));
  });
  it.each(["x^{0}", "2^{0}", "x^{-1}", "2^{3^{2}}", "(x^{2})^{3}"])("preserves the valid exponent %s", input => {
    expect(() => parseExpression(input)).not.toThrow();
  });

});
