export function ProjectBrand() {
  return (
    <div className="flex min-w-0 items-center gap-2.5" aria-label="Precision Lab Lite">
      <span
        aria-hidden="true"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-marker/40 bg-marker-soft font-display text-sm font-bold tracking-tight text-marker"
      >
        PL
      </span>
      <span className="min-w-0 truncate font-display text-lg font-medium tracking-tight text-bone">
        Precision Lab <span className="text-marker">Lite</span>
      </span>
    </div>
  );
}
