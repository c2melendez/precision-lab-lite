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
 * Contenido exacto de la spec: dígitos/operadores, `<`/`>` (long-press →
 * ≤/≥), `°` (long-press → plantilla D°M′S″, TODA la tecla unavailable),
 * variables x/y/z/θ (reubicadas) + φ/r (nuevas), constantes π/e/i/∞
 * (reubicadas). Nada de esto reordena contenido de Álgebra/Trigonometría/
 * Cálculo — eso son los Módulos 2-4.
 */

const CORE_ROWS: KeyDef[][] = [
  [
    key("7", "7", "7"),
    key("8", "8", "8"),
    key("9", "9", "9"),
    key("(", "(", "paréntesis izquierdo"),
    key(")", ")", "paréntesis derecho"),
    key("⌫", "", "borrar", false, undefined, "borra el último carácter escrito"),
  ],
  [key("4", "4", "4"), key("5", "5", "5"), key("6", "6", "6"), key("×", "\\cdot", "multiplicar"), key("÷", "\\frac{#0}{#1}", "dividir"), key("%", "\\%", "porcentaje")],
  [key("1", "1", "1"), key("2", "2", "2"), key("3", "3", "3"), key("+", "+", "sumar"), key("−", "-", "restar"), key(".", ".", "punto")],
  [
    key("0", "0", "0"),
    // Relacionales: long-press revela ≤/≥ (useLongPress, Módulo 0).
    key(
      "<",
      "<",
      "menor que",
      false,
      { type: "glyph", value: "≤" },
      "compara si el valor de la izquierda es menor que el de la derecha (mantén presionado para ≤)",
    ),
    key(
      ">",
      ">",
      "mayor que",
      false,
      { type: "glyph", value: "≥" },
      "compara si el valor de la izquierda es mayor que el de la derecha (mantén presionado para ≥)",
    ),
    // Grados: activada tras el Módulo D del track de motor matemático
    // (normalize.ts ya convierte ° y D°M′S″ a radianes, verificado con
    // ejecución real). Tap corto inserta el símbolo suelto (Nivel 1);
    // mantener presionado inserta la plantilla D°M′S″ editable (Nivel 2).
    // Riesgo conocido, documentado en normalize.ts y en el cierre del
    // Módulo D: si "°" se usa DENTRO del argumento de sin/cos/tan
    // directas con el modo de ángulo en GRAD, hay doble conversión — no
    // se resolvió (requeriría un cambio de firma más grande), no bloquea
    // la activación de la tecla porque el modo por defecto es RAD.
    key(
      "°",
      "°",
      "grados",
      false,
      {
        type: "template",
        latex: "#0°#1′#2″",
      },
      "símbolo de grados (mantén presionado para la plantilla grados-minutos-segundos)",
    ),
    key("=", "=", "igual"),
    key("⏎", "", "calcular", false, undefined, "calcula el resultado de lo escrito en el campo"),
  ],
];

const VARIABLES_ROW: KeyDef[] = [
  key({ italic: "x" }, "x", "variable x", false, undefined, "variable x"),
  key({ italic: "y" }, "y", "variable y", false, undefined, "variable y"),
  key({ italic: "z" }, "z", "variable z", false, undefined, "variable z"),
  key("θ", "\\theta", "theta", false, undefined, "letra griega theta, usada para ángulos"),
  // Nuevas (log §4): no existían en ningún lado del teclado antes.
  key("φ", "\\varphi", "phi", false, undefined, "letra griega phi, usada para ángulos"),
  key({ italic: "r" }, "r", "variable r", false, undefined, "variable r, usada en forma polar"),
  // Fase E (spec_edo_complejos_tooltips.md §2.3): agregada acá también,
  // igual que en precision-lab (main) — VARIABLES_ROW es lo que
  // realmente se ve en el panel básico, la fila equivalente de
  // MathKeyboard.tsx (SYMBOLS_ROW_2, si existe) no es lo que el usuario
  // usa para escribir una EDO. El motor (E2) ya está cerrado, así que
  // esta tecla y toda la sección "Ecuaciones diferenciales" (ver
  // MathKeyboard.tsx, CATEGORY_MENUS.Cálculo) están activas.
  key(
    "'",
    "'",
    "prima (derivada en notación de ecuaciones diferenciales)",
    false,
    undefined,
    "agrega una prima después de y para escribir una ecuación diferencial (y', y'', ...)",
  ),
];

const CONSTANTS_ROW: KeyDef[] = [
  key("π", "\\pi", "pi", false, undefined, "constante pi (≈3.14159)"),
  key("e", "e", "e", false, undefined, "constante de Euler (≈2.71828)"),
  key({ italic: "i" }, "i", "número imaginario", false, undefined, "unidad imaginaria (raíz cuadrada de -1)"),
  key("∞", "\\infty", "infinito", false, undefined, "símbolo de infinito, para límites y sumatorias"),
  // Decisión del usuario (revisión de pendientes post-Módulo D): ±()
  // vivía en Álgebra > Generales de forma provisional (AMBIGUO sin
  // resolver desde el Módulo 1, sin categoría en la spec nueva) — el
  // usuario pidió sacarla de ahí y ponerla en el teclado inicial. No
  // encaja temáticamente en "constantes", pero es donde hay espacio en
  // la grilla de 6 columnas del panel básico sin agregar una fila nueva.
  key("±()", "\\pm\\left(#0\\right)", "más/menos", false, undefined, "inserta ambas soluciones, positiva y negativa, de una expresión"),
  // Pendiente #3 (revisión post-Módulo D, pedido por el usuario): tecla
  // ANS — inserta el último resultado calculado. insertLatex vacío a
  // propósito: el valor real (lastAnswerLatex) no se conoce hasta el
  // momento del press, se resuelve en press() más abajo, no acá.
  key("ANS", "", "insertar el último resultado", false, undefined, "inserta el resultado del último cálculo"),
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
        title={k.description}
        className={className}
      >
        <KeyGlyph glyph={k.glyph} />
      </button>
    );
  }

  return (
    <button type="button" {...longPress} aria-label={k.ariaLabel} title={k.description} className={className}>
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
    if (glyphStr === "⏎") return "rounded-md bg-graph py-2.5 a11y-key-sm font-semibold text-paper hover:bg-graph/90";
    if (glyphStr === "=") return "rounded-md border border-marker py-2.5 a11y-key-sm font-medium text-marker hover:bg-marker-soft/10";
    if (["×", "−", "+", "÷"].includes(glyphStr)) return "rounded-md bg-marker py-2.5 a11y-key-base font-semibold text-chrome hover:bg-marker/90";
    if (/^[0-9.%]$/.test(glyphStr)) return "rounded-md bg-chrome-soft/80 py-2.5 a11y-key-sm font-medium text-bone hover:bg-chrome-soft/60";
    if (["<", ">"].includes(glyphStr)) return "rounded-md bg-paper-soft py-2.5 a11y-key-sm text-ink hover:bg-paper-line/60";
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

      {CORE_ROWS.map((row, i) => (
        <div key={i} className="grid grid-cols-6 gap-1">
          {row.map((k, j) => (
            <BasicKey key={j} k={k} onPress={press} onShowTooltip={showTooltip} className={keyClass(k)} />
          ))}
        </div>
      ))}

      <div className="grid grid-cols-7 gap-1">
        {VARIABLES_ROW.map((k, i) => (
          <BasicKey
            key={i}
            k={k}
            onPress={press}
            onShowTooltip={showTooltip}
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
            onShowTooltip={showTooltip}
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
