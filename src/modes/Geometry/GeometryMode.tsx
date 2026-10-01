import { useMemo, useState } from "react";

type GeometryTab = "basic" | "triangles" | "circles" | "composite" | "solids" | "builder";
type BasicShape = "rectangle" | "triangle" | "circle";

const TABS: { id: GeometryTab; label: string }[] = [
  { id: "basic", label: "Figuras básicas" },
  { id: "triangles", label: "Triángulos" },
  { id: "circles", label: "Círculos" },
  { id: "composite", label: "Áreas compuestas" },
  { id: "solids", label: "Sólidos" },
  { id: "builder", label: "Constructor" },
];

function fmt(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(8)));
}

export function GeometryMode() {
  const [tab, setTab] = useState<GeometryTab>("basic");
  const [shape, setShape] = useState<BasicShape>("rectangle");
  const [a, setA] = useState("4");
  const [b, setB] = useState("3");

  const result = useMemo(() => {
    const x = Number(a);
    const y = Number(b);
    if (!Number.isFinite(x) || x <= 0) return null;
    if (shape !== "circle" && (!Number.isFinite(y) || y <= 0)) return null;
    if (shape === "rectangle") return { area: x * y, perimeter: 2 * (x + y), formula: "A = base · altura" };
    if (shape === "triangle") return { area: (x * y) / 2, perimeter: null, formula: "A = (base · altura) / 2" };
    return { area: Math.PI * x * x, perimeter: 2 * Math.PI * x, formula: "A = πr²" };
  }, [a, b, shape]);

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-4 p-4 sm:p-5 lg:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-ink">Geometría</h2>
        <p className="text-sm text-muted">Áreas, perímetros, triángulos, círculos, sólidos y construcción de regiones compuestas.</p>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-1 rounded-xl border border-paper-line bg-paper-soft p-1">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-pressed={tab === item.id}
              className={tab === item.id
                ? "min-h-11 rounded-lg bg-marker px-4 text-sm font-semibold text-chrome"
                : "min-h-11 rounded-lg px-4 text-sm text-muted hover:bg-paper-line/40 hover:text-ink"}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "basic" ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,.8fr)]">
          <section className="rounded-xl border border-paper-line bg-paper-soft">
            <header className="border-b border-paper-line px-4 py-3">
              <h3 className="border-l-4 border-marker pl-2 text-sm font-semibold text-ink">Entrada</h3>
            </header>
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-3 gap-2">
                {([
                  ["rectangle", "Rectángulo"],
                  ["triangle", "Triángulo"],
                  ["circle", "Círculo"],
                ] as const).map(([id,label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setShape(id)}
                    className={shape === id
                      ? "min-h-11 rounded-lg border border-marker bg-marker-soft px-3 text-sm font-medium text-marker-text"
                      : "min-h-11 rounded-lg border border-paper-line px-3 text-sm text-muted hover:bg-paper"}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm text-muted">
                  {shape === "circle" ? "Radio" : "Base"}
                  <input value={a} onChange={(e) => setA(e.target.value)} inputMode="decimal"
                    className="mt-1 w-full rounded-lg border border-paper-line bg-paper px-3 py-2 text-base text-ink" />
                </label>
                {shape !== "circle" && (
                  <label className="text-sm text-muted">
                    Altura
                    <input value={b} onChange={(e) => setB(e.target.value)} inputMode="decimal"
                      className="mt-1 w-full rounded-lg border border-paper-line bg-paper px-3 py-2 text-base text-ink" />
                  </label>
                )}
              </div>
              <div className="rounded-xl border border-dashed border-paper-line bg-paper p-6 text-center text-sm text-muted">
                Vista geométrica interactiva — el constructor completo se implementa en el bloque Geometría de S26.3.
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-paper-line bg-paper-soft">
            <header className="border-b border-paper-line px-4 py-3">
              <h3 className="border-l-4 border-marker pl-2 text-sm font-semibold text-ink">Resultado</h3>
            </header>
            <div className="space-y-4 p-4" aria-live="polite">
              {result ? (
                <>
                  <p className="text-sm text-muted">{result.formula}</p>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">Área</p>
                    <p className="mt-1 text-3xl font-semibold text-ink">{fmt(result.area)}</p>
                  </div>
                  {result.perimeter !== null && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted">Perímetro / circunferencia</p>
                      <p className="mt-1 text-xl font-medium text-ink">{fmt(result.perimeter)}</p>
                    </div>
                  )}
                </>
              ) : <p className="text-sm text-red-600">Ingresa medidas positivas válidas.</p>}
            </div>
          </section>
        </div>
      ) : (
        <section className="rounded-xl border border-paper-line bg-paper-soft p-5">
          <h3 className="text-base font-semibold text-ink">{TABS.find((item) => item.id === tab)?.label}</h3>
          <p className="mt-2 text-sm text-muted">
            Superficie reservada para el siguiente bloque de S26.3. El contrato funcional está documentado en qa/s26/GEOMETRY_CONTRACT.md.
          </p>
        </section>
      )}
    </div>
  );
}
