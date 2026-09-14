import { describe, it, expect } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { tryCbrtSign } from "../src/engine/cbrtSign";

// Fix (suite de regresión v1.1, casos E107 y E109-E111): "cbrt" no
// estaba registrada, y "sign" estaba registrada pero Algebrite nunca la
// evaluaba a un número (daba NaN).
describe("tryCbrtSign (decisión: cbrt da la raíz real, no la rama compleja)", () => {
  it("cbrt(27) = 3", () => {
    expect(tryCbrtSign("cbrt(27)")).toBe("3");
  });

  it("cbrt(-27) = -3 (raíz real, no la rama compleja principal)", () => {
    expect(tryCbrtSign("cbrt(-27)")).toBe("-3");
  });

  it("sign(-3) = -1, sign(5) = 1, sign(0) = 0", () => {
    expect(tryCbrtSign("sign(-3)")).toBe("-1");
    expect(tryCbrtSign("sign(5)")).toBe("1");
    expect(tryCbrtSign("sign(0)")).toBe("0");
  });

  it("no es cbrt ni sign: devuelve null (no interfiere con evaluate normal)", () => {
    expect(tryCbrtSign("5+3")).toBe(null);
  });

  it("cbrt(27) se reconoce como función real (antes tronaba como multiplicación implícita)", () => {
    expect(parseExpression("cbrt(27)").algebrite).toBe("cbrt(27)");
  });
});
