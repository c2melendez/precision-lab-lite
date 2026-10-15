import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";

const row = source.trim().split("\n").map(line => JSON.parse(line)).find(x => x.id === "SY-V-27");

describe("SY-V-27 ASCII pi constant convention — Lite", () => {
  it("preserves the official ambiguous source and declares the reserved constant", () => {
    expect(row.entrada).toBe("pi");
    expect(row.operacion).toBe("convencion");
    expect(row.nota).toMatch(/declarar/);
    expect(parseExpression("pi").algebrite).toBe("pi");
    expect(parseExpression("pi").algebrite).toBe(parseExpression("\\pi").algebrite);
  });
  it("keeps an explicit product distinct from the reserved constant", () => {
    const explicit = parseExpression("p*i").algebrite;
    expect(explicit).toContain("*");
    expect(explicit).not.toBe(parseExpression("pi").algebrite);
  });
});
