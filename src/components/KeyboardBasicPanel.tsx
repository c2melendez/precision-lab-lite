import { useState } from "react";
import { useLongPress } from "../hooks/useLongPress";
import { KeyGlyph, type Glyph } from "./KeyGlyph";
import { key, type KeyDef, type MathField } from "./MathKeyboard";

/**
 * KeyboardBasicPanel.tsx — Módulo 1 (hoja-de-ruta-visual.md §1 / log §4 /
 * spec §4). Contenido del "panel básico" — se monta SIEMPRE visible
 * dentro de KeyboardDock (dock colapsado = panel básico, log §1), no
 * dentro del panel expandido/popover.
 *
 * Contenido exacto de la spec: dígitos/operadores, `<`/`>` (long-press →
 * ≤/≥), `°` (long-press → plantilla D°M′S″, TODA la tecla unavailable),
 * variables x/y/z/θ (reubicadas) + φ/r (nuevas), constantes π/e/i/∞
 * (reubicadas). Nada de esto reordena contenido de Álgebra/Trigonometría/
 * Cálculo — eso son los Módulos 2-4.
 */

const CORE_ROWS: KeyDef[][] = [
  [key("7", "7", "7"), key("8", "8", "8"), key("9", "9", "9"), key("(", "(", "paréntesis izquierdo"), key(")", ")", "paréntesis derecho"), key("⌫", "", "borrar")],
  [key("4", "4", "4"), key("5", "5", "5"), key("6", "6", "6"), key("×", "\\cdot", "multiplicar"), key("÷", "\\frac{#0}{#1}", "dividir"), key("%", "\\%", "porcentaje")],
  [key("1", "1", "1"), key("2", "2", "2"), key("3", "3", "3"), key("+", "+", "sumar"), key("−", "-", "restar"), key(".", ".", "punto")],
  [
    key("0", "0", "0"),
    // Relacionales: long-press revela ≤/≥ (useLongPress, Módulo 0).
    key("<", "<", "menor que", false, { type: "glyph", value: "≤" }),
    key(">", ">", "mayor que", false, { type: "glyph", value: "≥" }),
    // Grados: activada tras el Módulo D del track de motor matemático
    // (normalize.ts ya convierte ° y D°M′S″ a radianes, verificado con
    // ejecución real). Tap corto inserta el símbolo suelto (Nivel 1);
    // mantener presionado inserta la plantilla D°M′S″ editable (Nivel 2).
    // Riesgo conocido, documentado en normalize.ts y en el cierre del
    // Módulo D: si "°" se usa DENTRO del argumento de sin/cos/tan
    // directas con el modo de ángulo en GRAD, hay doble conversión — no
    // se resolvió (requeriría un cambio de firma más grande), no bloquea
    // la activación de la tecla porque el modo por defecto es RAD.
    key("°", "°", "grados", false, {
      type: "template",
      latex: "#0°#1′#2″",
    }),
    key("=", "=", "igual"),
    key("⏎", "", "calcular"),
  ],
];

const VARIABLES_ROW: KeyDef[] = [
  key({ italic: "x" }, "x", "variable x"),
  key({ italic: "y" }, "y", "variable y"),
  key({ italic: "z" }, "z", "variable z"),
  key("θ", "\\theta", "theta"),
  // Nuevas (log §4): no existían en ningún lado del teclado antes.
  key("φ", "\\varphi", "phi"),
  key({ italic: "r" }, "r", "variable r"),
];

const CONSTANTS_ROW: KeyDef[] = [
  key("π", "\\pi", "pi"),
  key("e", "e", "e"),
  key({ italic: "i" }, "i", "número imaginario"),
  key("∞", "\\infty", "infinito"),
  // Decisión del usuario (revisión de pendientes post-Módulo D): ±()
  // vivía en Álgebra > Generales de forma provisional (AMBIGUO sin
  // resolver desde el Módulo 1, sin categoría en la spec nueva) — el
  // usuario pidió sacarla de ahí y ponerla en el teclado inicial. No
  // encaja temáticamente en "constantes", pero es donde hay espacio en
  // la grilla de 6 columnas del panel básico sin agregar una fila nueva.
  key("±()", "\\pm\\left(#0\\right)", "más/menos"),
  // Pendiente #3 (revisión post-Módulo D, pedido por el usuario): tecla
  // ANS — inserta el último resultado calculado. insertLatex vacío a
  // propósito: el valor real (lastAnswerLatex) no se conoce hasta el
  // momento del press, se resuelve en press() más abajo, no acá.
  key("ANS", "", "insertar el último resultado"),
];

interface KeyboardBasicPanelProps {
  field: MathField;
  onBackspace: () => void;
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
  className,
}: {
  k: KeyDef;
  onPress: (k: KeyDef, useSecondary?: boolean) => void;
  className: string;
}) {
  const longPress = useLongPress({
    onLongPress: () => {
      if (k.secondaryAction) onPress(k, true);
    },
    onPress: () => onPress(k, false),
    disabled: !k.secondaryAction,
  });

  // Sin secondaryAction (la mayoría de las teclas): click normal, sin
  // pasar por el hook de long-press — evita el delay de 400ms en teclas
  // que no lo necesitan.
  if (!k.secondaryAction) {
    return (
      <button type="button" onClick={() => onPress(k, false)} aria-label={k.ariaLabel} className={className}>
        <KeyGlyph glyph={k.glyph} />
      </button>
    );
  }

  return (
    <button type="button" {...longPress} aria-label={k.ariaLabel} className={className}>
      <KeyGlyph glyph={k.glyph} />
    </button>
  );
}

export function KeyboardBasicPanel({ field, onBackspace, onEnter, lastAnswerLatex }: KeyboardBasicPanelProps) {
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
    if (k.glyph === "⏎") return onEnter();
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

  function keyClass(k: KeyDef): string {
    const glyphStr = String(k.glyph);
    if (k.unavailable) return "rounded-md border border-dashed border-bone/30 bg-chrome-soft/40 py-2.5 text-sm text-bone/40";
    if (glyphStr === "⏎") return "rounded-md bg-graph py-2.5 text-sm font-semibold text-paper hover:bg-graph/90";
    if (glyphStr === "=") return "rounded-md border border-marker py-2.5 text-sm font-medium text-marker hover:bg-marker-soft/10";
    if (["×", "−", "+", "÷"].includes(glyphStr)) return "rounded-md bg-marker py-2.5 text-base font-semibold text-chrome hover:bg-marker/90";
    if (/^[0-9.%]$/.test(glyphStr)) return "rounded-md bg-chrome-soft/80 py-2.5 text-sm font-medium text-bone hover:bg-chrome-soft/60";
    if (["<", ">"].includes(glyphStr)) return "rounded-md bg-paper-soft py-2.5 text-sm text-ink hover:bg-paper-line/60";
    return "rounded-md bg-chrome-soft py-2.5 text-[11px] text-marker hover:bg-chrome-soft/70";
  }

  return (
    <div className="relative flex flex-col gap-1.5">
      {notice && (
        <div className="absolute bottom-full left-0 right-0 mb-1.5 rounded-lg bg-chrome-soft px-3 py-2 text-center text-xs text-bone shadow-lg">
          {notice}
        </div>
      )}

      {CORE_ROWS.map((row, i) => (
        <div key={i} className="grid grid-cols-6 gap-1">
          {row.map((k, j) => (
            <BasicKey key={j} k={k} onPress={press} className={keyClass(k)} />
          ))}
        </div>
      ))}

      <div className="grid grid-cols-6 gap-1">
        {VARIABLES_ROW.map((k, i) => (
          <BasicKey
            key={i}
            k={k}
            onPress={press}
            className="rounded-md bg-chrome-soft py-2 text-sm text-bone hover:bg-chrome-soft/70"
          />
        ))}
      </div>

      <div className="grid grid-cols-6 gap-1">
        {CONSTANTS_ROW.map((k, i) => (
          <BasicKey
            key={i}
            k={k}
            onPress={press}
            className={
              k.glyph === "ANS" && !lastAnswerLatex
                ? "rounded-md bg-chrome-soft py-2 text-sm text-bone/30"
                : "rounded-md bg-chrome-soft py-2 text-sm text-bone hover:bg-chrome-soft/70"
            }
          />
        ))}
      </div>
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
