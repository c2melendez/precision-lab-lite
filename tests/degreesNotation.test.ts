import { describe, it, expect } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

describe("Auditoría Módulo D (DMS)", () => {
  it("Nivel 1: 90° = pi/2 rad", () => {
    const parsed = parseExpression("90°");
    const result = evaluate(`float(${parsed.algebrite})`);
    console.log("90° =>", parsed.algebrite, "=", result);
    expect(parseFloat(result)).toBeCloseTo(Math.PI / 2, 6);
  });

  it("Nivel 2: 45°30′ = 45.5° en radianes", () => {
    const parsed = parseExpression("45°30′");
    const result = evaluate(`float(${parsed.algebrite})`);
    const expected = (45.5 * Math.PI) / 180;
    console.log("45°30′ =>", parsed.algebrite, "=", result, "esperado:", expected);
    expect(parseFloat(result)).toBeCloseTo(expected, 6);
  });

  it("Nivel 2 con segundos: 45°30′15″", () => {
    const parsed = parseExpression("45°30′15″");
    const result = evaluate(`float(${parsed.algebrite})`);
    const decimalDegrees = 45 + 30 / 60 + 15 / 3600;
    const expected = (decimalDegrees * Math.PI) / 180;
    console.log("45°30′15″ =>", parsed.algebrite, "=", result, "esperado:", expected);
    expect(parseFloat(result)).toBeCloseTo(expected, 6);
  });
});
