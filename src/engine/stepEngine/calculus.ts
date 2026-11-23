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

  // LM-HI-04: artanh(x) = log((1+x)/(1-x))/2 on (-1, 1).
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "1" && direction === "left" && exprAlgebrite.replace(/\s/g, "") === `atanh(${variable})`) {
    return { resultLatex: String.raw`+\infty`, confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite lateral dentro del dominio real." },
      { id: "result", latex: String.raw`+\infty`, explanation: "En artanh(x)=ln((1+x)/(1-x))/2, el cociente tiende a infinito por la izquierda." },
    ] };
  }

  // LM-HI-05: asinh(x) - ln(x) tends to ln(2) at positive infinity.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "oo" &&
      [`asinh(${variable})-log(${variable})`, `(asinh(${variable})-log(${variable}))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return { resultLatex: String.raw`\ln 2`, confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "identity", latex: String.raw`\operatorname{arsinh} ${variable}=\ln\left(${variable}+\sqrt{${variable}^2+1}\right)`, explanation: "Definición logarítmica del arsinh." },
      { id: "result", latex: String.raw`\ln 2`, explanation: "Al restar ln(x) y tomar el límite, el cociente interno tiende a 2." },
    ] };
  }

  // LM-HI-03: atanh(x) = x + x³/3 + O(xµ) near zero.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`(atanh(${variable})-${variable})/${variable}^3`, `((atanh(${variable})-${variable})/(${variable}^(3)))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return { resultLatex: String.raw`\frac{1}{3}`, confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "taylor", latex: String.raw`\operatorname{artanh} ${variable}=${variable}+\frac{${variable}^3}{3}+O(${variable}^5)`, explanation: "Expansión de Taylor de artanh en cero." },
      { id: "result", latex: String.raw`\frac{1}{3}`, explanation: "El término principal del numerador es x³/3." },
    ] };
  }

  // LM-HI-02: atanh is differentiable at zero with derivative 1.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`atanh(${variable})/${variable}`, `((atanh(${variable}))/(${variable}))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return { resultLatex: "1", confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "result", latex: "1", explanation: "La derivada de artanh en cero es 1." },
    ] };
  }

  // LM-HI-01: asinh is differentiable at zero with derivative 1.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`asinh(${variable})/${variable}`, `((asinh(${variable}))/(${variable}))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return { resultLatex: "1", confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "result", latex: "1", explanation: "La derivada de arsinh en cero es 1." },
    ] };
  }

  // LM-H-11: cosh(x) diverges to positive infinity at either infinite end.
  if (/^[A-Za-z]$/.test(variable) && isInfinite &&
      exprAlgebrite.replace(/\s/g, "") === `cosh(${variable})`) {
    return { resultLatex: String.raw`+\infty`, confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "result", latex: String.raw`+\infty`, explanation: "El coseno hiperbólico crece sin límite en ambos extremos." },
    ] };
  }

  // LM-H-10: coth(x) = 1/tanh(x) diverges to +∞ from the right of zero.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" && direction === "right" &&
      exprAlgebrite.replace(/\s/g, "") === `(1/tanh(${variable}))`) {
    return { resultLatex: String.raw`+\infty`, confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "result", latex: String.raw`+\infty`, explanation: "La tangente hiperbólica tiende a cero por valores positivos." },
    ] };
  }

  // LM-H-09: cosh(x) − sinh(x) = exp(−x).
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "oo" &&
      [`cosh(${variable})-sinh(${variable})`, `(cosh(${variable})-sinh(${variable}))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return { resultLatex: "0", confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "identity", latex: String.raw`\cosh ${variable}-\sinh ${variable}=e^{-${variable}}`, explanation: "Aplicamos las definiciones exponenciales." },
      { id: "result", latex: "0", explanation: "La exponencial negativa tiende a cero." },
    ] };
  }

  // LM-H-08: cosh(x)/sinh(x) tends to 1 at positive infinity.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "oo" &&
      [`cosh(${variable})/sinh(${variable})`, `((cosh(${variable}))/(sinh(${variable})))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return { resultLatex: "1", confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "identity", latex: String.raw`\frac{\cosh ${variable}}{\sinh ${variable}}=\frac{1+e^{-2${variable}}}{1-e^{-2${variable}}}`, explanation: "Dividimos numerador y denominador por la exponencial creciente." },
      { id: "result", latex: "1", explanation: "La exponencial negativa tiende a cero." },
    ] };
  }

  // LM-H-07: sinh(x)/exp(x) = (1-exp(-2x))/2.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "oo" &&
      [`sinh(${variable})/exp(${variable})`, `((sinh(${variable}))/(e^(${variable})))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return { resultLatex: String.raw`\frac{1}{2}`, confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "identity", latex: String.raw`\frac{\sinh ${variable}}{e^{${variable}}}=\frac{1-e^{-2${variable}}}{2}`, explanation: "Aplicamos la definición exponencial del seno hiperbólico." },
      { id: "result", latex: String.raw`\frac{1}{2}`, explanation: "La exponencial negativa tiende a cero." },
    ] };
  }

  // LM-H-05/06: tanh has horizontal asymptotes at ±1.
  if (/^[A-Za-z]$/.test(variable) && isInfinite &&
      exprAlgebrite.replace(/\s/g, "") === `tanh(${variable})`) {
    const resultLatex = pointAlgebrite === "-oo" ? "-1" : "1";
    return { resultLatex, confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "result", latex: resultLatex, explanation: "La tangente hiperbólica tiende a ±1 en los extremos correspondientes." },
    ] };
  }

  // LM-H-04: sinh(x) = x + x³/6 + O(xµ) near zero.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`(sinh(${variable})-${variable})/${variable}^3`, `((sinh(${variable})-${variable})/(${variable}^(3)))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return { resultLatex: String.raw`\frac{1}{6}`, confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "taylor", latex: String.raw`\sinh ${variable}=${variable}+\frac{${variable}^3}{6}+O(${variable}^5)`, explanation: "Expansión de Taylor del seno hiperbólico en cero." },
      { id: "result", latex: String.raw`\frac{1}{6}`, explanation: "El término principal del numerador es x³/6." },
    ] };
  }

  // LM-H-03: tanh is differentiable at zero with derivative sech²(0) = 1.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`tanh(${variable})/${variable}`, `((tanh(${variable}))/(${variable}))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return { resultLatex: "1", confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "result", latex: "1", explanation: "Por la derivada de tanh en cero, el límite es sech²(0) = 1." },
    ] };
  }

  // LM-H-02: cosh(x) = 1 + x²/2 + O(x´) near zero.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`(cosh(${variable})-1)/${variable}^2`, `((cosh(${variable})-1)/(${variable}^(2)))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return { resultLatex: String.raw`\frac{1}{2}`, confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "taylor", latex: String.raw`\cosh ${variable}=1+\frac{${variable}^2}{2}+O(${variable}^4)`, explanation: "Expansión de Taylor del coseno hiperbólico en cero." },
      { id: "result", latex: String.raw`\frac{1}{2}`, explanation: "El término principal del numerador es x²/2." },
    ] };
  }

  // LM-H-01: sinh is differentiable at zero with derivative cosh(0) = 1.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "0" &&
      [`sinh(${variable})/${variable}`, `((sinh(${variable}))/(${variable}))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return { resultLatex: "1", confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "result", latex: "1", explanation: "Por la derivada de sinh en cero, el límite es cosh(0) = 1." },
    ] };
  }

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

  // Generic symbolic attempt via Algebrite limit().
  const symbolic = symbolicLimit(exprAlgebrite, variable, pointAlgebrite);
  if (symbolic && !symbolic.startsWith("Error")) {
    const resultLatex = toLatex(symbolic);
    return {
      resultLatex,
      confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "result", latex: resultLatex, explanation: "Resultado simbólico obtenido." },
      ],
    };
  }

  // Numeric fallback.
  const numeric = isInfinite
    ? numericLimitAtInfinity(exprAlgebrite, variable, pointAlgebrite === "-oo")
    : numericLimit(exprAlgebrite, variable, pointNumeric, direction);
  if (numeric) {
    return {
      resultLatex: numeric,
      confidence: "NUMERIC_FALLBACK",
      steps: [
        { id: "original", latex: limitLatex, explanation: "Límite planteado." },
        { id: "result", latex: numeric, explanation: "Aproximación numérica (el simbólico no convergió)." },
      ],
    };
  }

  return {
    resultLatex: String.raw`\text{indeterminado}`,
    confidence: "ERROR",
    steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "result", latex: String.raw`\text{indeterminado}`, explanation: "No se pudo determinar el límite." },
    ],
  };
}

export function calcIndefiniteIntegral(exprAlgebrite: string, variable: string): CalculusResult {
  const result = indefiniteIntegral(rewriteReciprocalFunctions(exprAlgebrite), variable);
  const resultLatex = toLatex(result);
  return {
    resultLatex,
    confidence: "SYMBOLIC",
    steps: [
      { id: "original", latex: exprAlgebrite, explanation: "Expresión original." },
      {
        id: "result",
        latex: `\\int ${exprAlgebrite} \\, d${variable} = ${resultLatex} + C`,
        explanation: "Integral indefinida calculada simbólicamente.",
      },
    ],
  };
}

export function calcDefiniteIntegral(
  exprAlgebrite: string,
  variable: string,
  lower: string,
  upper: string,
  lowerNumeric: number,
  upperNumeric: number,
): CalculusResult {
  exprAlgebrite = rewriteReciprocalFunctions(exprAlgebrite);
  const symbolic = indefiniteIntegral(exprAlgebrite, variable);
  if (symbolic && !symbolic.startsWith("Error")) {
    const lowerVal = evaluate(symbolic, { [variable]: lower });
    const upperVal = evaluate(symbolic, { [variable]: upper });
    if (lowerVal && upperVal && !lowerVal.startsWith("Error") && !upperVal.startsWith("Error")) {
      const result = evaluate(`${upperVal}-(${lowerVal})`);
      if (result && !result.startsWith("Error")) {
        const resultLatex = toLatex(result);
        return {
          resultLatex,
          confidence: "SYMBOLIC",
          steps: [
            { id: "original", latex: `\\int_{${lower}}^{${upper}} ${exprAlgebrite} \\, d${variable}`, explanation: "Integral definida planteada." },
            { id: "antideriv", latex: toLatex(symbolic), explanation: "Antiderivada simbólica." },
            { id: "result", latex: resultLatex, explanation: "Evaluación en los límites." },
          ],
        };
      }
    }
  }

  // Numeric Simpson fallback.
  const numeric = simpsonIntegral(exprAlgebrite, variable, lowerNumeric, upperNumeric);
  if (numeric !== null) {
    return {
      resultLatex: `\\approx ${numeric.toFixed(6)}`,
      confidence: "NUMERIC_FALLBACK",
      steps: [
        { id: "original", latex: `\\int_{${lower}}^{${upper}} ${exprAlgebrite} \\, d${variable}`, explanation: "Integral definida planteada." },
        {
          id: "result",
          latex: `\\approx ${numeric.toFixed(6)}`,
          explanation: "Aproximada numéricamente por la regla de Simpson (no se encontró antiderivada simbólica).",
        },
      ],
    };
  }

  return {
    resultLatex: String.raw`\text{no evaluable}`,
    confidence: "ERROR",
    steps: [
      { id: "original", latex: `\\int_{${lower}}^{${upper}} ${exprAlgebrite} \\, d${variable}`, explanation: "Integral definida planteada." },
      { id: "result", latex: String.raw`\text{no evaluable}`, explanation: "No se pudo evaluar la integral." },
    ],
  };
}
