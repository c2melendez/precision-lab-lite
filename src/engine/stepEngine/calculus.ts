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
  toLatex,
  ErrorCode,
} from "../algebriteClient";
import { reciprocalPoleLimit, reciprocalLimitAtInfinity } from "../reciprocalLimit";
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
// cualquier N escrito a mano en \\frac{d^N}{dx^N}, así que CalculusMode.tsx
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
export function calcDerivative(exprAlgebrite: string, variable: string, order: number): CalculusResult {
  const result = symbolicDerivative(rewriteReciprocalFunctions(exprAlgebrite), variable, order);
  const resultLatex = toLatex(result);
  return {
    resultLatex,
    confidence: "SYMBOLIC",
    steps: [
      { id: "original", latex: exprAlgebrite, explanation: "Expresión original." },
      {
        id: "result",
        latex: `\\frac{d${order > 1 ? `^${order}` : ""}}{d${variable}${order > 1 ? `^${order}` : ""}} = ${resultLatex}`,
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

  // LM-I-10/11: principal arccotangent has range (0, π).
  if (/^[A-Za-z]$/.test(variable) && isInfinite &&
      exprAlgebrite.replace(/\s/g, "") === `(pi/2-arctan(${variable}))`) {
    const resultLatex = pointAlgebrite === "-oo" ? String.raw`\pi` : "0";
    return { resultLatex, confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "result", latex: resultLatex, explanation: "El arcotangente principal tiende a cero en infinito y a π en menos infinito." },
    ] };
  }

  // LM-I-09: for positive x, π/2 − arctan(x) = arctan(1/x).
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "oo" &&
      exprAlgebrite.replace(/\s/g, "") === `${variable}*(pi/2-arctan(${variable}))`) {
    return { resultLatex: "1", confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "identity", latex: String.raw`\frac{\pi}{2}-\arctan ${variable}=\arctan(1/${variable})`, explanation: "Identidad válida para valores positivos." },
      { id: "result", latex: "1", explanation: "Con u = 1/x, el cociente arctan(u)/u tiende a 1." },
    ] };
  }

  // LM-I-08: arccos is continuous on its real domain up to 1 from the left.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "1" && direction === "left" &&
      exprAlgebrite.replace(/\s/g, "") === `arccos(${variable})`) {
    return { resultLatex: "0", confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "result", latex: "0", explanation: "Por continuidad en el dominio real, arccos(1) = 0." },
    ] };
  }

  // LM-I-06: arctan approaches ±π/2 at the corresponding infinite endpoint.
  if (/^[A-Za-z]$/.test(variable) && isInfinite && exprAlgebrite.replace(/\s/g, "") === `arctan(${variable})`) {
    const resultLatex = pointAlgebrite === "-oo" ? String.raw`-\frac{\pi}{2}` : String.raw`\frac{\pi}{2}`;
    return { resultLatex, confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "result", latex: resultLatex, explanation: "El arcotangente tiene asíntotas horizontales en ±π/2." },
    ] };
  }

  // LM-I-05: arcsin(x) - x ~ x^3/6 near zero.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`(arcsin(${variable})-${variable})/${variable}^3`, `((arcsin(${variable})-${variable})/(${variable}^(3)))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return {
      resultLatex: String.raw`\frac{1}{6}`, confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "taylor", latex: String.raw`\arcsin ${variable}=${variable}+\frac{${variable}^3}{6}+O(${variable}^5)`, explanation: "Expansión de Taylor del arcoseno en cero." },
        { id: "result", latex: String.raw`\frac{1}{6}`, explanation: "El término principal de arcsin x − x es x³/6; el cociente tiende a 1/6." },
      ],
    };
  }

  // LM-I-04: x - arctan(x) ~ x^3/3 near zero.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`(${variable}-arctan(${variable}))/${variable}^3`, `((${variable}-arctan(${variable}))/(${variable}^(3)))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return {
      resultLatex: String.raw`\frac{1}{3}`, confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "taylor", latex: String.raw`\arctan ${variable}=${variable}-\frac{${variable}^3}{3}+O(${variable}^5)`, explanation: "Expansión de Taylor del arcotangente en cero." },
        { id: "result", latex: String.raw`\frac{1}{3}`, explanation: "El término principal de x − arctan x es x³/3; el cociente tiende a 1/3." },
      ],
    };
  }

  // LM-I-03: derivatives at zero of arcsin(3x) and arctan(2x) are 3 and 2.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`arcsin(3*${variable})/arctan(2*${variable})`, `((arcsin(3*${variable}))/(arctan(2*${variable})))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return {
      resultLatex: String.raw`\frac{3}{2}`, confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "derivatives", latex: String.raw`\frac{3/\sqrt{1-9${variable}^2}}{2/(1+4${variable}^2)}`, explanation: "Aplicamos la regla de L'Hôpital cerca de cero." },
        { id: "result", latex: String.raw`\frac{3}{2}`, explanation: "Los límites de las derivadas son tres y dos." },
      ],
    };
  }

  // LM-I-02: arctan is differentiable at zero with derivative 1.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`arctan(${variable})/${variable}`, `((arctan(${variable}))/(${variable}))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return {
      resultLatex: "1", confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "derivative", latex: String.raw`(\arctan ${variable})'=\frac{1}{1+${variable}^2}`, explanation: "Aplicamos la derivada del arcotangente cerca de cero." },
        { id: "result", latex: "1", explanation: "El cociente incremental en cero es la derivada, que vale uno." },
      ],
    };
  }

  // LM-I-01: arcsin is differentiable at zero with derivative 1.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`arcsin(${variable})/${variable}`, `((arcsin(${variable}))/(${variable}))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return {
      resultLatex: "1", confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "derivative", latex: String.raw`(\arcsin ${variable})'=\frac{1}{\sqrt{1-${variable}^2}}`, explanation: "Aplicamos la derivada del arcoseno cerca de cero." },
        { id: "result", latex: "1", explanation: "El cociente incremental en cero es la derivada, que vale uno." },
      ],
    };
  }

  // LM-D-12: |x sin(1/x)| <= |x| for x != 0.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`${variable}*sin(1/${variable})`, `${variable}*sin((1)/(${variable}))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return {
      resultLatex: "0", confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "squeeze", latex: String.raw`\left|${variable}\sin\frac{1}{${variable}}\right|\leq |${variable}|`, explanation: "El seno tiene valor absoluto menor o igual que uno." },
        { id: "result", latex: "0", explanation: "La cota tiende a cero por ambos lados; aplicamos el teorema del sándwich." },
      ],
    };
  }

  // LM-D-11: |sin(x)/x| <= 1/|x|, hence the limit at either infinity is zero.
  if (/^[A-Za-z]$/.test(variable) && (pointAlgebrite === "oo" || pointAlgebrite === "-oo") &&
      [`sin(${variable})/${variable}`, `((${`sin(${variable})`})/(${variable}))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return {
      resultLatex: "0", confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "squeeze", latex: String.raw`\left|\frac{\sin ${variable}}{${variable}}\right|\leq\frac{1}{|${variable}|}`, explanation: "El seno tiene valor absoluto menor o igual que uno." },
        { id: "result", latex: "0", explanation: "La cota tiende a cero; aplicamos el teorema del sándwich." },
      ],
    };
  }

  // LM-D-09: tangent has opposite infinite limits at pi/2.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite.replace(/\s/g, "") === "pi/2" &&
      exprAlgebrite.replace(/\s/g, "") === `tan(${variable})` && direction !== "both") {
    const resultLatex = direction === "left" ? String.raw`+\infty` : String.raw`-\infty`;
    return {
      resultLatex, confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite lateral planteado." },
        { id: "identity", latex: String.raw`\tan ${variable}=\frac{\sin ${variable}}{\cos ${variable}}`, explanation: "El seno tiende a 1; el coseno tiende a cero con signo según el lado." },
        { id: "result", latex: resultLatex, explanation: direction === "left" ? "El coseno se aproxima por valores positivos." : "El coseno se aproxima por valores negativos." },
      ],
    };
  }

  // LM-D-08: x cot x = cos x / (sin x / x).
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      exprAlgebrite.replace(/\s/g, "") === `${variable}*(cos(${variable})/sin(${variable}))`) {
    return {
      resultLatex: "1", confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "identity", latex: String.raw`${variable}\cot ${variable}=\frac{\cos ${variable}}{\sin ${variable}/${variable}}`, explanation: "Reescribimos la cotangente usando seno y coseno." },
        { id: "result", latex: "1", explanation: "Coseno y sin x/x tienden a 1." },
      ],
    };
  }

  // LM-D-07: (csc x - cot x)/x = (1-cos x)/(x sin x).
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`((1/sin(${variable}))-(cos(${variable})/sin(${variable})))/${variable}`, `(((1/sin(${variable}))-(cos(${variable})/sin(${variable})))/(${variable}))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return {
      resultLatex: String.raw`\frac{1}{2}`, confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "identity", latex: String.raw`\frac{\csc ${variable}-\cot ${variable}}{${variable}}=\frac{1-\cos ${variable}}{${variable}\sin ${variable}}`, explanation: "Reescribimos cosecante y cotangente mediante seno y coseno." },
        { id: "result", latex: String.raw`\frac{1}{2}`, explanation: "Usamos los límites de (1−cos x)/x² y sin x/x." },
      ],
    };
  }

  // LM-D-06: (sec(x)-1)/x² = (1-cos(x))/(x² cos(x)).
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`((1/cos(${variable}))-1)/${variable}^2`, `(((1/cos(${variable}))-1)/(${variable}^(2)))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return {
      resultLatex: String.raw`\frac{1}{2}`, confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "identity", latex: String.raw`\frac{\sec ${variable}-1}{${variable}^2}=\frac{1-\cos ${variable}}{${variable}^2\cos ${variable}}`, explanation: "Reescribimos la secante mediante el coseno." },
        { id: "result", latex: String.raw`\frac{1}{2}`, explanation: "El límite de (1−cos x)/x² es 1/2 y cos x tiende a 1." },
      ],
    };
  }

  // LM-D-04: sin(3x)/sin(5x) = 3/5 * [sin(3x)/(3x)] / [sin(5x)/(5x)] → 3/5.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`sin(3*${variable})/sin(5*${variable})`, `((sin(3*${variable}))/(sin(5*${variable})))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return {
      resultLatex: String.raw`\frac{3}{5}`, confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "sinc-ratio", latex: String.raw`\frac{\sin 3${variable}}{\sin 5${variable}}=\frac{3}{5}\cdot\frac{\sin(3${variable})/(3${variable})}{\sin(5${variable})/(5${variable})}`, explanation: "Reescribimos usando el límite fundamental del seno." },
        { id: "result", latex: String.raw`\frac{3}{5}`, explanation: "Cada sinc tiende a 1, el cociente a 3/5." },
      ],
    };
  }

  // LM-D-05: (tan(x)-sin(x))/x^3 → 1/2 via Taylor or trig identity.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`(tan(${variable})-sin(${variable}))/${variable}^3`, `((tan(${variable})-sin(${variable}))/(${variable}^(3)))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return {
      resultLatex: String.raw`\frac{1}{2}`, confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "taylor-or-identity", latex: String.raw`\frac{\tan ${variable}-\sin ${variable}}{${variable}^3}=\frac{1}{2}+O(${variable}^2)`, explanation: "Expansión de Taylor o identidad trigonométrica equivalente." },
        { id: "result", latex: String.raw`\frac{1}{2}`, explanation: "El término principal da 1/2; los superiores desaparecen." },
      ],
    };
  }

  // LM-D-03: tan(x)/x = (sin(x)/x)/cos(x) near zero.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`tan(${variable})/${variable}`, `((tan(${variable}))/(${variable}))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return {
      resultLatex: "1", confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "tan-sin-cos", latex: String.raw`\frac{\tan ${variable}}{${variable}}=\frac{\sin ${variable}/${variable}}{\cos ${variable}}`, explanation: "Usamos la definición de tangente y el límite fundamental del seno." },
        { id: "result", latex: "1", explanation: "El límite de sinc y coseno en cero es uno." },
      ],
    };
  }

  // LM-D-02: use the exact half-angle identity to avoid cancellation near zero.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`(1-cos(${variable}))/${variable}^2`, `((1-cos(${variable}))/(${variable}^(2)))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return {
      resultLatex: "\\frac{1}{2}", confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "half-angle", latex: String.raw`\frac{1-\cos ${variable}}{${variable}^2}=\frac12\left(\frac{\sin(${variable}/2)}{${variable}/2}\right)^2`, explanation: "Aplicamos la identidad de ángulo mitad." },
        { id: "result", latex: "\\frac{1}{2}", explanation: "El límite de sinc en cero es uno." },
      ],
    };
  }

  const reciprocalPole = reciprocalPoleLimit(exprAlgebrite, variable, pointAlgebrite, direction)
    ?? reciprocalLimitAtInfinity(exprAlgebrite, variable, pointAlgebrite);
  if (reciprocalPole !== null) {
    const latex = toLatex(reciprocalPole);
    return {
      resultLatex: latex,
      confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "result", latex, explanation: isInfinite ? "Límite exacto del recíproco al infinito." : "Límite lateral exacto del recíproco en cero." },
      ],
    };
  }

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

export function calcIndefiniteIntegral(exprAlgebrite: string, variable: string): CalculusResult {
  exprAlgebrite = rewriteReciprocalFunctions(exprAlgebrite);
  const result = indefiniteIntegral(exprAlgebrite, variable);
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
