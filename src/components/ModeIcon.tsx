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
    return <svg {...common} {...props}><path d="M4 19V5M4 19h16"/><path d="m6 15 4-5 3 3 5-7"/></svg>;
  }
  if (name === "statistics") {
    return <svg {...common} {...props}><path d="M5 19v-5M10 19V9M15 19V5M20 19v-8"/><path d="M3 19h18"/></svg>;
  }
  if (name === "geometry") {
    return <svg {...common} {...props}><path d="m12 3 8 5v8l-8 5-8-5V8l8-5Z"/><path d="m4 8 8 5 8-5M12 13v8"/></svg>;
  }
  return <svg {...common} {...props}><path d="M5 18 18 5l2 2L7 20H5v-2Z"/><path d="m12 9 3 3M9 12l3 3M15 6l3 3"/></svg>;
}
