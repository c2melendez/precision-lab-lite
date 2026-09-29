/**
 * B7 — vista previa ligera de Científica.
 *
 * Preview uses the same graph worker as the full graphing mode.
 */
import { useEffect, useState } from "react";
import type { GraphAnalysis } from "../engine/stepEngine/graphing";
import type { MathResult } from "../types";
import { parseExpression } from "../engine/parsing";
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
  expression?: string | null;
  variable?: string;
  integral?: boolean;
  bounds?: [number, number] | null;
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
  expression,
  variable = "x",
  integral = false,
  bounds = null,
}: GraphPlaceholderProps) {
  const canOpenGraphing = Boolean(onGraph) && canGraph && (state === "available" || state === "advanced");
  const [analysis, setAnalysis] = useState<GraphAnalysis | null>(null);
  const [antiderivative, setAntiderivative] = useState<GraphAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const definite = integral && bounds !== null;
  const view: [number, number] = bounds
    ? [Math.min(-10, bounds[0], bounds[1]), Math.max(10, bounds[0], bounds[1])]
    : [-10, 10];

  useEffect(() => {
    setAnalysis(null);
    setAntiderivative(null);
    if (!expression || state !== "available") { setLoading(false); return; }
    const worker = new Worker(new URL("../workers/compute.worker.ts", import.meta.url), { type: "module" });
    const timeout = window.setTimeout(() => {
      setLoading(true);
      worker.postMessage({ type: "graph", requestId: "scientific-preview-integrand", expressionAlgebrite: expression, variable, view });
    }, 120);
    worker.onmessage = (event: MessageEvent<MathResult>) => {
      const data = event.data;
      if (data.requestId === "scientific-preview-integrand") {
        setAnalysis(data.success ? data.graphAnalysis as GraphAnalysis : null);
        if (integral && !definite && data.success) {
          worker.postMessage({ type: "evaluate", requestId: "scientific-preview-integral", expressionAlgebrite: `integral(${expression},${variable})` });
        } else setLoading(false);
      } else if (data.requestId === "scientific-preview-integral") {
        try {
          if (!data.success || !data.resultLatex) throw new Error("No antiderivative");
          const latex = data.resultLatex.replace(/\s*\+\s*C\s*$/, "");
          const parsed = parseExpression(latex, "RAD");
          worker.postMessage({ type: "graph", requestId: "scientific-preview-antiderivative", expressionAlgebrite: parsed.algebrite, variable, view });
        } catch { setLoading(false); }
      } else if (data.requestId === "scientific-preview-antiderivative") {
        setAntiderivative(data.success ? data.graphAnalysis as GraphAnalysis : null);
        setLoading(false);
      }
    };
    return () => { window.clearTimeout(timeout); worker.terminate(); };
  }, [expression, variable, state, integral, bounds?.[0], bounds?.[1]]);

  const samples = analysis?.samples ?? [];
  const visibleYs = [...samples, ...(antiderivative?.samples ?? [])].map((point) => point.y).filter((value) => Number.isFinite(value) && Math.abs(value) < 100);
  const minY = Math.min(-1, ...visibleYs);
  const maxY = Math.max(1, ...visibleYs);
  const ySpan = maxY - minY;
  const projectX = (x: number) => 16 + (x - view[0]) * 268 / (view[1] - view[0]);
  const projectY = (y: number) => 204 - (y - minY) * 188 / ySpan;
  const makeCurve = (points: typeof samples) => {
    let previousX = NaN;
    let previousY = NaN;
    return points.reduce((path, point) => {
      const x = projectX(point.x);
      const y = projectY(point.y);
      const discontinuity = !Number.isFinite(previousX) || x - previousX > 1.2 || Math.abs(y - previousY) > 110;
      previousX = x; previousY = y;
      return Number.isFinite(y) && y > -500 && y < 700
        ? `${path}${discontinuity ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)} ` : path;
    }, "");
  };
  const curve = makeCurve(samples);
  const integralCurve = makeCurve(antiderivative?.samples ?? []);
  const regionPoints = bounds && samples.filter((point) => point.x >= Math.min(...bounds) && point.x <= Math.max(...bounds)
    && Number.isFinite(point.y) && Math.abs(point.y) < 100);
  const region = regionPoints?.length
    ? `M${projectX(regionPoints[0].x).toFixed(1)},${projectY(0).toFixed(1)} `
      + regionPoints.map((point) => `L${projectX(point.x).toFixed(1)},${projectY(point.y).toFixed(1)}`).join(" ")
      + ` L${projectX(regionPoints[regionPoints.length - 1].x).toFixed(1)},${projectY(0).toFixed(1)} Z`
    : "";

  return (
    <section
      data-testid="scientific-graph"
      aria-label="Vista previa de gráfica"
      className="flex min-h-[360px] flex-1 flex-col rounded-xl border border-paper-line bg-paper-soft/60"
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
              aria-label={analysis ? `Gráfica de ${variable}` : "Vista previa de gráfica pendiente"}
              className="grid h-[min(52vh,420px)] min-h-[270px] w-full place-items-center overflow-hidden rounded-lg border border-paper-line bg-paper/50"
            >
              {analysis && curve ? (
                <svg data-testid="scientific-preview-plot" viewBox="0 0 300 220" preserveAspectRatio="none" className="h-full w-full text-graph" aria-hidden="true">
                  <line x1={projectX(0)} x2={projectX(0)} y1="0" y2="220" stroke="currentColor" opacity="0.2" />
                  {minY <= 0 && maxY >= 0 && <line x1="0" x2="300" y1={projectY(0)} y2={projectY(0)} stroke="currentColor" opacity="0.2" />}
                  {region && <path data-testid="integral-region" d={region} fill="#16865d" opacity="0.25" />}
                  <path data-testid="integrand-curve" d={curve} fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                  {integralCurve && <path data-testid="antiderivative-curve" d={integralCurve} fill="none" stroke="#f07820" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />}
                </svg>
              ) : <span className="text-xs text-muted">{loading ? "Preparando vista previa…" : "No hay curva real visible para esta expresión"}</span>}
            </div>
            <p className="text-xs text-muted">{definite
              ? `Área bajo la curva de ${bounds[0]} a ${bounds[1]} en verde`
              : integral
              ? <>Integrando <span className="text-graph">azul</span>{antiderivative ? <>, antiderivada <span style={{ color: "#f07820" }}>naranja</span> (C=0)</> : loading ? ", calculando antiderivada…" : ""}{bounds ? `; área de ${bounds[0]} a ${bounds[1]} en verde` : ""}</>
              : `Curva de la función en ${variable} ∈ [−10, 10]`}</p>
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
