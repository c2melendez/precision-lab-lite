// modes/Units/UnitsMode.tsx — P7 (spec v2 §8): formulario simple, NO usa
// el teclado matemático ni MathLive (spec explícita). Categoría → unidad
// origen → valor → unidad destino → resultado.

import { useMemo, useState } from "react";
import { CATEGORY_LABELS, UNITS, convert, type UnitCategory } from "../../engine/unitConversion";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as UnitCategory[];

export function UnitsMode() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const unitKeys = useMemo(() => Object.keys(UNITS[category]), [category]);
  const [fromUnit, setFromUnit] = useState(unitKeys[0]);
  const [toUnit, setToUnit] = useState(unitKeys[1] ?? unitKeys[0]);
  const [valueStr, setValueStr] = useState("1");

  function handleCategoryChange(next: UnitCategory) {
    setCategory(next);
    const keys = Object.keys(UNITS[next]);
    setFromUnit(keys[0]);
    setToUnit(keys[1] ?? keys[0]);
  }

  const value = Number(valueStr);
  const result = useMemo(() => {
    if (!Number.isFinite(value)) return null;
    try {
      return convert(category, value, fromUnit, toUnit);
    } catch {
      return null;
    }
  }, [category, value, fromUnit, toUnit]);

  const selectClass = "w-full rounded-lg bg-paper-soft px-3 py-2 text-sm text-ink";
  const labelClass = "mb-1 block text-xs uppercase tracking-wide text-muted";

  return (
    <div className="mx-auto grid w-full max-w-[1376px] gap-4 p-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
      <section aria-label="Conversor de unidades" className="min-w-0 space-y-4 rounded-xl border border-paper-line bg-paper-soft p-4 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-ink">Unidades</h2>
          <p className="text-sm text-muted">Selecciona una categoría, unidad de origen, destino y valor.</p>
        </div>

        <div className="space-y-2">
          <span className={labelClass}>Categoría</span>
          <div className="hidden gap-2 overflow-x-auto pb-1" role="group" aria-label="Categorías de unidades">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleCategoryChange(c)}
                aria-pressed={category === c}
                className={
                  category === c
                    ? "min-h-10 shrink-0 rounded-lg border border-marker bg-marker-soft px-3 text-sm font-semibold text-marker-text"
                    : "min-h-10 shrink-0 rounded-lg border border-paper-line bg-paper px-3 text-sm text-muted hover:border-marker/40 hover:text-ink"
                }
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="units-category">Categoría</label>
          <select
            id="units-category"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value as UnitCategory)}
            className={selectClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
          <div>
            <label className={labelClass} htmlFor="units-from">De</label>
            <select id="units-from" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className={selectClass}>
              {unitKeys.map((k) => (
                <option key={k} value={k}>{UNITS[category][k].label}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              const previousFrom = fromUnit;
              setFromUnit(toUnit);
              setToUnit(previousFrom);
            }}
            aria-label="Intercambiar unidades"
            title="Intercambiar unidades"
            className="min-h-10 rounded-lg border border-paper-line bg-paper px-3 text-lg text-marker-text hover:bg-marker-soft"
          >
            ⇄
          </button>

          <div>
            <label className={labelClass} htmlFor="units-to">A</label>
            <select id="units-to" value={toUnit} onChange={(e) => setToUnit(e.target.value)} className={selectClass}>
              {unitKeys.map((k) => (
                <option key={k} value={k}>{UNITS[category][k].label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="units-value">Valor</label>
          <input
            id="units-value"
            type="text"
            inputMode="decimal"
            value={valueStr}
            onChange={(e) => setValueStr(e.target.value)}
            className={`${selectClass} min-h-12 text-base`}
          />
        </div>
      </section>

      <section aria-label="Resultado de conversión" className="min-w-0 rounded-xl border border-paper-line bg-paper p-4 shadow-sm lg:sticky lg:top-4">
        <div className="mb-4 border-b border-paper-line pb-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Resultado</h2>
          <p className="mt-0.5 text-[11px] text-muted">Conversión en la unidad seleccionada</p>
        </div>

        {result === null ? (
          <div className="rounded-xl border border-dashed border-paper-line bg-paper-soft/60 px-4 py-8 text-center">
            <p className="text-sm text-muted">Ingresa un valor numérico válido.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl border border-paper-line bg-paper-soft px-4 py-5">
              <p className="text-xs uppercase tracking-wide text-muted">{CATEGORY_LABELS[category]}</p>
              <p className="mt-2 break-words text-3xl font-semibold tracking-tight text-ink">
                {Number(result.toPrecision(10))} <span className="text-base font-medium text-muted">{UNITS[category][toUnit].label}</span>
              </p>
            </div>
            <p className="text-xs text-muted">
              {valueStr || "—"} {UNITS[category][fromUnit].label} → {UNITS[category][toUnit].label}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
