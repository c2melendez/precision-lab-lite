// store/useArgandBridgeStore.ts — Fase F (spec_edo_complejos_tooltips.md
// §3.4, Módulo F3): el botón "Graficar" (BasicScientificMode) necesita
// cambiar a la pantalla de Graficación y pasarle un punto -- pero, a
// diferencia de precision-lab (main, que ya tenía `useUIStore` con
// `activeMode` como store compartido), en este repo el modo activo
// (`mode`) vive como estado LOCAL de `App.tsx` (`useState`), no en
// ningún store. Este store nuevo es el puente mínimo: BasicScientificMode
// lo llena, App.tsx lo consume (useEffect) para llamar a su propio
// `setMode` local y limpia el campo después.
import { create } from "zustand";

interface ArgandBridgeState {
  pendingArgandPoint: { re: number; im: number; expressionText: string } | null;
  setPendingArgandPoint: (point: { re: number; im: number; expressionText: string } | null) => void;
}

export const useArgandBridgeStore = create<ArgandBridgeState>((set) => ({
  pendingArgandPoint: null,
  setPendingArgandPoint: (point) => set({ pendingArgandPoint: point }),
}));
