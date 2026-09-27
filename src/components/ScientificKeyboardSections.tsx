import { cloneElement, isValidElement, useEffect, useId, useMemo, useState, type ReactElement, type ReactNode } from "react";
import {
  CATEGORY_MENUS,
  MathKeyboard,
  type KeyboardCategory,
  type MathKeyboardProps,
} from "./MathKeyboard";
import { useKeyboardPanelStore } from "../store/useKeyboardPanelStore";

export function RegisteredKeyboardSections({ basic, advanced }: { basic: ReactNode; advanced: ReactNode }) {
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") useKeyboardPanelStore.getState().close();
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);

  return basic && isValidElement<MathKeyboardProps>(advanced) && advanced.type === MathKeyboard && advanced.props.hideCoreGrid
    ? <ScientificKeyboardSections basic={basic} advanced={advanced} />
    : <>{basic}{advanced}</>;
}

const FAMILIES: readonly KeyboardCategory[] = [
  "Álgebra",
  "Trigonométricas",
  "Cálculo",
  "Complejos",
  "Símbolos",
  "Unidades",
  "Más",
];

const SYMBOL_SUBCATEGORIES = ["Variables", "Constantes y valores", "Funciones"] as const;

const FAMILY_ICONS: Record<KeyboardCategory, string> = {
  "Álgebra": "x²",
  "Trigonométricas": "sin",
  "Cálculo": "∫",
  "Complejos": "i",
  "Símbolos": "Ω",
  "Unidades": "°",
  "Más": "⋯",
};

const SUBCATEGORY_ICONS: Record<string, string> = {
  "Constantes": "π",
  "Logaritmos": "ln",
  "Exponenciales": "xⁿ",
  "Radicales": "√",
  "Aritmética": "a!",
  "Ecuaciones": "x=",
  "Directas": "sin",
  "Inversas": "sin⁻¹",
  "Hiperbólicas": "sinh",
  "Hiperbólicas inversas": "sinh⁻¹",
  "Integrales": "∫",
  "Sumas y productos": "Σ",
  "Derivadas": "d/dx",
  "Límites": "lim",
  "Ecuaciones diferenciales": "y′",
  "Acceso directo": "i",
  "Funciones": "ƒ",
  "Avanzado": "zⁿ",
  "Ángulos": "∠",
  "Variables": "x",
  "Constantes y valores": "π",
  "Relaciones": "≤",
  "Fracciones": "a/b",
  "Constante útil": "π",
  "Relaciones y ángulos": "°",
  "Signos": "±",
};

function subcategoriesFor(family: KeyboardCategory): string[] {
  if (family === "Símbolos") return [...SYMBOL_SUBCATEGORIES];
  return (CATEGORY_MENUS[family] ?? []).map((group) => group.section);
}

/**
 * S26 B6 — jerarquía visual definitiva:
 * familias arriba → subcategorías a la izquierda → teclas a la derecha
 * → núcleo básico permanente debajo.
 *
 * La captura aprobada define la distribución, no el inventario histórico.
 */
export function ScientificKeyboardSections({ basic, advanced }: {
  basic: ReactNode;
  advanced: ReactElement<MathKeyboardProps>;
}) {
  const [family, setFamily] = useState<KeyboardCategory>("Álgebra");
  const availableSubcategories = useMemo(() => subcategoriesFor(family), [family]);
  const [subcategory, setSubcategory] = useState<string>(() => subcategoriesFor("Álgebra")[0] ?? "");
  const id = useId();

  useEffect(() => {
    if (!availableSubcategories.includes(subcategory)) {
      setSubcategory(availableSubcategories[0] ?? "");
    }
  }, [availableSubcategories, subcategory]);

  const chooseFamily = (next: KeyboardCategory) => {
    setFamily(next);
    setSubcategory(subcategoriesFor(next)[0] ?? "");
  };

  return (
    <div data-testid="keyboard-b6-layout" className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-2">
      <div
        role="tablist"
        aria-label="Familias del teclado matemático"
        className="flex gap-1 overflow-x-auto rounded-xl border border-paper-line bg-paper-soft p-1.5"
      >
        {FAMILIES.map((name, index) => (
          <button
            key={name}
            type="button"
            role="tab"
            id={`${id}-family-${index}`}
            aria-selected={family === name}
            tabIndex={family === name ? 0 : -1}
            onClick={() => chooseFamily(name)}
            onKeyDown={(event) => {
              const next = event.key === "ArrowRight"
                ? (index + 1) % FAMILIES.length
                : event.key === "ArrowLeft"
                  ? (index + FAMILIES.length - 1) % FAMILIES.length
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? FAMILIES.length - 1
                      : -1;
              if (next < 0) return;
              event.preventDefault();
              chooseFamily(FAMILIES[next]);
              document.getElementById(`${id}-family-${next}`)?.focus();
            }}
            className={
              family === name
                ? "flex shrink-0 items-center gap-1.5 rounded-lg bg-marker px-3 py-2 text-xs font-semibold text-chrome"
                : "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted hover:bg-paper hover:text-ink"
            }
          >
            <span aria-hidden="true" className="min-w-5 text-center text-[11px] font-semibold">{FAMILY_ICONS[name]}</span>
            <span>{name}</span>
          </button>
        ))}
      </div>

      <div className="grid min-h-0 grid-cols-1 gap-2 overflow-hidden dt:grid-cols-[10.5rem_minmax(0,1fr)]">
        <div
          aria-label={`Subcategorías de ${family}`}
          className="flex min-h-0 gap-1 overflow-x-auto rounded-xl border border-paper-line bg-paper-soft p-1.5 dt:flex-col dt:overflow-x-hidden dt:overflow-y-auto"
        >
          {availableSubcategories.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={subcategory === name}
              onClick={() => setSubcategory(name)}
              className={
                subcategory === name
                  ? "flex shrink-0 items-center gap-2 rounded-lg border border-marker/30 bg-marker-soft/20 px-2.5 py-2 text-left text-[11px] font-semibold text-marker"
                  : "flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[11px] font-medium text-muted hover:bg-paper hover:text-ink"
              }
            >
              <span aria-hidden="true" className="min-w-8 text-center text-[10px] font-semibold">{SUBCATEGORY_ICONS[name] ?? "·"}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>

        <div
          id={`${id}-context`}
          data-testid="keyboard-b6-context"
          role="tabpanel"
          aria-labelledby={`${id}-family-${FAMILIES.indexOf(family)}`}
          aria-label={`${family}: ${subcategory}`}
          className="min-h-0 min-w-0 overflow-y-auto rounded-xl border border-paper-line bg-paper p-2"
        >
          {cloneElement(advanced, {
            activeCategory: family,
            activeSubcategory: subcategory,
          })}
        </div>
      </div>

      <div
        data-testid="keyboard-b6-core"
        className="min-w-0 shrink-0 rounded-xl border border-paper-line bg-paper p-2"
      >
        {basic}
      </div>
    </div>
  );
}
