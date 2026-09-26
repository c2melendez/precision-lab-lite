import { describe, expect, it } from "vitest";
import { decimalDegreesToDms, parseDecimalDegreesInput } from "./dmsDisplay";

describe("parseDecimalDegreesInput", () => {
  it("acepta grados decimales con símbolo real de grados", () => {
    expect(parseDecimalDegreesInput("30.525°")).toBe(30.525);
  });

  it("acepta la representación LaTeX que puede producir MathLive", () => {
    expect(parseDecimalDegreesInput("30.525^{\\circ}")).toBe(30.525);
    expect(parseDecimalDegreesInput("30.525\\degree")).toBe(30.525);
  });

  it("no habilita DMS para un número sin simbología angular", () => {
    expect(parseDecimalDegreesInput("30.525")).toBeNull();
    expect(parseDecimalDegreesInput("x+1")).toBeNull();
  });
});

describe("decimalDegreesToDms", () => {
  it("convierte 30.525° a 30° 31′ 30.0″", () => {
    const result = decimalDegreesToDms(30.525);
    expect(result?.text).toBe("30° 31′ 30.0″");
    expect(result?.latex).toBe("30^{\\circ}\\ 31^{\\prime}\\ 30.0^{\\prime\\prime}");
  });

  it("normaliza acarreo de segundos y minutos", () => {
    const result = decimalDegreesToDms(12.999999);
    expect(result?.degrees).toBe(13);
    expect(result?.minutes).toBe(0);
    expect(result?.seconds).toBe(0);
  });

  it("preserva el signo", () => {
    expect(decimalDegreesToDms(-30.5)?.text).toBe("-30° 30′ 0.0″");
  });
});
