import { useState } from "react";
import { StaticMath } from "./StaticMath";
import type { MathResult } from "../types";
import { decimalDegreesToDms, isInverseTrigAngleExpression, parseDecimalDegreesInput } from "./dmsDisplay";
import { ResultFormatSelector, type ResultFormatId } from "./ResultFormatSelector";
import { getAvailableResultFormats } from "./resultFormatPolicy";

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

type AnswerFormat = ResultFormatId;

export function ResultPanel({ result, inputLatex = "", angleMode = "RAD" }: { result: MathResult | null; inputLatex?: string; angleMode?: "RAD" | "GRAD" }) {
  const [format, setFormat] = useState<AnswerFormat>("dec");
  // Antes: "frac" siempre mostraba mixta cuando estaba disponible
  // (mixedLatex ?? improperLatex), sin forma de pedir la impropia. El
  // usuario pidió explícitamente poder elegir — ahora hay un toggle
  // chico que solo aparece cuando realmente hay una forma mixta posible
  // (fracción impropia: |numerador| >= denominador).
  const [showMixed, setShowMixed] = useState(true);
  const explicitDegreeInput = parseDecimalDegreesInput(inputLatex);
  const inverseAngleResult = angleMode === "GRAD" && isInverseTrigAngleExpression(inputLatex);
  const inverseDegreeSource = (
    result?.fraction?.decimal ?? result?.decimalApprox ?? result?.resultLatex ?? ""
  ).replace(/…/g, "").trim();
  const inverseDegrees = inverseAngleResult && Number.isFinite(Number(inverseDegreeSource))
    ? Number(inverseDegreeSource)
    : null;
  const dmsDegrees = explicitDegreeInput ?? inverseDegrees;
  const dmsValue = dmsDegrees === null ? null : decimalDegreesToDms(dmsDegrees);

  function withAngleUnit(
    value: { latex: string; isPlainNumber: boolean },
    selectedFormat: AnswerFormat,
  ): { latex: string; isPlainNumber: boolean } {
    if (!inverseAngleResult || selectedFormat === "dms" || selectedFormat === "dd") return value;
    return value.isPlainNumber
      ? { latex: `${value.latex}°`, isPlainNumber: true }
      : { latex: `{${value.latex}}^{\\circ}`, isPlainNumber: false };
  }

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

  function renderValue(selectedFormat: AnswerFormat): { latex: string; isPlainNumber: boolean } {
    if (selectedFormat === "dd" && dmsDegrees !== null) {
      const cleanDegrees = Math.round((dmsDegrees + Number.EPSILON) * 1e12) / 1e12;
      return { latex: `${cleanDegrees}°`, isPlainNumber: true };
    }
    if (selectedFormat === "dms" && dmsValue) return { latex: dmsValue.latex, isPlainNumber: false };
    if (selectedFormat === "frac" && result?.fraction) {
      const hasMixed = result.fraction.mixedLatex !== null;
      const latex = hasMixed && showMixed ? result.fraction.mixedLatex! : result.fraction.improperLatex;
      return withAngleUnit({ latex, isPlainNumber: false }, selectedFormat);
    }
    if (selectedFormat === "scn") {
      // fraction.decimal y decimalApprox pueden traer "…" al final cuando
      // el motor truncó un decimal periódico (fractions.ts / Fase E en
      // algebriteClient.ts) — Number() necesita el string limpio.
      const source = (result?.fraction?.decimal ?? result?.decimalApprox ?? result?.resultLatex ?? "").replace(
        "…",
        "",
      );
      const n = Number(source);
      return withAngleUnit(
        Number.isFinite(n)
          ? { latex: n.toExponential(6), isPlainNumber: true }
          : { latex: result?.resultLatex ?? "", isPlainNumber: false },
        selectedFormat,
      );
    }
    if (selectedFormat === "dec") {
      // Orden de fallback: fracción exacta -> decimal, luego float()
      // forzado sobre un resultado simbólico (Fase E), y solo si ninguno
      // de los dos existe, el resultado tal cual (mejor que nada).
      if (result?.fraction) return withAngleUnit({ latex: result.fraction.decimal, isPlainNumber: true }, selectedFormat);
      if (result?.decimalApprox) return withAngleUnit({ latex: result.decimalApprox, isPlainNumber: true }, selectedFormat);
      return withAngleUnit({ latex: result?.resultLatex ?? "", isPlainNumber: false }, selectedFormat);
    }
    // "exact": resultado simbólico/radical exacto tal cual lo devolvió el motor.
    return withAngleUnit({ latex: result?.resultLatex ?? "", isPlainNumber: false }, selectedFormat);
  }

  const numericSource = (
    result?.fraction?.decimal ?? result?.decimalApprox ?? result?.resultLatex ?? ""
  ).replace(/…/g, "").trim();
  const hasNumericValue = Number.isFinite(Number(numericSource));
  const availableFormats = getAvailableResultFormats({
    hasExact: Boolean(result.resultLatex),
    hasDecimal: hasNumericValue,
    hasFraction: Boolean(result.fraction),
    hasDms: Boolean(dmsValue),
  }) as AnswerFormat[];

  const activeFormat = availableFormats.includes(format) ? format : (availableFormats[0] ?? "exact");
  const { latex, isPlainNumber } = renderValue(activeFormat);

  return (
    <div className="space-y-3 pt-1" role="status" aria-live="polite" aria-atomic="true">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Resultado</p>
        {result.confidence === "NUMERIC_FALLBACK" && (
          <span className="rounded-md bg-marker-soft px-2 py-1 text-[11px] font-medium text-marker-text">
            Aproximado
          </span>
        )}
      </div>

      <div className="min-h-14 rounded-xl border border-paper-line bg-paper px-4 py-3">
        <div className="flex min-h-8 items-center justify-end">
          {isPlainNumber ? (
            <span className="a11y-scale-result-3xl font-mono font-semibold tracking-tight text-ink">{latex}</span>
          ) : (
            <StaticMath latex={latex} className="a11y-scale-result-3xl font-mono text-ink" />
          )}
        </div>
        {result.confidence === "NUMERIC_FALLBACK" && (
          <p className="mt-1 text-right text-[11px] text-muted">
            Aproximado numéricamente (no resuelto simbólicamente)
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <ResultFormatSelector
          formats={availableFormats}
          value={activeFormat}
          onChange={setFormat}
        />

        {activeFormat === "frac" && result.fraction?.mixedLatex !== null && result.fraction && (
          <button
            onClick={() => setShowMixed((v) => !v)}
            className="min-h-8 rounded-full px-2 text-xs text-muted underline decoration-dotted hover:text-marker"
          >
            {showMixed ? "ver como impropia" : "ver como mixta"}
          </button>
        )}
      </div>
    </div>
  );
}
