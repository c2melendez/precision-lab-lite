import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { ErrorCode } from "../src/types";

interface AppErr {
  code?: string;
  message?: string;
}

function algebriteOf(input: string, mode: "RAD" | "GRAD" = "RAD"): string {
  return parseExpression(input, mode).algebrite;
}

function numericOf(input: string, mode: "RAD" | "GRAD" = "RAD"): number {
  return compileNumeric(algebriteOf(input, mode), "__none__")(0);
}

function domainError(input: string, mode: "RAD" | "GRAD" = "RAD"): AppErr {
  try {
    evaluate(algebriteOf(input, mode));
  } catch (error) {
    return error as AppErr;
  }
  throw new Error(`expected a DOMAIN_ERROR for ${input} (${mode})`);
}

describe("AUD-SING-02 hyperbolic aliases are functions, not products", () => {
  it("arcsinh/arccosh/arctanh resolve to the inverse hyperbolic functions", () => {
    for (const input of ["arcsinh(1)", "arsinh(1)"]) {
      expect(algebriteOf(input)).toContain("asinh(");
      expect(algebriteOf(input)).not.toMatch(/\*h\*/);
      expect(numericOf(input)).toBeCloseTo(Math.asinh(1), 9);
    }
    for (const input of ["arccosh(2)", "arcosh(2)"]) {
      expect(algebriteOf(input)).toContain("acosh(");
      expect(algebriteOf(input)).not.toMatch(/\*h\*/);
      expect(numericOf(input)).toBeCloseTo(Math.acosh(2), 9);
    }
    for (const input of ["arctanh(0.5)", "artanh(0.5)"]) {
      expect(algebriteOf(input)).toContain("atanh(");
      expect(algebriteOf(input)).not.toMatch(/\*h\*/);
      expect(numericOf(input)).toBeCloseTo(Math.atanh(0.5), 9);
    }
  });

  it("reciprocal inverse hyperbolics resolve through acoth/acsch/asech", () => {
    expect(algebriteOf("arccoth(2)")).toContain("atanh(");
    expect(numericOf("arccoth(2)")).toBeCloseTo(Math.atanh(1 / 2), 9);
    expect(algebriteOf("arccsch(2)")).toContain("asinh(");
    expect(numericOf("arccsch(2)")).toBeCloseTo(Math.asinh(1 / 2), 9);
    expect(algebriteOf("arcsech(0.5)")).toContain("acosh(");
  });

  it("operatorname spellings follow the same mapping", () => {
    expect(algebriteOf("\\operatorname{arccosh}(2)")).toContain("acosh(");
    expect(algebriteOf("\\operatorname{arctanh}(0.5)")).toContain("atanh(");
  });
});

describe("AUD-SING-02 degree-mode reciprocal trigonometry", () => {
  it("sec/csc/cot convert their angle in GRAD mode", () => {
    expect(numericOf("cot(45)", "GRAD")).toBeCloseTo(1, 9);
    expect(numericOf("csc(30)", "GRAD")).toBeCloseTo(2, 9);
    expect(numericOf("sec(60)", "GRAD")).toBeCloseTo(2, 9);
  });

  it("sec(90) in GRAD mode is undefined and raises DOMAIN_ERROR", () => {
    const err = domainError("sec(90)", "GRAD");
    expect(err.code).toBe(ErrorCode.DOMAIN_ERROR);
    expect(err.message ?? "").toMatch(/división entre cero|no está definid/i);
  });

  it("RAD mode reciprocal values are unchanged", () => {
    expect(evaluate(algebriteOf("sec(pi/3)"))).toBe("2");
    expect(evaluate(algebriteOf("cot(pi/4)"))).toBe("1");
    expect(evaluate(algebriteOf("csc(pi/6)"))).toBe("2");
  });
});
