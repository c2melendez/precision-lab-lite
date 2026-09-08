import { describe, it, expect } from "vitest";
import { tryPlusMinus } from "../src/engine/plusMinus";

// Fix (decisión de Carlos, cierre de la suite de paridad de teclado v1.0):
// la tecla ±() no tenía ningún cómputo detrás (Algebrite no conoce "pm").
describe("tryPlusMinus (decisión de Carlos: ±(expr) da las dos ramas)", () => {
  it("±(5) = [5,-5]", () => {
    expect(tryPlusMinus("pm(5)")).toBe("[5,-5]");
  });

  it("±(sqrt(2)) conserva la forma exacta, no una aproximación decimal", () => {
    expect(tryPlusMinus("pm(sqrt(2))")).toBe("[2^(1/2),-2^(1/2)]");
  });

  it("no es ±: devuelve null (no interfiere con evaluate normal)", () => {
    expect(tryPlusMinus("5+3")).toBe(null);
  });
});
