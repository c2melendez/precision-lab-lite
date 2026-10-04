import { useState } from "react";
import { StaticMath } from "./StaticMath";
import type { MathResult, ResultView, ResultViewKey } from "../types";

// spec v10 §11: el usuario alterna entre formatos sin recalcular.
//
// Fase 2.6 (fix real del bug de display de fracciones, ver StaticMath.tsx
// para la explicación completa): antes usaba convertLatexToMarkup +
// dangerouslySetInnerHTML, que seguía rompiéndose en casos reales pese a
// tener el CSS de MathLive importado (Fase 2.5). Ahora usa <StaticMath>,
// que renderiza en Shadow DOM — inmune al CSS de la página.
// "dec" usa decimalApprox como segundo fallback cuando no hay `fraction`
// (resultado simbólico, ej. sin(pi/4)) — antes caía directo a resultLatex
// y mostraba el mismo string simbólico en las 4 pestañas.
//
// Ya no trae su propio fondo/padding/sombra: vive anidado dentro de
// Screen.tsx, que es quien da el contenedor "pantalla" único (spec UX
// estilo ClassCalc, decisión del mockup).

type AnswerFormat = "dec" | "frac" | "scn" | "sqrt";

export function ResultPanel({ result }: { result: MathResult | null }) {
  const [format, setFormat] = useState<AnswerFormat>("dec");
  // Antes: "frac" siempre mostraba mixta cuando estaba disponible
  // (mixedLatex ?? improperLatex), sin forma de pedir la impropia. El
  // usuario pidió explícitamente poder elegir — ahora hay un toggle
  // chico que solo aparece cuando realmente hay una forma mixta posible
  // (fracción impropia: |numerador| >= denominador).
  const [showMixed, setShowMixed] = useState(true);
  const [symbolicView, setSymbolicView] = useState<ResultViewKey>("result");
  const [displayMode, setDisplayMode] = useState<"view" | "format">("format");

  if (!result) {
    return <p className="py-1 text-right text-sm text-muted">Escribe una expresión y presiona Calcular.</p>;
  }

  if (!result.success) {
    return (
      <div role="alert" aria-live="assertive" aria-atomic="true" className="py-1 text-right text-red-600">
        <p className="text-sm font-semibold">No se pudo calcular ({result.errorCode})</p>
        <p className="text-xs text-red-500">{result.errorMessage}</p>
      </div>
    );
  }

  function renderValue(): { latex: string; isPlainNumber: boolean } {
    if (format === "frac" && result?.fraction) {
      const hasMixed = result.fraction.mixedLatex !== null;
      const latex = hasMixed && showMixed ? result.fraction.mixedLatex! : result.fraction.improperLatex;
      return { latex, isPlainNumber: false };
    }
    if (format === "scn") {
      // fraction.decimal y decimalApprox pueden traer "…" al final cuando
      // el motor truncó un decimal periódico (fractions.ts / Fase E en
      // algebriteClient.ts) — Number() necesita el string limpio.
      const source = (result?.fraction?.decimal ?? result?.decimalApprox ?? result?.resultLatex ?? "").replace(
        "…",
        "",
      );
      const n = Number(source);
      return Number.isFinite(n)
        ? { latex: n.toExponential(6), isPlainNumber: true }
        : { latex: result?.resultLatex ?? "", isPlainNumber: false };
    }
    if (format === "dec") {
      // Orden de fallback: fracción exacta -> decimal, luego float()
      // forzado sobre un resultado simbólico (Fase E), y solo si ninguno
      // de los dos existe, el resultado tal cual (mejor que nada).
      if (result?.fraction) return { latex: result.fraction.decimal, isPlainNumber: true };
      if (result?.decimalApprox) return { latex: result.decimalApprox, isPlainNumber: true };
      return { latex: result?.resultLatex ?? "", isPlainNumber: false };
    }
    // "sqrt", o "frac" sin datos de fracción disponibles: se muestra el
    // resultado tal cual lo devolvió el motor (ya es LaTeX real).
    return { latex: result?.resultLatex ?? "", isPlainNumber: false };
  }

  // Contrato S26: las vistas vienen declaradas por el motor. Mientras
  // migramos todos los flujos, se conserva un fallback retrocompatible
  // para resultados antiguos que solo traen interpretedLatex.
  const fallbackViews: ResultView[] =
    result.interpretedLatex && result.resultLatex
      ? [
          { key: "original", label: "Original", latex: result.interpretedLatex, kind: result.resultKind ?? "other" },
          { key: "result", label: result.resultViewLabel ?? "Resultado", latex: result.resultLatex, kind: result.resultKind ?? "other" },
        ]
      : [];
  const contextualViews = result.resultViews?.length ? result.resultViews : fallbackViews;
  const hasSymbolicViews = contextualViews.length > 0;
  const hasNumericFormats =
    result.fraction !== undefined ||
    result.decimalApprox !== undefined ||
    (result.resultLatex !== null && /^-?\d+(?:\.\d+)?$/.test(result.resultLatex));
  const rendered = renderValue();
  const activeView =
    contextualViews.find((view) => view.key === symbolicView) ??
    contextualViews.find((view) => view.key === "result" || view.key === "solution") ??
    contextualViews[1] ??
    contextualViews[0];
  const showingContextualView = displayMode === "view" && hasSymbolicViews && Boolean(activeView);
  const latex = showingContextualView && activeView ? activeView.latex : rendered.latex;
  const isPlainNumber = showingContextualView ? false : rendered.isPlainNumber;

  return (
    <div className="pt-1" role="status" aria-live="polite" aria-atomic="true">
      {result.confidence === "NUMERIC_FALLBACK" && (
        <p className="mb-1.5 inline-block rounded bg-marker-soft px-2 py-0.5 text-xs text-marker-text">
          Aproximado numéricamente (no resuelto simbólicamente)
        </p>
      )}
      {/* Fase R, Módulo R0: a11y-scale-result-3xl reemplaza a text-3xl —
          mismo tamaño exacto por defecto, ahora escalable. */}
      <div className="flex items-end justify-between gap-3">
        {isPlainNumber ? (
          <span className="a11y-scale-result-3xl ml-auto font-mono font-medium text-ink">{latex}</span>
        ) : (
          <StaticMath latex={latex} className="a11y-scale-result-3xl ml-auto font-mono text-ink" />
        )}
      </div>
      {displayMode === "format" && format === "frac" && result.fraction?.mixedLatex !== null && result.fraction && (
        <div className="mt-1 flex justify-end">
          <button
            onClick={() => setShowMixed((v) => !v)}
            className="text-xs text-muted underline decoration-dotted hover:text-marker"
          >
            {showMixed ? "ver como impropia" : "ver como mixta"}
          </button>
        </div>
      )}
      {result.domainConditions && result.domainConditions.length > 0 && (
        <div className="mt-2 rounded border border-paper-line px-2 py-1.5 text-right">
          <p className="mb-1 text-xs font-semibold text-ink">Restricciones del dominio</p>
          <div className="space-y-1">
            {result.domainConditions.map((condition, index) => (
              <StaticMath
                key={`${condition.kind}-${index}`}
                latex={condition.latex}
                className="text-sm text-muted"
              />
            ))}
          </div>
        </div>
      )}
      <div className="mt-1.5 flex justify-end gap-3 text-xs text-muted">
        {contextualViews.map((view) => (
          <button
            key={`view-${view.key}`}
            type="button"
            onClick={() => {
              setSymbolicView(view.key);
              setDisplayMode("view");
            }}
            aria-pressed={displayMode === "view" && activeView?.key === view.key}
            className={displayMode === "view" && activeView?.key === view.key ? "font-semibold text-marker" : "hover:text-ink"}
          >
            {view.label}
          </button>
        ))}
        {hasNumericFormats &&
          (["dec", "frac", "scn", "sqrt"] as AnswerFormat[]).map((f) => (
            <button
              key={`format-${f}`}
              type="button"
              onClick={() => {
                setFormat(f);
                setDisplayMode("format");
              }}
              aria-pressed={displayMode === "format" && format === f}
              className={displayMode === "format" && format === f ? "font-semibold text-marker" : "hover:text-ink"}
            >
              {f}
            </button>
          ))}
      </div>
    </div>
  );
}
