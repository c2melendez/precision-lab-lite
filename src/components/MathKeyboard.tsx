import { useState } from "react";
import { KeyGlyph, type Glyph, BOX } from "./KeyGlyph";

// Fase A (spec UX estilo ClassCalc) — reemplaza el teclado SHIFT/ALPHA de
// la Fase 1/3 por el patrón real de ClassCalc: rejilla base fija (más
// usados) + pestañas Trig/Stat que abren un menú flotante con más
// funciones, sin ocultar la rejilla base. Inserta con field.insert()
// usando plantillas LaTeX con marcador de posición #0 (igual que
// Precision Lab/Python) — ya no concatenación de texto ingenua.
//
// MÓDULO 1 (hoja-de-ruta-visual.md §1 / log §4 / spec §4): el "núcleo
// fijo" (CORE_GRID), el renglón relacional (RELATIONAL_ROW) y las
// constantes/variables de SYMBOLS_ROW_2 se reubican al nuevo panel
// básico (KeyboardBasicPanel.tsx), que vive en KeyboardDock — NO en este
// panel expandido. Para BasicScientificMode (el único modo alcanzable
// que usa este componente) esas teclas desaparecen de aquí sin
// duplicarse, como exige la hoja de ruta ("elimina las teclas reubicadas
// de su ubicación anterior en Símbolos, para no dejar duplicados").
//
// DECISIÓN DEDUCIBLE de este módulo (registrada en el cierre): en vez de
// BORRAR CORE_GRID/RELATIONAL_ROW/SYMBOLS_ROW_2 del archivo, se dejan
// intactos detrás de un prop nuevo `hideCoreGrid` (default false, sin
// romper compatibilidad). BasicScientificMode pasa `hideCoreGrid` para
// no duplicar lo que ahora vive en el dock. AlgebraMode/CalculusMode/
// LinearSystemsMode (código muerto, no alcanzable desde la navegación —
// ver Módulo 0) NO pasan el prop, así que siguen viendo exactamente el
// mismo teclado de siempre si alguna vez se reactivan — se evita
// degradar silenciosamente código inalcanzable sin necesidad real.
//
// log/ln/log_b/eˣ/±() (que vivían en CORE_GRID pero no están en la lista
// del panel básico §4) quedan en una pestaña temporal "Funciones" dentro
// de este panel — su hogar definitivo es Álgebra > Logaritmos/
// Exponenciales (Módulo 3). ±() no tiene NINGÚN hogar mencionado en
// ninguna sección de la spec nueva — AMBIGUO sin resolver, se deja en
// "Funciones" hasta que el usuario decida su destino. sin/cos/tan de
// CORE_GRID NO se replican en "Funciones" porque son duplicados exactos
// de lo que ya existe en la pestaña "Trigonométricas" (misma plantilla).

type MathField = { insert: (s: string) => void; focus: () => void } | null;

/** Acción de long-press (Módulo 0). Consumida desde el Módulo 1 en
 * KeyboardBasicPanel.tsx — ninguna tecla de este archivo usa long-press. */
export type KeySecondaryAction = { type: "glyph"; value: Glyph } | { type: "template"; latex: string };

export interface KeyDef {
  glyph: Glyph;
  insertLatex: string;
  ariaLabel: string;
  /** Sin cómputo real detrás todavía (∬/∭/∂) — presionarla muestra un
   * aviso en vez de insertar algo que el motor no puede resolver. */
  unavailable?: boolean;
  secondaryAction?: KeySecondaryAction;
}

export const key = (
  glyph: Glyph,
  insertLatex: string,
  ariaLabel: string,
  unavailable?: boolean,
  secondaryAction?: KeySecondaryAction,
): KeyDef => ({
  glyph,
  insertLatex,
  ariaLabel,
  unavailable,
  secondaryAction,
});

export type { MathField };
export { BOX };

// ---- Núcleo fijo original (P3 spec v2 §4.5) — se mantiene intacto para
// AlgebraMode/CalculusMode/LinearSystemsMode (código muerto). Renderizado
// condicional a `!hideCoreGrid`, ver cabecera del archivo. ----
const CORE_GRID: KeyDef[][] = [
  [
    key("7", "7", "7"),
    key("8", "8", "8"),
    key("9", "9", "9"),
    key("sin", "\\sin\\left(#0\\right)", "seno"),
    key("log", "\\log\\left(#0\\right)", "logaritmo base 10"),
    key("(", "(", "paréntesis izquierdo"),
    key("×", "\\cdot", "multiplicar"),
  ],
  [
    key("4", "4", "4"),
    key("5", "5", "5"),
    key("6", "6", "6"),
    key("cos", "\\cos\\left(#0\\right)", "coseno"),
    key("ln", "\\ln\\left(#0\\right)", "logaritmo natural"),
    key(")", ")", "paréntesis derecho"),
    key("−", "-", "restar"),
  ],
  [
    key("1", "1", "1"),
    key("2", "2", "2"),
    key("3", "3", "3"),
    key("tan", "\\tan\\left(#0\\right)", "tangente"),
    key({ sub: BOX, base: "log" }, "\\log_{#0}\\left(#1\\right)", "logaritmo con base"),
    key("±()", "\\pm\\left(#0\\right)", "más/menos"),
    key("+", "+", "sumar"),
  ],
  [
    key("0", "0", "0"),
    key(".", ".", "punto"),
    key("%", "\\%", "porcentaje"),
    key({ sup: "x", base: "e" }, "e^{#0}", "e a la x"),
    key("=", "=", "igual"),
    key("⏎", "", "calcular"),
    key("÷", "\\frac{#0}{#1}", "dividir"),
  ],
];

// Módulo 3 (spec §5.2): x², xʸ, √, ∛, 10ˣ, exp, |x|, n! se reubican a la
// categoría Álgebra (Exponenciales/Radicales/Generales, con notación a/n
// — NO x/y, spec §5.2). ∛a (índice fijo en 3) se descarta directamente —
// queda cubierta editando el índice de ⁿ√a (índice editable). Solo queda
// DEL, que no tiene categoría temática (borra todo el campo).
const SYMBOLS_ROW_1: KeyDef[] = [key("DEL", "", "borrar todo el campo")];

// Se mantiene solo para AlgebraMode/CalculusMode/LinearSystemsMode
// (código muerto) — BasicScientificMode ya no la renderiza (hideCoreGrid
// también oculta esta fila, ver JSX), su contenido vive ahora en
// KeyboardBasicPanel + φ/r nuevas.
const SYMBOLS_ROW_2: KeyDef[] = [
  key({ italic: "i" }, "i", "número imaginario"),
  key("π", "\\pi", "pi"),
  key("e", "e", "e"),
  key("∞", "\\infty", "infinito"),
  key({ italic: "x" }, "x", "variable x"),
  key({ italic: "y" }, "y", "variable y"),
  key({ italic: "z" }, "z", "variable z"),
  key("θ", "\\theta", "theta"),
  key("⌫", "", "borrar"),
];

const RELATIONAL_ROW: KeyDef[] = [
  key("<", "<", "menor que"),
  key(">", ">", "mayor que"),
  key("≤", "\\le", "menor o igual que"),
  key("≥", "\\ge", "mayor o igual que"),
];

const CALCULUS_ROW_1: KeyDef[] = [
  key("∫", "\\int #0\\,dx", "integral indefinida"),
  key({ base: "∫", sub: BOX, sup: BOX }, "\\int_{#0}^{#1}#2\\,dx", "integral definida"),
  key("Σ", "\\sum_{#0}^{#1}#2", "sumatoria"),
  key("Π", "", "productoria", true),
  key("LCM", "\\mathrm{lcm}\\left(#0,#1\\right)", "mínimo común múltiplo"),
  key("GCD", "\\gcd\\left(#0,#1\\right)", "máximo común divisor"),
];

const CALCULUS_ROW_2: KeyDef[] = [
  key({ frac: ["d", "dx"] }, "\\frac{d}{dx}\\left(#0\\right)", "derivada"),
  key({ frac: ["d²", "dx²"] }, "\\frac{d^2}{dx^2}\\left(#0\\right)", "derivada segunda"),
  key({ frac: ["dⁿ", "dxⁿ"] }, "\\frac{d^3}{dx^3}\\left(#0\\right)", "derivada de orden n (edita el 3 por el orden que quieras)"),
  key({ frac: ["∂", "∂x"] }, "", "derivada parcial", true),
  key({ base: "lim", sub: "x→a" }, "\\lim_{#0\\to#1}#2", "límite"),
  key({ base: "lim", sub: "x→∞" }, "\\lim_{#0\\to\\infty}#1", "límite al infinito"),
  key({ base: "lim", sub: "x→a±" }, "\\lim_{#0\\to#1^{#2}}#3", "límite lateral (edita + o - en el exponente)"),
];

const CATEGORY_MENUS: Record<string, { section: string; keys: KeyDef[] }[]> = {
  Trigonométricas: [
    {
      section: "Directas",
      keys: ["sin", "cos", "tan", "csc", "sec", "cot"].map((f) =>
        key(f, `\\${f}\\left(#0\\right)`, f),
      ),
    },
    {
      section: "Inversas",
      keys: ["sin", "cos", "tan", "csc", "sec", "cot"].map((f) =>
        key({ sup: "-1", base: f }, `\\${f}^{-1}\\left(#0\\right)`, `${f} inversa`),
      ),
    },
    {
      section: "Hiperbólicas",
      keys: ["sinh", "cosh", "tanh", "csch", "sech", "coth"].map((f) => key(f, `${f}\\left(#0\\right)`, f)),
    },
    // Módulo A (spec_motor_matematico_pendiente.md §2, activación pedida
    // por el usuario): csch⁻¹/sech⁻¹/coth⁻¹ ya son computables — el motor
    // se cerró con las 3 reescrituras nuevas en rewriteReciprocalFunctions
    // + normalize.ts (asech/acsch/acoth → acosh(1/x)/asinh(1/x)/atanh(1/x)),
    // verificado con ejecución real. Las 6 teclas de esta sección quedan
    // simétricas: ninguna `unavailable`.
    {
      section: "Hiperbólicas inversas",
      keys: ["sinh", "cosh", "tanh", "csch", "sech", "coth"].map((f) =>
        key({ sup: "-1", base: f }, `${f}^{-1}\\left(#0\\right)`, `${f} inversa`),
      ),
    },
  ],
};

CATEGORY_MENUS.Complejos = [
  {
    section: "Funciones",
    keys: [
      key("Re()", "\\mathrm{re}\\left(#0\\right)", "parte real"),
      key("Im()", "\\mathrm{im}\\left(#0\\right)", "parte imaginaria"),
      key("arg()", "\\mathrm{arg}\\left(#0\\right)", "argumento"),
      key("conj()", "\\mathrm{conj}\\left(#0\\right)", "conjugado"),
      key("|z|", "\\left|#0\\right|", "módulo"),
      key("⇄ Polar", "\\mathrm{topolar}\\left(#0\\right)", "convertir a forma polar"),
    ],
  },
];

// Módulo 3 (spec §5.2 / log §3.2 y §5): categoría Álgebra, 5 secciones —
// reemplaza a la pestaña temporal "Funciones" del Módulo 1. Logaritmos
// ya era computable (solo reubicación); log₂ es nueva pero sin cambio de
// motor (atajo sobre log_b, log §3.2). Exponenciales/Radicales/
// Generales usan notación a/n (spec §5.2) — NUNCA x/y, a diferencia del
// resto del teclado. ∛a se descarta (ver comentario de SYMBOLS_ROW_1).
//
// La sección "Ecuaciones" NO usa el renderer genérico de abajo (los
// botones no insertan LaTeX plano — disparan onSolveEquation/
// onSolveSystem/onSimplify, los mismos callbacks que ya usan los 3
// íconos de resolución de siempre) — se renderiza aparte en el JSX, ver
// "openCategory === Álgebra".
//
// AMBIGUO señalado por la spec misma (§6, no resuelto por mí): el
// mecanismo de UI para agregar filas al sistema más allá de las 2
// iniciales (Enter nativo de MathLive vs. botón "+" explícito) para
// llegar a 5×5. La tecla "sistema" solo abre el mismo flujo de siempre
// (onSolveSystem) — el tope de 5 filas en sí no se implementa en este
// módulo, queda pendiente de esa decisión de UI.
//
// LCM/GCD: reubicadas aquí per log §3.2, PERO se mantienen también en
// CALCULUS_ROW_1 (la tira de Cálculo) sin tocar — esa tira todavía no se
// reorganizó (eso es el Módulo 4). Duplicación temporal, a resolver
// cuando el Módulo 4 convierta la tira en categoría propia.
CATEGORY_MENUS.Álgebra = [
  {
    section: "Logaritmos",
    keys: [
      key("ln", "\\ln\\left(#0\\right)", "logaritmo natural"),
      key("log", "\\log\\left(#0\\right)", "logaritmo base 10"),
      key({ sub: BOX, base: "log" }, "\\log_{#0}\\left(#1\\right)", "logaritmo con base"),
      key("log₂", "\\log_{2}\\left(#0\\right)", "logaritmo base 2"),
    ],
  },
  {
    section: "Exponenciales",
    keys: [
      key({ sup: "n", base: "e" }, "e^{#0}", "e a la n"),
      key({ sup: "n", base: "10" }, "10^{#0}", "10 a la n"),
      key({ sup: "2", base: BOX }, "#0^2", "a al cuadrado"),
      key({ sup: "n", base: BOX }, "#0^{#1}", "a a la n"),
      key("exp", "\\exp\\left(#0\\right)", "exponencial"),
    ],
  },
  {
    section: "Radicales",
    keys: [
      key({ sqrt: BOX }, "\\sqrt{#0}", "raíz cuadrada de a"),
      key({ sqrt: BOX, index: BOX }, "\\sqrt[#0]{#1}", "raíz de índice n editable"),
    ],
  },
  {
    section: "Generales",
    keys: [
      key("|a|", "\\left|#0\\right|", "valor absoluto de a"),
      key("a!", "#0!", "factorial de a"),
    ],
  },
  {
    // Renderizado aparte — ver comentario de cabecera de este bloque.
    section: "Ecuaciones",
    keys: [],
  },
];

// Módulo 4 (spec §5.3 / log §3.3): categoría Cálculo, 4 secciones — todo
// contenido YA existente (CALCULUS_ROW_1/2, la tira siempre-visible),
// solo reagrupado como pestaña propia. Reutiliza los mismos KeyDef, sin
// reescribir plantillas LaTeX (regla del módulo: "solo reagrupado").
// LCM/GCD NO se repiten aquí — ya viven en Álgebra > Ecuaciones (Módulo
// 3) y no están en la lista de 4 secciones de este módulo (Integrales/
// Sumas y productos/Derivadas/Límites). La tira vieja (CALCULUS_ROW_1/2
// tal cual, con LCM/GCD incluidas) se sigue renderizando sin cambios
// para GraphMode/código muerto — ver `!hideCoreGrid` en el JSX.
CATEGORY_MENUS.Cálculo = [
  { section: "Integrales", keys: CALCULUS_ROW_1.slice(0, 2) },
  { section: "Sumas y productos", keys: CALCULUS_ROW_1.slice(2, 4) },
  { section: "Derivadas", keys: CALCULUS_ROW_2.slice(0, 4) },
  { section: "Límites", keys: CALCULUS_ROW_2.slice(4, 7) },
];

const CATEGORIES_FULL = ["Trigonométricas", "Símbolos", "Complejos"] as const;
const CATEGORIES_BASIC_MODE = ["Trigonométricas", "Álgebra", "Cálculo", "Símbolos", "Complejos"] as const;

interface MathKeyboardProps {
  field: MathField;
  onBackspace?: () => void;
  onEnter?: () => void;
  onClearField: () => void;
  /** Fase A §3.4: los tres íconos de resolución. Si no se pasan, el ícono
   * simplemente inserta la plantilla LaTeX asociada.
   * Pendiente #2 (revisión post-Módulo D): onSolveSystem ahora recibe la
   * cantidad de ecuaciones elegida en el selector 2-5 que se abre al
   * tocar "Sistema" — quien lo implemente decide si la usa (solo aplica
   * cuando el campo todavía no tiene un sistema escrito; si ya lo tiene,
   * se ignora y se resuelve el existente, mismo criterio que ya tenía
   * handleSolveSystem en BasicScientificMode.tsx). */
  onSolveEquation?: () => void;
  onSolveSystem?: (rows?: number) => void;
  onSimplify?: () => void;
  /** Módulo 1: true para BasicScientificMode — oculta CORE_GRID/
   * RELATIONAL_ROW/SYMBOLS_ROW_2 (ya viven en KeyboardBasicPanel, dentro
   * del dock) y agrega la pestaña temporal "Funciones". Default false —
   * AlgebraMode/CalculusMode/LinearSystemsMode no lo pasan, ven el
   * teclado completo de siempre. */
  hideCoreGrid?: boolean;
}

/** Cuántas filas puede pedir el selector de "Sistema" — spec §6 (5×5 ya
 * verificado en el Módulo B del motor). Mínimo 2 (un sistema de 1
 * ecuación no es un sistema). */
const SYSTEM_ROW_OPTIONS = [2, 3, 4, 5];

export function MathKeyboard({
  field,
  onBackspace,
  onEnter,
  onClearField,
  onSolveEquation,
  onSolveSystem,
  onSimplify,
  hideCoreGrid = false,
}: MathKeyboardProps) {
  const CATEGORIES = hideCoreGrid ? CATEGORIES_BASIC_MODE : CATEGORIES_FULL;
  const [openCategory, setOpenCategory] = useState<(typeof CATEGORIES)[number] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  // Pendiente #2: menú chico "¿cuántas ecuaciones?" al tocar "Sistema".
  const [showSystemSizeMenu, setShowSystemSizeMenu] = useState(false);

  function press(k: KeyDef) {
    if (k.unavailable) {
      setNotice(`${k.ariaLabel}: todavía no disponible.`);
      window.setTimeout(() => setNotice(null), 2500);
      return;
    }
    field?.focus();
    if (k.insertLatex) field?.insert(k.insertLatex);
    setOpenCategory(null);
  }

  function pressBase(k: KeyDef) {
    if (k.glyph === "⏎") return onEnter?.();
    press(k);
  }

  function pressSymbol(k: KeyDef) {
    if (k.glyph === "DEL") return onClearField();
    if (k.glyph === "⌫") return onBackspace?.();
    press(k);
  }

  return (
    <div className="relative rounded-xl bg-chrome p-3">
      {notice && (
        <div className="absolute bottom-full left-3 right-3 mb-1.5 rounded-lg bg-chrome-soft px-3 py-2 text-center text-xs text-bone shadow-lg">
          {notice}
        </div>
      )}

      {openCategory && (
        <div className="absolute bottom-full left-3 right-3 mb-1.5 rounded-lg bg-chrome-soft p-3 shadow-lg">
          {(openCategory as string) === "Símbolos" ? (
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-9 gap-1">
                {SYMBOLS_ROW_1.map((k, i) => (
                  <button
                    key={`sym1-${i}`}
                    onClick={() => pressSymbol(k)}
                    aria-label={k.ariaLabel}
                    className="rounded-md bg-chrome py-2 text-[11px] text-bone hover:bg-chrome/70"
                  >
                    <KeyGlyph glyph={k.glyph} />
                  </button>
                ))}
              </div>
              {/* SYMBOLS_ROW_2 solo se muestra cuando NO se ocultó el
                  núcleo — en BasicScientificMode ya no tiene contenido
                  relevante (todo reubicado al panel básico). */}
              {!hideCoreGrid && (
                <div className="grid grid-cols-9 gap-1">
                  {SYMBOLS_ROW_2.map((k, i) => (
                    <button
                      key={`sym2-${i}`}
                      onClick={() => pressSymbol(k)}
                      aria-label={k.ariaLabel}
                      className="rounded-md bg-chrome py-2 text-[11px] text-bone hover:bg-chrome/70"
                    >
                      <KeyGlyph glyph={k.glyph} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            CATEGORY_MENUS[openCategory].map((group) =>
              group.section === "Ecuaciones" ? (
                // Módulo 3: no son teclas que insertan LaTeX — disparan
                // los mismos callbacks que los 3 íconos de resolución de
                // siempre. f(x)>0 llama al MISMO onSolveEquation que
                // f(x)=0 (decisión DEDUCIBLE: el backend ya auto-detecta
                // ecuación vs. inecuación por el operador presente en lo
                // que el usuario ya escribió — log §5 — así que no hace
                // falta una acción distinta, solo un botón que deja claro
                // que las inecuaciones también funcionan).
                <div key={group.section} className="mb-2 last:mb-0">
                  <div className="mb-1.5 text-[9px] uppercase tracking-wide text-bone/50">{group.section}</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => {
                        onSolveEquation?.();
                        setOpenCategory(null);
                      }}
                      aria-label="Resolver ecuación"
                      className="rounded-md bg-marker-soft/10 py-2 text-xs text-marker hover:bg-marker-soft/20"
                    >
                      f(x)=0
                    </button>
                    <button
                      onClick={() => {
                        onSolveEquation?.();
                        setOpenCategory(null);
                      }}
                      aria-label="Resolver inecuación"
                      className="rounded-md bg-marker-soft/10 py-2 text-xs text-marker hover:bg-marker-soft/20"
                    >
                      f(x)&gt;0
                    </button>
                    <button
                      onClick={() => {
                        setOpenCategory(null);
                        setShowSystemSizeMenu(true);
                      }}
                      aria-label="Resolver sistema de ecuaciones"
                      className="rounded-md bg-alpha-soft py-2 text-xs text-alpha hover:bg-alpha-soft/80"
                    >
                      Sistema
                    </button>
                    <button
                      onClick={() => {
                        // Corrección post-auditoría (Módulo C): el motor ya
                        // detecta solo si un \begin{cases} es de ecuaciones o
                        // de inecuaciones (ver runSystem en
                        // BasicScientificMode.tsx) — esta tecla usa la MISMA
                        // plantilla/selector que "Sistema", solo con un rótulo
                        // que deja claro que también acepta <, >, ≤, ≥.
                        setOpenCategory(null);
                        setShowSystemSizeMenu(true);
                      }}
                      aria-label="Sistema de inecuaciones de 2 variables — escribe inecuaciones dentro de las llaves"
                      className="relative rounded-md bg-alpha-soft py-2 text-[10px] text-alpha hover:bg-alpha-soft/80"
                    >
                      Sist. inecuaciones
                      {/* Módulo de cierre (honestidad de alcance): el motor
                          (linearInequalitySystem.ts) solo resuelve EXACTAMENTE
                          2 variables — este botón es funcional (no unavailable),
                          pero no comunicaba esa limitación real antes de tocarlo. */}
                      <span className="absolute -bottom-1 right-1 rounded-sm bg-alpha/20 px-1 text-[7px] font-medium leading-tight text-alpha">
                        2 var.
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        onSimplify?.();
                        setOpenCategory(null);
                      }}
                      aria-label="Simplificar expresión"
                      className="rounded-md bg-graph/15 py-2 text-xs text-graph hover:bg-graph/25"
                    >
                      a+a → 2a
                    </button>
                    <button
                      onClick={() => press(key("LCM", "\\mathrm{lcm}\\left(#0,#1\\right)", "mínimo común múltiplo"))}
                      aria-label="Mínimo común múltiplo"
                      className="rounded-md border border-marker bg-marker-soft/10 py-2 text-xs font-medium text-marker hover:bg-marker-soft/20"
                    >
                      LCM
                    </button>
                    <button
                      onClick={() => press(key("GCD", "\\gcd\\left(#0,#1\\right)", "máximo común divisor"))}
                      aria-label="Máximo común divisor"
                      className="rounded-md border border-marker bg-marker-soft/10 py-2 text-xs font-medium text-marker hover:bg-marker-soft/20"
                    >
                      GCD
                    </button>
                  </div>
                </div>
              ) : (
                <div key={group.section} className="mb-2 last:mb-0">
                  <div className="mb-1.5 text-[9px] uppercase tracking-wide text-bone/50">{group.section}</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {group.keys.map((k, i) => (
                      <button
                        key={`${group.section}-${i}`}
                        onClick={() => press(k)}
                        aria-label={k.ariaLabel}
                        className={
                          // Módulo de cierre (honestidad visual): mismo patrón
                          // gris/borde punteado que ya usa KeyboardBasicPanel.tsx
                          // para "°" — antes esta tecla se veía idéntica a una
                          // activa aunque k.unavailable fuera true (Π, ∂/∂x).
                          k.unavailable
                            ? "rounded-md border border-dashed border-bone/30 bg-chrome-soft/40 py-2 text-sm text-bone/40"
                            : "rounded-md bg-marker-soft/10 py-2 text-sm text-marker hover:bg-marker-soft/20"
                        }
                      >
                        <KeyGlyph glyph={k.glyph} />
                      </button>
                    ))}
                  </div>
                </div>
              ),
            )
          )}
        </div>
      )}

      {/* Íconos de resolución (spec §3.4) */}
      <div className="relative mb-1.5 grid grid-cols-3 gap-1.5">
        <button
          onClick={onSolveEquation}
          aria-label="Resolver ecuación"
          className="rounded-md bg-marker-soft/15 py-2 text-[11px] font-medium text-marker hover:bg-marker-soft/25"
        >
          f(x)=0
        </button>
        <button
          onClick={() => setShowSystemSizeMenu((v) => !v)}
          aria-expanded={showSystemSizeMenu}
          aria-label="Resolver sistema de ecuaciones — elegir cantidad"
          className="flex items-center justify-center gap-1 rounded-md bg-alpha-soft py-2 text-[10px] font-medium text-alpha hover:bg-alpha-soft/80"
        >
          <span className="text-base font-light">{"{"}</span>
          <span className="text-left leading-tight">
            f(x)=0
            <br />
            g(x)=0
          </span>
        </button>
        {showSystemSizeMenu && (
          // Pendiente #2 (revisión post-Módulo D): menú chico que
          // pregunta cuántas ecuaciones antes de insertar la plantilla
          // \begin{cases}. Solo importa cuando el campo todavía no tiene
          // un sistema escrito — si ya lo tiene, onSolveSystem lo
          // resuelve directo e ignora el número (mismo criterio que ya
          // tenía handleSolveSystem antes de este cambio).
          <div className="absolute left-1/3 top-full z-10 mt-1 flex gap-1 rounded-md bg-chrome-soft p-1.5 shadow-lg">
            <span className="self-center px-1 text-[10px] text-bone/60">Ecuaciones:</span>
            {SYSTEM_ROW_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => {
                  onSolveSystem?.(n);
                  setShowSystemSizeMenu(false);
                }}
                aria-label={`Sistema de ${n} ecuaciones`}
                className="h-6 w-6 rounded bg-alpha-soft text-xs font-medium text-alpha hover:bg-alpha-soft/70"
              >
                {n}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={onSimplify}
          aria-label="Simplificar expresión"
          className="rounded-md bg-graph/15 py-2 text-[11px] font-medium text-graph hover:bg-graph/25"
        >
          a+a → 2a
        </button>
      </div>

      {/* Tira de Cálculo — Módulo 4: oculta cuando hideCoreGrid=true
          (BasicScientificMode), porque su contenido (menos LCM/GCD, que
          quedaron en Álgebra > Ecuaciones) ahora vive en la pestaña
          "Cálculo" del panel expandido. GraphMode/código muerto no pasan
          hideCoreGrid — siguen viendo esta tira exactamente igual que
          siempre, LCM/GCD incluidas. El botón de "borrar todo" que vive
          acá adentro desaparece con la tira para BasicMode, pero DEL
          sigue disponible en la pestaña Símbolos (verificado, no es una
          pérdida de funcionalidad). */}
      {!hideCoreGrid && (
        <div className="relative mb-1.5 rounded-lg bg-chrome-soft/60 p-1.5">
          <div className="mb-1 grid grid-cols-6 gap-1">
            {CALCULUS_ROW_1.map((k, i) => (
              <button
                key={i}
                onClick={() => press(k)}
                aria-label={k.ariaLabel}
                className={
                  k.unavailable
                    ? "rounded-md bg-chrome-soft py-1.5 text-[11px] text-bone/40 hover:bg-chrome-soft/70"
                    : ["LCM", "GCD"].includes(String(k.glyph))
                      ? "rounded-md border border-marker bg-chrome-soft py-1.5 text-[11px] font-medium text-marker hover:bg-chrome-soft/70"
                      : "rounded-md bg-chrome-soft py-1.5 text-[11px] text-bone hover:bg-chrome-soft/70"
                }
              >
                <KeyGlyph glyph={k.glyph} />
              </button>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {CALCULUS_ROW_2.map((k, i) => (
              <button
                key={i}
                onClick={() => press(k)}
                aria-label={k.ariaLabel}
                className={
                  k.unavailable
                    ? "rounded-md bg-chrome-soft py-1.5 text-[10px] text-bone/40 hover:bg-chrome-soft/70"
                    : "rounded-md bg-chrome-soft py-1.5 text-[10px] text-bone hover:bg-chrome-soft/70"
                }
              >
                <KeyGlyph glyph={k.glyph} />
              </button>
            ))}
          </div>
          <button
            onClick={onClearField}
            aria-label="Borrar todo el campo"
            title="Borrar todo"
            className="absolute -right-1 -top-1 rounded-md bg-chrome p-1.5 text-bone/70 hover:text-bone"
          >
            🗑
          </button>
        </div>
      )}

      {/* Pestañas de categoría */}
      <div className="mb-1.5 flex flex-wrap gap-x-3 gap-y-1 px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setOpenCategory((c) => (c === cat ? null : cat))}
            aria-expanded={openCategory === cat}
            className={openCategory === cat ? "text-xs font-semibold text-marker" : "text-xs text-bone/70"}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Núcleo fijo + relacionales — ocultos cuando hideCoreGrid=true
          (BasicScientificMode: viven en KeyboardBasicPanel/dock). */}
      {!hideCoreGrid && (
        <>
          {CORE_GRID.map((row, i) => (
            <div key={i} className="mb-1.5 grid grid-cols-7 gap-1">
              {row.map((k, j) => {
                const glyphStr = String(k.glyph);
                const isDigit = /^[0-9.%]$/.test(glyphStr);
                const isOperator = ["×", "−", "+", "÷"].includes(glyphStr);
                const isEquals = glyphStr === "=";
                const isEnter = glyphStr === "⏎";
                const className = isEnter
                  ? "rounded-md bg-graph py-2.5 text-sm font-semibold text-paper hover:bg-graph/90"
                  : isEquals
                    ? "rounded-md border border-marker py-2.5 text-sm font-medium text-marker hover:bg-marker-soft/10"
                    : isOperator
                      ? "rounded-md bg-marker py-2.5 text-base font-semibold text-chrome hover:bg-marker/90"
                      : isDigit
                        ? "rounded-md bg-chrome-soft/80 py-2.5 text-sm font-medium text-bone hover:bg-chrome-soft/60"
                        : "rounded-md bg-chrome-soft py-2.5 text-[11px] text-marker hover:bg-chrome-soft/70";
                return (
                  <button key={j} onClick={() => pressBase(k)} aria-label={k.ariaLabel} className={className}>
                    <KeyGlyph glyph={k.glyph} />
                  </button>
                );
              })}
            </div>
          ))}

          <div className="grid grid-cols-4 gap-1">
            {RELATIONAL_ROW.map((k, i) => (
              <button
                key={i}
                onClick={() => press(k)}
                aria-label={k.ariaLabel}
                className="rounded-md bg-paper-soft py-1.5 text-sm text-ink hover:bg-paper-line/60"
              >
                <KeyGlyph glyph={k.glyph} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
