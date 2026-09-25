import { useState, useEffect } from "react";
import { useArgandBridgeStore } from "./store/useArgandBridgeStore";
import { usePendingGraphStore } from "./store/usePendingGraphStore";
import { useActiveModeStore } from "./store/useActiveModeStore";
import { BasicScientificMode } from "./modes/BasicScientific/BasicScientificMode";
import { SimpleBasicMode } from "./modes/SimpleBasic/SimpleBasicMode";
import { AlgebraMode } from "./modes/Algebra/AlgebraMode";
import { CalculusMode } from "./modes/Calculus/CalculusMode";
import { LinearSystemsMode } from "./modes/LinearSystems/LinearSystemsMode";
import { MatrixMode } from "./modes/Matrices/MatrixMode";
import { GraphingMode } from "./modes/Graphing/GraphingMode";
import { StatisticsMode } from "./modes/Statistics/StatisticsMode";
import { UnitsMode } from "./modes/Units/UnitsMode";
import { GeometryMode } from "./modes/Geometry/GeometryMode";
import { HistoryPanel } from "./components/HistoryPanel";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { AjustesPopover } from "./components/AjustesPopover";
import { KeyboardDock } from "./components/KeyboardDock";
import { GlobalKeyboardFallback } from "./components/GlobalKeyboardFallback";
import { ProjectBrand } from "./components/ProjectBrand";
import { ModeIcon, type ModeIconName } from "./components/ModeIcon";
import { useLayoutModeStore } from "./store/useLayoutModeStore";
import { useKeyboardPanelStore } from "./store/useKeyboardPanelStore";
import { useMinWidthMediaQuery, FLOATING_MIN_WIDTH_PX } from "./hooks/useMinWidthMediaQuery";

type Mode = "basic" | "simple" | "algebra" | "calculus" | "systems" | "matrices" | "graphing" | "statistics" | "geometry" | "units" | "history";

const MODE_LABELS: Record<Mode, string> = {
  basic: "Científica",
  simple: "Basic",
  algebra: "Álgebra",
  calculus: "Cálculo",
  systems: "Sistemas",
  matrices: "Matrices",
  graphing: "Gráficas",
  statistics: "Estadística",
  geometry: "Geometría",
  units: "Unidades",
  history: "Historial",
};

const VISIBLE_MODES: Mode[] = ["basic", "graphing", "matrices", "statistics", "geometry", "units"];

const MODE_ICONS: Partial<Record<Mode, ModeIconName>> = {
  basic: "scientific",
  graphing: "graph",
  matrices: "matrix",
  statistics: "statistics",
  geometry: "geometry",
  units: "units",
};

const SIDEBAR_STORAGE_KEY = "precision-lab-sidebar-expanded";

function readInitialSidebarExpanded(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(SIDEBAR_STORAGE_KEY) !== "false";
}

export default function App() {
  const [mode, setMode] = useState<Mode>("basic");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(readInitialSidebarExpanded);
  const layoutMode = useLayoutModeStore((s) => s.layoutMode);
  const isFloatingWideEnough = useMinWidthMediaQuery(FLOATING_MIN_WIDTH_PX);
  const hasDockContent = useKeyboardPanelStore((s) =>
    s.content !== null || s.basicContent !== null || s.compactActions !== null);
  const hasFixedDock = hasDockContent && !(layoutMode === "stacked" || (layoutMode === "floating" && isFloatingWideEnough));
  const mainBottomPadding = hasFixedDock ? "pb-56 md:pb-72" : "pb-8";
  const pendingArgandPoint = useArgandBridgeStore((s) => s.pendingArgandPoint);
  const pendingGraphExpression = usePendingGraphStore((s) => s.pendingExpression);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarExpanded));
  }, [sidebarExpanded]);

  useEffect(() => {
    if (pendingArgandPoint !== null) setMode("graphing");
  }, [pendingArgandPoint]);

  useEffect(() => {
    if (pendingGraphExpression !== null) setMode("graphing");
  }, [pendingGraphExpression]);

  const setActiveModeForRecentKeys = useActiveModeStore((s) => s.setActiveMode);
  useEffect(() => {
    setActiveModeForRecentKeys(mode);
  }, [mode, setActiveModeForRecentKeys]);

  return (
    <div className="min-h-screen bg-chrome pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[60] focus:rounded focus:bg-marker focus:px-3 focus:py-2 focus:text-chrome"
      >
        Saltar al contenido principal
      </a>

      <div className="flex min-h-screen">
        <aside
          aria-label="Navegación principal"
          data-sidebar-state={sidebarExpanded ? "expanded" : "compact"}
          className={`sticky top-0 z-10 flex h-screen shrink-0 flex-col border-r border-[#0b467d] bg-[#052b52] text-white transition-[width] duration-200 ${sidebarExpanded ? "w-[72px] md:w-60" : "w-[72px]"}`}
        >
          <header className={`relative flex shrink-0 border-b border-white/15 ${sidebarExpanded ? "min-h-[112px] flex-col items-center px-2 py-3 md:min-h-[104px] md:items-start md:px-3" : "min-h-[112px] flex-col items-center px-2 py-3"}`}>
            <ProjectBrand showName={sidebarExpanded} />
            <button
              type="button"
              onClick={() => setSidebarExpanded((current) => !current)}
              aria-label={sidebarExpanded ? "Contraer navegación" : "Expandir navegación"}
              aria-expanded={sidebarExpanded}
              title={sidebarExpanded ? "Contraer navegación" : "Expandir navegación"}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${sidebarExpanded ? "mt-2 md:absolute md:right-2 md:top-2 md:mt-0" : "mt-2"}`}
            >
              <span aria-hidden="true" className="text-xl leading-none">☰</span>
            </button>
          </header>

          <nav aria-label="Modos de la calculadora" className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
            <ul className="space-y-1">
              {VISIBLE_MODES.map((m) => {
                const icon = MODE_ICONS[m];
                const active = m === mode;
                return (
                  <li key={m}>
                    <button
                      type="button"
                      onClick={() => setMode(m)}
                      aria-current={active ? "page" : undefined}
                      aria-label={MODE_LABELS[m]}
                      title={!sidebarExpanded ? MODE_LABELS[m] : undefined}
                      className={
                        active
                          ? "flex min-h-11 w-full items-center gap-3 rounded-lg bg-[#1478ff] px-3 font-medium text-white shadow-sm"
                          : "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-white/80 hover:bg-white/10 hover:text-white"
                      }
                    >
                      {icon && <ModeIcon name={icon} className="h-5 w-5 shrink-0" />}
                      {sidebarExpanded && <span className="hidden whitespace-nowrap text-sm md:inline">{MODE_LABELS[m]}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={`space-y-1 border-t border-white/15 px-2 py-3 ${hasFixedDock ? "mb-24" : ""}`}>
            <button
              type="button"
              onClick={() => setHistoryOpen((o) => !o)}
              aria-label="Historial"
              aria-expanded={historyOpen}
              aria-controls="history-panel"
              title={!sidebarExpanded ? "Historial" : undefined}
              className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
            >
              <span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center">▤</span>
              {sidebarExpanded && <span className="hidden whitespace-nowrap text-sm md:inline">Historial</span>}
            </button>
            <div className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-white/80" title={!sidebarExpanded ? "Configuración" : undefined}>
              <div className="grid h-5 w-5 shrink-0 place-items-center">
                <AjustesPopover />
              </div>
              {sidebarExpanded && <span className="hidden whitespace-nowrap text-sm md:inline">Configuración</span>}
            </div>
          </div>
        </aside>

        <main id="main-content" tabIndex={-1} className={`min-h-screen min-w-0 flex-1 overflow-x-hidden bg-paper text-ink ${mainBottomPadding} focus:outline-none`}>
          {mode === "basic" && <BasicScientificMode />}
          {mode === "simple" && <SimpleBasicMode />}
          {mode === "algebra" && <AlgebraMode />}
          {mode === "calculus" && <CalculusMode />}
          {mode === "systems" && <LinearSystemsMode />}
          {mode === "matrices" && <MatrixMode />}
          {mode === "graphing" && <GraphingMode />}
          {mode === "statistics" && <StatisticsMode />}
          {mode === "geometry" && <GeometryMode />}
          {mode === "units" && <UnitsMode />}
        </main>

        <HistoryDrawer isOpen={historyOpen} onClose={() => setHistoryOpen(false)}>
          <HistoryPanel />
        </HistoryDrawer>
      </div>
      <GlobalKeyboardFallback mode={mode} />
      <KeyboardDock />
    </div>
  );
}
