/**
 * B7 — vista previa ligera de Científica.
 *
 * Este componente NO analiza matemática por sí mismo. Recibe un estado
 * semántico del orquestador y ofrece el puente explícito al módulo
 * Gráficas cuando existe contexto reutilizable.
 */
export type ScientificGraphState =
  | "empty"
  | "available"
  | "not-needed"
  | "advanced"
  | "unavailable";

interface GraphPlaceholderProps {
  canGraph?: boolean;
  onGraph?: () => void;
  state?: ScientificGraphState;
  message?: string;
}

const STATE_COPY: Record<Exclude<ScientificGraphState, "available">, string> = {
  empty: "Escribe o resuelve una expresión para preparar una vista previa.",
  "not-needed": "Representación gráfica no necesaria. El resultado no requiere una gráfica para su interpretación.",
  advanced: "Esta operación requiere una representación más avanzada. Puedes continuar el análisis en Gráficas.",
  unavailable: "No hay una representación gráfica útil disponible para esta operación.",
};

export function GraphPlaceholder({
  canGraph = false,
  onGraph,
  state = canGraph ? "available" : "empty",
  message,
}: GraphPlaceholderProps) {
  const canOpenGraphing = Boolean(onGraph) && canGraph && (state === "available" || state === "advanced");

  return (
    <section
      data-testid="scientific-graph"
      aria-label="Vista previa de gráfica"
      className="flex min-h-[110px] flex-1 flex-col rounded-xl border border-paper-line bg-paper-soft/60"
    >
      <div className="flex items-center justify-between border-b border-paper-line px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Vista previa de gráfica</p>
        <span className="text-[10px] font-medium text-muted">Científica</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6 text-center">
        {state === "available" ? (
          <>
            <div
              role="img"
              aria-label="Vista previa pendiente de renderizado contextual"
              className="grid h-24 w-full max-w-md place-items-center rounded-lg border border-dashed border-paper-line bg-paper/50"
            >
              <span className="text-[11px] text-muted">Vista previa contextual</span>
            </div>
            <p className="max-w-md text-[11px] text-muted">
              La vista ampliada conserva la expresión y el contexto matemático de la operación.
            </p>
          </>
        ) : (
          <p className="max-w-md text-xs leading-relaxed text-muted">{message ?? STATE_COPY[state]}</p>
        )}

        {canOpenGraphing && (
          <button
            type="button"
            onClick={onGraph}
            className="rounded-md bg-marker px-3 py-1.5 text-xs font-semibold text-chrome hover:bg-marker/90"
          >
            Abrir en Gráficas
          </button>
        )}
      </div>
    </section>
  );
}
