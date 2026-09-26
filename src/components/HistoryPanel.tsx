import { useEffect, useState } from "react";
import { StaticMath } from "./StaticMath";
import { getAllHistoryEntries, clearHistory, type HistoryEntry } from "../store/historyDb";

interface HistoryPanelProps {
  onReuse: (entry: HistoryEntry) => void;
}

function naturalOperation(mode: string): string {
  const normalized = mode.toLowerCase();
  if (normalized.includes("ecuación")) return "Resolver ecuación";
  if (normalized.includes("deriv")) return "Derivada";
  if (normalized.includes("integr")) return "Integral";
  if (normalized.includes("límite") || normalized.includes("limit")) return "Límite";
  if (normalized.includes("sistema")) return "Sistema de ecuaciones";
  if (normalized.includes("descriptiva")) return "Estadística descriptiva";
  if (normalized.includes("combinatoria")) return "Combinatoria";
  if (normalized.includes("correlación")) return "Correlación";
  if (normalized.includes("grafic")) return "Gráfica";
  if (normalized.includes("matrices")) {
    const detail = mode.match(/\((.+)\)/)?.[1];
    return detail ? `Operación de matrices · ${detail}` : "Operación de matrices";
  }
  if (normalized.includes("científica")) return "Cálculo científico";
  return mode.replace(/[_-]+/g, " ");
}

function formatDateTime(timestamp: number): { date: string; time: string } {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" }),
    time: date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  };
}

function parseMatrices(input: string): Array<{ name: string; values: unknown[][] }> | null {
  try {
    const parsed = JSON.parse(input) as Record<string, unknown>;
    const matrices = Object.entries(parsed)
      .filter(([, value]) => Array.isArray(value) && (value as unknown[]).every((row) => Array.isArray(row)))
      .map(([name, value]) => ({ name, values: value as unknown[][] }));
    return matrices.length ? matrices : null;
  } catch {
    return null;
  }
}

function parseMatrixResult(value: string): unknown[][] | null {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every((row) => Array.isArray(row))) return parsed as unknown[][];
  } catch {
    // Puede venir como LaTeX.
  }
  const match = value.match(/\\begin\{(?:bmatrix|pmatrix|matrix)\}([\s\S]*?)\\end\{(?:bmatrix|pmatrix|matrix)\}/);
  if (!match) return null;
  return match[1]
    .split(/\\\\/)
    .map((row) => row.split("&").map((cell) => cell.trim()))
    .filter((row) => row.length > 0);
}

function MatrixGridPreview({ name, values }: { name: string; values: unknown[][] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-muted">{name} =</span>
      <div className="rounded-lg border border-paper-line bg-paper-soft px-2 py-1">
        {values.map((row, index) => (
          <div key={index} className="grid grid-flow-col auto-cols-min justify-center gap-2 font-mono text-xs text-ink">
            {row.map((value, column) => <span key={column}>{String(value)}</span>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function MatrixPreview({ input }: { input: string }) {
  const matrices = parseMatrices(input);
  if (!matrices) return <p className="mt-1 break-words text-sm font-medium text-ink">{input}</p>;
  return (
    <div className="mt-2 flex flex-wrap gap-3">
      {matrices.map(({ name, values }) => (
        <MatrixGridPreview key={name} name={name} values={values} />
      ))}
    </div>
  );
}

function MathOrText({ value, className }: { value: string; className: string }) {
  const looksLikeLatex = /\\[a-zA-Z]+|[{}^_]/.test(value);
  return looksLikeLatex
    ? <StaticMath latex={value} className={className} />
    : <span className={className}>{value}</span>;
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

      {loading && <div className="rounded-xl border border-paper-line bg-paper p-4 text-sm text-muted">Cargando…</div>}
      {!loading && entries.length === 0 && (
        <div className="rounded-xl border border-dashed border-paper-line bg-paper p-6 text-center">
          <p className="text-sm font-medium text-ink">Todavía no hay cálculos guardados.</p>
          <p className="mt-1 text-xs text-muted">Los cálculos que guardes aparecerán aquí, del más reciente al más antiguo.</p>
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {entries.map((entry) => {
          const when = formatDateTime(entry.timestamp);
          const isMatrix = (entry.module ?? "").toLowerCase() === "matrices";
          return (
            <li key={entry.id} className="rounded-xl border border-paper-line bg-paper p-3 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-marker-soft px-2 py-0.5 text-[10px] font-semibold text-marker-text">
                      {entry.module ?? "Científica"}
                    </span>
                    <span className="text-[11px] font-medium text-muted">{naturalOperation(entry.mode)}</span>
                  </div>

                  {isMatrix
                    ? <MatrixPreview input={entry.input} />
                    : <div className="mt-2 text-sm font-medium text-ink"><MathOrText value={entry.input} className="text-sm font-medium text-ink" /></div>}

                  {entry.resultSummary && (() => {
                    const matrixResult = isMatrix ? parseMatrixResult(entry.resultSummary) : null;
                    return matrixResult ? (
                      <div className="mt-3">
                        <MatrixGridPreview name="Resultado" values={matrixResult} />
                      </div>
                    ) : (
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">Resultado</span>
                        <MathOrText value={entry.resultSummary} className="text-sm font-medium text-marker-text" />
                      </div>
                    );
                  })()}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <time className="text-right text-[10px] leading-4 text-muted" dateTime={new Date(entry.timestamp).toISOString()}>
                    <span className="block">{when.date}</span>
                    <span className="block">{when.time}</span>
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
          );
        })}
      </ul>
    </div>
  );
}
