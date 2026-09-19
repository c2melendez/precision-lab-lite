import { beforeEach, describe, expect, it } from "vitest";

import type { KeyDef } from "../src/components/MathKeyboard";
import { useRecentKeysStore } from "../src/store/useRecentKeysStore";

// A diferencia de precision-lab (main, entorno jsdom), este repo corre
// sus tests en entorno "node" (sin window/localStorage) — ver
// vite.config.ts. Se prueba la lógica del store (registro, orden,
// deduplicación, tope, aislamiento por modo), que es idéntica a main;
// la persistencia real en localStorage queda cubierta por los mismos
// try/catch defensivos del store (sin localStorage, simplemente no
// persiste, sin romper nada — mismo criterio que el resto del proyecto).

function k(insertLatex: string, ariaLabel = insertLatex): KeyDef {
  return { glyph: insertLatex, insertLatex, ariaLabel };
}

beforeEach(() => {
  useRecentKeysStore.setState({ recentByMode: {} });
});

describe("useRecentKeysStore", () => {
  it("empieza vacío para cualquier modo", () => {
    expect(useRecentKeysStore.getState().getRecents("basic")).toEqual({ operations: [], variables: [] });
  });

  it("registra una operación al frente de su lista", () => {
    useRecentKeysStore.getState().recordKey("basic", k("\\sin(#0)"), "operation");
    expect(useRecentKeysStore.getState().getRecents("basic").operations).toEqual([k("\\sin(#0)")]);
    expect(useRecentKeysStore.getState().getRecents("basic").variables).toEqual([]);
  });

  it("registra una variable/constante en su propia lista, separada de operaciones", () => {
    useRecentKeysStore.getState().recordKey("basic", k("x"), "variable");
    const recents = useRecentKeysStore.getState().getRecents("basic");
    expect(recents.variables).toEqual([k("x")]);
    expect(recents.operations).toEqual([]);
  });

  it("la tecla más reciente va primero", () => {
    const { recordKey } = useRecentKeysStore.getState();
    recordKey("basic", k("\\sin(#0)"), "operation");
    recordKey("basic", k("\\cos(#0)"), "operation");
    expect(useRecentKeysStore.getState().getRecents("basic").operations).toEqual([k("\\cos(#0)"), k("\\sin(#0)")]);
  });

  it("reusar una tecla ya presente la sube al frente, sin duplicarla", () => {
    const { recordKey } = useRecentKeysStore.getState();
    recordKey("basic", k("\\sin(#0)"), "operation");
    recordKey("basic", k("\\cos(#0)"), "operation");
    recordKey("basic", k("\\sin(#0)"), "operation");
    const { operations } = useRecentKeysStore.getState().getRecents("basic");
    expect(operations).toEqual([k("\\sin(#0)"), k("\\cos(#0)")]);
  });

  it("limita cada dock a 7 elementos", () => {
    const { recordKey } = useRecentKeysStore.getState();
    for (let i = 0; i < 10; i++) recordKey("basic", k(`f${i}(#0)`), "operation");
    const { operations } = useRecentKeysStore.getState().getRecents("basic");
    expect(operations).toHaveLength(7);
    expect(operations.map((o) => o.insertLatex)).toEqual(["f9(#0)", "f8(#0)", "f7(#0)", "f6(#0)", "f5(#0)", "f4(#0)", "f3(#0)"]);
  });

  it("mantiene historiales separados por modo", () => {
    const { recordKey } = useRecentKeysStore.getState();
    recordKey("basic", k("\\sin(#0)"), "operation");
    recordKey("matrices", k("\\det(#0)"), "operation");
    expect(useRecentKeysStore.getState().getRecents("basic").operations).toEqual([k("\\sin(#0)")]);
    expect(useRecentKeysStore.getState().getRecents("matrices").operations).toEqual([k("\\det(#0)")]);
  });
});
