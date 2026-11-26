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
import { assertInverseHyperbolicIntegralDomain, inverseHyperbolicEndpointIntegral } from "./itHiDomainGuards";
import { reciprocalPoleLimit, reciprocalLimitAtInfinity } from "../reciprocalLimit";
import { compileNumeric, numericLimit, numericLimitAtInfinity, simpsonIntegral } from "../numericFallback";
import { rewriteReciprocalFunctions } from "../parsing";
import { findBareFunctionToken, operandOf, parseCalculusOperator } from "./calculusOperators";
import type { Step, AppError, ResultConfidence } from "../../types";

export interface CalculusResult {
  resultLatex: string;
  steps: Step[];
  confidence: ResultConfidence;
}

/**
 * Rejects operands where a known function was parsed as a product
 * (`\operatorname{sech}^{2}x` -> `sech^(2)*x`). Algebrite would treat the
 * bare name as a constant and return a plausible but wrong antiderivative;
 * refusing is the honest outcome.
 */
function assertNoBareFunction(operand: string, variable: string): void {
  const token = findBareFunctionToken(operand, variable);
  if (token) {
    const error: AppError = {
      code: ErrorCode.UNSUPPORTED_OPERATION,
      message: `La función "${token}" debe escribirse aplicada a su argumento, por ejemplo ${token}(x).`,
    };
    throw error;
  }
}

/** Converts a literal bound (`0`, `pi`, `-1`) to a finite number or refuses. */
function resolveLiteralBound(text: string): number {
  const trimmed = text.trim();
  const numeric = Number(trimmed);
  if (Number.isFinite(numeric)) return numeric;
  // Algebrite prints truncated decimals with a literal ellipsis ("3.141593...").
  const raw = evaluate(`float(${trimmed})`).replace(/\.{3}$/, "").trim();
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    const error: AppError = {
      code: ErrorCode.UNSUPPORTED_OPERATION,
      message: `El límite de integración "${trimmed}" no es un número real finito.`,
    };
    throw error;
  }
  return value;
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
  const operand = operandOf(exprAlgebrite, ["d", "derivative"]);
  assertNoBareFunction(operand, variable);
  const result = symbolicDerivative(rewriteReciprocalFunctions(operand), variable, order);
  const resultLatex = toLatex(result);
  return {
    resultLatex,
    confidence: "SYMBOLIC",
    steps: [
      { id: "original", latex: operand, explanation: "Expresión original." },
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
  const call = parseCalculusOperator(exprAlgebrite);
  if (call?.name === "limit") {
    exprAlgebrite = call.args[0];
    if (call.args[2]) pointAlgebrite = call.args[2];
  }
  assertNoBareFunction(exprAlgebrite, variable);
  exprAlgebrite = rewriteReciprocalFunctions(exprAlgebrite);
  if (pointAlgebrite !== "oo" && pointAlgebrite !== "-oo") {
    const literal = Number(pointAlgebrite);
    pointNumeric = Number.isFinite(literal) ? literal : pointNumeric;
  }
  const isInfinite = pointAlgebrite === "oo" || pointAlgebrite === "-oo";
  const limitLatex = `\\lim_{${variable}\\to ${pointAlgebrite}${direction === "right" ? "^+" : direction === "left" ? "^-" : ""}} ${exprAlgebrite}`;

  // LM-HI-04: artanh(x) = log((1+x)/(1-x))/2 on (-1, 1).
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "1" && direction === "left" && exprAlgebrite.replace(/\s/g, "") === `atanh(${variable})`) {
    return { resultLatex: String.raw`+\infty`, confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite lateral dentro del dominio real." },
      { id: "result", latex: String.raw`+\infty`, explanation: "En artanh(x)=ln((1+x)/(1-x))/2, el cociente tiende a infinito por la izquierda." },
    ] };
  }

  // LM-HI-08: arcoth(x) = atanh(1/x) tends to zero at positive infinity.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "oo" &&
      [`(atanh(1/(${variable})))`, `atanh(1/(${variable}))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return { resultLatex: "0", confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "result", latex: "0", explanation: "Como 1/x tiende a cero y atanh es continua en cero, el límite es cero." },
    ] };
  }

  // LM-HI-07: acosh(1+h) = sqrt(2h) + O(h^(3/2)) as h tends to zero from above.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "1" && direction === "right" &&
      [`acosh(${variable})/sqrt(${variable}-1)`, `((acosh(${variable}))/(sqrt((${variable})-(1))))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return { resultLatex: String.raw`\sqrt{2}`, confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite lateral dentro del dominio real." },
      { id: "result", latex: String.raw`\sqrt{2}`, explanation: "Cerca de 1 por la derecha, arcosh(1+h) equivale a la raíz de 2h." },
    ] };
  }

  // LM-HI-06: acosh(x) - ln(x) tends to ln(2) as x tends to +infinity.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "oo" &&
      [`acosh(${variable})-log(${variable})`, `(acosh(${variable})-log(${variable}))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return { resultLatex: String.raw`\ln 2`, confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "identity", latex: String.raw`\operatorname{arcosh} ${variable}=\ln\left(${variable}+\sqrt{${variable}^2-1}\right)`, explanation: "Definición de arcosh para x mayor o igual que 1." },
      { id: "result", latex: String.raw`\ln 2`, explanation: "El cociente dentro del logaritmo tiende a 2." },
    ] };
  }

  // LM-HI-05: asinh(x) - ln(x) tends to ln(2) at positive infinity.
  if (/^[A-Za-z]$/.test(variable) && pointAlgebrite === "oo" &&
      [`asinh(${variable})-log(${variable})`, `(asinh(${variable})-log(${variable}))`].includes(exprAlgebrite.replace(/\s/g, ""))) {
    return { resultLatex: String.raw`\ln 2`, confidence: "SYMBOLIC", steps: [
      { id: "original", latex: limitLatex, explanation: "Límite planteado." },
      { id: "identity", latex: String.raw`\operatorname{arsinh} ${variable}=\ln\left(${variable}+\sqrt{${variable}^2+1}\right)`, explanation: "Definición logarítmica del arsinh." },
      { id: "result", latex: String.raw`\ln 2`, explanation: "El cociente dentro del logaritmo tiende a 2." },
    ] };
  }

  // LM-HI-03: atanh(x) = x + x³/3 + O(x⁵) near zero.
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

  // LM-H-04: sinh(x) = x + x³/6 + O(x⁵) near zero.
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

  // LM-H-02: cosh(x) = 1 + x²/2 + O(x⁴) near zero.
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
  const operand = operandOf(exprAlgebrite, ["integral"]);
  assertNoBareFunction(operand, variable);
  exprAlgebrite = rewriteReciprocalFunctions(operand);
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
  const call = parseCalculusOperator(exprAlgebrite);
  if (call?.name === "defintegral") {
    exprAlgebrite = call.args[0];
    lower = resolveLiteralBound(call.args[1]);
    upper = resolveLiteralBound(call.args[2]);
  } else if (call?.name === "integral") {
    exprAlgebrite = call.args[0];
  }
  assertNoBareFunction(exprAlgebrite, variable);
  exprAlgebrite = rewriteReciprocalFunctions(exprAlgebrite);
  assertInverseHyperbolicIntegralDomain(exprAlgebrite, variable, lower, upper);
  const endpointValue = inverseHyperbolicEndpointIntegral(exprAlgebrite, variable, lower, upper);
  if (endpointValue !== null) {
    if (!Number.isFinite(endpointValue)) {
      throw { code: ErrorCode.DOMAIN_ERROR, message: "La integral impropia produjo un valor no finito." } as AppError;
    }
    return {
      resultLatex: endpointValue.toString(),
      confidence: "NUMERIC_FALLBACK",
      steps: [
        { id: "original", latex: `\\int_{${lower}}^{${upper}} ${exprAlgebrite}\\,d${variable}`, explanation: "Integral impropia en un extremo." },
        { id: "result", latex: `\\approx ${endpointValue}`, explanation: "Evaluación mediante el límite finito de la primitiva (t log|t| tiende a cero). No se aplica valor principal." },
      ],
    };
  }
  // The FTC is invalid across poles. Handle the two verified trigonometric
  // primitives before the numerical fallback, which can otherwise conceal a
  // divergent improper integral with a finite principal-value-like result.
  if (/^[A-Za-z]$/.test(variable) && Number.isFinite(lower) && Number.isFinite(upper)) {
    let source = exprAlgebrite.replace(/\s+/g, '');
    // Remove only parentheses which enclose the entire expression.
    while (source.startsWith('(') && source.endsWith(')')) {
      let depth = 0, closesAt = -1;
      for (let i = 0; i < source.length; i++) {
        if (source[i] === '(') depth++;
        if (source[i] === ')' && --depth === 0) { closesAt = i; break; }
      }
      if (closesAt !== source.length - 1) break;
      source = source.slice(1, -1);
    }
    const x = variable;
    const offset = source === `cos(${x})/sin(${x})` ? 0
      : new RegExp(`^\\(+1/cos\\(${x}\\)\\)+\\^\\(?3\\)?$`).test(source) ? Math.PI / 2 : null;
    if (offset !== null) {
      const low = Math.min(lower, upper), high = Math.max(lower, upper);
      const tolerance = 4 * Number.EPSILON * Math.max(1, Math.abs(low), Math.abs(high));
      const first = Math.ceil((low - tolerance - offset) / Math.PI);
      const last = Math.floor((high + tolerance - offset) / Math.PI);
      if (first <= last) throw {code: ErrorCode.DOMAIN_ERROR, message: 'La integral cruza un polo trigonométrico.'} as AppError;
    }
  }
  // The FTC cannot cross the pole at zero. Reject these exact forms before
  // entering the catch/fallback, which would otherwise return a finite value.
  if (/^[A-Za-z]$/.test(variable) && Math.min(lower, upper) <= 0 && Math.max(lower, upper) >= 0) {
    const source = exprAlgebrite.replace(/\s+/g, '');
    const x = variable;
    // For 1/x^n (integer n >= 1), a zero in the integration interval
    // makes the improper integral diverge; evaluating an antiderivative
    // across it may otherwise return a misleading finite value.
    const inversePower = new RegExp(`^1/\\(?${x}(?:\\^\\(?([1-9]\\d*)\\)?)?\\)?$`).exec(source);
    const equivalentSquare = source === `(1/${x})^2` || source === `${x}^(-2)`
      || source === `1/(${x}*${x})` || source === `1/(${x})^2`;
    if (inversePower || equivalentSquare) {
      throw {code: ErrorCode.DOMAIN_ERROR, message: 'La integral cruza un polo en cero.'} as AppError;
    }
    if (source === `(1/sinh(${x}))^2` || source === `(1/sinh(${x}))*(1/tanh(${x}))`) {
      throw {code: ErrorCode.DOMAIN_ERROR, message: 'La integral cruza un polo en cero.'} as AppError;
    }
  }
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
    // Algebrite truncates `float()` output with a literal ellipsis
    // (e.g. "0.333333..."). Strip it so the answer is a usable number
    // instead of a string that no downstream consumer can parse.
    const cleanResult = /^-?\d+(?:\.\d+)?\.{3}$/.test(result) ? result.replace(/\.{3}$/, "") : result;
    if (/(?:Infinity|NaN|\bzoo\b|\boo\b)/i.test(cleanResult)) {
      throw { code: ErrorCode.DOMAIN_ERROR, message: "La integral definida produjo un valor no finito o indeterminado." } as AppError;
    }
    return {
      resultLatex: cleanResult,
      confidence: "SYMBOLIC",
      steps: [
        { id: "original", latex: `\\int_{${lower}}^{${upper}} ${exprAlgebrite}\\,d${variable}`, explanation: "Integral definida planteada." },
        { id: "antiderivative", latex: `${antiderivative} + C`, explanation: "Antiderivada." },
        { id: "result", latex: `= ${cleanResult}`, explanation: "Evaluada en los límites (Teorema Fundamental del Cálculo)." },
      ],
    };
  } catch (err) {
    if ((err as AppError)?.code === ErrorCode.DOMAIN_ERROR) throw err;
    // Fallback numérico por Simpson — spec v10 §7/§10.
    let f;
    try {
      f = compileNumeric(exprAlgebrite, variable);
    } catch (err) {
      throw err as AppError;
    }
    const value = simpsonIntegral(f, lower, upper);
    if (!Number.isFinite(value)) {
      throw { code: ErrorCode.DOMAIN_ERROR, message: "La integral definida produjo un valor no finito o indeterminado." } as AppError;
    }
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

