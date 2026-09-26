import { describe, expect, it } from "vitest";

import { getAvailableResultFormats } from "../src/components/resultFormatPolicy";

describe("S26 Bloque 4 — política de formatos de resultado", () => {
  it("muestra Exacto como base", () => {
    expect(getAvailableResultFormats({
      hasExact: true,
      hasDecimal: false,
      hasFraction: false,
      hasDms: false,
    })).toEqual(["exact"]);
  });

  it("muestra Decimal y Científica solo cuando existe valor numérico", () => {
    expect(getAvailableResultFormats({
      hasExact: true,
      hasDecimal: true,
      hasFraction: false,
      hasDms: false,
    })).toEqual(["exact", "dec", "scn"]);
  });

  it("muestra Fracción solo cuando existe forma exacta racional", () => {
    expect(getAvailableResultFormats({
      hasExact: true,
      hasDecimal: true,
      hasFraction: true,
      hasDms: false,
    })).toEqual(["exact", "dec", "frac", "scn"]);
  });

  it("añade DMS únicamente cuando la salida angular lo habilita", () => {
    expect(getAvailableResultFormats({
      hasExact: true,
      hasDecimal: true,
      hasFraction: false,
      hasDms: true,
    })).toEqual(["exact", "dec", "scn", "dms"]);
  });
});
