import { create } from "zustand";
import type { ReactNode } from "react";

/**
 * useKeyboardPanelStore.ts — Módulo 0.
 *
 * DECISIÓN ARQUITECTÓNICA (DEDUCIBLE, no explícita en el spec — registrar
 * en el cierre): la hoja de ruta pide montar <KeyboardDock> "a nivel raíz
 * en App.tsx... para que persista entre modos", pero cada modo
 * (BasicScientificMode, etc.) es dueño de su propio `mathField` y de sus
 * propios handlers (onEnter/onSolveEquation/...), que hoy se pasan como
 * props directas a <MathKeyboard>. Un <KeyboardDock> verdaderamente
 * global en App.tsx no tiene forma de acceder a ese estado local del modo
 * activo sin algún canal compartido.
 *
 * Se resuelve con este store efímero (mismo patrón zustand ya usado en
 * useUIStore del proyecto Python, nunca persistido): cada modo con
 * teclado registra su contenido (el <MathKeyboard .../> ya armado con sus
 * props) al montar, y lo limpia al desmontar. KeyboardDock/KeyboardPanel,
 * montados una sola vez en App.tsx, solo leen `content` e `isOpen` — no
 * conocen la lógica de ningún modo. Alternativa descartada: React
 * Context con el mismo propósito — se prefirió zustand por consistencia
 * con el store ya existente en ambos repos, no por necesidad técnica.
 *
 * PATRÓN OBLIGATORIO PARA QUIEN CONSUMA ESTE STORE (documentado tras un
 * bug real encontrado en el cierre de ese módulo): `setContent` y
 * `clearContent` deben ir en efectos SEPARADOS. Si un mismo useEffect
 * hace setContent() y devuelve clearContent() como cleanup, cada cambio
 * de dependencia (ej. el usuario escribiendo, que cambia `latex`)
 * dispara el cleanup antes de re-ejecutar el efecto — y clearContent()
 * pone isOpen:false, cerrando el panel solo mientras se escribe. Patrón
 * correcto: un efecto con dependencias reales que solo llama setContent
 * (nunca toca isOpen), y un efecto aparte con deps `[]` cuyo cleanup
 * llama clearContent (se dispara una sola vez, al desmontar).
 *
 * CORRECCIÓN post-Módulo 7 (spec §8: "móvil... dock reducido a lo
 * esencial Calcular/⌫/expandir"): en <768px el dock ya NO muestra el
 * grid completo de basicContent — se oculta con CSS (`hidden md:block`
 * en KeyboardDock) y aparece en su lugar una fila compacta (Calcular/⌫/
 * Expandir). Como esa fila vive en KeyboardDock (fuera del componente
 * que arma basicContent) necesita los mismos callbacks de onEnter/
 * onBackspace por separado — de ahí `compactActions`. El grid completo
 * SIGUE existiendo en el DOM para móvil, pero ahora DENTRO del panel
 * expandido (KeyboardPanel), oculto con `md:hidden` — se accede
 * tocando "Expandir". Mismo patrón de dos-efectos de arriba aplica
 * también a setCompactActions/clearCompactActions.
 */

interface KeyboardPanelState {
  isOpen: boolean;
  /** Contenido actual del panel expandido — normalmente un <MathKeyboard
   * .../> o <NaturalMathKeyboard .../> ya configurado por el modo activo.
   * `null` cuando el modo activo no usa teclado matemático (ej. Matrices,
   * Estadística, Unidades — spec §11, fuera de alcance de este track). */
  content: ReactNode | null;
  /** Contenido del panel básico (dígitos/operadores/relacionales/
   * variables/constantes). Visible SIEMPRE en el dock a partir de
   * tablet (md, ≥768px); en móvil se oculta ahí y se muestra dentro del
   * panel expandido en su lugar (ver corrección arriba). */
  basicContent: ReactNode | null;
  /** Acciones de la fila compacta del dock en móvil (Calcular/⌫) — el
   * mismo par de callbacks que ya recibe basicContent, expuestos aparte
   * porque KeyboardDock no tiene acceso directo a las props internas de
   * ese ReactNode ya armado. `null` con las mismas reglas que content. */
  compactActions: { onEnter: () => void; onBackspace: () => void } | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setContent: (content: ReactNode) => void;
  clearContent: () => void;
  setBasicContent: (content: ReactNode) => void;
  clearBasicContent: () => void;
  setCompactActions: (actions: { onEnter: () => void; onBackspace: () => void }) => void;
  clearCompactActions: () => void;
}

export const useKeyboardPanelStore = create<KeyboardPanelState>((set) => ({
  isOpen: false,
  content: null,
  basicContent: null,
  compactActions: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s: KeyboardPanelState) => ({ isOpen: !s.isOpen })),
  setContent: (content) => set({ content }),
  clearContent: () => set({ content: null, isOpen: false }),
  setBasicContent: (basicContent) => set({ basicContent }),
  clearBasicContent: () => set({ basicContent: null }),
  setCompactActions: (compactActions) => set({ compactActions }),
  clearCompactActions: () => set({ compactActions: null }),
}));
