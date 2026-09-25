import type { SVGProps } from "react";

export type ModeIconName = "scientific" | "matrix" | "graph" | "statistics" | "geometry" | "units";

export function ModeIcon({ name, ...props }: { name: ModeIconName } & SVGProps<SVGSVGElement>) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "scientific") {
    return <svg {...common} {...props}><path d="M9 3h6M10 3v5l-5 9a2 2 0 0 0 1.75 3h10.5A2 2 0 0 0 19 17l-5-9V3"/><path d="M8 14h8"/></svg>;
  }
  if (name === "matrix") {
    return <svg {...common} {...props}><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9.33 4v16M14.66 4v16M4 9.33h16M4 14.66h16"/></svg>;
  }
  if (name === "graph") {
    return <svg {...common} {...props}><path d="M4 20V10M10 20V6M16 20V3M22 20V13"/><path d="M2 20h22"/></svg>;
  }
  if (name === "statistics") {
    return <svg {...common} {...props}><path d="M17.5 4H6.5l6 8-6 8h11"/></svg>;
  }
  if (name === "geometry") {
    return <svg {...common} {...props}><path d="M4 19 12 5l8 14H4Z"/><circle cx="12" cy="13" r="3.2"/></svg>;
  }
  return <svg {...common} {...props}><path d="M5 18 18 5l2 2L7 20H5v-2Z"/><path d="m12 9 3 3M9 12l3 3M15 6l3 3"/></svg>;
}
