import { create } from "zustand";

/**
 * useLayoutModeStore.ts — Módulo 6 (hoja-de-ruta-visual.md §6 / spec §7),
 * extendido en Fase P (Rediseño visual, Módulo P0/P1 — spec_rediseno_visual.md
 * sección 2 y 15): de 2 a 6 disposiciones.
 *
 * - "fused" (default) / "separated": ya existían (Módulo 6).
 * - "split" (Pantalla dividida, P1), "focus" (Enfoque, P2), "stacked"
 *   (Apilado, P3): implementados.
 * - "floating" (Flotante): implementado en Módulo P4 — ver
 *   useFloatingLayoutStore.ts para el estado de posición/tamaño de sus
 *   paneles (persistencia en localStorage, confirmada explícitamente
 *   por el usuario en la sesión de diseño, con riesgo de coordenadas
 *   obsoletas entre dispositivos — ver Cierre del Módulo P4).
 *
 * Persistido en localStorage con el mismo criterio que el tema (ver
 * ThemeToggle.tsx / AjustesPopover.tsx) — se lee UNA vez al montar
 * AjustesPopover, no hace falta un useEffect en cada consumidor.
 * Retrocompatible: un valor guardado de antes de Fase P ("fused" o
 * "separated") sigue siendo válido sin migración.
 */

export type LayoutMode = "fused" | "separated" | "split" | "focus" | "floating" | "stacked";

const STORAGE_KEY = "precision-lab-layout-mode";

/**
 * B7 — Científica expone cuatro diseños. Conservamos los ids históricos
 * para no romper consumidores ni preferencias existentes, pero "stacked"
 * y "floating" ya no forman parte de la selección visible de Científica.
 *
 * Mapeo B7:
 * fused     -> Balanceada
 * split     -> Cálculo amplio
 * focus     -> Resultado amplio
 * separated -> Cuadrícula 2×2
 */
const B7_LAYOUT_MODES: readonly LayoutMode[] = ["fused", "split", "focus", "separated"];

function readInitialLayoutMode(): LayoutMode {
  if (typeof localStorage === "undefined") return "fused";
  const stored = localStorage.getItem(STORAGE_KEY);
  if ((B7_LAYOUT_MODES as readonly string[]).includes(stored ?? "")) return stored as LayoutMode;

  // Preferencias heredadas de layouts retirados se migran a Balanceada.
  if (stored === "stacked" || stored === "floating") {
    localStorage.setItem(STORAGE_KEY, "fused");
  }
  return "fused";
}

interface LayoutModeState {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
}

export const useLayoutModeStore = create<LayoutModeState>((set) => ({
  layoutMode: readInitialLayoutMode(),
  setLayoutMode: (layoutMode) => {
    localStorage.setItem(STORAGE_KEY, layoutMode);
    set({ layoutMode });
  },
}));
