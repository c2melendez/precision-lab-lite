import { useEffect, useRef } from "react";
import "mathlive";
import { useKeyboardPanelStore } from "../store/useKeyboardPanelStore";

// Wrapper único sobre el <math-field> de MathLive (spec v10 §5). Expone
// getValue()/setValue() en LaTeX y un evento onChange, para que el resto de
// la app nunca dependa directamente de la API de MathLive.
//
// Re-vestido con los tokens Precision Lab (Fase 1/2): vive sobre el panel
// "paper" (igual que su equivalente NaturalMathField.tsx en Precision Lab),
// con el caret y la selección de MathLive en marker.

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        placeholder?: string;
        "virtual-keyboard-mode"?: string;
      };
    }
  }
}

interface NaturalInputProps {
  value: string;
  onChange: (latex: string) => void;
  placeholder?: string;
  /** Fase A: expone el elemento real de MathLive para que MathKeyboard use
   * field.insert() con plantillas #? — igual que Precision Lab (Python).
   * Antes el teclado insertaba con concatenación de texto ingenua; esto
   * corrige eso de una vez ya que estamos reescribiendo el teclado. */
  fieldRef?: (el: (HTMLElement & { value: string; insert: (s: string) => void; focus: () => void }) | null) => void;
  /** Fase E: 'bare' (default false) quita fondo/borde/sombra propios para
   * cuando el campo vive anidado dentro de Screen.tsx, que ya provee el
   * contenedor "pantalla" único (spec UX estilo ClassCalc, mockup). El
   * uso standalone original (con su propia tarjeta) se conserva si algún
   * modo todavía no migró a Screen. */
  bare?: boolean;
}

export interface NaturalInputHandle {
  insert: (latex: string) => void;
  clear: () => void;
}

export function NaturalInput({ value, onChange, placeholder, fieldRef, bare = false }: NaturalInputProps) {
  const ref = useRef<HTMLElement & { value: string; insert: (s: string) => void; focus: () => void }>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => onChange(el.value);
    el.addEventListener("input", handler);
    return () => el.removeEventListener("input", handler);
  }, [onChange]);

  // Fase Y (spec_rediseno_visual.md sección 11) — mismo criterio que
  // precision-lab (main), NaturalMathField.tsx: el foco en el campo de
  // entrada es uno de los 2 mecanismos obligatorios de apertura del
  // teclado.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function handleFocus(): void {
      useKeyboardPanelStore.getState().open();
    }
    el.addEventListener("focus", handleFocus);
    return () => el.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (el && el.value !== value) {
      el.value = value;
    }
  }, [value]);

  return (
    <math-field
      ref={(el: (HTMLElement & { value: string; insert: (s: string) => void; focus: () => void }) | null) => {
        (ref as React.MutableRefObject<typeof el>).current = el;
        fieldRef?.(el);
      }}
      className={
        bare
          ? "block min-w-0 max-w-full w-full bg-transparent px-0 py-1 text-right text-2xl text-ink"
          : "block min-w-0 max-w-full w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-3 text-2xl text-ink shadow-sm"
      }
      style={
        {
          "--caret-color": "#E8A33D",
          "--selection-background-color": "#FBEFDA",
          "--selection-color": "#8A5A0E",
        } as React.CSSProperties
      }
      // "virtual-keyboard-mode" en off: el teclado propio de la app
      // (MathKeyboard) reemplaza al teclado virtual por defecto de MathLive
      // — spec v10 §5.
      virtual-keyboard-mode="off"
      placeholder={placeholder}
    />
  );
}
