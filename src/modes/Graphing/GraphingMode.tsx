import { useCallback, useEffect, useRef, useState } from "react";
import { NaturalInput } from "../../components/NaturalInput";
import { GraphViewer, type GraphCurve } from "../../components/GraphViewer";
import { GraphViewer3D } from "../../components/GraphViewer3D";
import { makeRequestId, type MathResult } from "../../types";
import { parseExpression } from "../../engine/parsing";
import type { GraphAnalysis, GraphSurface3D } from "../../engine/stepEngine/graphing";
import { addHistoryEntry } from "../../store/historyDb";
import { useGraphColorPaletteStore } from "../../store/useGraphColorPaletteStore";
import { useArgandBridgeStore } from "../../store/useArgandBridgeStore";
import { usePendingGraphStore } from "../../store/usePendingGraphStore";

// Modo 6 de la spec v10 §10 (Módulo 7 — el de mayor riesgo del proyecto,
// según la propia spec). Ver README del Módulo 7 sobre el cambio de
// enfoque: todo el análisis es numérico (muestreo + diferencias finitas),
// no un híbrido simbólico-primero. Por eso TODO resultado aquí se marca
// "aproximado", visible en la UI, nunca presentado como exacto.
//
// Fase D (spec UX estilo ClassCalc §6): layout Desmos — lista de
// expresiones a la izquierda (cada una con su color, graficada
// simultáneamente) + lienzo a la derecha con zoom/centrado, en vez de una
// sola expresión a la vez. Se reutiliza el mismo worker "graph" (spec
// v10 §3/§12: el cómputo pesado no sale del worker) — se le pide una
// gráfica por cada expresión activa, correlacionando resultados por
// requestId.

// Fase T, Módulo T0: CURVE_COLORS se unificó en
// useGraphColorPaletteStore.ts — ver el hook dentro de GraphingMode().

interface ExpressionEntry {
  id: string;
  latex: string;
  // Solo se usa cuando kind === "parametric": componente y(t). En
  // cartesiana/polar/3d queda vacío y sin uso — evita duplicar la lista
  // de entradas por tipo de gráfica (mismo patrón que ya traía la
  // sidebar).
  yLatex: string;
  color: string;
  analysis: GraphAnalysis | null;
  // Módulo J2: solo se llena cuando kind === "3d" — forma de dato
  // distinta a GraphAnalysis (ver comentario de cabecera de
  // GraphSurface3D en graphing.ts), por eso es un campo aparte y no un
  // caso más dentro de `analysis`.
  surface3D: GraphSurface3D | null;
  error: string | null;
}

function makeEntry(color: string): ExpressionEntry {
  return { id: makeRequestId(), latex: "", yLatex: "", color, analysis: null, surface3D: null, error: null };
}

export function GraphingMode() {
  // Fase T, Módulo T0: CURVE_COLORS unificado en
  // useGraphColorPaletteStore.ts (antes vivía como constante de módulo
  // aquí, duplicada con la de GraphMode.tsx en main).
  const colors = useGraphColorPaletteStore((s) => s.colors);
  const [kind, setKind] = useState<"cartesian" | "polar" | "parametric" | "3d">("cartesian");
  const [entries, setEntries] = useState<ExpressionEntry[]>([makeEntry(colors[0])]);
  const [selectedId, setSelectedId] = useState<string | null>(entries[0]?.id ?? null);
  const [view, setView] = useState<[number, number]>([-10, 10]);
  const [thetaRange, setThetaRange] = useState<[number, number]>([0, 2 * Math.PI]);
  const [tRange, setTRange] = useState<[number, number]>([0, 2 * Math.PI]);
  const [xRange3D, setXRange3D] = useState<[number, number]>([-5, 5]);
  const [yRange3D, setYRange3D] = useState<[number, number]>([-5, 5]);

  // M35: una entrada conserva su análisis y contenido, pero su color debe
  // reflejar siempre la paleta activa. Antes el color se fijaba solo al
  // crear la expresión, por lo que cambiar Ajustes no recoloreaba curvas
  // existentes. Reasignamos por índice cuando cambia la paleta.
  useEffect(() => {
    setEntries((prev) =>
      prev.map((entry, index) => {
        const nextColor = colors[index % colors.length];
        return entry.color === nextColor ? entry : { ...entry, color: nextColor };
      }),
    );
  }, [colors]);

  // Fase F (Módulo F3): punto de Argand pendiente de mostrar, ver
  // useArgandBridgeStore.ts. Se copia a estado local al consumirlo (y se
  // limpia el store) para que quede fijo en pantalla aunque el store se
  // reutilice después para otro punto -- mismo criterio que
  // `pendingGraphResult` en main.
  const pendingArgandPoint = useArgandBridgeStore((s) => s.pendingArgandPoint);
  const setPendingArgandPoint = useArgandBridgeStore((s) => s.setPendingArgandPoint);
  const [argandPoint, setArgandPoint] = useState<{ re: number; im: number } | null>(null);

  useEffect(() => {
    if (pendingArgandPoint !== null) {
      setArgandPoint({ re: pendingArgandPoint.re, im: pendingArgandPoint.im });
      const margin = Math.max(Math.abs(pendingArgandPoint.re), Math.abs(pendingArgandPoint.im), 1) * 1.5;
      setView([-margin, margin]);
      setPendingArgandPoint(null);
    }
  }, [pendingArgandPoint, setPendingArgandPoint]);

  // Botón "Graficar" explícito en GraphPlaceholder.tsx (decisión de
  // producto confirmada por Carlos), ver usePendingGraphStore.ts. Se
  // sobreescribe la primera expresión (misma convención que "nueva
  // gráfica" -- una sola entrada al llegar de otro modo) y se manda a
  // graficar de inmediato con `submitEntry`, que ya hace toda la
  // validación real (parseExpression + freeVariables.length === 1) --
  // no se duplica esa lógica aquí. Si no es graficable, el error
  // aparece en la propia ficha de la expresión, por el canal normal.
  const pendingGraphExpression = usePendingGraphStore((s) => s.pendingExpression);
  const clearPendingGraphExpression = usePendingGraphStore((s) => s.clearPendingExpression);
  useEffect(() => {
    if (pendingGraphExpression === null) return;
    setKind("cartesian");
    const updated = { ...entries[0], latex: pendingGraphExpression };
    setEntries((prev) => (prev.length > 0 ? [updated, ...prev.slice(1)] : [updated]));
    submitEntry(updated);
    clearPendingGraphExpression();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingGraphExpression, clearPendingGraphExpression]);

  const workerRef = useRef<Worker | null>(null);
  const requestToEntryRef = useRef<Map<string, string>>(new Map());

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../../workers/compute.worker.ts", import.meta.url),
        { type: "module" },
      );
      workerRef.current.onmessage = (e: MessageEvent<MathResult>) => {
        const entryId = requestToEntryRef.current.get(e.data.requestId);
        if (!entryId) return;
        requestToEntryRef.current.delete(e.data.requestId);
        setEntries((prev) =>
          prev.map((entry) => {
            if (entry.id !== entryId) return entry;
            if (!e.data.success) {
              return { ...entry, analysis: null, surface3D: null, error: e.data.errorMessage ?? "No se pudo graficar." };
            }
            // Se distingue por la forma real del mensaje recibido
            // (graphSurface3D vs graphAnalysis), no por el `kind` actual
            // de la UI — evita una condición de carrera si el usuario
            // cambia de tipo de gráfica mientras una respuesta vieja del
            // worker todavía está en camino.
            if (e.data.graphSurface3D) {
              return { ...entry, surface3D: e.data.graphSurface3D as GraphSurface3D, analysis: null, error: null };
            }
            return { ...entry, analysis: e.data.graphAnalysis as GraphAnalysis, surface3D: null, error: null };
          }),
        );
        if (e.data.success) {
          addHistoryEntry({ module: "Gráficas", mode: "Graficación", input: "", resultSummary: e.data.resultLatex ?? "" });
        }
      };
    }
    return workerRef.current;
  }, []);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      requestToEntryRef.current.clear();
    };
  }, []);

  const graphEntry = useCallback(
    (
      entry: ExpressionEntry,
      currentView: [number, number],
      currentThetaRange: [number, number],
      currentTRange: [number, number],
      currentXRange3D: [number, number],
      currentYRange3D: [number, number],
    ) => {
      if (kind === "3d") {
        if (entry.latex.trim() === "") return;
        let parsed;
        try {
          parsed = parseExpression(entry.latex);
        } catch (err) {
          setEntries((prev) =>
            prev.map((e) =>
              e.id === entry.id ? { ...e, surface3D: null, error: (err as { message?: string }).message ?? "Expresión inválida." } : e,
            ),
          );
          return;
        }
        if (parsed.freeVariables.length !== 2) {
          setEntries((prev) =>
            prev.map((e) =>
              e.id === entry.id
                ? { ...e, surface3D: null, error: "z=f(x,y) debe tener exactamente dos variables (ej. x, y)." }
                : e,
            ),
          );
          return;
        }
        const [varX, varY] = parsed.freeVariables;
        const requestId = makeRequestId();
        requestToEntryRef.current.set(requestId, entry.id);
        getWorker().postMessage({
          type: "graphSurface3D",
          requestId,
          expressionAlgebrite: parsed.algebrite,
          varX,
          varY,
          xRange: currentXRange3D,
          yRange: currentYRange3D,
        });
        return;
      }

      if (kind === "parametric") {
        if (entry.latex.trim() === "" || entry.yLatex.trim() === "") return;
        let parsedX;
        let parsedY;
        try {
          parsedX = parseExpression(entry.latex);
          parsedY = parseExpression(entry.yLatex);
        } catch (err) {
          setEntries((prev) =>
            prev.map((e) =>
              e.id === entry.id ? { ...e, analysis: null, error: (err as { message?: string }).message ?? "Expresión inválida." } : e,
            ),
          );
          return;
        }
        if (parsedX.freeVariables.length !== 1 || parsedY.freeVariables.length !== 1) {
          setEntries((prev) =>
            prev.map((e) =>
              e.id === entry.id
                ? { ...e, analysis: null, error: "x(t) e y(t) deben tener exactamente una variable cada una (ej. t)." }
                : e,
            ),
          );
          return;
        }
        const parameter = parsedX.freeVariables[0];
        if (parsedY.freeVariables[0] !== parameter) {
          setEntries((prev) =>
            prev.map((e) =>
              e.id === entry.id
                ? { ...e, analysis: null, error: `x(t) usa "${parameter}" pero y(t) usa "${parsedY.freeVariables[0]}" — deben ser el mismo parámetro.` }
                : e,
            ),
          );
          return;
        }
        const requestId = makeRequestId();
        requestToEntryRef.current.set(requestId, entry.id);
        getWorker().postMessage({
          type: "graphParametric",
          requestId,
          xExpressionAlgebrite: parsedX.algebrite,
          yExpressionAlgebrite: parsedY.algebrite,
          parameter,
          tRange: currentTRange,
        });
        return;
      }

      if (entry.latex.trim() === "") return;
      let parsed;
      try {
        parsed = parseExpression(entry.latex);
      } catch (err) {
        setEntries((prev) =>
          prev.map((e) =>
            e.id === entry.id ? { ...e, analysis: null, error: (err as { message?: string }).message ?? "Expresión inválida." } : e,
          ),
        );
        return;
      }
      if (parsed.freeVariables.length !== 1) {
        setEntries((prev) =>
          prev.map((e) =>
            e.id === entry.id
              ? {
                  ...e,
                  analysis: null,
                  error:
                    kind === "polar"
                      ? "La expresión debe tener exactamente una variable (ej. theta)."
                      : "La expresión debe tener exactamente una variable (ej. x).",
                }
              : e,
          ),
        );
        return;
      }
      const requestId = makeRequestId();
      requestToEntryRef.current.set(requestId, entry.id);
      if (kind === "polar") {
        getWorker().postMessage({
          type: "graphPolar",
          requestId,
          expressionAlgebrite: parsed.algebrite,
          variable: parsed.freeVariables[0],
          thetaRange: currentThetaRange,
        });
      } else {
        getWorker().postMessage({
          type: "graph",
          requestId,
          expressionAlgebrite: parsed.algebrite,
          variable: parsed.freeVariables[0],
          view: currentView,
        });
      }
    },
    [getWorker, kind],
  );

  function updateLatex(id: string, latex: string) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, latex } : e)));
  }

  function updateYLatex(id: string, yLatex: string) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, yLatex } : e)));
  }

  function submitEntry(entry: ExpressionEntry) {
    graphEntry(entry, view, thetaRange, tRange, xRange3D, yRange3D);
  }

  function switchKind(nextKind: "cartesian" | "polar" | "parametric" | "3d") {
    if (nextKind === kind) return;
    setKind(nextKind);
    // Cambiar de tipo invalida los análisis/superficies ya calculados
    // (dominio de la otra clase de gráfica) — se limpia y el usuario
    // vuelve a graficar, igual que al cambiar el rango con
    // applyZoom/recenter.
    setEntries((prev) => prev.map((e) => ({ ...e, analysis: null, surface3D: null, error: null })));
  }

  function addExpression() {
    const nextColor = colors[entries.length % colors.length];
    const entry = makeEntry(nextColor);
    setEntries((prev) => [...prev, entry]);
    setSelectedId(entry.id);
  }

  function removeExpression(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  // Bug conocido de la versión anterior, todavía vigente: "desde"==
  // "hasta" divide entre cero al escalar en GraphViewer — se valida antes
  // de aplicar un nuevo rango de vista.
  function applyZoom(factor: number) {
    const [a, b] = view;
    const center = (a + b) / 2;
    const halfRange = ((b - a) / 2) * factor;
    if (halfRange < 0.01) return; // evita colapsar el rango a (casi) cero
    const nextView: [number, number] = [center - halfRange, center + halfRange];
    setView(nextView);
    entries.forEach((entry) => graphEntry(entry, nextView, thetaRange, tRange, xRange3D, yRange3D));
  }

  function recenter() {
    const nextView: [number, number] = [-10, 10];
    setView(nextView);
    entries.forEach((entry) => graphEntry(entry, nextView, thetaRange, tRange, xRange3D, yRange3D));
  }

  function applyThetaRange(nextThetaRange: [number, number]) {
    setThetaRange(nextThetaRange);
    entries.forEach((entry) => graphEntry(entry, view, nextThetaRange, tRange, xRange3D, yRange3D));
  }

  function applyTRange(nextTRange: [number, number]) {
    setTRange(nextTRange);
    entries.forEach((entry) => graphEntry(entry, view, thetaRange, nextTRange, xRange3D, yRange3D));
  }

  function applyXYRange3D(nextXRange3D: [number, number], nextYRange3D: [number, number]) {
    setXRange3D(nextXRange3D);
    setYRange3D(nextYRange3D);
    entries.forEach((entry) => graphEntry(entry, view, thetaRange, tRange, nextXRange3D, nextYRange3D));
  }

  const curves: GraphCurve[] = entries
    .filter((e): e is ExpressionEntry & { analysis: GraphAnalysis } => e.analysis !== null)
    .map((e) => ({ id: e.id, color: e.color, analysis: e.analysis }));
  const selectedEntry = entries.find((e) => e.id === selectedId) ?? null;
  const selectedAnalysis = selectedEntry?.analysis ?? null;
  const selectedSurface3D = selectedEntry?.surface3D ?? null;

  return (
    <div className="mx-auto flex w-full max-w-[1376px] flex-col gap-4 p-4 md:flex-row md:items-start lg:gap-6">
      {/* Sidebar de expresiones (spec §6, + selector de tipo Módulo I0) */}
      <aside aria-label="Expresiones y tipo de gráfica" className="flex w-full shrink-0 flex-col gap-3 rounded-xl border border-paper-line bg-paper-soft p-3 shadow-sm md:w-[280px]">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Expresiones</h2>
          <span className="text-[11px] text-muted">{entries.length} {entries.length === 1 ? "expresión" : "expresiones"}</span>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1" role="group" aria-label="Tipo de gráfica">
          <button
            type="button"
            onClick={() => switchKind("cartesian")}
            aria-pressed={kind === "cartesian"}
            className={`min-h-8 shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              kind === "cartesian" ? "bg-marker text-white" : "border border-paper-line text-muted hover:bg-paper-soft"
            }`}
          >
            y = f(x)
          </button>
          <button
            type="button"
            onClick={() => switchKind("polar")}
            aria-pressed={kind === "polar"}
            className={`min-h-8 shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              kind === "polar" ? "bg-marker text-white" : "border border-paper-line text-muted hover:bg-paper-soft"
            }`}
          >
            Polar
          </button>
          <button
            type="button"
            onClick={() => switchKind("parametric")}
            aria-pressed={kind === "parametric"}
            className={`min-h-8 shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              kind === "parametric" ? "bg-marker text-white" : "border border-paper-line text-muted hover:bg-paper-soft"
            }`}
          >
            Paramétrica
          </button>
          <button
            type="button"
            onClick={() => switchKind("3d")}
            aria-pressed={kind === "3d"}
            className={`min-h-8 shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              kind === "3d" ? "bg-marker text-white" : "border border-paper-line text-muted hover:bg-paper-soft"
            }`}
          >
            3D
          </button>
        </div>
        {entries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => setSelectedId(entry.id)}
            className={`flex items-center gap-2 rounded-lg p-2 ${entry.id === selectedId ? "bg-paper-line/50" : ""}`}
          >
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
            <div className="min-w-0 flex-1 space-y-1">
              <NaturalInput
                value={entry.latex}
                onChange={(v) => updateLatex(entry.id, v)}
                placeholder={
                  kind === "polar"
                    ? "r(theta), ej. 1+cos(theta)"
                    : kind === "parametric"
                      ? "x(t), ej. cos(t)"
                      : kind === "3d"
                        ? "z=f(x,y), ej. x^2+y^2"
                        : "f(x), ej. x^2-4"
                }
              />
              {kind === "parametric" && (
                <NaturalInput
                  value={entry.yLatex}
                  onChange={(v) => updateYLatex(entry.id, v)}
                  placeholder="y(t), ej. sin(t)"
                />
              )}
            </div>
            <button
              onClick={(ev) => {
                ev.stopPropagation();
                submitEntry(entry);
              }}
              aria-label="Graficar esta expresión"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs text-marker hover:bg-paper-soft hover:text-marker-text"
            >
              ⏎
            </button>
            <button
              onClick={(ev) => {
                ev.stopPropagation();
                removeExpression(entry.id);
              }}
              aria-label="Eliminar expresión"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted hover:bg-paper-soft hover:text-red-600"
            >
              ×
            </button>
          </div>
        ))}
        <button onClick={addExpression} className="self-start rounded-md bg-paper-soft px-3 py-1.5 text-sm text-marker hover:bg-paper-line/40">
          + Agregar expresión
        </button>
        {kind === "polar" && (
          <div className="mt-2 flex flex-wrap items-end gap-2">
            <div className="space-y-1">
              <label htmlFor="theta-min" className="block text-xs text-muted">θ mínimo</label>
              <input
                id="theta-min"
                type="text"
                value={thetaRange[0]}
                onChange={(e) => {
                  const parsed = Number(e.target.value);
                  if (!Number.isNaN(parsed)) applyThetaRange([parsed, thetaRange[1]]);
                }}
                className="w-20 rounded border border-paper-line bg-paper-soft px-2 py-1 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="theta-max" className="block text-xs text-muted">θ máximo</label>
              <input
                id="theta-max"
                type="text"
                value={thetaRange[1]}
                onChange={(e) => {
                  const parsed = Number(e.target.value);
                  if (!Number.isNaN(parsed)) applyThetaRange([thetaRange[0], parsed]);
                }}
                className="w-20 rounded border border-paper-line bg-paper-soft px-2 py-1 text-xs"
              />
            </div>
          </div>
        )}
        {kind === "parametric" && (
          <div className="mt-2 flex flex-wrap items-end gap-2">
            <div className="space-y-1">
              <label htmlFor="t-min" className="block text-xs text-muted">t mínimo</label>
              <input
                id="t-min"
                type="text"
                value={tRange[0]}
                onChange={(e) => {
                  const parsed = Number(e.target.value);
                  if (!Number.isNaN(parsed)) applyTRange([parsed, tRange[1]]);
                }}
                className="w-20 rounded border border-paper-line bg-paper-soft px-2 py-1 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="t-max" className="block text-xs text-muted">t máximo</label>
              <input
                id="t-max"
                type="text"
                value={tRange[1]}
                onChange={(e) => {
                  const parsed = Number(e.target.value);
                  if (!Number.isNaN(parsed)) applyTRange([tRange[0], parsed]);
                }}
                className="w-20 rounded border border-paper-line bg-paper-soft px-2 py-1 text-xs"
              />
            </div>
          </div>
        )}
        {kind === "3d" && (
          <div className="mt-2 flex flex-wrap items-end gap-2">
            <div className="space-y-1">
              <label htmlFor="x3d-min" className="block text-xs text-muted">x mínimo</label>
              <input
                id="x3d-min"
                type="text"
                value={xRange3D[0]}
                onChange={(e) => {
                  const parsed = Number(e.target.value);
                  if (!Number.isNaN(parsed)) applyXYRange3D([parsed, xRange3D[1]], yRange3D);
                }}
                className="w-16 rounded border border-paper-line bg-paper-soft px-2 py-1 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="x3d-max" className="block text-xs text-muted">x máximo</label>
              <input
                id="x3d-max"
                type="text"
                value={xRange3D[1]}
                onChange={(e) => {
                  const parsed = Number(e.target.value);
                  if (!Number.isNaN(parsed)) applyXYRange3D([xRange3D[0], parsed], yRange3D);
                }}
                className="w-16 rounded border border-paper-line bg-paper-soft px-2 py-1 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="y3d-min" className="block text-xs text-muted">y mínimo</label>
              <input
                id="y3d-min"
                type="text"
                value={yRange3D[0]}
                onChange={(e) => {
                  const parsed = Number(e.target.value);
                  if (!Number.isNaN(parsed)) applyXYRange3D(xRange3D, [parsed, yRange3D[1]]);
                }}
                className="w-16 rounded border border-paper-line bg-paper-soft px-2 py-1 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="y3d-max" className="block text-xs text-muted">y máximo</label>
              <input
                id="y3d-max"
                type="text"
                value={yRange3D[1]}
                onChange={(e) => {
                  const parsed = Number(e.target.value);
                  if (!Number.isNaN(parsed)) applyXYRange3D(xRange3D, [yRange3D[0], parsed]);
                }}
                className="w-16 rounded border border-paper-line bg-paper-soft px-2 py-1 text-xs"
              />
            </div>
          </div>
        )}
      </aside>

      {/* Lienzo (spec §6) */}
      <section aria-label="Vista de gráfica" className="flex min-w-0 flex-1 flex-col gap-3 rounded-xl border border-paper-line bg-paper p-3 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Vista</h2>
          <span className="text-[11px] text-muted">{kind === "3d" ? "Superficie 3D" : kind === "polar" ? "Polar" : kind === "parametric" ? "Paramétrica" : "Cartesiana"}</span>
        </div>
        <div className="flex items-center justify-end gap-1.5">
          {kind !== "3d" && (
            <>
              <button onClick={() => applyZoom(0.7)} aria-label="Acercar" className="h-7 w-7 rounded-md bg-paper-line/50 text-ink hover:bg-paper-line">
                +
              </button>
              <button onClick={() => applyZoom(1.4)} aria-label="Alejar" className="h-7 w-7 rounded-md bg-paper-line/50 text-ink hover:bg-paper-line">
                −
              </button>
              <button onClick={recenter} aria-label="Centrar" className="h-7 w-7 rounded-md bg-paper-line/50 text-ink hover:bg-paper-line">
                ⊙
              </button>
            </>
          )}
        </div>

        {kind === "3d" ? (
          selectedSurface3D ? (
            <GraphViewer3D surface={selectedSurface3D} />
          ) : (
            <div className="flex h-52 items-center justify-center rounded-xl bg-chrome text-sm text-bone">
              Escribe z=f(x,y) y presiona ⏎ para graficarla.
            </div>
          )
        ) : curves.length > 0 || argandPoint ? (
          <GraphViewer
            curves={curves}
            selectedId={selectedId}
            view={view}
            argandPoint={argandPoint}
            axisLabels={argandPoint ? { x: "Re", y: "Im" } : undefined}
          />
        ) : (
          <div className="flex h-52 items-center justify-center rounded-xl bg-chrome text-sm text-bone">
            Escribe una expresión y presiona ⏎ para graficarla.
          </div>
        )}

        {selectedEntry?.error && (
          <div className="rounded-xl bg-paper-soft p-3 text-sm text-red-600">{selectedEntry.error}</div>
        )}

        {selectedSurface3D && (
          <p className="inline-block rounded bg-marker-soft px-2 py-1 text-xs text-marker-text">
            {selectedSurface3D.domainDescription} · {selectedSurface3D.rangeDescription}
          </p>
        )}

        {selectedAnalysis && (
          <section aria-label="Análisis de gráfica" className="space-y-3 rounded-xl border border-paper-line bg-paper-soft p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Análisis</h3>
                <p className="mt-0.5 text-[11px] text-muted">Dominio, rango y puntos notables</p>
              </div>
              <span className="rounded-full bg-marker-soft px-2.5 py-1 text-[11px] text-marker-text">
                Aproximado
              </span>
            </div>
            <p className="text-xs text-muted">
              Análisis aproximado por muestreo numérico, no simbólico exacto.
            </p>
            <div className="grid gap-x-5 gap-y-2 rounded-xl border border-paper-line bg-paper p-3 text-sm text-ink sm:grid-cols-[auto_minmax(0,1fr)]">
              <span className="text-muted">Dominio:</span>
              <span className="min-w-0 break-words">{selectedAnalysis.domainDescription}</span>
              <span className="text-muted">Rango:</span>
              <span className="min-w-0 break-words">{selectedAnalysis.rangeDescription}</span>
              {kind === "cartesian" && (
                <>
                  <span className="text-muted">Intercepciones en x:</span>
                  <span className="min-w-0 break-words">
                    {selectedAnalysis.xIntercepts.length ? selectedAnalysis.xIntercepts.map((x) => x.toFixed(3)).join(", ") : "ninguna en la vista actual"}
                  </span>
                  <span className="text-muted">Intercepción en y:</span>
                  <span className="min-w-0 break-words">
                    {selectedAnalysis.yIntercept !== null ? selectedAnalysis.yIntercept.toFixed(3) : "no definida en x=0"}
                  </span>
                  <span className="text-muted">Máximo global:</span>
                  <span className="min-w-0 break-words">
                    {selectedAnalysis.globalMax ? `(${selectedAnalysis.globalMax.x.toFixed(3)}, ${selectedAnalysis.globalMax.y.toFixed(3)})` : "—"}
                  </span>
                  <span className="text-muted">Mínimo global:</span>
                  <span className="min-w-0 break-words">
                    {selectedAnalysis.globalMin ? `(${selectedAnalysis.globalMin.x.toFixed(3)}, ${selectedAnalysis.globalMin.y.toFixed(3)})` : "—"}
                  </span>
                  <span className="text-muted">Vértice:</span>
                  <span className="min-w-0 break-words">
                    {selectedAnalysis.vertex ? `(${selectedAnalysis.vertex.x.toFixed(3)}, ${selectedAnalysis.vertex.y.toFixed(3)})` : "no aplica"}
                  </span>
                </>
              )}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
