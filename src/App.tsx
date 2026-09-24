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

// Selector de modos por pestañas tipo "chasis" (Fase 1 — sistema de diseño
// Precision Lab). Historial persistente (IndexedDB) como séptima pestaña,
// más ajustes responsive (safe-area para notch/barra de gestos en móvil).
//
// Fase B (spec UX estilo ClassCalc): se agregó "simple" (modo Basic, 4
// operaciones) como pestaña adicional — sin fusionar Álgebra/Cálculo/
// Sistemas dentro de Científica ni cambiar a un dropdown de 4 modos
// todavía (decisión explícita: se pospone hasta que el ícono "sistema"
// del teclado de Científica tenga lógica real de resolución).

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

// Punto 4 del rediseño de teclado (pedido de Carlos): Álgebra/Cálculo/
// Sistemas ya no deben verse en el frontend — su función quedó cubierta
// por el router de Fase 1/2 dentro de "Científica" (ecuación/sistema/
// derivada/integral/límite, todo en una sola pantalla). Los modos en sí
// NO se eliminan (siguen existiendo, siguen siendo válidos si algo
// interno navega ahí), solo se les quita la pestaña visible.
//
// Módulo 5 (hoja-de-ruta-visual.md §5 / spec §3): mismo tratamiento para
// "simple" (Basic) — confirmado por el usuario. Se verificó que ninguna
// función de Basic queda huérfana SALVO UNA: SimpleKeyboard tenía
// botones ←/→ para recargar una expresión previa de vuelta al campo
// editable (historyBack/historyForward en SimpleBasicMode.tsx) — eso NO
// existe en Científica hoy. El HistoryLog de Científica (dentro de
// Screen.tsx) es de solo lectura + expandir pasos, no "recargar para
// editar". Reportado en el cierre del módulo — no bloqueé la
// eliminación porque ya estaba confirmada, pero es una pérdida de
// funcionalidad real, no solo teórica.
//
// P2 (spec v2 §3): "history" deja de ser pestaña — pasa a ser el
// HistoryDrawer (botón dedicado en el header, ya no un tab). Se queda
// en `type Mode`/MODE_LABELS por si algo interno todavía lo referencia,
// pero ya no aparece en VISIBLE_MODES.
// P6 (spec v2 §7): "statistics" nueva, visible.
// P7 (spec v2 §8): "units" nueva, visible — con esto queda el orden
// final de §9 (previo al Módulo 5): Científica · Basic · Matrices ·
// Gráficas · Estadística · Unidades. Módulo 5: se quita "Basic".
const VISIBLE_MODES: Mode[] = ["basic", "matrices", "graphing", "statistics", "geometry", "units"];

const MODE_ICONS: Partial<Record<Mode, ModeIconName>> = {
  basic: "scientific",
  matrices: "matrix",
  graphing: "graph",
  statistics: "statistics",
  geometry: "geometry",
  units: "units",
};

export default function App() {
  const [mode, setMode] = useState<Mode>("basic");
  const [historyOpen, setHistoryOpen] = useState(false);
  // Módulo P3/P4: sin dock fijo en "stacked", ni en "floating" realmente
  // activo (viewport ancho) — mismo criterio que KeyboardDock.tsx.
  const layoutMode = useLayoutModeStore((s) => s.layoutMode);
  const isFloatingWideEnough = useMinWidthMediaQuery(FLOATING_MIN_WIDTH_PX);
  const hasDockContent = useKeyboardPanelStore((s) =>
    s.content !== null || s.basicContent !== null || s.compactActions !== null);
  const hasFixedDock = hasDockContent && !(layoutMode === "stacked" || (layoutMode === "floating" && isFloatingWideEnough));
  // Reserva espacio inferior solo cuando el módulo registra un dock.
  const mainBottomPadding = hasFixedDock ? "pb-56 md:pb-72" : "pb-8";
  const pendingArgandPoint = useArgandBridgeStore((s) => s.pendingArgandPoint);
  const pendingGraphExpression = usePendingGraphStore((s) => s.pendingExpression);

  // Fase F (Módulo F3): "Graficar" llena el store puente; acá se
  // consume UNA vez (cambia a la pestaña de graficación) -- el punto en
  // sí (re/im) lo vuelve a leer GraphingMode directamente del mismo
  // store, esto solo se encarga del cambio de pestaña.
  useEffect(() => {
    if (pendingArgandPoint !== null) setMode("graphing");
  }, [pendingArgandPoint]);

  // Botón "Graficar" explícito en GraphPlaceholder.tsx (decisión de
  // producto confirmada por Carlos) -- mismo criterio que el efecto de
  // arriba: solo cambia de pestaña, GraphingMode.tsx consume y limpia
  // la expresión pendiente él mismo.
  useEffect(() => {
    if (pendingGraphExpression !== null) setMode("graphing");
  }, [pendingGraphExpression]);

  // Fase X, Módulo X0 (Smart Docks): sincroniza el modo activo al store
  // global para que MathKeyboard.tsx (que no recibe `mode` como prop)
  // sepa en qué "cajón" del historial registrar cada tecla. Ver
  // useActiveModeStore.ts para por qué no se reutiliza `mode` directo.
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
      <header className="border-b border-chrome-soft bg-chrome px-3 py-3 sm:px-4">
        <div className="mx-auto flex max-w-[1376px] items-center justify-between gap-2">
          <ProjectBrand />
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setHistoryOpen((o) => !o)}
              aria-label="Historial"
              aria-expanded={historyOpen}
              aria-controls="history-panel"
              className="flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-bone/80 hover:bg-chrome-soft hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marker"
            >
              <span aria-hidden="true">▤</span>
              <span className="hidden text-xs sm:inline">Historial</span>
            </button>
            <AjustesPopover />
          </div>
        </div>
      </header>
      <nav aria-label="Modos de la calculadora" className="border-b border-chrome-soft bg-chrome">
        <div className="mx-auto flex max-w-[1376px] flex-nowrap gap-1 overflow-x-auto px-3 py-1.5 text-sm sm:justify-center sm:px-4 lg:gap-2">
          {VISIBLE_MODES.map((m) => {
            const icon = MODE_ICONS[m];
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                aria-current={m === mode ? "page" : undefined}
                className={
                  m === mode
                    ? "flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border-b-2 border-marker bg-marker-soft px-3 font-medium text-marker-text"
                    : "flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border-b-2 border-transparent px-3 text-bone/70 hover:bg-chrome-soft hover:text-bone"
                }
              >
                {icon && <ModeIcon name={icon} className="h-4 w-4" />}
                <span>{MODE_LABELS[m]}</span>
              </button>
            );
          })}
        </div>
      </nav>
      <div className="flex">
        {/* Módulo 0: padding inferior para que el KeyboardDock fijo (que
            ahora vive fuera de este flujo, montado más abajo) no tape el
            contenido de ningún modo — no solo Científica. Cambio a nivel
            de layout global, deliberado, ver Cierre del Módulo 0. Módulo
            P3: en "stacked" no hay dock fijo que compensar. */}
        <main id="main-content" tabIndex={-1} className={`min-w-0 flex-1 bg-paper text-ink ${mainBottomPadding} focus:outline-none`}>
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
