import { describe, expect, it } from "vitest";

import { extractDomainConditions, mergeDomainConditions } from "../src/engine/domainConditions";

describe("domainConditions", () => {
  it("preserva el hueco de un denominador explícito antes de simplificar", () => {
    const conditions = extractDomainConditions("(x^2-1)/(x-1)");
    expect(conditions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "denominator",
          expressionAlgebrite: "x-1",
          operator: "!=",
          comparisonAlgebrite: "0",
          variable: "x",
        }),
      ]),
    );
  });

  it("extrae restricciones de logaritmos y raíces pares", () => {
    const conditions = extractDomainConditions("log(x-2)+sqrt(x+1)");
    expect(conditions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "log", expressionAlgebrite: "x-2", operator: ">" }),
        expect.objectContaining({ kind: "even_root", expressionAlgebrite: "x+1", operator: ">=" }),
      ]),
    );
  });

  it("fusiona sin duplicar condiciones equivalentes", () => {
    const a = extractDomainConditions("1/(x-1)");
    const b = extractDomainConditions("2/(x-1)");
    expect(mergeDomainConditions(a, b)).toHaveLength(1);
  });
});
