import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import fixture from "../qa/stem/arithmetic-pilot.json";

describe("STEM pilot: exact principal root and rational arithmetic", () => {
  it.each(fixture.cases)("$id", ({expression, expected}) => {
    const actual = evaluate(parseExpression(expression).algebrite).replace(/\s+/g, "");
    expect(actual).toBe(expected);
  });
});
