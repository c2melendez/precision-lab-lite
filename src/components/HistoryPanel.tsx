import { useEffect, useState } from "react";
import { getAllHistoryEntries, clearHistory, type HistoryEntry } from "../store/historyDb";

// FIX (auditoría Fase 0 v2): este componente usaba clases bg-panel/
// text-slate-*/text-accent que ya no existen en tailwind.config.js desde
// la Fase 1 (mismo bug ya corregido antes en ResultPanel.tsx y
// MatrixGridInput.tsx, pero este archivo había quedado sin actualizar).

interface HistoryPanelProps {
  onReuse: (entry: HistoryEntry) => void;
}

export function HistoryPanel({ onReuse }: HistoryPanelProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setEntries(await getAllHistoryEntries());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-end">
        <button
          onClick={async () => {
            await clearHistory();
            load();
          }}
          className="rounded-lg border border-paper-line bg-paper px-3 py-2 text-xs font-medium text-ink hover:bg-paper-line/40"
        >
          Borrar todo
        </button>
      </div>

      {loading && (
        <div className="rounded-xl border border-paper-line bg-paper p-4 text-sm text-muted">Cargando…</div>
      )}
      {!loading && entries.length === 0 && (
        <div className="rounded-xl border border-dashed border-paper-line bg-paper p-6 text-center">
          <p className="text-sm font-medium text-ink">Todavía no hay cálculos guardados.</p>
          <p className="mt-1 text-xs text-muted">Los cálculos que guardes aparecerán aquí, del más reciente al más antiguo.</p>
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {entries.map((entry) => (
          <li key={entry.id} className="rounded-xl border border-paper-line bg-paper p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-marker-soft px-2 py-0.5 text-[10px] font-semibold text-marker-text">
                    {entry.module ?? "Científica"}
                  </span>
                  <span className="text-[10px] font-medium text-muted">{entry.mode}</span>
                </div>
                <p className="mt-1 break-words text-sm font-medium text-ink">{entry.input}</p>
                <p className="mt-1 break-words text-sm text-marker">{entry.resultSummary}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <time className="text-[10px] text-muted" dateTime={new Date(entry.timestamp).toISOString()}>
                  {new Date(entry.timestamp).toLocaleString()}
                </time>
                <button
                  type="button"
                  onClick={() => onReuse(entry)}
                  aria-label={`Reusar entrada: ${entry.input}`}
                  className="rounded-lg border border-paper-line bg-paper-soft px-3 py-1.5 text-xs font-medium text-ink hover:bg-paper-line/40"
                >
                  Reusar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
