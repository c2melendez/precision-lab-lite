import { cloneElement, isValidElement, useEffect, useId, useState, type ReactElement, type ReactNode } from "react";
import { MathKeyboard, type KeyboardCategory, type MathKeyboardProps } from "./MathKeyboard";
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

const SECTIONS = ["Básico", "Símbolos", "Álgebra", "Trigonométricas", "Cálculo", "Complejos"] as const;

export function ScientificKeyboardSections({ basic, advanced }: {
  basic: ReactNode;
  advanced: ReactElement<MathKeyboardProps>;
}) {
  const [section, setSection] = useState<"Básico" | KeyboardCategory>("Básico");
  const id = useId();
  return <>
    <div role="tablist" aria-label="Categorías del teclado matemático" className="mb-3 flex flex-wrap gap-1 p-1">
      {SECTIONS.map((name, index) => <button key={name} type="button" role="tab"
        id={`${id}-tab-${index}`} aria-controls={`${id}-panel`} aria-selected={section === name}
        tabIndex={section === name ? 0 : -1}
        onClick={() => setSection(name)}
        onKeyDown={(event) => {
          const next = event.key === "ArrowRight" ? (index + 1) % SECTIONS.length
            : event.key === "ArrowLeft" ? (index + SECTIONS.length - 1) % SECTIONS.length
            : event.key === "Home" ? 0 : event.key === "End" ? SECTIONS.length - 1 : -1;
          if (next < 0) return;
          event.preventDefault();
          setSection(SECTIONS[next]);
          document.getElementById(`${id}-tab-${next}`)?.focus();
        }}
        className={section === name
          ? "rounded-lg bg-marker px-3 py-2 text-xs font-semibold text-chrome"
          : "rounded-lg bg-chrome-soft px-3 py-2 text-xs text-bone hover:bg-marker-soft hover:text-marker-text"}>
        {name}
      </button>)}
    </div>
    <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${SECTIONS.indexOf(section)}`}>
      {section === "Básico" ? basic : cloneElement(advanced, { activeCategory: section })}
    </div>
  </>;
}
