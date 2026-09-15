import { describe, it, expect } from "vitest";
import { gaussJordan, toFractionMatrix } from "../src/engine/matrixOps";

// Auditoría Módulo B — casos 5×5 reales, no incluidos en la suite del proyecto.
describe("Auditoría 5x5 (Módulo B)", () => {
  it("5x5 solución única: identidad => x_i = i", () => {
    // x1=1, x2=2, x3=3, x4=4, x5=5 via identity matrix
    const rows = [
      [1, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 2],
      [0, 0, 1, 0, 0, 3],
      [0, 0, 0, 1, 0, 4],
      [0, 0, 0, 0, 1, 5],
    ];
    const sol = gaussJordan(toFractionMatrix(rows), ["x1", "x2", "x3", "x4", "x5"]);
    console.log("unique:", JSON.stringify(sol.kind));
    expect(sol.kind).toBe("unique");
  });

  it("5x5 compatible indeterminado: fila 5 dependiente", () => {
    const rows = [
      [1, 1, 0, 0, 0, 2],
      [0, 1, 1, 0, 0, 2],
      [0, 0, 1, 1, 0, 2],
      [0, 0, 0, 1, 1, 2],
      [1, 2, 2, 2, 1, 8], // = fila1+fila2+fila3+fila4 exactamente -> dependiente
    ];
    const sol = gaussJordan(toFractionMatrix(rows), ["x1", "x2", "x3", "x4", "x5"]);
    console.log("infinite:", JSON.stringify(sol.kind));
    expect(sol.kind).toBe("infinite");
  });

  it("5x5 incompatible: fila 5 contradictoria", () => {
    const rows = [
      [1, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 2],
      [0, 0, 1, 0, 0, 3],
      [0, 0, 0, 1, 0, 4],
      [1, 0, 0, 0, 0, 99], // contradice fila 1 (x1=1 y x1=99)
    ];
    const sol = gaussJordan(toFractionMatrix(rows), ["x1", "x2", "x3", "x4", "x5"]);
    console.log("none:", JSON.stringify(sol.kind));
    expect(sol.kind).toBe("none");
  });
});
