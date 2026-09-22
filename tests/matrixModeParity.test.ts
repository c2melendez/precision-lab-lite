import { describe, expect, it } from "vitest";
import { MATRIX_OPERATION_LABELS } from "../src/modes/Matrices/MatrixMode";

describe("M17 — paridad de matrices Plus/Lite", () => {
  it("expone eigenvalores y eigenvectores porque el motor ya calcula ambos", () => {
    expect(MATRIX_OPERATION_LABELS.eigen).toBe("Eigenvalores y eigenvectores");
  });
});
