import { useState, type MouseEvent as ReactMouseEvent } from "react";
import { useLongPress } from "../hooks/useLongPress";
import { KeyGlyph, type Glyph } from "./KeyGlyph";
import { key, type KeyDef, type MathField } from "./MathKeyboard";
import { triggerKeyFeedback } from "../utils/keyFeedback";

/**
 * KeyboardBasicPanel.tsx — Módulo 1 (hoja-de-ruta-visual.md §1 / log §4 /
 * spec §4). Contenido del "panel básico" — se monta SIEMPRE visible
 * dentro de KeyboardDock (dock colapsado = panel básico, log §1), no
 * dentro del panel expandido/popover.
 *
 * V5: Básico concentra escritura y control. Variables y constantes se
 * muestran exclusivamente en Símbolos, con color semántico propio.
 */

export const BASIC_V5_ROWS: KeyDef[][] = [
  [
    key("7", "7", "7", false, undefined, "inserta el número siete"),
    key("8", "8", "8", false, undefined, "inserta el número ocho"),
    key("9", "9", "9", false, undefined, "inserta el número nueve"),
    key("(", "(", "paréntesis izquierdo", false, undefined, "abre un grupo o establece prioridad de operación"),
    key(")", ")", "paréntesis derecho", false, undefined, "cierra el grupo iniciado con un paréntesis"),
    key("⌫", "", "borrar", false, undefined, "borra el último carácter escrito"),
    key("DEL", "", "borrar todo el campo", false, undefined, "borra todo lo escrito en el campo actual"),
    key("ANS", "", "insertar el último resultado", false, undefined, "inserta el resultado del último cálculo"),
  ],
  [
    key("4", "4", "4", false, undefined, "inserta el número cuatro"),
    key("5", "5", "5", false, undefined, "inserta el número cinco"),
    key("6", "6", "6", false, undefined, "inserta el número seis"),
    key("×", "\\cdot", "multiplicar", false, undefined, "multiplica el valor de la izquierda por el de la derecha"),
    key("÷", "\\frac{#0}{#1}", "dividir", false, undefined, "inserta una fracción editable con numerador y denominador"),
    key("%", "\\%", "porcentaje", false, undefined, "inserta el símbolo de porcentaje"),
    key("<", "<", "menor que", false, undefined, "compara si el valor izquierdo es menor que el derecho"),
    key(">", ">", "mayor que", false, undefined, "compara si el valor izquierdo es mayor que el derecho"),
  ],
  [
    key("1", "1", "1", false, undefined, "inserta el número uno"),
    key("2", "2", "2", false, undefined, "inserta el número dos"),
    key("3", "3", "3", false, undefined, "inserta el número tres"),
    key("+", "+", "sumar", false, undefined, "suma dos valores"),
    key("−", "-", "restar", false, undefined, "resta el valor derecho al izquierdo"),
    key(".", ".", "punto decimal", false, undefined, "inserta el separador decimal"),
    key("=", "=", "igual", false, undefined, "inserta un signo de igualdad sin ejecutar el cálculo"),
    key("′", "'", "prima", false, undefined, "agrega una prima para escribir ecuaciones diferenciales"),
  ],
  [
    key("0", "0", "0", false, undefined, "inserta el número cero"),
    key("°", "°", "grados", false, undefined, "inserta el símbolo de grados"),
    key("DMS", "#0°#1′#2″", "grados minutos segundos", false, undefined, "inserta la plantilla editable grados, minutos y segundos"),
    key("±()", "\\pm\\left(#0\\right)", "más/menos", false, undefined, "inserta las alternativas positiva y negativa"),
    key("≤", "\\le", "menor o igual que", false, undefined, "compara si el valor izquierdo es menor o igual que el derecho"),
    key("≥", "\\ge", "mayor o igual que", false, undefined, "compara si el valor izquierdo es mayor o igual que el derecho"),
    key("Enter", "", "calcular", false, undefined, "ejecuta o resuelve la expresión actual"),
  ],
];

interface KeyboardBasicPanelProps {
  field: MathField;
  onBackspace: () => void;
  onClear: () => void;
  onEnter: () => void;
  /** Pendiente #3: último resultado calculado (MathResult.resultLatex),
   * `null` si todavía no se calculó nada en esta sesión. */
  lastAnswerLatex: string | null;
}

/** Botón individual — llama useLongPress una sola vez por instancia
 * (no se puede llamar un hook dentro de un .map() del componente padre,
 * por eso cada tecla es su propio componente). */
function BasicKey({
  k,
  onPress,
  onShowTooltip,
  className,
}: {
  k: KeyDef;
  onPress: (k: KeyDef, useSecondary?: boolean) => void;
  onShowTooltip: (k: KeyDef) => void;
  className: string;
}) {
  // Fase H (Módulo H1): mismo criterio que main -- long-press muestra el
  // tooltip SOLO cuando no hay ya una acción secundaria asignada.
  const hasSecondary = Boolean(k.secondaryAction);
  const hasTooltipOnly = !hasSecondary && Boolean(k.description);
  const longPress = useLongPress({
    onLongPress: () => {
      if (k.secondaryAction) onPress(k, true);
      else if (k.description) onShowTooltip(k);
    },
    onPress: () => onPress(k, false),
    disabled: !hasSecondary && !hasTooltipOnly,
  });

  // Sin secondaryAction ni description (la mayoría de las teclas): click
  // normal, sin pasar por el hook de long-press — evita el delay de
  // 400ms en teclas que no lo necesitan.
  if (!hasSecondary && !hasTooltipOnly) {
    return (
      <button
        type="button"
        onClick={() => onPress(k, false)}
        aria-label={k.ariaLabel}
                        aria-disabled={k.unavailable ? "true" : undefined}
        title={k.description ?? k.ariaLabel}
        className={className}
      >
        <KeyGlyph glyph={k.glyph} />
      </button>
    );
  }

  return (
    <button type="button" {...longPress} aria-label={k.ariaLabel}
                        aria-disabled={k.unavailable ? "true" : undefined} title={k.description ?? k.ariaLabel} className={className}>
      <KeyGlyph glyph={k.glyph} />
    </button>
  );
}

export function KeyboardBasicPanel({ field, onBackspace, onClear, onEnter, lastAnswerLatex }: KeyboardBasicPanelProps) {
  const [notice, setNotice] = useState<string | null>(null);

  function press(k: KeyDef, useSecondary?: boolean) {
    if (useSecondary && k.secondaryAction) {
      if (k.unavailable) {
        setNotice(`${k.ariaLabel}: todavía no disponible.`);
        window.setTimeout(() => setNotice(null), 2500);
        return;
      }
      if (k.secondaryAction.type === "glyph") {
        field?.focus();
        field?.insert(secondaryGlyphLatex(k.secondaryAction.value));
      } else {
        field?.focus();
        field?.insert(k.secondaryAction.latex);
      }
      return;
    }
    if (k.unavailable) {
      setNotice(`${k.ariaLabel}: todavía no disponible.`);
      window.setTimeout(() => setNotice(null), 2500);
      return;
    }
    if (k.glyph === "⌫") return onBackspace();
    if (k.glyph === "DEL") return onClear();
    if (k.ariaLabel === "calcular") return onEnter();
    if (k.glyph === "ANS") {
      if (!lastAnswerLatex) {
        setNotice("Sin resultado previo todavía.");
        window.setTimeout(() => setNotice(null), 2500);
        return;
      }
      field?.focus();
      field?.insert(lastAnswerLatex);
      return;
    }
    field?.focus();
    if (k.insertLatex) field?.insert(k.insertLatex);
  }

  function showTooltip(k: KeyDef) {
    if (!k.description) return;
    setNotice(k.description);
    window.setTimeout(() => setNotice(null), 3000);
  }

  function keyClass(k: KeyDef): string {
    const glyphStr = String(k.glyph);
    // Fase R, Módulo R0: las clases text-sm/text-base/text-[11px] de
    // aquí se reemplazan por a11y-key-sm/a11y-key-base/a11y-key-tiny —
    // mismo tamaño exacto por defecto (ver design-tokens.css), pero
    // ahora escalable vía la opción de accesibilidad tipográfica.
    if (k.unavailable) return "rounded-md border border-dashed border-bone/30 bg-chrome-soft/40 py-2.5 a11y-key-sm text-bone/40";
    if (k.ariaLabel === "calcular") return "col-span-2 rounded-md bg-graph py-2.5 a11y-key-sm font-semibold text-white hover:bg-graph/90";
    if (glyphStr === "=") return "rounded-md border border-marker py-2.5 a11y-key-sm font-medium text-marker hover:bg-marker-soft/10";
    if (["×", "−", "+", "÷"].includes(glyphStr)) return "rounded-md bg-marker py-2.5 a11y-key-base font-semibold text-chrome hover:bg-marker/90";
    if (/^[0-9.%]$/.test(glyphStr)) return "rounded-md bg-chrome-soft/80 py-2.5 a11y-key-sm font-medium text-bone hover:bg-chrome-soft/60";
    if (["<", ">", "≤", "≥"].includes(glyphStr)) return "rounded-md bg-paper-soft py-2.5 a11y-key-sm text-ink hover:bg-paper-line/60";
    return "rounded-md bg-chrome-soft py-2.5 a11y-key-tiny text-marker hover:bg-chrome-soft/70";
  }

  // Fase V, Módulo V0: mismo patrón de delegación que en main.
  function handleKeyboardClickCapture(e: ReactMouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("button")) triggerKeyFeedback();
  }

  return (
    <div className="relative flex flex-col gap-1.5" onClickCapture={handleKeyboardClickCapture}>
      {notice && (
        <div className="absolute bottom-full left-0 right-0 mb-1.5 rounded-lg bg-chrome-soft px-3 py-2 text-center text-xs text-bone shadow-lg">
          {notice}
        </div>
      )}

      {BASIC_V5_ROWS.map((row, i) => (
        <div key={i} className="grid grid-cols-8 gap-1">
          {row.map((k, j) => (
            <BasicKey key={j} k={k} onPress={press} onShowTooltip={showTooltip} className={keyClass(k)} />
          ))}
        </div>
      ))}

    </div>
  );
}

/** `<`/`>` insertan literalmente su glyph como LaTeX (misma convención que
 * el resto de operadores de una sola tecla) — ≤/≥ insertan \le/\ge, no el
 * carácter Unicode. Mapeo mínimo, no depende de KeyGlyph.tsx. */
function secondaryGlyphLatex(glyph: Glyph): string {
  if (typeof glyph !== "string") return "";
  if (glyph === "≤") return "\\le";
  if (glyph === "≥") return "\\ge";
  return glyph;
}
