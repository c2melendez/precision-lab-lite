import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { solveInequality } from "../src/engine/inequality";
import { parseExpression } from "../src/engine/parsing";

describe("TRIG-IN-H-01", () => {
  it("anchors the frozen source row", () => {
    const path = new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url);
    const row = gunzipSync(readFileSync(path)).toString("utf8").split(/\r?\n/)
      .find(line => line.startsWith("| IN-H-01 |"));
    expect(row?.split("|").map(cell => cell.trim().replace(/^`|`$/g, "")).filter(Boolean))
      .toEqual(["IN-H-01", String.raw`\sinh x>0`, String.raw`(0,\infty)`]);
  });

  it.each([
    ["sinh(x)>0", "x"],
    [String.raw`\sinh x>0`, "x"],
    ["0<sinh(t)", "t"],
  ])("solves %s with a strict lower boundary", (input, variable) => {
    const parsed = parseExpression(input, "RAD");
    const result = solveInequality(parsed.algebrite, parsed.inequalityOperator!, variable);
    expect(result.resultText).toBe(`${variable} > 0`);
    expect(result.steps.at(-1)?.latex).toBe(String.raw`\left(0,\infty\right)`);
  });
});
