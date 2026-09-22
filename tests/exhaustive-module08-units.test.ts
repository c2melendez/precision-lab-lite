import { describe, expect, it } from "vitest";
import { convert } from "../src/engine/unitConversion";

describe("Suite exhaustiva original — Módulo 8: Unidades", () => {
  it("conversiones conocidas de las 12 categorías", () => {
    expect(convert("length", 1, "km", "m")).toBeCloseTo(1000, 12);
    expect(convert("mass", 1, "lb", "kg")).toBeCloseTo(0.45359237, 12);
    expect(convert("time", 1, "h", "s")).toBeCloseTo(3600, 12);
    expect(convert("area", 1, "ha", "m2")).toBeCloseTo(10000, 12);
    expect(convert("volume", 1, "gal", "l")).toBeCloseTo(3.785411784, 12);
    expect(convert("speed", 36, "kmh", "mps")).toBeCloseTo(10, 12);
    expect(convert("storage", 1, "kb", "byte")).toBeCloseTo(1000, 12);
    expect(convert("pressure", 1, "atm", "pa")).toBeCloseTo(101325, 12);
    expect(convert("energy", 1, "kwh", "j")).toBeCloseTo(3_600_000, 9);
    expect(convert("power", 1, "kw", "w")).toBeCloseTo(1000, 12);
    expect(convert("force", 1, "kgf", "n")).toBeCloseTo(9.80665, 12);
    expect(convert("temperature", 0, "c", "f")).toBeCloseTo(32, 12);
  });

  it("temperatura cruza correctamente C/F/K", () => {
    expect(convert("temperature", 32, "f", "c")).toBeCloseTo(0, 12);
    expect(convert("temperature", 0, "c", "k")).toBeCloseTo(273.15, 12);
    expect(convert("temperature", 273.15, "k", "c")).toBeCloseTo(0, 12);
    expect(convert("temperature", -40, "c", "f")).toBeCloseTo(-40, 12);
  });

  it("almacenamiento usa base decimal 1000 y bit/byte correctos", () => {
    expect(convert("storage", 8, "bit", "byte")).toBeCloseTo(1, 12);
    expect(convert("storage", 1, "mb", "kb")).toBeCloseTo(1000, 12);
    expect(convert("storage", 1, "gb", "mb")).toBeCloseTo(1000, 12);
  });

  it("identidad y cero se preservan", () => {
    expect(convert("length", 0, "mi", "km")).toBe(0);
    expect(convert("mass", 7.5, "kg", "kg")).toBeCloseTo(7.5, 12);
    expect(convert("temperature", 25, "c", "c")).toBeCloseTo(25, 12);
  });

  it("unidad inválida se rechaza explícitamente", () => {
    expect(() => convert("length", 1, "bogus", "m")).toThrow();
    expect(() => convert("temperature", 1, "bogus", "c")).toThrow();
  });
});
