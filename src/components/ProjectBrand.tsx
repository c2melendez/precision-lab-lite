export function ProjectBrand() {
  const brandIcon = `${import.meta.env.BASE_URL}icons/precision-lab-lite.svg`;
  return (
    <div className="flex min-w-0 items-center gap-2.5" aria-label="Precision Lab Lite">
      <img
        src={brandIcon}
        alt=""
        aria-hidden="true"
        className="h-10 w-10 shrink-0 rounded-xl shadow-sm"
      />
      <h1 className="min-w-0 truncate font-display text-lg font-medium tracking-tight text-bone">
        Precision Lab <span className="text-marker">Lite</span>
      </h1>
    </div>
  );
}
