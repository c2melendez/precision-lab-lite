import { create } from "zustand";

/**
 * usePendingGraphStore.ts — botón "Graficar" explícito en
 * GraphPlaceholder.tsx (decisión de producto confirmada por Carlos: NO
 * automático, el usuario lo pide). Mismo "puente" que
 * useArgandBridgeStore.ts (Track A) pero para una expresión y=f(x)
 * normal en vez de un punto complejo — App.tsx cambia a modo
 * "graphing" cuando `pendingExpression` deja de ser null, y
 * GraphingMode.tsx lo consume y limpia en un efecto, igual que hace con
 * `pendingArgandPoint`.
 *
 * Deliberadamente NO valida "es graficable" aquí (una sola variable
 * libre, etc.) — esa validación ya vive en GraphingMode.tsx (`graphEntry`
 * -> `parseExpression`/`analyzeGraph`), que es quien de verdad sabe
 * graficar. Duplicarla aquí sería una segunda fuente de verdad que
 * podría desincronizarse.
 */

interface PendingGraphState {
  pendingExpression: string | null;
  setPendingExpression: (latex: string) => void;
  clearPendingExpression: () => void;
}

export const usePendingGraphStore = create<PendingGraphState>((set) => ({
  pendingExpression: null,
  setPendingExpression: (pendingExpression) => set({ pendingExpression }),
  clearPendingExpression: () => set({ pendingExpression: null }),
}));
