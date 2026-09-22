import { beforeEach, describe, expect, it } from "vitest";
import {
  MATRIX_NAMES,
  useNamedMatricesStore,
} from "../src/store/useNamedMatricesStore";
import { matrixOperationLabel } from "../src/modes/Matrices/MatrixMode";

beforeEach(() => {
  useNamedMatricesStore.getState().resetAll();
});

describe("M25 — matrices nombradas A-F", () => {
  it("inicializa seis matrices 2x2 y selección A/B", () => {
    const state = useNamedMatricesStore.getState();
    expect(Object.keys(state.matrices)).toEqual([...MATRIX_NAMES]);
    expect(state.primary).toBe("A");
    expect(state.secondary).toBe("B");
    for (const name of MATRIX_NAMES) {
      expect(state.matrices[name].rows).toBe(2);
      expect(state.matrices[name].cols).toBe(2);
      expect(state.matrices[name].values).toEqual([["", ""], ["", ""]]);
    }
  });

  it("mantiene datos independientes por nombre", () => {
    const store = useNamedMatricesStore.getState();
    store.setValues("C", [["1", "2"], ["3", "4"]]);
    store.setValues("F", [["5", "6"], ["7", "8"]]);
    expect(useNamedMatricesStore.getState().matrices.C.values).toEqual([["1", "2"], ["3", "4"]]);
    expect(useNamedMatricesStore.getState().matrices.F.values).toEqual([["5", "6"], ["7", "8"]]);
    expect(useNamedMatricesStore.getState().matrices.A.values).toEqual([["", ""], ["", ""]]);
  });

  it("redimensiona hasta 6x6 conservando celdas existentes", () => {
    const store = useNamedMatricesStore.getState();
    store.setValues("D", [["1", "2"], ["3", "4"]]);
    store.setDimensions("D", 6, 6);
    const d = useNamedMatricesStore.getState().matrices.D;
    expect(d.rows).toBe(6);
    expect(d.cols).toBe(6);
    expect(d.values[0][0]).toBe("1");
    expect(d.values[1][1]).toBe("4");
    expect(d.values[5][5]).toBe("");
  });

  it("selecciona operandos explícitos y genera etiquetas dinámicas", () => {
    const store = useNamedMatricesStore.getState();
    store.setPrimary("C");
    store.setSecondary("F");
    const state = useNamedMatricesStore.getState();
    expect(state.primary).toBe("C");
    expect(state.secondary).toBe("F");
    expect(matrixOperationLabel("add", "C", "F")).toBe("C + F");
    expect(matrixOperationLabel("multiply", "C", "F")).toBe("C × F");
    expect(matrixOperationLabel("determinant", "C", "F")).toBe("det(C)");
    expect(matrixOperationLabel("rank", "C", "F")).toBe("rango(C)");
  });

  it("M27: duplica dimensiones y valores sin enlazar original y copia", () => {
    const store = useNamedMatricesStore.getState();
    store.setDimensions("C", 3, 2);
    store.setValues("C", [["1", "2"], ["3", "4"], ["5", "6"]]);
    store.copyMatrix("C", "E");

    const copied = useNamedMatricesStore.getState().matrices.E;
    expect(copied.rows).toBe(3);
    expect(copied.cols).toBe(2);
    expect(copied.values).toEqual([["1", "2"], ["3", "4"], ["5", "6"]]);

    useNamedMatricesStore.getState().setValues("E", [["9", "2"], ["3", "4"], ["5", "6"]]);
    expect(useNamedMatricesStore.getState().matrices.C.values[0][0]).toBe("1");
    expect(useNamedMatricesStore.getState().matrices.E.values[0][0]).toBe("9");
  });

  it("limpia solo la matriz indicada", () => {
    const store = useNamedMatricesStore.getState();
    store.setValues("C", [["1", "2"], ["3", "4"]]);
    store.setValues("D", [["5", "6"], ["7", "8"]]);
    store.resetMatrix("C");
    expect(useNamedMatricesStore.getState().matrices.C.values).toEqual([["", ""], ["", ""]]);
    expect(useNamedMatricesStore.getState().matrices.D.values).toEqual([["5", "6"], ["7", "8"]]);
  });
});
