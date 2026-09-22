import type { GraphAnalysis } from "../engine/stepEngine/graphing";

// GraphViewer — spec v10 §10. Renderiza en SVG puro a partir de los puntos
// ya muestreados por `analyzeGraph()`, en vez de usar function-plot: evita
// añadir otra dependencia externa no verificada en este entorno sin red
// (ver README, Módulo 7, "cambio de enfoque declarado").
//
// Fase D (spec UX estilo ClassCalc §6): ahora dibuja VARIAS curvas
// superpuestas (antes solo una) — layout Desmos, cada expresión de la
// lista tiene su propio color. Las anotaciones ricas (intercepciones,
// extremos, inflexión, vértice) solo se muestran para la curva
// "seleccionada" — mostrarlas todas a la vez para cada curva sería
// ilegible con más de una expresión activa, igual que hace Desmos.

export interface GraphCurve {
  id: string;
  color: string;
  analysis: GraphAnalysis;
}

const WIDTH = 340;
const HEIGHT = 280;
const PADDING = 24;

function buildSegmentedPath(samples: { x: number; y: number }[], view: [number, number]): string {
  if (samples.length === 0) return "";
  const expectedStep = Math.abs(view[1] - view[0]) / 2000;
  return samples
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = samples[i - 1];
      const gap = Math.abs(p.x - prev.x) > expectedStep * 1.5;
      const asymptoticJump =
        Math.sign(p.y) !== Math.sign(prev.y) && Math.min(Math.abs(p.y), Math.abs(prev.y)) > 50;
      return `${gap || asymptoticJump ? "M" : "L"} ${p.x} ${p.y}`;
    })
    .join(" ");
}

interface GraphViewerProps {
  curves: GraphCurve[];
  selectedId: string | null;
  view: [number, number];
  // Fase F (spec_edo_complejos_tooltips.md §3.4, Módulo F3): reutiliza
  // este mismo componente (mismo mecanismo de "pintar un círculo suelto"
  // que ya usan xIntercepts/localMaxima/etc. más abajo) para un número
  // complejo evaluado en vez de un punto notable de una curva. `curves`
  // puede venir vacío (graficar SOLO el punto, sin ninguna curva de
  // fondo) -- por eso `allYs` de abajo incluye `argandPoint.im` cuando
  // está presente, para que el punto nunca quede fuera del rango
  // vertical calculado incluso sin curvas.
  argandPoint?: { re: number; im: number } | null;
  /** "Re"/"Im" en vez de las líneas de eje sin etiqueta de siempre --
   * opcional, default sin etiquetas (comportamiento exactamente igual
   * al de antes de este módulo cuando se omite). */
  axisLabels?: { x: string; y: string };
}

export function GraphViewer({ curves, selectedId, view, argandPoint = null, axisLabels }: GraphViewerProps) {
  const [xMin, xMax] = view;
  const allYs = curves.flatMap((c) => c.analysis.samples.map((p) => p.y));
  if (argandPoint) allYs.push(argandPoint.im);
  const yMin = Math.min(...allYs, -1);
  const yMax = Math.max(...allYs, 1);

  const toScreenX = (x: number) => PADDING + ((x - xMin) / (xMax - xMin)) * (WIDTH - 2 * PADDING);
  const toScreenY = (y: number) => HEIGHT - PADDING - ((y - yMin) / (yMax - yMin)) * (HEIGHT - 2 * PADDING);

  const axisXScreen = toScreenY(0);
  const axisYScreen = toScreenX(0);
  const selected = curves.find((c) => c.id === selectedId) ?? curves[0];

  return (
    <div className="rounded-xl bg-chrome p-2">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full">
        {yMin <= 0 && yMax >= 0 && (
          <line x1={PADDING} y1={axisXScreen} x2={WIDTH - PADDING} y2={axisXScreen} stroke="#475569" strokeWidth={1} />
        )}
        {xMin <= 0 && xMax >= 0 && (
          <line x1={axisYScreen} y1={PADDING} x2={axisYScreen} y2={HEIGHT - PADDING} stroke="#475569" strokeWidth={1} />
        )}

        {curves.map((curve) => {
          const rawPath = buildSegmentedPath(curve.analysis.samples, view);
          const pathD = rawPath.replace(/([ML]) ([^ ]+) ([^ ]+)/g, (_m, cmd, x, y) =>
            `${cmd} ${toScreenX(Number(x)).toFixed(1)} ${toScreenY(Number(y)).toFixed(1)}`,
          );
          return (
            <path
              key={curve.id}
              d={pathD}
              fill="none"
              stroke={curve.color}
              strokeWidth={curve.id === selected?.id ? 2.5 : 1.5}
              opacity={curve.id === selected?.id ? 1 : 0.55}
            />
          );
        })}

        {selected && (
          <>
            {selected.analysis.xIntercepts.map((x, i) => (
              <circle key={`xi-${i}`} cx={toScreenX(x)} cy={toScreenY(0)} r={3} fill="#22c55e" />
            ))}
            {selected.analysis.yIntercept !== null && (
              <circle cx={toScreenX(0)} cy={toScreenY(selected.analysis.yIntercept)} r={3} fill="#22c55e" />
            )}
            {selected.analysis.localMaxima.map((p, i) => (
              <circle key={`max-${i}`} cx={toScreenX(p.x)} cy={toScreenY(p.y)} r={4} fill="#f59e0b" />
            ))}
            {selected.analysis.localMinima.map((p, i) => (
              <circle key={`min-${i}`} cx={toScreenX(p.x)} cy={toScreenY(p.y)} r={4} fill="#f97316" />
            ))}
            {selected.analysis.inflectionPoints.map((p, i) => (
              <rect key={`inf-${i}`} x={toScreenX(p.x) - 3} y={toScreenY(p.y) - 3} width={6} height={6} fill="#a855f7" />
            ))}
            {selected.analysis.vertex && (
              <circle cx={toScreenX(selected.analysis.vertex.x)} cy={toScreenY(selected.analysis.vertex.y)} r={5} fill="#ef4444" />
            )}
          </>
        )}
        {argandPoint && (
          <circle
            cx={toScreenX(argandPoint.re)}
            cy={toScreenY(argandPoint.im)}
            r={5}
            fill="#3b82f6"
            stroke="#1e3a8a"
            strokeWidth={1.5}
          />
        )}

        {axisLabels && (
          <>
            <text x={WIDTH - PADDING - 2} y={axisXScreen - 4} fontSize={10} fill="#94a3b8" textAnchor="end">
              {axisLabels.x}
            </text>
            <text x={axisYScreen + 4} y={PADDING + 8} fontSize={10} fill="#94a3b8">
              {axisLabels.y}
            </text>
          </>
        )}
      </svg>
      <div className="mt-1 flex flex-wrap gap-3 text-xs text-bone/60">
        <span><span className="inline-block h-2 w-2 rounded-full bg-green-500" /> intercepciones</span>
        <span><span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> máximo local</span>
        <span><span className="inline-block h-2 w-2 rounded-full bg-orange-500" /> mínimo local</span>
        <span><span className="inline-block h-2 w-2 bg-purple-500" /> inflexión</span>
        <span><span className="inline-block h-2 w-2 rounded-full bg-red-500" /> vértice</span>
        <span className="text-bone/40">(anotaciones solo de la curva seleccionada)</span>
      </div>
    </div>
  );
}
