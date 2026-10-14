import { describe, expect, it } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { compileNumeric } from "../src/engine/numericFallback";

const rows = fixture.trim().split("\n").map(line => JSON.parse(line));
const byId = Object.fromEntries(rows.map(row => [row.id, row]));

describe("Syntax309 SY-E initial exponent witnesses", () => {
  it("SY-E-01: two to a braced two-digit exponent is 1024", () => {
    const row = byId["SY-E-01"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("2^{10}");
    const parsed = parseExpression(row.entrada).algebrite;
    const actual = compileNumeric(parsed, "__unused__")(0);
    expect(Number.isFinite(actual), "SY-E-01 parsed=" + parsed).toBe(true);
    expect(actual).toBe(1024);
  });
});
