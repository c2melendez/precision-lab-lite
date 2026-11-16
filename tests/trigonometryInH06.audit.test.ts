import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { solveInequality } from "../src/engine/inequality";
import { parseExpression } from "../src/engine/parsing";

describe("TRIG-IN-H-06", () => {
  it("anchors the original row", () => {
    const source = new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url);
    const row = gunzipSync(readFileSync(source)).toString("utf8").split(/\r?\n/)
      .find(line => line.startsWith("| IN-H-06 |"));
    expect(row?.split("|").map(cell => cell.trim().replace(/^`|`$/g, "")).filter(Boolean))
      .toEqual([
        "IN-H-06",
        String.raw`\cosh(2x)\le 3`,
        String.raw`\left[-\ln\left(1+\sqrt{2}\right),\ \ln\left(1+\sqrt{2}\right)\right]`,
      ]);
  });

  it.each([
    ["cosh(2*x)<=3", "x"],
    [String.raw`\cosh(2x)\le 3`, "x"],
    ["3>=cosh(2*t)", "t"],
  ])("solves %s with both endpoints included", (input, variable) => {
    const parsed = parseExpression(input, "RAD");
    const result = solveInequality(parsed.algebrite, parsed.inequalityOperator!, variable);
    expect(result.resultText).toBe(`-log(1+sqrt(2)) <= ${variable} <= log(1+sqrt(2))`);
    expect(result.steps.at(-1)?.latex).toBe(String.raw`\left[-\ln(1+\sqrt{2}),\ln(1+\sqrt{2})\right]`);
  });

  it("checks equality and signs on either side of both endpoints", () => {
    const boundary = Math.log(1 + Math.sqrt(2));
    for (const sign of [-1, 1]) {
      expect(Math.cosh(2 * sign * boundary)).toBeCloseTo(3, 13);
      expect(Math.cosh(2 * sign * (boundary - 0.01))).toBeLessThan(3);
      expect(Math.cosh(2 * sign * (boundary + 0.01))).toBeGreaterThan(3);
    }
  });
});
