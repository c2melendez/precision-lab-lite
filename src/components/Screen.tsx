import { NaturalInput } from "./NaturalInput";
import { ResultPanel } from "./ResultPanel";
import { HistoryLog, type SessionHistoryEntry } from "./HistoryLog";
import { AngleModePopover } from "./AngleModePopover";
import type { MathResult } from "../types";

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
  /** Módulo 6 (spec §7): "fused" (default) es el diseño de Fase E de
   * siempre. "separated" vuelve a 3 tarjetas independientes (como se
   * veía antes de Fase E) — mismas piezas (HistoryLog/NaturalInput/
   * ResultPanel), cada una con su propio fondo/borde/sombra en vez de
   * compartir el contenedor fusionado. */
  layoutMode?: "fused" | "separated";
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
}: ScreenProps) {
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

  if (layoutMode === "separated") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex justify-end">
          <AngleModePopover angleMode={angleMode} onToggle={onToggleAngleMode} variant="paper" />
        </div>
        {sessionHistory.length > 0 && (
          <div className="max-h-28 overflow-y-auto rounded-xl bg-paper-soft px-4 py-3 shadow-sm">
            <HistoryLog entries={sessionHistory} />
          </div>
        )}
        <div className="rounded-xl bg-paper-soft px-4 py-3 shadow-sm">{inputField}</div>
        <div className="rounded-xl bg-paper-soft px-4 py-3 shadow-sm">
          <ResultPanel result={result} />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-paper-soft px-4 py-3 shadow-inner shadow-black/10">
      <div className="mb-1.5 flex justify-end">
        <AngleModePopover angleMode={angleMode} onToggle={onToggleAngleMode} variant="paper" />
      </div>

      {sessionHistory.length > 0 && (
        <div className="mb-2 max-h-28 overflow-y-auto border-b border-paper-line pb-2">
          <HistoryLog entries={sessionHistory} />
        </div>
      )}

      {inputField}
      <ResultPanel result={result} />
    </div>
  );
}
