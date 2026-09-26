import { useEffect } from "react";
import type { ReactNode } from "react";

import { NaturalInput } from "./NaturalInput";
import { RecentKeysBar } from "./RecentKeysBar";
import { ResultPanel } from "./ResultPanel";
import { HistoryLog, type SessionHistoryEntry } from "./HistoryLog";
import { AngleModePopover } from "./AngleModePopover";
import { GraphPlaceholder } from "./GraphPlaceholder";
import { KeyboardIcon } from "./KeyboardIcon";
import type { MathResult } from "../types";
import type { LayoutMode } from "../store/useLayoutModeStore";
import { useKeyboardPanelStore } from "../store/useKeyboardPanelStore";
import { useFloatingLayoutStore } from "../store/useFloatingLayoutStore";
import { FloatingWindow } from "./FloatingWindow";
import { RegisteredKeyboardSections } from "./ScientificKeyboardSections";
import { useMinWidthMediaQuery, FLOATING_MIN_WIDTH_PX } from "../hooks/useMinWidthMediaQuery";

// Fase E (spec UX estilo ClassCalc — mockup confirmado con el usuario):
// fusiona lo que antes eran 3 tarjetas independientes (HistoryLog,
// NaturalInput, ResultPanel, cada una con su propio bg/rounded/shadow) en
// un solo contenedor "pantalla", como una calculadora física: historial
// atenuado arriba, línea activa grande, resultado alineado a la derecha
// pegado a su expresión. El badge DEG/RAD entra en la esquina de la
// pantalla en vez de flotar en el header del modo.
//
// No reemplaza HistoryLog/ResultPanel — los envuelve. Cada uno sigue
// siendo su propio archivo/responsabilidad, solo que ahora ninguno trae
// fondo propio (ver Fase E en cada uno) para que la fusión visual
// funcione sin bordes duplicados.
//
// Fase P (Rediseño visual, Módulo P1 — spec_rediseno_visual.md sección 2):
// las 6 disposiciones reservan 4 cuadrantes (entrada, resultado, teclado
// colapsado, gráfica) — instrucción explícita del usuario. El cuadrante
// de teclado no se renderiza aquí (el dock vive montado en la raíz de la
// app, fuera de este componente e independiente de layoutMode); el de
// gráfica es <GraphPlaceholder /> — ver ese archivo para la decisión
// pendiente de graficación real (Track de Graficación).
// "focus"/"floating"/"stacked" todavía no tienen render propio (P2/P3/P4
// pendientes) — caen al comportamiento de "fused" por ahora.

type MathFieldRef = { insert: (s: string) => void; focus: () => void; value: string } | null;

interface ScreenProps {
  latex: string;
  onChangeLatex: (latex: string) => void;
  placeholder?: string;
  fieldRef: (el: MathFieldRef) => void;
  result: MathResult | null;
  sessionHistory: SessionHistoryEntry[];
  angleMode: "RAD" | "GRAD";
  onToggleAngleMode: () => void;
  /** Punto 7 del rediseño de teclado: botón "X" para vaciar el campo,
   * visible dentro del display cuando hay contenido (igual que la
   * captura de referencia, tooltip "clear field"). */
  onClearField: () => void;
  /** Módulo 6 (spec §7) + Fase P (Módulo P0/P1, spec_rediseno_visual.md
   * sección 2/15): "fused" (default) y "separated" ya existían. "split"
   * (Pantalla dividida) implementado en este módulo. "focus"/"floating"/
   * "stacked" están en el tipo pero sin render propio todavía. */
  layoutMode?: LayoutMode;
  /** Botón "Graficar" explícito en el cuadrante de gráfica (decisión de
   * producto confirmada por Carlos) — opcional porque no todos los
   * modos que usan Screen lo implementan todavía (alcance V1: solo
   * BasicScientificMode.tsx). Paridad con precision-lab (main). */
  onGraphExpression?: () => void;
  onCalculate?: () => void;
}

export function Screen({
  latex,
  onChangeLatex,
  placeholder,
  fieldRef,
  result,
  sessionHistory,
  angleMode,
  onToggleAngleMode,
  onClearField,
  layoutMode = "fused",
  onGraphExpression,
  onCalculate,
}: ScreenProps) {
  // Botón "Graficar" (cuadrante de gráfica, las 6 disposiciones): solo
  // tiene sentido ofrecerlo cuando hay algo escrito. GraphingMode.tsx
  // valida de verdad si es graficable al recibir el click.
  const canGraph = Boolean(onGraphExpression) && latex.trim().length > 0;
  const inputField = (
    <div className="relative">
      <NaturalInput value={latex} onChange={onChangeLatex} placeholder={placeholder} fieldRef={fieldRef} bare />
      {latex.length > 0 && (
        <button
          type="button"
          onClick={onClearField}
          aria-label="Borrar campo"
          title="clear field"
          className="absolute right-0 top-0 rounded p-1 text-muted hover:text-ink"
        >
          ✕
        </button>
      )}
    </div>
  );

  const inputSurface = (
    <section aria-label="Entrada" className="rounded-xl border border-paper-line bg-paper-soft shadow-sm">
      <div className="flex items-center justify-between border-b border-paper-line px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Entrada</p>
        <span className="text-[11px] text-muted">Expresión matemática</span>
      </div>
      <div className="px-4 py-3">{inputField}</div>
    </section>
  );


  // "stacked" (Apilado, Módulo P3): una sola columna — input, resultado,
  // gráfica, y el teclado como sección COLAPSADA dentro del mismo flujo
  // (no overlay/bottom sheet). Por eso NO usa <KeyboardPanel> (siempre
  // fixed) — lee useKeyboardPanelStore directamente y renderiza su
  // propio disclosure inline. KeyboardDock.tsx no se monta en este modo
  // (retorna null), para no duplicar la UI de teclado.
  if (layoutMode === "stacked") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex justify-end">
          <AngleModePopover angleMode={angleMode} onToggle={onToggleAngleMode} variant="paper" />
        </div>
        {sessionHistory.length > 0 && (
          <div className="max-h-20 overflow-y-auto rounded-xl border border-paper-line bg-paper-soft/70 px-4 py-2 shadow-sm">
            <HistoryLog entries={sessionHistory} />
          </div>
        )}
        {inputSurface}
        <div className="rounded-xl bg-paper-soft px-4 py-3 shadow-sm">
          <ResultPanel result={result} inputLatex={latex} angleMode={angleMode} />
        </div>
        <GraphPlaceholder canGraph={canGraph} onGraph={onGraphExpression} />
        <StackedKeyboardSection />
      </div>
    );
  }

  // "floating" (Flotante, Módulo P4 — la disposición de mayor riesgo,
  // confirmada por el usuario pese al costo). Por debajo de lg (1024px)
  // degrada a Enfoque, SIN crear estado de ventanas flotantes (P0) — el
  // gating usa el mismo hook que KeyboardDock.tsx para no desincronizarse
  // con él (ver useMinWidthMediaQuery.ts).
  if (layoutMode === "floating") {
    return (
      <FloatingScreenContent
        inputField={inputSurface}
        result={result}
        inputLatex={latex}
        angleMode={angleMode}
        onToggleAngleMode={onToggleAngleMode}
        canGraph={canGraph}
        onGraphExpression={onGraphExpression}
      />
    );
  }

  // "focus" (Enfoque, Módulo P2): sin historial (libera espacio),
  // resultado destacado, gráfica con más área — el dock ya se reduce a
  // la fila compacta en cualquier breakpoint (ver KeyboardDock.tsx,
  // consciente de layoutMode). No es "fused" con menos cosas: es su
  // propia composición, para no depender de que History decida ocultarse
  // sola. Factorizado en <FocusScreenContent> porque Flotante degradado
  // (arriba) reusa exactamente esta misma composición.
  if (layoutMode === "focus") {
    return (
      <FocusScreenContent
        inputField={inputSurface}
        result={result}
        inputLatex={latex}
        angleMode={angleMode}
        onToggleAngleMode={onToggleAngleMode}
        canGraph={canGraph}
        onGraphExpression={onGraphExpression}
      />
    );
  }

  if (layoutMode === "separated") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex justify-end">
          <AngleModePopover angleMode={angleMode} onToggle={onToggleAngleMode} variant="paper" />
        </div>
        {sessionHistory.length > 0 && (
          <div className="max-h-20 overflow-y-auto rounded-xl border border-paper-line bg-paper-soft/70 px-4 py-2 shadow-sm">
            <HistoryLog entries={sessionHistory} />
          </div>
        )}
        {inputSurface}
        <div className="rounded-xl bg-paper-soft px-4 py-3 shadow-sm">
          <ResultPanel result={result} inputLatex={latex} angleMode={angleMode} />
        </div>
        <GraphPlaceholder canGraph={canGraph} onGraph={onGraphExpression} />
      </div>
    );
  }

  // "split" (Pantalla dividida, Módulo P1): dos columnas fijas desde el
  // breakpoint dt (≥1440px) — izquierda: historial + entrada; derecha:
  // resultado + gráfica, ambos visibles a la vez. Por debajo de dt colapsa
  // a una sola columna en el mismo orden (equivalente a la degradación a
  // Apilado acordada en el Módulo P0, implementada aquí solo con clases
  // responsivas, sin depender de que el Módulo P3 ya exista).
  if (layoutMode === "split") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex justify-end">
          <AngleModePopover angleMode={angleMode} onToggle={onToggleAngleMode} variant="paper" />
        </div>
        <div className="flex flex-col gap-3 dt:grid dt:grid-cols-[minmax(0,1.38fr)_minmax(340px,1fr)] dt:items-start dt:gap-4">
          <div className="flex min-w-0 flex-col gap-3">
            {sessionHistory.length > 0 && (
              <div className="max-h-20 overflow-y-auto rounded-xl border border-paper-line bg-paper-soft/70 px-4 py-2 shadow-sm">
                <HistoryLog entries={sessionHistory} />
              </div>
            )}
            <section aria-label="Entrada" className="rounded-xl border border-paper-line bg-paper-soft shadow-sm">
              <div className="flex items-center justify-between border-b border-paper-line px-4 py-3">
                <h2 className="border-l-4 border-marker pl-2 text-sm font-semibold">Entrada</h2>
                <button type="button" onClick={() => useKeyboardPanelStore.getState().open()}
                  aria-label="Abrir teclado matemático" title="Abrir teclado matemático"
                  className="flex items-center gap-2 rounded-lg border border-paper-line px-3 py-2 text-xs text-marker-text hover:bg-marker-soft">
                  <KeyboardIcon className="h-4 w-4" /> Teclado
                </button>
              </div>
              <div className="px-4 py-3">{inputField}</div>
              {onCalculate && (
                <div className="flex justify-end px-4 pb-4">
                  <button type="button" onClick={onCalculate} disabled={!latex.trim()}
                    className="rounded-lg bg-marker px-5 py-2 text-sm font-semibold text-chrome hover:bg-marker/90 disabled:opacity-40">
                    Calcular
                  </button>
                </div>
              )}
            </section>
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <div className="min-w-0 rounded-xl bg-paper-soft px-4 py-3 shadow-sm">
              <ResultPanel result={result} inputLatex={latex} angleMode={angleMode} />
            </div>
            <GraphPlaceholder canGraph={canGraph} onGraph={onGraphExpression} />
          </div>
        </div>
      </div>
    );
  }

  // "fused" (default) — todas las demás disposiciones ya tienen su
  // propia rama arriba (P1/P2/P3/P4).
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl bg-paper-soft px-4 py-3 shadow-inner shadow-black/10">
        <div className="mb-1.5 flex justify-end">
          <AngleModePopover angleMode={angleMode} onToggle={onToggleAngleMode} variant="paper" />
        </div>

        {sessionHistory.length > 0 && (
          <div className="mb-2 max-h-20 overflow-y-auto rounded-lg border border-paper-line bg-paper/60 px-3 py-2 opacity-80">
            <HistoryLog entries={sessionHistory} />
          </div>
        )}

        {inputSurface}
        <div className="mt-3">
          <ResultPanel result={result} inputLatex={latex} angleMode={angleMode} />
        </div>
      </div>
      <GraphPlaceholder canGraph={canGraph} onGraph={onGraphExpression} />
    </div>
  );
}

/**
 * StackedKeyboardSection — Fase P, Módulo P3 ("Apilado").
 *
 * Sección de teclado COLAPSADA dentro del flujo normal del documento
 * (no overlay/bottom sheet como <KeyboardPanel>). Lee el mismo
 * useKeyboardPanelStore que ya usa KeyboardDock.tsx/KeyboardPanel.tsx
 * (misma fuente de verdad de qué categorías/teclas hay en el modo
 * activo), pero NO importa esos dos componentes — evita tocar
 * KeyboardPanel.tsx/CATEGORY_MENUS (zona de fricción con Track A, ver
 * precision-lab-mapa-de-coordinacion.md sección 3.4).
 *
 * Colapsada por defecto (mismo estado global `isOpen`, no uno propio) —
 * si el usuario ya lo tenía abierto en otra disposición y cambia a
 * Apilado, se respeta ese estado; no se fuerza a cerrado en cada cambio
 * de disposición (fuera de alcance de este módulo, no pedido).
 */
function StackedKeyboardSection() {
  const isOpen = useKeyboardPanelStore((s) => s.isOpen);
  const content = useKeyboardPanelStore((s) => s.content);
  const basicContent = useKeyboardPanelStore((s) => s.basicContent);
  const toggle = useKeyboardPanelStore((s) => s.toggle);

  const canExpand = content !== null || basicContent !== null;

  return (
    <div className="flex flex-col gap-1.5">
      {/* Fase X, Módulo X0 — mismo criterio que precision-lab (main). */}
      <RecentKeysBar />
      <div className="rounded-xl border border-paper-line bg-paper-soft">
        <button
          type="button"
          onClick={toggle}
          disabled={!canExpand}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Cerrar teclado" : "Abrir teclado"}
          className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-ink disabled:text-muted/40"
        >
          <span className="flex items-center gap-2">
            <KeyboardIcon className="h-4 w-4 text-marker" />
            Teclado
          </span>
          <span aria-hidden="true">{isOpen ? "▾" : "▴"}</span>
        </button>
        {isOpen && canExpand && (
          <div role="region" aria-label="Teclado matemático" className="border-t border-paper-line px-3 pb-3 pt-2">
            <RegisteredKeyboardSections basic={basicContent} advanced={content} />
          </div>
        )}
      </div>
    </div>
  );
}

interface FocusLikeContentProps {
  inputField: ReactNode;
  result: MathResult | null;
  inputLatex: string;
  angleMode: "RAD" | "GRAD";
  onToggleAngleMode: () => void;
  canGraph: boolean;
  onGraphExpression?: () => void;
}

/** Módulo P2 ("Enfoque"): sin historial, resultado destacado, gráfica
 * con más área. Reusado tal cual por Flotante cuando degrada (P0/P4). */
function FocusScreenContent({ inputField, result, inputLatex, angleMode, onToggleAngleMode, canGraph, onGraphExpression }: FocusLikeContentProps) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex justify-end">
        <AngleModePopover angleMode={angleMode} onToggle={onToggleAngleMode} variant="paper" />
      </div>
      {inputField}
      <div className="rounded-xl bg-paper-soft px-5 py-4 text-center shadow-sm">
        <ResultPanel result={result} inputLatex={inputLatex} angleMode={angleMode} />
      </div>
      <GraphPlaceholder canGraph={canGraph} onGraph={onGraphExpression} />
    </div>
  );
}

/**
 * Módulo P4 ("Flotante"). Por debajo de FLOATING_MIN_WIDTH_PX (1024px,
 * `lg`) delega en <FocusScreenContent> — sin crear estado de ventanas
 * flotantes en absoluto (P0). En dt/laptop, input+resultado quedan fijos
 * arriba y Teclado/Gráfica son <FloatingWindow> independientes, con
 * posición/tamaño en useFloatingLayoutStore.ts (persistido en
 * localStorage, confirmado por el usuario, con clamp contra el viewport
 * actual al montar y al redimensionar la ventana del navegador).
 */
function FloatingScreenContent({ inputField, result, inputLatex, angleMode, onToggleAngleMode, canGraph, onGraphExpression }: FocusLikeContentProps) {
  const isWideEnough = useMinWidthMediaQuery(FLOATING_MIN_WIDTH_PX);

  const keyboardWindow = useFloatingLayoutStore((s) => s.keyboardWindow);
  const graphWindow = useFloatingLayoutStore((s) => s.graphWindow);
  const setWindow = useFloatingLayoutStore((s) => s.setWindow);
  const clampAllToViewport = useFloatingLayoutStore((s) => s.clampAllToViewport);
  const resetToDefault = useFloatingLayoutStore((s) => s.resetToDefault);

  const basicContent = useKeyboardPanelStore((s) => s.basicContent);
  const content = useKeyboardPanelStore((s) => s.content);
  const isOpen = useKeyboardPanelStore((s) => s.isOpen);
  const toggle = useKeyboardPanelStore((s) => s.toggle);
  const canExpand = basicContent !== null || content !== null;

  useEffect(() => {
    if (!isWideEnough) return;
    // Al activar Flotante (o al redimensionar la ventana del navegador
    // mientras está activo), recorta las ventanas guardadas al viewport
    // actual — mitiga el riesgo de coordenadas obsoletas señalado en P0.
    clampAllToViewport(window.innerWidth, window.innerHeight);
    function onResize() {
      clampAllToViewport(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isWideEnough, clampAllToViewport]);

  if (!isWideEnough) {
    return (
      <FocusScreenContent
        inputField={inputField}
        result={result}
        inputLatex={inputLatex}
        angleMode={angleMode}
        onToggleAngleMode={onToggleAngleMode}
        canGraph={canGraph}
        onGraphExpression={onGraphExpression}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <AngleModePopover angleMode={angleMode} onToggle={onToggleAngleMode} variant="paper" />
        <button type="button" onClick={resetToDefault} className="text-[11px] text-muted underline">
          Restablecer posición de ventanas
        </button>
      </div>
      {inputField}
      <div className="rounded-xl bg-paper-soft px-4 py-3 shadow-sm">
        <ResultPanel result={result} inputLatex={inputLatex} angleMode={angleMode} />
      </div>
      {/* Fase X, Módulo X0 — mismo criterio que precision-lab (main): el
          dock de recientes va fuera de la FloatingWindow, justo encima. */}
      <RecentKeysBar />
      {/* Fase Y (spec_rediseno_visual.md sección 11) — restricción dura:
          el teclado SIEMPRE inicia colapsado, en las 6 disposiciones sin
          excepción, Flotante incluida. Antes de este fix, la
          FloatingWindow de abajo se renderizaba sin condición alguna —
          mismo bug que se encontró y corrigió en precision-lab (main).
          Ahora: colapsado por defecto (botón dedicado, mismo ícono que
          KeyboardDock.tsx), se abre por foco en el campo de entrada
          (NaturalInput.tsx) o al presionar este botón. */}
      {isOpen && canExpand ? (
        <FloatingWindow title="Teclado" rect={keyboardWindow} onChange={(rect) => setWindow("keyboard", rect)} onClose={() => useKeyboardPanelStore.getState().close()}>
          <RegisteredKeyboardSections basic={basicContent} advanced={content} />
        </FloatingWindow>
      ) : (
        <button
          type="button"
          onClick={toggle}
          disabled={!canExpand}
          aria-expanded={isOpen}
          aria-label="Abrir teclado"
          className={
            canExpand
              ? "relative z-40 flex items-center justify-center gap-2 self-start rounded-lg bg-marker px-4 py-2 text-sm font-semibold text-chrome hover:bg-marker/90"
              : "relative z-40 flex items-center justify-center gap-2 self-start rounded-lg bg-chrome-soft px-4 py-2 text-sm text-bone/30"
          }
        >
          <KeyboardIcon className="h-4 w-4" />
          Teclado
        </button>
      )}
      <FloatingWindow title="Gráfica" rect={graphWindow} onChange={(rect) => setWindow("graph", rect)}>
        <GraphPlaceholder canGraph={canGraph} onGraph={onGraphExpression} />
      </FloatingWindow>
    </div>
  );
}
