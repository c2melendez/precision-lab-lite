export type ResultFormatId = "exact" | "dec" | "frac" | "scn" | "dms";

const LABELS: Record<ResultFormatId, string> = {
  exact: "Exacto",
  dec: "Decimal",
  frac: "Fracción",
  scn: "Científica",
  dms: "DMS",
};

interface ResultFormatSelectorProps {
  formats: ResultFormatId[];
  value: ResultFormatId;
  onChange: (format: ResultFormatId) => void;
}

export function ResultFormatSelector({ formats, value, onChange }: ResultFormatSelectorProps) {
  if (formats.length <= 1) return null;

  return (
    <div
      className="flex flex-wrap gap-1.5 text-xs"
      aria-label="Formato del resultado"
      role="group"
    >
      {formats.map((format) => (
        <button
          key={format}
          type="button"
          onClick={() => onChange(format)}
          aria-pressed={value === format}
          aria-label={LABELS[format]}
          data-format={format}
          title={LABELS[format]}
          className={
            value === format
              ? "min-h-8 rounded-full border border-marker bg-marker-soft px-3 font-semibold text-marker-text"
              : "min-h-8 rounded-full border border-paper-line bg-paper px-3 text-muted hover:border-marker/50 hover:text-ink"
          }
        >
          {LABELS[format]}
        </button>
      ))}
    </div>
  );
}
