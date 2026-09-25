import { useEffect, useRef, useState } from "react";
import { useLayoutModeStore, type LayoutMode } from "../store/useLayoutModeStore";
import { GRAPH_COLOR_PALETTES, useGraphColorPaletteStore } from "../store/useGraphColorPaletteStore";
import {
  readSoundEnabled,
  readVibrationEnabled,
  setSoundEnabled as persistSoundEnabled,
  setVibrationEnabled as persistVibrationEnabled,
} from "../utils/keyFeedback";

/**
 * AjustesPopover.tsx — Módulo 6 (hoja-de-ruta-visual.md §6 / log §7 /
 * spec §7). Reemplaza a ThemeToggle.tsx (ciclo de 3 estados) por un
 * popover de engranaje con selección directa entre 4 temas + el toggle
 * Fusionada/Separada. ThemeToggle.tsx se deja en el repo sin usar (no se
 * borra) por si hace falta su lógica de ciclo más adelante.
 *
 * Temas: mismo mecanismo que ThemeToggle (atributo `data-theme` en
 * <html>, persistido en localStorage con la MISMA clave que ya usaba
 * ThemeToggle — así una preferencia guardada antes de este módulo sigue
 * siendo válida). Azul SaaS es el 4º tema, tokens confirmados en
 * design-tokens.css.
 *
 * Sistema de temas preparado para crecer (log §7, "10 temas propuestos"):
 * agregar uno nuevo es un bloque en design-tokens.css + una línea en
 * THEMES de abajo. Corrección post-auditoría: los 9 que quedaban
 * pendientes ya están implementados (colores elegidos por criterio propio,
 * ver comentario de cabecera en design-tokens.css) — quedan agrupados por
 * familia visual (oscuros / claros / alto contraste) en el propio array,
 * no en el orden en que se propusieron en el log.
 */

type ConcreteTheme =
  | "v4-blue"
  | "dark"
  | "light"
  | "high-contrast"
  | "saas-blue"
  | "mint"
  | "sepia"
  | "midnight-purple"
  | "coral"
  | "graphite"
  | "amber-light"
  | "cyan-tech"
  | "deep-forest"
  | "high-contrast-blue";

/**
 * Fase U, Módulo U0 — Tema automático. "auto" es una SELECCIÓN, no un
 * tema concreto: nunca se escribe tal cual en `data-theme` (design-tokens.css
 * no tiene bloque para "auto"). Se resuelve siempre a "dark" o "light"
 * según `prefers-color-scheme` del sistema — Alto Contraste y los 9 temas
 * adicionales quedan fuera del modo automático a propósito (spec Fase U:
 * "quedan como elección manual exclusivamente").
 */
type Theme = ConcreteTheme | "auto";
const THEME_STORAGE_KEY = "precision-lab-theme";

function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveTheme(selection: Theme): ConcreteTheme {
  if (selection === "auto") return systemPrefersDark() ? "dark" : "light";
  return selection;
}

/**
 * Fase Q, Módulo Q0 — Densidad de interfaz. Mismo mecanismo que el tema
 * (atributo en <html>, persistido en localStorage) pero con
 * `data-density` en vez de `data-theme` — ver design-tokens.css para el
 * porqué de por qué esto alcanza sin tocar componentes individuales.
 * Independiente de tema y de layoutMode (Fase P) — combinable con
 * cualquiera de los dos sin conflicto, porque no comparte ningún
 * selector CSS con ellos.
 */
type Density = "compact" | "comfortable";
const DENSITY_STORAGE_KEY = "precision-lab-density";

function applyDensity(density: Density) {
  document.documentElement.setAttribute("data-density", density);
  localStorage.setItem(DENSITY_STORAGE_KEY, density);
}

function readInitialDensity(): Density {
  const stored = localStorage.getItem(DENSITY_STORAGE_KEY);
  return stored === "compact" ? "compact" : "comfortable";
}

/**
 * Fase R, Módulo R0 — Accesibilidad tipográfica. Mismo mecanismo
 * (atributo en <html> + localStorage) que tema/densidad.
 */
type TextSize = "normal" | "large" | "xlarge";
const TEXT_SIZE_STORAGE_KEY = "precision-lab-text-size";
const TEXT_SIZES: { id: TextSize; label: string }[] = [
  { id: "normal", label: "Normal" },
  { id: "large", label: "Grande" },
  { id: "xlarge", label: "Muy grande" },
];

function applyTextSize(size: TextSize) {
  document.documentElement.setAttribute("data-text-size", size);
  localStorage.setItem(TEXT_SIZE_STORAGE_KEY, size);
}

function readInitialTextSize(): TextSize {
  const stored = localStorage.getItem(TEXT_SIZE_STORAGE_KEY);
  return TEXT_SIZES.some((t) => t.id === stored) ? (stored as TextSize) : "normal";
}

const DYSLEXIA_STORAGE_KEY = "precision-lab-dyslexia-friendly";

function applyDyslexiaFriendly(enabled: boolean) {
  document.documentElement.setAttribute("data-dyslexia-friendly", String(enabled));
  localStorage.setItem(DYSLEXIA_STORAGE_KEY, String(enabled));
}

function readInitialDyslexiaFriendly(): boolean {
  return localStorage.getItem(DYSLEXIA_STORAGE_KEY) === "true";
}

/**
 * Fase S, Módulo S0 — Reducir movimiento.
 *
 * Tres estados posibles en localStorage, no dos: ausente (el usuario
 * nunca tocó el toggle → seguir `prefers-reduced-motion` del sistema,
 * y seguir escuchando sus cambios), "true" (forzado, manual), "false"
 * (forzado, manual). Una vez el usuario toca el toggle, pasa a "true" u
 * "false" para siempre — deja de escuchar el sistema, como pide el spec
 * ("el toggle manual, una vez usado, tiene prioridad").
 */
const REDUCED_MOTION_STORAGE_KEY = "precision-lab-reduced-motion";

function systemPrefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasManualReducedMotionOverride(): boolean {
  const stored = localStorage.getItem(REDUCED_MOTION_STORAGE_KEY);
  return stored === "true" || stored === "false";
}

function computeReducedMotion(): boolean {
  const stored = localStorage.getItem(REDUCED_MOTION_STORAGE_KEY);
  if (stored === "true") return true;
  if (stored === "false") return false;
  return systemPrefersReducedMotion();
}

function applyReducedMotion(enabled: boolean) {
  document.documentElement.setAttribute("data-reduced-motion", String(enabled));
}

const THEMES: { id: Theme; label: string }[] = [
  { id: "v4-blue", label: "Azul claro" },
  { id: "auto", label: "Automático (sistema)" },
  { id: "dark", label: "Oscuro" },
  { id: "light", label: "Claro" },
  { id: "high-contrast", label: "Alto contraste" },
  { id: "saas-blue", label: "Azul SaaS" },
  { id: "midnight-purple", label: "Medianoche Púrpura" },
  { id: "graphite", label: "Grafito Monocromo" },
  { id: "cyan-tech", label: "Cian Tecnológico" },
  { id: "deep-forest", label: "Bosque Profundo" },
  { id: "mint", label: "Menta" },
  { id: "sepia", label: "Sepia Cuaderno" },
  { id: "coral", label: "Coral" },
  { id: "amber-light", label: "Ámbar Claro" },
  { id: "high-contrast-blue", label: "Alto Contraste Azul" },
];

type SettingsSection = "appearance" | "accessibility" | "keyboard" | "graph";

const PRIMARY_THEMES: { id: Theme; label: string; description: string }[] = [
  { id: "light", label: "Claro", description: "Interfaz clara para espacios bien iluminados." },
  { id: "dark", label: "Oscuro", description: "Interfaz oscura con menor luminancia." },
  { id: "auto", label: "Sistema", description: "Sigue automáticamente el tema del dispositivo." },
];

const LAYOUT_OPTIONS: { id: LayoutMode; label: string; description: string }[] = [
  { id: "fused", label: "Por defecto", description: "Entrada, resultado y contexto en una composición equilibrada." },
  { id: "stacked", label: "Compacto", description: "Prioriza el flujo vertical y reduce ocupación lateral." },
  { id: "split", label: "Lateral", description: "Distribuye el trabajo en columnas cuando existe espacio." },
  { id: "focus", label: "Centrado", description: "Concentra la atención en el contenido principal." },
  { id: "separated", label: "Extendido", description: "Separa las superficies para dar más aire visual." },
  { id: "floating", label: "Flotante", description: "Permite paneles flotantes en pantallas suficientemente anchas." },
];

function LayoutPreview({ mode, active }: { mode: LayoutMode; active: boolean }) {
  const frame = active ? "border-marker bg-marker-soft" : "border-paper-line bg-paper";
  const block = active ? "bg-marker/80" : "bg-muted/35";
  if (mode === "split") {
    return <div aria-hidden="true" className={`grid h-10 grid-cols-2 gap-1 rounded-md border p-1 ${frame}`}><span className={`rounded-sm ${block}`} /><span className={`rounded-sm ${block}`} /></div>;
  }
  if (mode === "stacked") {
    return <div aria-hidden="true" className={`grid h-10 grid-rows-3 gap-1 rounded-md border p-1 ${frame}`}><span className={`rounded-sm ${block}`} /><span className={`rounded-sm ${block}`} /><span className={`rounded-sm ${block}`} /></div>;
  }
  if (mode === "focus") {
    return <div aria-hidden="true" className={`flex h-10 items-center justify-center rounded-md border p-1 ${frame}`}><span className={`h-7 w-3/5 rounded-sm ${block}`} /></div>;
  }
  if (mode === "floating") {
    return <div aria-hidden="true" className={`relative h-10 rounded-md border p-1 ${frame}`}><span className={`absolute left-2 top-2 h-5 w-1/2 rounded-sm ${block}`} /><span className={`absolute bottom-2 right-2 h-5 w-1/2 rounded-sm border border-paper-soft ${block}`} /></div>;
  }
  if (mode === "separated") {
    return <div aria-hidden="true" className={`grid h-10 grid-cols-3 gap-1 rounded-md border p-1 ${frame}`}><span className={`rounded-sm ${block}`} /><span className={`rounded-sm ${block}`} /><span className={`rounded-sm ${block}`} /></div>;
  }
  return <div aria-hidden="true" className={`h-10 rounded-md border p-1 ${frame}`}><span className={`block h-full rounded-sm ${block}`} /></div>;
}

function applyTheme(selection: Theme) {
  // Persistimos la SELECCIÓN ("auto" incluido), pero `data-theme` siempre
  // lleva el tema concreto resuelto — así design-tokens.css no necesita
  // saber que "auto" existe.
  document.documentElement.setAttribute("data-theme", resolveTheme(selection));
  localStorage.setItem(THEME_STORAGE_KEY, selection);
}

function readInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  return stored && THEMES.some((t) => t.id === stored) ? stored : "v4-blue";
}

export function AjustesPopover() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<SettingsSection>("appearance");
  const [theme, setTheme] = useState<Theme>("v4-blue");
  const [density, setDensity] = useState<Density>("comfortable");
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [dyslexiaFriendly, setDyslexiaFriendly] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const layoutMode = useLayoutModeStore((s) => s.layoutMode);
  const setLayoutMode = useLayoutModeStore((s) => s.setLayoutMode);
  const graphPaletteId = useGraphColorPaletteStore((s) => s.paletteId);
  const setGraphPaletteId = useGraphColorPaletteStore((s) => s.setPaletteId);

  useEffect(() => {
    const initial = readInitialTheme();
    setTheme(initial);
    applyTheme(initial);
    const initialDensity = readInitialDensity();
    setDensity(initialDensity);
    applyDensity(initialDensity);
    const initialTextSize = readInitialTextSize();
    setTextSize(initialTextSize);
    applyTextSize(initialTextSize);
    const initialDyslexiaFriendly = readInitialDyslexiaFriendly();
    setDyslexiaFriendly(initialDyslexiaFriendly);
    applyDyslexiaFriendly(initialDyslexiaFriendly);
    const initialReducedMotion = computeReducedMotion();
    setReducedMotion(initialReducedMotion);
    applyReducedMotion(initialReducedMotion);
    // Módulo V0: sin `applyX` propio — estas dos no escriben ningún
    // atributo en <html>, `triggerKeyFeedback()` lee `localStorage`
    // directamente en cada pulsación (ver utils/keyFeedback.ts).
    setVibrationEnabled(readVibrationEnabled());
    setSoundEnabled(readSoundEnabled());
  }, []);

  useEffect(() => {
    // Módulo S0: mientras el usuario NUNCA haya tocado el toggle, seguir
    // los cambios en vivo de prefers-reduced-motion del sistema (ej. lo
    // activa en las preferencias del SO sin recargar la página). En
    // cuanto exista un override manual, este listener deja de aplicar
    // cambios — el toggle manual manda, como pide el spec.
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    function onSystemChange() {
      if (hasManualReducedMotionOverride()) return;
      setReducedMotion(mql.matches);
      applyReducedMotion(mql.matches);
    }
    mql.addEventListener("change", onSystemChange);
    return () => mql.removeEventListener("change", onSystemChange);
  }, []);

  useEffect(() => {
    // Módulo U0: si la selección actual es "auto", seguir en vivo los
    // cambios de prefers-color-scheme del sistema (ej. el usuario cambia
    // de claro a oscuro en el SO sin recargar). No usamos el `theme` del
    // closure para decidir si aplica — leemos el valor guardado en cada
    // evento, igual que el listener de reducir movimiento, para no
    // depender de reordenar efectos.
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    function onSystemThemeChange() {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored !== "auto") return;
      document.documentElement.setAttribute("data-theme", resolveTheme("auto"));
    }
    mql.addEventListener("change", onSystemThemeChange);
    return () => mql.removeEventListener("change", onSystemThemeChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function pickTheme(next: Theme) {
    setTheme(next);
    applyTheme(next);
  }

  function pickDensity(next: Density) {
    setDensity(next);
    applyDensity(next);
  }

  function pickTextSize(next: TextSize) {
    setTextSize(next);
    applyTextSize(next);
  }

  function toggleDyslexiaFriendly() {
    const next = !dyslexiaFriendly;
    setDyslexiaFriendly(next);
    applyDyslexiaFriendly(next);
  }

  function toggleReducedMotion() {
    const next = !reducedMotion;
    setReducedMotion(next);
    applyReducedMotion(next);
    // A partir de aquí queda como override manual permanente — "false"
    // explícito, no ausente, para que el listener del sistema de arriba
    // deje de tocarlo (hasManualReducedMotionOverride() ahora es true).
    localStorage.setItem(REDUCED_MOTION_STORAGE_KEY, String(next));
  }

  function toggleVibration() {
    const next = !vibrationEnabled;
    setVibrationEnabled(next);
    persistVibrationEnabled(next);
  }

  function toggleSound() {
    const next = !soundEnabled;
    setSoundEnabled(next);
    persistSoundEnabled(next);
  }

  return (
    <div ref={popoverRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Ajustes"
        aria-expanded={open}
        className="rounded-md bg-white/10 p-1.5 text-white hover:bg-white/15"
      >
        <span aria-hidden="true">⚙</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Configuración"
          className="fixed inset-x-3 bottom-3 top-3 z-[70] grid grid-cols-1 overflow-hidden rounded-xl border border-paper-line bg-paper-soft text-ink shadow-2xl sm:absolute sm:inset-auto sm:bottom-0 sm:left-full sm:ml-2 sm:max-h-[calc(100vh-2rem)] sm:w-[min(46rem,calc(100vw-7rem))] sm:grid-cols-[9.5rem_minmax(0,1fr)]"
        >
          <nav aria-label="Secciones de configuración" className="border-b border-paper-line bg-paper p-2 sm:border-b-0 sm:border-r">
            <div className="flex gap-1 overflow-x-auto sm:flex-col">
              {([
                ["appearance", "Apariencia"],
                ["accessibility", "Accesibilidad"],
                ["keyboard", "Teclado"],
                ["graph", "Gráficas"],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSection(id)}
                  aria-current={section === id ? "page" : undefined}
                  className={
                    section === id
                      ? "shrink-0 rounded-lg bg-marker-soft px-3 py-2 text-left text-xs font-semibold text-marker-text"
                      : "shrink-0 rounded-lg px-3 py-2 text-left text-xs font-medium text-muted hover:bg-paper-line/50 hover:text-ink"
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>

          <div className="min-h-0 overflow-y-auto p-4">
            {section === "appearance" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm font-semibold">Apariencia</h2>
                  <p className="mt-1 text-xs text-muted">Tema, densidad visual y distribución del área de trabajo.</p>
                </div>

                <section aria-labelledby="settings-theme-heading">
                  <h3 id="settings-theme-heading" className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Tema</h3>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {PRIMARY_THEMES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        aria-label={t.label}
                        onClick={() => pickTheme(t.id)}
                        aria-pressed={theme === t.id}
                        className={
                          theme === t.id
                            ? "rounded-lg border border-marker bg-marker-soft p-3 text-left"
                            : "rounded-lg border border-paper-line bg-paper p-3 text-left hover:border-marker/50"
                        }
                      >
                        <span className="block text-sm font-semibold">{t.label}</span>
                        <span className="mt-1 block text-[11px] leading-snug text-muted">{t.description}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-3">
                    <div className="mb-1.5 text-[10px] uppercase tracking-wide text-muted">Temas adicionales</div>
                    <div className="grid gap-1.5 sm:grid-cols-2">
                      {THEMES.filter((t) => !PRIMARY_THEMES.some((primary) => primary.id === t.id)).map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => pickTheme(t.id)}
                          aria-pressed={theme === t.id}
                          className={
                            theme === t.id
                              ? "rounded-md border border-marker bg-marker-soft px-2.5 py-2 text-left text-xs font-medium text-marker-text"
                              : "rounded-md border border-paper-line px-2.5 py-2 text-left text-xs text-ink hover:bg-paper"
                          }
                        >
                          {theme === t.id ? "✓ " : ""}{t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section aria-labelledby="settings-layout-heading">
                  <div className="mb-2">
                    <h3 id="settings-layout-heading" className="text-xs font-semibold uppercase tracking-wide text-muted">Diseño</h3>
                    <p className="mt-1 text-[11px] text-muted">Flotante degrada automáticamente a un modo seguro cuando el ancho no es suficiente.</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {LAYOUT_OPTIONS.map((option) => {
                      const selected = layoutMode === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          aria-label={option.label}
                          data-layout-option={option.id}
                          onClick={() => setLayoutMode(option.id)}
                          aria-pressed={selected}
                          className={
                            selected
                              ? "rounded-lg border border-marker bg-marker-soft p-2 text-left"
                              : "rounded-lg border border-paper-line bg-paper p-2 text-left hover:border-marker/50"
                          }
                        >
                          <LayoutPreview mode={option.id} active={selected} />
                          <span className="mt-2 block text-xs font-semibold">{option.label}</span>
                          <span className="mt-0.5 block text-[10px] leading-snug text-muted">{option.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section aria-labelledby="settings-density-heading">
                  <h3 id="settings-density-heading" className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Densidad</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(["comfortable", "compact"] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => pickDensity(value)}
                        aria-pressed={density === value}
                        className={
                          density === value
                            ? "rounded-lg border border-marker bg-marker-soft px-3 py-2 text-xs font-semibold text-marker-text"
                            : "rounded-lg border border-paper-line bg-paper px-3 py-2 text-xs text-ink hover:border-marker/50"
                        }
                      >
                        {value === "comfortable" ? "Cómoda" : "Compacta"}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {section === "accessibility" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold">Accesibilidad</h2>
                  <p className="mt-1 text-xs text-muted">Opciones de lectura y movimiento sin alterar el contenido matemático.</p>
                </div>
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Tamaño de texto (números y teclado)</div>
                  <div className="grid grid-cols-3 gap-2">
                    {TEXT_SIZES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => pickTextSize(t.id)}
                        aria-pressed={textSize === t.id}
                        className={
                          textSize === t.id
                            ? "rounded-lg border border-marker bg-marker-soft px-2 py-2 text-xs font-semibold text-marker-text"
                            : "rounded-lg border border-paper-line bg-paper px-2 py-2 text-xs text-ink"
                        }
                      >{t.label}</button>
                    ))}
                  </div>
                </div>
                {[
                  ["Espaciado amigable con dislexia", dyslexiaFriendly, toggleDyslexiaFriendly],
                  ["Reducir movimiento", reducedMotion, toggleReducedMotion],
                ].map(([label, enabled, action]) => (
                  <div key={label as string} className="flex items-center justify-between gap-3 rounded-lg border border-paper-line bg-paper p-3">
                    <span className="text-xs font-medium">{label as string}</span>
                    <button
                      type="button"
                      onClick={action as () => void}
                      aria-pressed={enabled as boolean}
                      className={(enabled as boolean) ? "rounded-md bg-marker px-3 py-1.5 text-xs font-semibold text-chrome" : "rounded-md bg-paper-line px-3 py-1.5 text-xs font-medium text-ink"}
                    >
                      {(enabled as boolean) ? "Activado" : "Desactivado"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {section === "keyboard" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold">Teclado</h2>
                  <p className="mt-1 text-xs text-muted">Feedback de las teclas del teclado matemático global.</p>
                </div>
                {[
                  ["Vibración al presionar tecla", vibrationEnabled, toggleVibration],
                  ["Sonido de clic", soundEnabled, toggleSound],
                ].map(([label, enabled, action]) => (
                  <div key={label as string} className="flex items-center justify-between gap-3 rounded-lg border border-paper-line bg-paper p-3">
                    <span className="text-xs font-medium">{label as string}</span>
                    <button
                      type="button"
                      onClick={action as () => void}
                      aria-pressed={enabled as boolean}
                      className={(enabled as boolean) ? "rounded-md bg-marker px-3 py-1.5 text-xs font-semibold text-chrome" : "rounded-md bg-paper-line px-3 py-1.5 text-xs font-medium text-ink"}
                    >
                      {(enabled as boolean) ? "Activado" : "Desactivado"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {section === "graph" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold">Gráficas</h2>
                  <p className="mt-1 text-xs text-muted">Paleta usada por las curvas y superficies gráficas.</p>
                </div>
                <div className="grid gap-2">
                  {GRAPH_COLOR_PALETTES.map((palette) => (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => setGraphPaletteId(palette.id)}
                      aria-pressed={graphPaletteId === palette.id}
                      className={
                        graphPaletteId === palette.id
                          ? "flex items-center gap-3 rounded-lg border border-marker bg-marker-soft p-3 text-left"
                          : "flex items-center gap-3 rounded-lg border border-paper-line bg-paper p-3 text-left hover:border-marker/50"
                      }
                    >
                      <span className="flex shrink-0 gap-1">
                        {palette.colors.map((color, index) => <span key={index} className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />)}
                      </span>
                      <span className="text-xs font-medium">{palette.label}</span>
                      {palette.colorBlindSafe && <span className="ml-auto text-[10px] text-muted">daltonismo</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
