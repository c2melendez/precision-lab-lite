import { describe, expect, it } from "vitest";
import { toLatex } from "../src/engine/algebriteClient";

describe("natural logarithm LaTeX reentry", () => {
  it("prints the exact inverse-hyperbolic logarithm with a LaTeX operator", () => {
    const latex = toLatex("ln(1+sqrt(2))");
    expect(latex).toContain("\\ln");
    expect(latex).not.toContain("\\\\ln");
    expect(latex).not.toMatch(/^ln/);
  });
});
