import type { Step } from "../types";

// Ficha de paso tipo "margen de cuaderno" (Fase 1 — sistema de diseño
// Precision Lab). Se degrada con elegancia cuando el motor (Algebrite) no
// provee title/rule/latexBefore: en ese caso solo se muestra el resultado
// del paso y su explicación, sin dejar espacios vacíos ni etiquetas "N/A".
// Ver auditoría Fase 0, Opción 2 de paridad del modelo de datos.
//
// Fase BB, Módulo BB0 (spec_rediseno_visual.md sección 14) — confirmado
// por Carlos: mismo criterio que precision-lab (main). Se deja de
// renderizar `step.rule` como insignia técnica. Nota real: en Lite
// ningún módulo de engine/stepEngine/*.ts asigna nunca `rule` (el campo
// existe en `types.ts` pero está huérfano) — este cambio no altera nada
// visible hoy, pero evita que aparezca sin querer si algún motor futuro
// empieza a poblarlo con un identificador técnico. `Step.rule` se
// mantiene en el tipo, sin cambios de contrato.

export function StepList({ steps, activeIndex }: { steps: Step[]; activeIndex?: number }) {
  if (steps.length === 0) return null;

  return (
    <ol className="relative flex flex-col gap-4 pl-7" aria-label="Procedimiento paso a paso">
      <div className="absolute bottom-2 left-[11px] top-2 w-px bg-paper-line" aria-hidden="true" />

      {steps.map((step, i) => {
        const isActive = activeIndex === i;
        return (
          <li key={step.id} className="relative">
            <span
              className={
                isActive
                  ? "absolute -left-7 top-0 grid h-6 w-6 place-items-center rounded-full bg-marker text-[10px] font-bold text-chrome ring-4 ring-marker-soft"
                  : "absolute -left-7 top-0 grid h-6 w-6 place-items-center rounded-full border border-paper-line bg-paper text-[10px] font-semibold text-muted"
              }
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div className={isActive ? "rounded-xl border border-marker/30 bg-marker-soft p-3" : "rounded-xl border border-paper-line bg-paper/60 p-3"}>
              {step.title && (
                <p className={isActive ? "text-sm font-medium text-marker-text" : "text-sm font-medium text-muted"}>
                  {step.title}
                </p>
              )}
              {step.latexBefore ? (
                <p className="mt-1 font-mono text-sm text-ink">
                  {step.latexBefore} <span className="text-muted">→</span> {step.latex}
                </p>
              ) : (
                <p className="mt-1 font-mono text-sm text-ink">{step.latex}</p>
              )}
              <p className="mt-0.5 text-sm text-muted">{step.explanation}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
