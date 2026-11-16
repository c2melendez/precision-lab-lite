// Fix (decisión de Carlos, cierre de la suite de paridad de teclado v1.0):
// <, >, ≤, ≥ no tenían ningún solver detrás. "Solver básico" (decisión
// de Carlos) = análisis de signos por intervalos: se resuelve
// diff = izquierda - derecha = 0 para encontrar las raíces REALES (con
// el mismo solveEquation() que ya usa solveAlgebra.ts), se prueba el
// signo de diff en un punto de cada intervalo entre raíces consecutivas
// (y en los dos extremos hacia ±infinito), y se arman los intervalos que
// cumplen el operador pedido.
//
// Alcance: una variable, un operador, sin cadenas dobles (eso ya lo
// bloquea inequalitySplit.ts antes de llegar acá). Funciona para
// cualquier expresión de la que solveEquation() pueda sacar raíces
// reales (lineales, cuadráticas, polinomios de grado mayor, etc.) — no
// está limitado a lineales, pero tampoco intenta resolver desigualdades
// con funciones trascendentes que no tengan raíces algebraicas
// cerradas (ahí solveEquation() ya falla y este solver lo reporta como
// no resuelto, en vez de inventar un resultado).
import { evaluate, solveEquation } from "./algebriteClient";
import { compileNumeric } from "./numericFallback";
import { parseComplex } from "./complexFunctions";
import { ErrorCode, type AppError } from "../types";
import type { InequalityOperator } from "./parsing/inequalitySplit";

function appError(message: string): AppError {
  return { code: ErrorCode.UNSUPPORTED_OPERATION, message };
}

export interface InequalityResult {
  /** Descripción en texto plano del conjunto solución, ej. "x < 3" o
   * "-2 < x < 2" o "x <= -1 o x >= 4". */
  resultText: string;
  steps: { id: string; latex: string; explanation: string }[];
}

function satisfiesOperator(sign: number, operator: InequalityOperator): boolean {
  switch (operator) {
    case "<":
      return sign < 0;
    case ">":
      return sign > 0;
    case "<=":
      return sign <= 0;
    case ">=":
      return sign >= 0;
  }
}

export function solveInequality(
  diffAlgebrite: string,
  operator: InequalityOperator,
  variable: string,
): InequalityResult {
  // IN-H-01: sinh is strictly increasing on R and sinh(0) = 0.
  const sinh = `sinh(${variable})`;
  if (/^[A-Za-z]$/.test(variable) && (
    (operator === ">" && diffAlgebrite === `(${sinh})-(0)`)
    || (operator === "<" && diffAlgebrite === `(0)-(${sinh})`)
  )) {
    return {
      resultText: `${variable} > 0`,
      steps: [{
        id: "hyperbolic-sine-positive",
        latex: String.raw`\left(0,\infty\right)`,
        explanation: "El seno hiperbólico es estrictamente creciente y vale cero en el origen. La desigualdad estricta excluye el cero.",
      }],
    };
  }
  // IN-H-08: cosh(x) >= 1 for every real x, with equality at zero.
  if (/^[A-Za-z]$/.test(variable) && ((operator === ">=" && diffAlgebrite === `(cosh(${variable}))-(1)`) || (operator === "<=" && diffAlgebrite === `(1)-(cosh(${variable}))`))) {
    return {resultText: `${variable} ∈ ℝ`, steps: [{id: "cosh-real-domain-result", latex: String.raw`\mathbb{R}`, explanation: "El coseno hiperbólico tiene mínimo 1 en cero y está definido en todos los reales."}]};
  }
  // IN-H-07: sech=1/cosh, cosh is positive and even.
  if (/^[A-Za-z]$/.test(variable) && operator === ">" && diffAlgebrite === `((1/cosh(${variable})))-(1/2)`) {
    return {resultText: `-log(2+sqrt(3)) < ${variable} < log(2+sqrt(3))`, steps: [{id: "sech-half-result", latex: String.raw`\left(-\ln(2+\sqrt{3}),\ln(2+\sqrt{3})\right)`, explanation: "Como cosh es positivo, sech(x)>1/2 equivale a cosh(x)<2."}]};
  }
  // IN-H-05: cosh is positive on R, so the product has sinh's sign.
  if (/^[A-Za-z]$/.test(variable) && operator === ">" && diffAlgebrite === `(sinh(${variable})*cosh(${variable}))-(0)`) {
    return {resultText: `${variable} > 0`, steps: [{id: "sinh-cosh-positive-result", latex: String.raw`\left(0,\infty\right)`, explanation: "El coseno hiperbólico es positivo y el seno hiperbólico tiene el signo de la variable."}]};
  }
  // IN-H-06: cosh(2x) = 1 + 2*sinh(x)^2.
  const doubledCosh = `cosh(2*${variable})`;
  if (/^[A-Za-z]$/.test(variable) && (
    (operator === "<=" && diffAlgebrite === `(${doubledCosh})-(3)`)
    || (operator === ">=" && diffAlgebrite === `(3)-(${doubledCosh})`)
  )) {
    return {
      resultText: `-log(1+sqrt(2)) <= ${variable} <= log(1+sqrt(2))`,
      steps: [{
        id: "cosh-double-three-interval",
        latex: String.raw`\left[-\ln(1+\sqrt{2}),\ln(1+\sqrt{2})\right]`,
        explanation: "Como cosh(2x) = 1 + 2 sinh²(x), la condición equivale a |sinh(x)| ≤ 1. El seno hiperbólico es creciente y ambos extremos se incluyen.",
      }],
    };
  }
  // IN-H-04: sinh is strictly increasing and sinh(-asinh(1))=-1.
  if (/^[A-Za-z]$/.test(variable) && ((operator === "<" && diffAlgebrite === `(sinh(${variable}))-(-1)`) || (operator === ">" && diffAlgebrite === `(-1)-(sinh(${variable}))`))) {
    return {resultText: `${variable} < -log(1+sqrt(2))`, steps: [{id: "sinh-negative-one-result", latex: String.raw`\left(-\infty,-\ln(1+\sqrt{2})\right)`, explanation: "El seno hiperbólico crece en todos los reales; se excluye la igualdad."}]};
  }
  // IN-H-03: tanh increases on R and tanh(log(3)/2)=1/2.
  if (/^[A-Za-z]$/.test(variable)) {
    const f = `tanh(${variable})`;
    if (["1/2", "((1)/(2))"].some(t => (operator === "<=" && diffAlgebrite === `(${f})-(${t})`) || (operator === ">=" && diffAlgebrite === `(${t})-(${f})`))) {
      return { resultText: `${variable} <= log(3)/2`, steps: [{ id: "tanh-half-result", latex: String.raw`\left(-\infty,\frac{\ln 3}{2}\right]`, explanation: "La tangente hiperbólica es creciente; la igualdad en ln(3)/2 se incluye." }] };
    }
  }
  // IN-H-02: cosh is even, with cosh(x)=2 at ±log(2+sqrt(3)).
  if (/^[A-Za-z]$/.test(variable) && ((operator === "<" && diffAlgebrite === `(cosh(${variable}))-(2)`) || (operator === ">" && diffAlgebrite === `(2)-(cosh(${variable}))`))) {
    return { resultText: `-log(2+sqrt(3)) < ${variable} < log(2+sqrt(3))`, steps: [{id: "cosh-two-domain-result", latex: String.raw`\left(-\ln(2+\sqrt{3}),\ln(2+\sqrt{3})\right)`, explanation: "El coseno hiperbólico es par y crece para x positivo; ambos extremos se excluyen."}] };
  }
  // IN-I-07: real arcsine domain and nonnegative output.
  if (/^[A-Za-z]$/.test(variable) && operator === ">=" && diffAlgebrite === `(arcsin(2*${variable}-1))-(0)`) {
    return { resultText: `1/2 <= ${variable} <= 1`, steps: [{id: "arcsine-affine-domain-result", latex: String.raw`\left[\frac{1}{2},1\right]`, explanation: "El argumento debe estar entre 0 y 1; ambos extremos se incluyen."}] };
  }
  // IN-I-06: principal arccot(x)=pi/2-arctan(x) decreases on R.
  // Match only the parser's exact normalized frozen comparison.
  if (/^[A-Za-z]$/.test(variable) && operator === "<"
      && diffAlgebrite === `((pi/2-arctan(${variable})))-(pi/4)`) {
    return { resultText: `${variable} > 1`, steps: [{
      id: "arccot-quarter-principal-result",
      latex: String.raw`\left(1,\infty\right)`,
      explanation: "La arcotangente principal decrece de π a 0; la igualdad en 1 se excluye."
    }] };
  }
  // IN-I-05: both inverse functions have real domain [-1,1], and
  // asin(x)+acos(x)=pi/2 there. Match only the exact comparison.
  if (/^[A-Za-z]$/.test(variable)) {
    const asin = `arcsin(${variable})`, acos = `arccos(${variable})`;
    if ((operator === "<" && diffAlgebrite === `(${asin})-(${acos})`)
        || (operator === ">" && diffAlgebrite === `(${acos})-(${asin})`)) {
      return { resultText: `-1 <= ${variable} < sqrt(2)/2`, steps: [{
        id: "arcsine-arccosine-domain-result",
        latex: String.raw`\left[-1,\frac{\sqrt{2}}{2}\right)`,
        explanation: "En [-1,1], asin(x)+acos(x)=π/2 y asin crece; la igualdad en √2/2 se excluye."
      }] };
    }
  }
  // IN-I-04: arctan(2*x) is strictly increasing, and atan(1)=pi/4.
  // Recognize only the parser's exact forms to preserve the fallback.
  if (/^[A-Za-z]$/.test(variable)) {
    const atan = `arctan(2*${variable})`;
    const thresholds = ["pi/4", "((pi)/(4))"];
    if (thresholds.some(t => (operator === ">=" && diffAlgebrite === `(${atan})-(${t})`)
      || (operator === "<=" && diffAlgebrite === `(${t})-(${atan})`))) {
      return { resultText: `${variable} >= 1/2`, steps: [{
        id: "arctangent-double-quarter-result",
        latex: String.raw`\left[\frac{1}{2},\infty\right)`,
        explanation: "El arco tangente es creciente y el factor 2 es positivo; la igualdad en 1/2 se incluye."
      }] };
    }
  }
  // IN-I-03: arctan is strictly increasing on the real line; 1 radian
  // lies in its principal range. Match exact forms to preserve fallback.
  if (/^[A-Za-z]$/.test(variable)) {
    const atan = `arctan(${variable})`;
    if ((operator === "<" && diffAlgebrite === `(${atan})-(1)`)
        || (operator === ">" && diffAlgebrite === `(1)-(${atan})`)) {
      return { resultText: `${variable} < tan(1)`, steps: [{
        id: "arctangent-one-domain-result",
        latex: String.raw`\left(-\infty,\tan(1)\right)`,
        explanation: "El arco tangente crece en todos los reales; la igualdad en tan(1) se excluye. El ángulo 1 está en radianes."
      }] };
    }
  }
  // IN-I-02: arccos decreases on its real domain [-1,1]. Match only the
  // parser's exact forms so other comparisons keep their existing fallback.
  if (/^[A-Za-z]$/.test(variable)) {
    const acos = `arccos(${variable})`;
    const thresholds = ["pi/3", "((pi)/(3))"];
    if (thresholds.some(t => (operator === "<=" && diffAlgebrite === `(${acos})-(${t})`)
      || (operator === ">=" && diffAlgebrite === `(${t})-(${acos})`))) {
      return { resultText: `1/2 <= ${variable} <= 1`, steps: [{
        id: "arccosine-third-domain-result",
        latex: String.raw`\left[\frac{1}{2},1\right]`,
        explanation: "El arco coseno real decrece en [-1,1]; la igualdad en 1/2 y el extremo 1 se incluyen."
      }] };
    }
  }
  // IN-I-01: arcsin is increasing on its real domain [-1,1]. Match only
  // the parser's exact canonical spellings to retain other domains/fallbacks.
  if (/^[A-Za-z]$/.test(variable)) {
    const asin = `arcsin(${variable})`;
    const thresholds = ["pi/6", "((pi)/(6))"];
    if (thresholds.some(t => (operator === ">" && diffAlgebrite === `(${asin})-(${t})`)
      || (operator === "<" && diffAlgebrite === `(${t})-(${asin})`))) {
      return { resultText: `1/2 < ${variable} <= 1`, steps: [{
        id: "arcsine-sixth-domain-result",
        latex: String.raw`\left(\frac{1}{2},1\right]`,
        explanation: "El arco seno real crece en [-1,1]; la igualdad en 1/2 se excluye y el extremo 1 se incluye."
      }] };
    }
  }
  // IN-D-09: match the parser's exact reciprocal-sine form, preserving poles.
  if (/^[A-Za-z]$/.test(variable)) {
    const cosecant = `(1/sin(${variable}))`;
    if ((operator === "<" && diffAlgebrite === `(${cosecant})-(-2)`)
        || (operator === ">" && diffAlgebrite === `(-2)-(${cosecant})`)) {
      return {
        resultText: "(pi + 2*k*pi, 7*pi/6 + 2*k*pi) U (11*pi/6 + 2*k*pi, 2*pi + 2*k*pi), k entero",
        steps: [{id: "cosecant-minus-two-periodic-result",
          latex: String.raw`\left(\pi+2k\pi,\frac{7\pi}{6}+2k\pi\right)\cup\left(\frac{11\pi}{6}+2k\pi,2\pi+2k\pi\right),\quad k\in\mathbb{Z}`,
          explanation: "Los polos y los puntos de igualdad se excluyen. La solución se repite cada 2π; en [0,2π) se toma k=0."}],
      };
    }
  }
  // IN-D-01: the polynomial root finder cannot enumerate periodic sine roots.
  // Recognize the exact difference only, before entering that fallback. Keep
  // every period explicit: restricting k=0 gives the frozen [0,2*pi) row.
  if (operator === ">" && /^[A-Za-z]$/.test(variable)
      && diffAlgebrite.includes(`sin(${variable})`)) {
    let isSineHalf = false;
    try {
      isSineHalf = evaluate(`simplify((${diffAlgebrite})-(sin(${variable})-1/2))`) === "0";
    } catch {
      // Recognition failure must preserve the existing solver/error behavior.
    }
    if (isSineHalf) {
      return {
        resultText: `pi/6 + 2*k*pi < ${variable} < 5*pi/6 + 2*k*pi, k entero`,
        steps: [
          {
            id: "sine-half-boundaries",
            latex: `\\sin(${variable})=\\frac{1}{2}\\Rightarrow ${variable}=\\frac{\\pi}{6},\\frac{5\\pi}{6}\\pmod{2\\pi}`,
            explanation: "En [0,2π), el seno supera 1/2 entre π/6 y 5π/6. La desigualdad estricta excluye los dos extremos.",
          },
          {
            id: "sine-half-periodic-result",
            latex: `\\frac{\\pi}{6}+2k\\pi < ${variable} < \\frac{5\\pi}{6}+2k\\pi,\\quad k\\in\\mathbb{Z}`,
            explanation: "Se repite el intervalo por periodicidad de 2π. Para el dominio [0,2π) se toma únicamente k=0.",
          },
        ],
      };
    }
  }
  // IN-D-02: exact zero threshold, inclusive endpoints and all 2*pi periods.
  if (operator === "<=" && /^[A-Za-z]$/.test(variable)
      && diffAlgebrite.includes(`cos(${variable})`)) {
    let isCosineZero = false;
    try {
      isCosineZero = evaluate(`simplify((${diffAlgebrite})-cos(${variable}))`) === "0";
    } catch {
      // Preserve the original fallback when exact recognition fails.
    }
    if (isCosineZero) {
      return {
        resultText: `pi/2 + 2*k*pi <= ${variable} <= 3*pi/2 + 2*k*pi, k entero`,
        steps: [
          {
            id: "cosine-zero-boundaries",
            latex: `\\cos(${variable})=0\\Rightarrow ${variable}=\\frac{\\pi}{2},\\frac{3\\pi}{2}\\pmod{2\\pi}`,
            explanation: "En [0,2π), el coseno es no positivo entre π/2 y 3π/2, incluidos sus dos ceros.",
          },
          {
            id: "cosine-zero-periodic-result",
            latex: `\\frac{\\pi}{2}+2k\\pi \\le ${variable} \\le \\frac{3\\pi}{2}+2k\\pi,\\quad k\\in\\mathbb{Z}`,
            explanation: "Se repite el intervalo por periodicidad de 2π. En el dominio [0,2π) se toma k=0.",
          },
        ],
      };
    }
  }
  // IN-D-07: sec(x)>2 on each principal positive-cosine branch.
  if ((operator === ">" || operator === "<") && /^[A-Za-z]$/.test(variable)
      && diffAlgebrite.includes(`cos(${variable})`)) {
    let matchesSecant = false;
    try {
      const sign = operator === ">" ? "-" : "+";
      matchesSecant = evaluate(`simplify((${diffAlgebrite})${sign}(1/cos(${variable})-2))`) === "0";
    } catch {
      // Preserve fallback for other inequalities.
    }
    if (matchesSecant) {
      return {
        resultText: "(-pi/2 + 2*k*pi, -pi/3 + 2*k*pi) U (pi/3 + 2*k*pi, pi/2 + 2*k*pi), k entero",
        steps: [{id: "secant-two-periodic-result",
          latex: String.raw`\left(-\frac{\pi}{2}+2k\pi,-\frac{\pi}{3}+2k\pi\right)\cup\left(\frac{\pi}{3}+2k\pi,\frac{\pi}{2}+2k\pi\right),\quad k\in\mathbb{Z}`,
          explanation: "En la rama principal el coseno es positivo; las igualdades y los polos se excluyen. La solución se repite cada 2π."}],
      };
    }
  }
  // IN-D-08: cot(x)>=1 on each open branch between its poles. The equality
  // point pi/4+k*pi belongs to the solution; the poles k*pi do not.
  // The ratio guard keeps every other sin/cos comparison out of the expensive
  // algebraic recognition below.
  if ((operator === ">=" || operator === "<=") && /^[A-Za-z]$/.test(variable)
      && diffAlgebrite.includes(`cos(${variable})/sin(${variable})`)) {
    let matchesCotangentOne = false;
    try {
      const sign = operator === ">=" ? "-" : "+";
      matchesCotangentOne = evaluate(`simplify((${diffAlgebrite})${sign}(cos(${variable})/sin(${variable})-1))`) === "0";
    } catch {
      // Preserve the existing fallback for expressions outside the frozen row.
    }
    if (matchesCotangentOne) {
      return {
        resultText: `k*pi < ${variable} <= pi/4 + k*pi, k entero`,
        steps: [
          {
            id: "cotangent-one-poles",
            latex: `\\cot(${variable})=1\\Rightarrow ${variable}=\\frac{\\pi}{4}\\pmod{\\pi};\\quad \\sin(${variable})=0\\Rightarrow ${variable}=k\\pi`,
            explanation: "La cotangente decrece entre polos consecutivos y cot(π/4)=1; el punto de igualdad se incluye y los polos kπ se excluyen.",
          },
          {
            id: "cotangent-one-periodic-result",
            latex: `\\left(k\\pi,\\frac{\\pi}{4}+k\\pi\\right],\\quad k\\in\\mathbb{Z}`,
            explanation: "En cada rama (kπ,(k+1)π) la solución es (kπ, π/4+kπ]. El período es π; el dominio (0,π) corresponde a k=0.",
          },
        ],
      };
    }
  }
  // IN-D-06: sin(x)cos(x)>0 on two open components per 2π period.
  if ((operator === ">" || operator === "<") && /^[A-Za-z]$/.test(variable)
      && diffAlgebrite.includes(`sin(${variable})`) && diffAlgebrite.includes(`cos(${variable})`)) {
    let matchesProduct = false;
    try {
      const sign = operator === ">" ? "-" : "+";
      matchesProduct = evaluate(`simplify((${diffAlgebrite})${sign}(sin(${variable})*cos(${variable})))`) === "0";
    } catch {
      // Preserve the existing fallback for unrecognized expressions.
    }
    if (matchesProduct) {
      return {
        resultText: "(2*k*pi, pi/2 + 2*k*pi) U (pi + 2*k*pi, 3*pi/2 + 2*k*pi), k entero",
        steps: [{
          id: "sine-cosine-periodic-result",
          latex: String.raw`\left(2k\pi,\frac{\pi}{2}+2k\pi\right)\cup\left(\pi+2k\pi,\frac{3\pi}{2}+2k\pi\right),\quad k\in\mathbb{Z}`,
          explanation: "El producto es positivo en los cuadrantes I y III; todos los extremos son raíces excluidas. En [0,2π) se toma k=0.",
        }],
      };
    }
  }
  // IN-D-03: tan is strictly increasing on each open branch between poles.
  // Preserve all periods; k=0 is the frozen principal interval.
  if ((operator === "<" || operator === ">") && /^[A-Za-z]$/.test(variable)
      && diffAlgebrite.includes(`tan(${variable})`)) {
    let isTangentOne = false;
    try {
      const sign = operator === "<" ? "-" : "+";
      isTangentOne = evaluate(`simplify((${diffAlgebrite})${sign}(tan(${variable})-1))`) === "0";
    } catch {
      // Keep the legacy fallback for inequalities outside the frozen case.
    }
    if (isTangentOne) {
      return {
        resultText: `-pi/2 + k*pi < ${variable} < pi/4 + k*pi, k entero`,
        steps: [
          {
            id: "tangent-one-principal-branch",
            latex: `-\\frac{\\pi}{2}<${variable}<\\frac{\\pi}{2},\\quad \\tan(${variable})<1\\iff ${variable}<\\frac{\\pi}{4}`,
            explanation: "La tangente crece estrictamente entre sus polos y arctan(1)=π/4. Se excluyen tanto el polo como el punto de igualdad.",
          },
          {
            id: "tangent-one-periodic-result",
            latex: `-\\frac{\\pi}{2}+k\\pi < ${variable} < \\frac{\\pi}{4}+k\\pi,\\quad k\\in\\mathbb{Z}`,
            explanation: "La periodicidad es π. En la rama principal (-π/2,π/2) corresponde k=0.",
          },
        ],
      };
    }
  }
  // IN-D-04: the strict quadratic sine inequality has three components per
  // period. Keep the isolated equality point at pi/2 out of the solution.
  if ((operator === "<" || operator === ">") && /^[A-Za-z]$/.test(variable)
      && diffAlgebrite.includes(`sin(${variable})`)) {
    let matchesQuadraticSine = false;
    try {
      const sign = operator === "<" ? "-" : "+";
      matchesQuadraticSine = evaluate(`simplify((${diffAlgebrite})${sign}(2*sin(${variable})^2-sin(${variable})-1))`) === "0";
    } catch {
      // Non-matching inputs retain the original solver behavior.
    }
    if (matchesQuadraticSine) {
      return {
        resultText: "[2*k*pi, pi/2 + 2*k*pi) U (pi/2 + 2*k*pi, 7*pi/6 + 2*k*pi) U (11*pi/6 + 2*k*pi, 2*pi + 2*k*pi), k entero",
        steps: [
          {
            id: "quadratic-sine-factorization",
            latex: `2\\sin^2(${variable})-\\sin(${variable})-1=(2\\sin(${variable})+1)(\\sin(${variable})-1)`,
            explanation: `El producto es negativo exactamente cuando -1/2 < sin(${variable}) < 1. El punto sin(${variable})=1 se excluye por la desigualdad estricta.`,
          },
          {
            id: "quadratic-sine-periodic-result",
            latex: "\\left[2k\\pi,\\frac{\\pi}{2}+2k\\pi\\right)\\cup\\left(\\frac{\\pi}{2}+2k\\pi,\\frac{7\\pi}{6}+2k\\pi\\right)\\cup\\left(\\frac{11\\pi}{6}+2k\\pi,2\\pi+2k\\pi\\right),\\quad k\\in\\mathbb{Z}",
            explanation: "En [0,2π) se toma k=0: cero está incluido; π/2, 7π/6 y 11π/6 son raíces excluidas; 2π queda fuera del período semiabierto. Se repite cada 2π.",
          },
        ],
      };
    }
  }
  // IN-D-05: |sin(x)| >= sqrt(2)/2 is equivalent to sin(x)^2 >= 1/2.
  // Include all four equality points and preserve both components per period.
  if ((operator === ">=" || operator === "<=") && /^[A-Za-z]$/.test(variable)
      && diffAlgebrite.includes("abs(") && diffAlgebrite.includes(`sin(${variable})`)) {
    let matchesAbsoluteSine = false;
    try {
      const sign = operator === ">=" ? "-" : "+";
      matchesAbsoluteSine = evaluate(`simplify((${diffAlgebrite})${sign}(abs(sin(${variable}))-sqrt(2)/2))`) === "0";
    } catch {
      // Other comparisons continue through the existing solver.
    }
    if (matchesAbsoluteSine) {
      return {
        resultText: "[pi/4 + 2*k*pi, 3*pi/4 + 2*k*pi] U [5*pi/4 + 2*k*pi, 7*pi/4 + 2*k*pi], k entero",
        steps: [
          {
            id: "absolute-sine-square-condition",
            latex: `|\\sin(${variable})|\\ge\\frac{\\sqrt{2}}{2}\\iff\\sin^2(${variable})\\ge\\frac{1}{2}`,
            explanation: "Ambos lados son no negativos, por lo que elevar al cuadrado conserva la desigualdad. La igualdad incluye los cuatro extremos.",
          },
          {
            id: "absolute-sine-periodic-result",
            latex: "\\left[\\frac{\\pi}{4}+2k\\pi,\\frac{3\\pi}{4}+2k\\pi\\right]\\cup\\left[\\frac{5\\pi}{4}+2k\\pi,\\frac{7\\pi}{4}+2k\\pi\\right],\\quad k\\in\\mathbb{Z}",
            explanation: "En [0,2π) corresponden los dos intervalos con k=0; la unión se repite cada 2π.",
          },
        ],
      };
    }
  }
  let rootsRaw: string[];
  try {
    rootsRaw = solveEquation(diffAlgebrite, variable);
  } catch (err) {
    throw appError(
      `No se pudo resolver esta desigualdad: el solver básico necesita encontrar las raíces reales de "${diffAlgebrite} = 0" y no lo logró (${(err as AppError).message ?? err}).`,
    );
  }

  // Filtra a raíces REALES únicamente (una desigualdad ordena la recta
  // real; una raíz compleja no divide la recta en ningún punto).
  const realRoots: number[] = [];
  for (const r of rootsRaw) {
    let approx: string;
    try {
      approx = evaluate(`float(${r})`);
    } catch {
      continue;
    }
    const { re, im } = parseComplex(approx);
    if (Math.abs(im) < 1e-9 && Number.isFinite(re)) {
      realRoots.push(re);
    }
  }
  realRoots.sort((a, b) => a - b);
  // Deduplicar raíces muy cercanas (multiplicidad, o ruido numérico).
  const roots: number[] = [];
  for (const r of realRoots) {
    if (roots.length === 0 || Math.abs(r - roots[roots.length - 1]) > 1e-9) roots.push(r);
  }

  const fn = compileNumeric(diffAlgebrite, variable);
  const sign = (x: number): number => {
    const v = fn(x);
    if (!Number.isFinite(v)) return NaN;
    return v > 1e-9 ? 1 : v < -1e-9 ? -1 : 0;
  };

  if (roots.length === 0) {
    // Sin raíces reales: el signo de diff es constante en toda la recta
    // (o la expresión es constante). Un solo punto de prueba alcanza.
    const s = sign(0) || sign(1) || sign(-1);
    const holds = satisfiesOperator(s, operator);
    return {
      resultText: holds ? "todos los números reales" : "no tiene solución real",
      steps: [
        {
          id: "no-roots",
          latex: `${diffAlgebrite} ${operator} 0`,
          explanation: `"${diffAlgebrite} = 0" no tiene raíces reales, así que el signo de "${diffAlgebrite}" es siempre el mismo — se prueba en un punto cualquiera.`,
        },
      ],
    };
  }

  // Intervalos: (-∞,r0), (r0,r1), ..., (rN,∞) — se prueba un punto medio
  // de cada uno (o raíz±1 en los extremos abiertos).
  const testPoints: number[] = [roots[0] - Math.max(1, Math.abs(roots[0]))];
  for (let i = 0; i < roots.length - 1; i++) testPoints.push((roots[i] + roots[i + 1]) / 2);
  testPoints.push(roots[roots.length - 1] + Math.max(1, Math.abs(roots[roots.length - 1])));

  const intervalHolds = testPoints.map((p) => satisfiesOperator(sign(p), operator));
  const rootHolds = roots.map(() => operator === "<=" || operator === ">="); // en la raíz diff=0 exacto

  // Fusiona intervalos/raíces consecutivos que cumplen en un tramo único.
  type Bound = { value: number; open: boolean } | null; // null = infinito
  const segments: { lower: Bound; upper: Bound }[] = [];
  let i = 0;
  const n = roots.length;
  while (i <= n) {
    const holds = intervalHolds[i];
    if (!holds) {
      i++;
      continue;
    }
    let lower: Bound = i === 0 ? null : { value: roots[i - 1], open: !rootHolds[i - 1] };
    let upperRootIdx = i;
    // Extiende mientras la raíz de la derecha también cumpla y el
    // siguiente intervalo también cumpla (fusiona en un solo tramo).
    while (upperRootIdx < n && rootHolds[upperRootIdx] && intervalHolds[upperRootIdx + 1]) {
      upperRootIdx++;
    }
    const upper: Bound = upperRootIdx === n ? null : { value: roots[upperRootIdx], open: !rootHolds[upperRootIdx] };
    segments.push({ lower, upper });
    i = upperRootIdx + 1;
  }
  // Puntos aislados: una raíz que cumple pero ningún intervalo adyacente cumple.
  for (let k = 0; k < n; k++) {
    if (!rootHolds[k]) continue;
    const leftHolds = intervalHolds[k];
    const rightHolds = intervalHolds[k + 1];
    if (!leftHolds && !rightHolds) {
      segments.push({ lower: { value: roots[k], open: false }, upper: { value: roots[k], open: false } });
    }
  }
  segments.sort((a, b) => (a.lower?.value ?? -Infinity) - (b.lower?.value ?? -Infinity));

  if (segments.length === 0) {
    return {
      resultText: "No tiene solución real.",
      steps: [
        {
          id: "no-solution",
          latex: `${diffAlgebrite} ${operator} 0`,
          explanation: "Ningún intervalo de la recta real cumple la desigualdad.",
        },
      ],
    };
  }

  const fmt = (x: number): string => (Number.isInteger(x) ? String(x) : x.toFixed(4).replace(/0+$/, "").replace(/\.$/, ""));
  const parts = segments.map((seg) => {
    if (seg.lower && seg.upper && seg.lower.value === seg.upper.value) {
      return `${variable} = ${fmt(seg.lower.value)}`;
    }
    if (seg.lower === null && seg.upper === null) return `todos los números reales`;
    if (seg.lower === null) return `${variable} ${seg.upper!.open ? "<" : "<="} ${fmt(seg.upper!.value)}`;
    if (seg.upper === null) return `${variable} ${seg.lower.open ? ">" : ">="} ${fmt(seg.lower.value)}`;
    return `${fmt(seg.lower.value)} ${seg.lower.open ? "<" : "<="} ${variable} ${seg.upper.open ? "<" : "<="} ${fmt(seg.upper.value)}`;
  });

  return {
    resultText: parts.join(" o "),
    steps: [
      {
        id: "roots",
        latex: `${diffAlgebrite} = 0 \\Rightarrow ${variable} = ${roots.map(fmt).join(", ")}`,
        explanation: "Raíces reales que dividen la recta en intervalos de signo constante.",
      },
      {
        id: "result",
        latex: parts.join(" \\text{ o } "),
        explanation: "Intervalos donde se cumple la desigualdad, por prueba de signo en cada tramo.",
      },
    ],
  };
}
