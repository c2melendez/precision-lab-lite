interface ProjectBrandProps {
  showName?: boolean;
}

export function ProjectBrand({ showName = true }: ProjectBrandProps) {
  const brandIcon = new URL("icons/precision-lab-lite.svg", document.baseURI).toString();
  return (
    <div className="flex min-w-0 flex-col items-start gap-1.5">
      <img
        src={brandIcon}
        alt=""
        aria-hidden="true"
        className="h-10 w-10 shrink-0 rounded-xl shadow-sm"
      />
      <h1 className={showName ? "whitespace-nowrap font-display text-[15px] font-semibold leading-tight tracking-tight text-white" : "sr-only"}>
        Precision Lab <span className="text-sky-300">Lite</span>
      </h1>
    </div>
  );
}
