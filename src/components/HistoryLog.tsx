import { StaticMath } from "./StaticMath";
import type { MathResult } from "../types";

// B7: esta superficie representa únicamente las entradas recientes de la
// sesión actual. El Historial persistente sigue viviendo aparte.

export interface SessionHistoryEntry {
  id: string;
  input: string;
  result: MathResult;
}

interface HistoryLogProps {
  entries: SessionHistoryEntry[];
  maxVisible?: number;
  onReuse?: (entry: SessionHistoryEntry) => void;
}

export function HistoryLog({ entries, maxVisible = 5, onReuse }: HistoryLogProps) {
  if (entries.length === 0) return null;

  const visible = entries.slice(-maxVisible).reverse();

  return (
    <ol aria-label="Entradas previas de esta sesión" className="flex min-w-0 flex-col gap-1.5">
      {visible.map((entry, index) => {
        const content = (
          <>
            <span className="min-w-0 flex-1 overflow-hidden text-left">
              <StaticMath latex={entry.input} className="text-sm text-ink" />
            </span>
            {entry.result.success ? (
              <StaticMath
                latex={entry.result.resultLatex ?? ""}
                className="max-w-[45%] shrink-0 overflow-hidden text-sm font-medium text-marker-text"
              />
            ) : (
              <span className="shrink-0 text-xs text-muted">sin resultado</span>
            )}
          </>
        );

        return (
          <li key={entry.id} className={index === 0 ? "opacity-100" : index < 3 ? "opacity-80" : "opacity-65"}>
            {onReuse ? (
              <button
                type="button"
                onClick={() => onReuse(entry)}
                aria-label={`Reusar entrada ${index + 1}`}
                title="Reusar en Entrada"
                className="flex w-full min-w-0 items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-paper-line/40 focus:outline-none focus:ring-2 focus:ring-marker/50"
              >
                {content}
              </button>
            ) : (
              <div className="flex min-w-0 items-center justify-between gap-3 rounded-lg px-2 py-1.5">
                {content}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
