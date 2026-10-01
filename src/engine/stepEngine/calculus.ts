// stepEngine/calculus.ts (spec v10 §7, Módulo 4 — Modo Cálculo).
//
// Enfoque híbrido explícito por operación:
// - Derivada: solo simbólica (Algebrite `d()`, función bien establecida).
//   Orden 1-3 (spec v10 §7 — reducido de v9 por prudencia ante Algebrite).
// - Límite: intenta simbólico (Algebrite `limit()`), si falla cae a
//   estimación numérica por acercamiento (numericFallback.ts) —
//   confidence: "NUMERIC_FALLBACK" en ese caso, visible en la UI.
// - Integral indefinida: solo simbólica — nunca se inventa un resultado
//   numérico para una integral indefinida (no tiene un único valor).
// - Integral definida: intenta symbolic (evaluar la indefinida en los
//   límites), si falla usa Simpson numérico — igual que límite, marcado.

import {
  derivative as symbolicDerivative,
  indefiniteIntegral,
  symbolicLimit,
  evaluate,
  ErrorCode,
} from "../algebriteClient";
import { compileNumeric, numericLimit, numericLimitAtInfinity, simpsonIntegral } from "../numericFallback";
import { rewriteReciprocalFunctions } from "../parsing";
import type { Step, AppError, ResultConfidence } from "../../types";

export interface CalculusResult {
  resultLatex: string;
  steps: Step[];
  confidence: ResultConfidence;
}

// Fase 3 (paridad con la pantalla única): el orden de derivada ya no
// tiene tope artificial — Algebrite acepta d(cuerpo,x,N) con N nativo,
// verificado contra el paquete real (ver algebriteClient.ts). El tope de
// 1-3 que tenía este archivo ("reducido de v9 por prudencia ante
// Algebrite") ya no aplica: la pantalla única (vía normalize.ts) acepta
// cualquier N escrito a mano en \frac{d^N}{dx^N}, así que CalculusMode.tsx
// (el formulario dedicado) no debería quedar más limitado que eso.
// Fix (suite de regresión, casos D013-D015: d/dx[sec(x)], d/dx[csc(x)],
// d/dx[cot(x)] quedaban sin evaluar, ej. "d(sec(x),x)"). El `d()` nativo
// de Algebrite solo deriva sin/cos/tan de fábrica — no conoce las
// recíprocas. Se reescriben a su forma equivalente en sin/cos/tan/etc.
// antes de derivar. Ampliado luego (cierre de la suite de paridad de
// teclado) a csch/sech/coth y arcsec/arccsc/arccot, y movido a
// engine/parsing/index.ts como `rewriteReciprocalFunctions` para que
// TODO el pipeline (evaluate/derivada/integral/límite) las resuelva por
// igual, no solo la derivada — se importa desde ahí en vez de duplicar
// la lógica acá.
function rewriteBalancedUnary(
  input: string,
  fnName: string,
  build: (arg: string) => string,
): string {
  let result = "";
  let i = 0;
  while (i < input.length) {
    const precededByLetter = i > 0 && /[A-Za-z]/.test(input[i - 1]);
    if (!precededByLetter && input.startsWith(`${fnName}(`, i)) {
      const open = i + fnName.length;
      let depth = 1;
      let j = open + 1;
      while (j < input.length && depth > 0) {
        if (input[j] === "(") depth++;
        else if (input[j] === ")") depth--;
        j++;
      }
      if (depth !== 0) {
        result += input.slice(i);
        break;
      }
      const arg = input.slice(open + 1, j - 1);
      result += build(arg);
      i = j;
    } else {
      result += input[i];
      i++;
    }
  }
  return result;
}

function rewriteInverseHyperbolicsForDerivative(input: string): string {
  let result = input;
  const rules: Array<[string, (arg: string) => string]> = [
    ["asinh", (arg) => `ln((${arg})+sqrt((${arg})^2+1))`],
    ["acosh", (arg) => `ln((${arg})+sqrt((${arg})^2-1))`],
    ["atanh", (arg) => `(1/2)*ln((1+(${arg}))/(1-(${arg})))`],
  ];
  // Use a balanced scanner rather than /[^()]*/ so reciprocal inverse
  // functions rewritten as atanh(1/(x)), acosh(1/(x)) or asinh(1/(x))
  // are handled by the same derivative pipeline.
  for (let pass = 0; pass < 6; pass++) {
    const previous = result;
    for (const [name, build] of rules) result = rewriteBalancedUnary(result, name, build);
    if (result === previous) break;
  }
  return result;
}

export function calcDerivative(exprAlgebrite: string, variable: string, order: number): CalculusResult {
  const normalized = rewriteInverseHyperbolicsForDerivative(
    rewriteReciprocalFunctions(exprAlgebrite),
  )
    .replace(/\be\^\(([^()]*)\)/g, "exp($1)")
    .replace(/\be\^([A-Za-z][A-Za-z0-9_]*)\b/g, "exp($1)");

  const result = symbolicDerivative(normalized, variable, order);
  if (/NaN|\bd\(/i.test(result)) {
    throw {
      code: ErrorCode.UNSUPPORTED_OPERATION,
      message: "La derivada simbólica no pudo reducirse a una expresión cerrada.",
    } as AppError;
  }
  return {
    resultLatex: result,
    confidence: "SYMBOLIC",
    steps: [
      { id: "original", latex: exprAlgebrite, explanation: "Expresión original." },
      {
        id: "result",
        latex: `\\frac{d${order > 1 ? `^${order}` : ""}}{d${variable}${order > 1 ? `^${order}` : ""}} = ${result}`,
        explanation: `Derivada de orden ${order} calculada simbólicamente.`,
      },
    ],
  };
}

export type LimitDirection = "both" | "left" | "right";

// Fase 3 (paridad con la pantalla única): antes esta función solo probaba
// un punto finito. tryLimitFallback (compute.worker.ts) ya resuelve
// infinito/lateral para la notación natural en Básica — se porta acá el
// mismo criterio para que el formulario dedicado de Cálculo llegue a lo
// mismo, sin que el usuario tenga que "saber" que escribiendo la notación
// a mano en Básica consigue más que en el formulario pensado para eso.
export function calcLimit(
  exprAlgebrite: string,
  variable: string,
  pointAlgebrite: string,
  pointNumeric: number,
  direction: LimitDirection = "both",
): CalculusResult {
  exprAlgebrite = rewriteReciprocalFunctions(exprAlgebrite);
  const isInfinite = pointAlgebrite === "oo" || pointAlgebrite === "-oo";
  const limitLatex = `\\lim_{${variable}\\to ${pointAlgebrite}${direction === "right" ? "^+" : direction === "left" ? "^-" : ""}} ${exprAlgebrite}`;

  try {
    // symbolicLimit ya detecta el caso "Algebrite devolvió la llamada sin
    // evaluar" (incluido cuando el punto es oo/-oo, confirmado contra el
    // paquete real) y lanza en ese caso — cae directo al catch de abajo.
    const result = symbolicLimit(exprAlgebrite, variable, pointAlgebrite);
    return {
      resultLatex: result,
      confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "result", latex: result, explanation: "Resuelto simbólicamente por Algebrite." },
      ],
    };
  } catch {
    let f;
    try {
      f = compileNumeric(exprAlgebrite, variable);
    } catch (err) {
      throw err as AppError;
    }
    const { value, converged } = isInfinite
      ? numericLimitAtInfinity(f, pointAlgebrite === "oo" ? 1 : -1)
      : numericLimit(f, pointNumeric, direction);
    if (Number.isNaN(value)) {
      throw { code: ErrorCode.UNSUPPORTED_OPERATION, message: "No se pudo estimar el límite numéricamente." } as AppError;
    }
    if ((value === Infinity || value === -Infinity) && converged) {
      const infinityText = value > 0 ? "oo" : "-oo";
      return {
        resultLatex: infinityText,
        confidence: "NUMERIC_FALLBACK",
        steps: [
          { id: "original", latex: limitLatex, explanation: "Límite planteado." },
          {
            id: "numeric",
            latex: value > 0 ? "\\infty" : "-\\infty",
            explanation: "La magnitud crece sin cota de forma consistente; el límite diverge a infinito.",
          },
        ],
      };
    }
    if (!Number.isFinite(value)) {
      throw { code: ErrorCode.UNSUPPORTED_OPERATION, message: "No se pudo estimar el límite numéricamente (valores no finitos)." } as AppError;
    }
    // Fix (suite de regresión v1.1, casos L004/L010: lim 1/x y lim
    // abs(x)/x en x=0 daban "0.000000" en vez de "no existe"). Cuando
    // `direction === "both"` y los lados izquierdo/derecho NO
    // convergen (`converged === false`), `value` es el PROMEDIO de las
    // dos estimaciones laterales — para 1/x eso es (1e6 + (-1e6))/2 = 0,
    // un número sin ningún significado matemático que antes se
    // presentaba igual como si fuera la respuesta (el aviso de que
    // "podría no existir" quedaba escondido solo en el texto de un
    // paso). Ahora se trata como lo que es: el límite no existe.
    //
    // Alcance: SOLO para el punto finito (`!isInfinite`) — para
    // x→∞/-∞, `converged=false` significa otra cosa (la magnitud sigue
    // creciendo sin parar entre las dos últimas muestras, ej. x² en
    // x→∞ da 1e12 y luego 1e14, nunca "converge" en ese sentido) y esa
    // SÍ es una respuesta válida de "diverge a infinito", no "no
    // existe" — aplicar el mismo chequeo ahí rompía L007/L012.
    if (!isInfinite && direction === "both" && !converged) {
      throw {
        code: ErrorCode.UNSUPPORTED_OPERATION,
        message: "El límite no existe: los límites laterales izquierdo y derecho no coinciden.",
      } as AppError;
    }
    return {
      resultLatex: value.toFixed(6),
      confidence: "NUMERIC_FALLBACK",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        {
          id: "numeric",
          latex: `\\approx ${value.toFixed(6)}`,
          explanation: converged
            ? isInfinite
              ? "Estimado numéricamente evaluando en magnitudes crecientes (no resuelto simbólicamente)."
              : direction === "both"
                ? "Estimado numéricamente por acercamiento lateral (no resuelto simbólicamente)."
                : `Estimado numéricamente acercándose solo por la ${direction === "right" ? "derecha" : "izquierda"}.`
            : "Estimado numéricamente, pero los lados izquierdo/derecho no convergen al mismo valor — el límite podría no existir.",
        },
      ],
    };
  }
}

export function fastAntiderivative(
  exprAlgebrite: string,
  variable: string,
): string | null {
  if (variable !== "x") return null;
  let expr = exprAlgebrite
    .replace(/\s+/g, "")
    .replace(/\^\((\d+)\)/g, "^$1")
    .replace(/e\^\(x\)/g, "e^x");

  // MathLive/parser can leave harmless grouping around one function or a
  // reciprocal atom, e.g. ((1/cosh(x)))^2 or (arcsin(x))/(sqrt(...)).
  // Canonicalize only these x-only atoms so the exact identity table
  // remains deliberately narrow instead of becoming a general simplifier.
  for (let pass = 0; pass < 6; pass++) {
    const previous = expr;
    expr = expr
      .replace(/\(\((1\/(?:cos|sin|tan|cosh|sinh|tanh)\(x\))\)\)/g, "($1)")
      .replace(/\(1\/\((cos|sin|tan|cosh|sinh|tanh)\(x\)\)\)/g, "(1/$1(x))")
      .replace(/\((arcsin|arccos|arctan|sin|cos|tan|sinh|cosh|tanh)\(x\)\)/g, "$1(x)")
      .replace(/\(sqrt\(([^()]*)\)\)/g, "sqrt($1)");
    if (expr === previous) break;
  }

  // Natural input groups the whole integrand. Remove only balanced
  // outer grouping, never parentheses belonging to one factor of a sum.
  const stripGrouping = (source: string): string => {
    while (source.startsWith("(") && source.endsWith(")")) {
      let depth = 0;
      let wraps = true;
      for (let i = 0; i < source.length - 1; i++) {
        depth += source[i] === "(" ? 1 : source[i] === ")" ? -1 : 0;
        if (depth === 0) { wraps = false; break; }
      }
      if (!wraps || depth !== 1) break;
      source = source.slice(1, -1);
    }
    return source;
  };
  expr = stripGrouping(expr);

  // parseExpression rewrites reciprocal trig/hyperbolic functions before
  // the worker sees the integrand. Canonicalize those exact x-only forms
  // back to their calculator names so one identity table serves both the
  // dedicated Calculus mode and inline Scientific notation.
  for (let pass = 0; pass < 4; pass++) {
    const previous = expr;
    expr = expr
      .replace(/\(1\/cos\(x\)\)/g, "sec(x)")
      .replace(/\(1\/sin\(x\)\)/g, "csc(x)")
      .replace(/\(1\/tan\(x\)\)/g, "cot(x)")
      .replace(/\(1\/cosh\(x\)\)/g, "sech(x)")
      .replace(/\(1\/sinh\(x\)\)/g, "csch(x)")
      .replace(/\(1\/tanh\(x\)\)/g, "coth(x)")
      .replace(/arccos\(1\/\(x\)\)/g, "arcsec(x)")
      .replace(/arcsin\(1\/\(x\)\)/g, "arccsc(x)")
      .replace(/acosh\(1\/\(x\)\)/g, "asech(x)")
      .replace(/asinh\(1\/\(x\)\)/g, "acsch(x)")
      .replace(/atanh\(1\/\(x\)\)/g, "acoth(x)")
      .replace(/\((sin|cos|tan|sinh|cosh|tanh|sec|csc|cot|sech|csch|coth)\(x\)\)/g, "$1(x)");
    expr = stripGrouping(expr);
    if (expr === previous) break;
  }

  const exact: Record<string, string> = {
    "sec(x)*tan(x)": "1/cos(x)",
    "tan(x)*sec(x)": "1/cos(x)",
    "csc(x)*cot(x)": "-1/sin(x)",
    "cot(x)*csc(x)": "-1/sin(x)",
    "tan(x)^2": "tan(x)-x",
    "sec(x)^3": "(1/2)*((1/cos(x))*tan(x)+ln(abs((1/cos(x))+tan(x))))",
    "cos(x)/(1+sin(x)^2)": "arctan(sin(x))",
    "arcsin(x)/sqrt(1-x^2)": "(1/2)*arcsin(x)^2",
    "coth(x)": "ln(abs(sinh(x)))",
    "sech(x)^2": "tanh(x)",
    "csch(x)": "ln(abs(tanh(x/2)))",
    "sech(x)*tanh(x)": "-1/cosh(x)",
    "tanh(x)*sech(x)": "-1/cosh(x)",
    "e^x*cosh(x)": "e^(2*x)/4+x/2",
    "e^x*sin(x)": "e^x*(sin(x)-cos(x))/2",
    "arcsec(x)": "x*arccos(1/x)-ln(x+sqrt(x^2-1))",
    "arccsc(x)": "x*arcsin(1/x)+ln(x+sqrt(x^2-1))",
    "csch(x)^2": "-cosh(x)/sinh(x)",
    "csch(x)*coth(x)": "-1/sinh(x)",
    "coth(x)*csch(x)": "-1/sinh(x)",
    "sech(x)": "arctan(sinh(x))",
    "x*asinh(x)": "((2*x^2+1)/4)*asinh(x)-(x*sqrt(x^2+1))/4",
    "asinh(x)": "x*asinh(x)-sqrt(x^2+1)",
    "acosh(x)": "x*acosh(x)-sqrt(x^2-1)",
    "atanh(x)": "x*atanh(x)+(1/2)*ln(1-x^2)",
    "acoth(x)": "x*acoth(x)+(1/2)*ln(x^2-1)",
    "asech(x)": "x*asech(x)+arcsin(x)",
    "acsch(x)": "x*acsch(x)+asinh(x)",
  };

  return exact[expr] ?? null;
}

export function calcIndefiniteIntegral(exprAlgebrite: string, variable: string): CalculusResult {
  const originalExpr = exprAlgebrite;
  const fast = fastAntiderivative(originalExpr, variable);
  if (fast !== null) {
    return {
      resultLatex: `${fast} + C`,
      confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: `\\int ${originalExpr}\\,d${variable}`, explanation: "Integral planteada." },
        { id: "result", latex: `${fast} + C`, explanation: "Se aplicó una identidad cerrada de integración." },
      ],
    };
  }

  exprAlgebrite = rewriteReciprocalFunctions(exprAlgebrite);
  const result = indefiniteIntegral(exprAlgebrite, variable);
  if (/Unsupported\s*function|^integral\(/i.test(result)) {
    throw {
      code: ErrorCode.UNSUPPORTED_OPERATION,
      message: "Algebrite no pudo reducir la integral a una antiderivada cerrada.",
    } as AppError;
  }
  return {
    resultLatex: `${result} + C`,
    confidence: "SYMBOLIC",
    steps: [
      { id: "original", latex: `\\int ${exprAlgebrite}\\,d${variable}`, explanation: "Integral planteada." },
      { id: "result", latex: `${result} + C`, explanation: "Antiderivada calculada simbólicamente (+ constante de integración)." },
    ],
  };
}

export function calcDefiniteIntegral(
  exprAlgebrite: string,
  variable: string,
  lower: number,
  upper: number,
): CalculusResult {
  const originalExpr = exprAlgebrite;
  const fast = fastAntiderivative(originalExpr, variable);
  if (fast !== null) {
    try {
      const F = compileNumeric(fast, variable);
      const lowerValue = F(lower);
      const upperValue = F(upper);
      const value = upperValue - lowerValue;
      if (Number.isFinite(value)) {
        return {
          resultLatex: String(value),
          confidence: "SYMBOLIC",
          steps: [
            { id: "original", latex: `\\int_{${lower}}^{${upper}} ${originalExpr}\\,d${variable}`, explanation: "Integral definida planteada." },
            { id: "antiderivative", latex: `${fast} + C`, explanation: "Se aplicó una identidad cerrada de integración." },
            { id: "result", latex: `= ${value}`, explanation: "Evaluada en los límites." },
          ],
        };
      }
    } catch {
      // Si la antiderivada cerrada no puede evaluarse numéricamente en
      // estos límites, se conserva el pipeline simbólico/Simpson existente.
    }
  }

  exprAlgebrite = rewriteReciprocalFunctions(exprAlgebrite);
  try {
    const antiderivative = indefiniteIntegral(exprAlgebrite, variable);
    // FIX (Fase 2 externa, hallazgo nuevo): subst() de Algebrite toma
    // (nuevo_valor, variable_vieja, expr), no al revés — mismo bug ya
    // corregido en linearSystem.ts (Fase 1) pero nunca portado aquí. Con
    // el orden viejo (variable, valor, expr) la sustitución nunca hacía
    // nada: daba la antiderivada sin evaluar en los límites (ej.
    // 1/3*x^3 en vez de 8/3 para ∫₀² x² dx), en silencio, sin error.
    //
    // Segundo bug destapado al corregir el primero (nunca se llegaba
    // aquí antes): float(...) de Algebrite devuelve un string con "..."
    // literal cuando el decimal no es exacto (ej. "2.666667..."), y
    // volver a meter ese string en otro evaluate() como si fuera una
    // expresión válida da "NaN...". Se evita el viaje de ida y vuelta
    // por texto combinando la resta en una sola llamada a Algebrite.
    const result = evaluate(
      `float(subst(${upper},${variable},${antiderivative})) - float(subst(${lower},${variable},${antiderivative}))`,
    );
    return {
      resultLatex: result,
      confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: `\\int_{${lower}}^{${upper}} ${exprAlgebrite}\\,d${variable}`, explanation: "Integral definida planteada." },
        { id: "antiderivative", latex: `${antiderivative} + C`, explanation: "Antiderivada." },
        { id: "result", latex: `= ${result}`, explanation: "Evaluada en los límites (Teorema Fundamental del Cálculo)." },
      ],
    };
  } catch {
    // Fallback numérico por Simpson — spec v10 §7/§10.
    let f;
    try {
      f = compileNumeric(exprAlgebrite, variable);
    } catch (err) {
      throw err as AppError;
    }
    const value = simpsonIntegral(f, lower, upper);
    return {
      resultLatex: value.toFixed(6),
      confidence: "NUMERIC_FALLBACK",
      steps: [
        { id: "original", latex: `\\int_{${lower}}^{${upper}} ${exprAlgebrite}\\,d${variable}`, explanation: "Integral definida planteada." },
        {
          id: "numeric",
          latex: `\\approx ${value.toFixed(6)}`,
          explanation: "Aproximada numéricamente por la regla de Simpson (no se encontró antiderivada simbólica).",
        },
      ],
    };
  }
}
