// Grilla de entrada de matriz — M21: hasta 6x6. Usa <input>
// simples en vez de NaturalInput por celda: TODO declarado, ver README del
// Módulo 6 sobre por qué no se usó MathLive aquí.

interface MatrixGridInputProps {
  rows: number;
  cols: number;
  values: string[][];
  onChange: (values: string[][]) => void;
  label: string;
}

export function MatrixGridInput({ rows, cols, values, onChange, label }: MatrixGridInputProps) {
  const setCell = (r: number, c: number, value: string) => {
    const next = values.map((row) => [...row]);
    next[r][c] = value;
    onChange(next);
  };

  return (
    <section aria-label={label} className="space-y-2 rounded-xl border border-paper-line bg-paper p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">{label}</h3>
          <p className="text-[11px] text-muted">{rows} × {cols}</p>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto pb-1">
        <div
          className="inline-grid min-w-max gap-1 rounded-lg bg-chrome p-2"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => (
              <input
                key={`${r}-${c}`}
                value={values[r]?.[c] ?? ""}
                onChange={(e) => setCell(r, c, e.target.value)}
                aria-label={`${label} celda fila ${r + 1} columna ${c + 1}`}
                className="w-10 rounded-md bg-chrome-soft px-1 py-1.5 text-center text-bone sm:w-12 lg:w-14"
                placeholder="0"
              />
            )),
          )}
        </div>
      </div>
    </section>
  );
}

export function makeEmptyMatrix(rows: number, cols: number): string[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => ""));
}
