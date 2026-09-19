import { create } from "zustand";

/**
 * useActiveModeStore.ts — Fase X, Módulo X0 (Smart Docks de uso
 * reciente, spec_rediseno_visual.md sección 10). Alcance confirmado por
 * Carlos: separado POR MODO.
 *
 * precision-lab (main) ya tenía un store global de UI con `activeMode`
 * (useUIStore.ts) — Lite nunca lo necesitó porque `mode` vivía como
 * `useState` local dentro de App.tsx (ver comentario ahí). Se agrega
 * este store mínimo, sin tocar esa lógica existente (nada de tests la
 * ejercita directamente, pero se prefiere no arriesgarla): App.tsx
 * sincroniza `mode` aquí en un `useEffect` cuando cambia, y
 * MathKeyboard.tsx (que no recibe `mode` como prop y no debería
 * empezar a hacerlo solo para esto) lo lee de aquí para saber en qué
 * "cajón" del historial de Smart Docks registrar cada tecla.
 */

interface ActiveModeState {
  activeMode: string;
  setActiveMode: (mode: string) => void;
}

export const useActiveModeStore = create<ActiveModeState>((set) => ({
  activeMode: "basic",
  setActiveMode: (activeMode) => set({ activeMode }),
}));
