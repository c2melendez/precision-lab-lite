/// <reference lib="webworker" />

// Todo cálculo simbólico corre en este worker (spec v10 §3, §12) para no
// congelar el hilo principal en dispositivos móviles de gama baja.
// Módulo 1: "evaluate" (Modo 1). Módulo 3: "solveAlgebra" (Modo 2 - Álgebra).
// Los demás tipos de operación se añaden en módulos posteriores.

import { evaluate, toLatex, toDecimalApprox, ErrorCode as ClientErrorCode } from "../engine/algebriteClient";
import { toFractionResult, fractionToLatex } from "../engine/fractions";
import { compileNumeric, numericLimit, numericLimitAtInfinity } from "../engine/numericFallback";
import { tryStatFunction, splitTopLevelArgs } from "../engine/statFunctions";
import { tryComplexFunction, parseComplex } from "../engine/complexFunctions";
import { residueAtRational, singularitiesOfRational } from "../engine/complexAnalysis";
import { tryPlusMinus } from "../engine/plusMinus";
import { tryFiniteProduct } from "../engine/product";
import { validateFiniteSumRange } from "../engine/sum";
import { tryCbrtSign } from "../engine/cbrtSign";
import { solveLinearInequalitySystem } from "../engine/stepEngine/linearInequalitySystem";
import type { InequalityOperator } from "../engine/parsing/inequalitySplit";
import { solveInequality } from "../engine/inequality";
import { solveAlgebra } from "../engine/stepEngine/algebra";
import {
  calcDerivative,
  calcLimit,
  calcIndefiniteIntegral,
  calcDefiniteIntegral,
} from "../engine/stepEngine/calculus";
import { solveLinearSystem } from "../engine/stepEngine/linearSystem";
import {
  toFractionMatrix,
  addMatrices,
  subtractMatrices,
  multiplyMatrices,
  transposeMatrix,
  determinant,
  invertMatrix,
  powerMatrix,
  ref,
  rref,
  kroneckerProduct,
  dotProduct,
  crossProduct,
  vectorNorm,
  trace,
  rank,
} from "../engine/matrixOps";
import { analyzeGraph, analyzeGraphPolar, analyzeGraphParametric, analyzeGraphSurface3D } from "../engine/stepEngine/graphing";
import { computeEigenvalues } from "../engine/eigenOps";
import { evaluateMatrixExpression, matrixExpressionValueToLatex } from "../engine/matrixExpression";
import { solveODE } from "../engine/stepEngine/ode";
import { ErrorCode, makeRequestId, type MathResult, type AppError, type ResultConfidence } from "../types";

export type ComputeRequest =
  | { type: "evaluate"; requestId: string; expressionAlgebrite: string }
  | {
      type: "solveAlgebra";
      requestId: string;
      leftAlgebrite: string;
      rightAlgebrite: string;
      variable: string;
    }
  | {
      type: "derivative";
      requestId: string;
      expressionAlgebrite: string;
      variable: string;
      order: number;
    }
  | {
      type: "limit";
      requestId: string;
      expressionAlgebrite: string;
      variable: string;
      pointAlgebrite: string;
      pointNumeric: number;
      direction?: "both" | "left" | "right";
    }
  | { type: "indefiniteIntegral"; requestId: string; expressionAlgebrite: string; variable: string }
  | {
      type: "definiteIntegral";
      requestId: string;
      expressionAlgebrite: string;
      variable: string;
      lower: number;
      upper: number;
    }
  | { type: "linearSystem"; requestId: string; equationsAlgebrite: string[]; variables: string[] }
  | {
      type: "matrixOp";
      requestId: string;
      op: "add" | "subtract" | "multiply" | "transpose" | "determinant" | "inverse" | "power" | "ref" | "rref" | "kron" | "dot" | "cross" | "norm" | "eigen" | "trace" | "rank";
      a: (string | number)[][];
      b?: (string | number)[][];
      exponent?: number;
    }
  | {
      type: "matrixExpression";
      requestId: string;
      expression: string;
      matrices: Record<"A" | "B" | "C" | "D" | "E" | "F", (string | number)[][]>;
    }
  | { type: "graph"; requestId: string; expressionAlgebrite: string; variable: string; view: [number, number] }
  | {
      // Módulo I0 (spec_graficacion_matrices_estadistica_unidades.md,
      // Fase I): gráfica polar r=f(θ) — mensaje separado de "graph" en
      // vez de un campo "kind" opcional ahí, porque el payload es
      // distinto (thetaRange, no view en x) y esto mantiene el
      // discriminated union exhaustivo y explícito.
      type: "graphPolar";
      requestId: string;
      expressionAlgebrite: string;
      variable: string;
      thetaRange: [number, number];
    }
  | {
      // Módulo J1 (spec_graficacion_matrices_estadistica_unidades.md,
      // sección 3.2): paramétrico 2D — mismo criterio que "graphPolar",
      // mensaje propio en vez de sobrecargar "graph".
      type: "graphParametric";
      requestId: string;
      xExpressionAlgebrite: string;
      yExpressionAlgebrite: string;
      parameter: string;
      tRange: [number, number];
    }
  | {
      // Módulo J2 (spec_graficacion_matrices_estadistica_unidades.md,
      // sección 3.2, Opción B): superficie 3D z=f(x,y). Payload
      // completamente distinto a los otros mensajes de graficación (dos
      // variables, dos rangos, sin "samples" planos sino una grilla) —
      // mismo criterio de mensaje propio.
      type: "graphSurface3D";
      requestId: string;
      expressionAlgebrite: string;
      varX: string;
      varY: string;
      xRange: [number, number];
      yRange: [number, number];
    }
  | {
      type: "solveInequality";
      requestId: string;
      diffAlgebrite: string;
      operator: "<" | ">" | "<=" | ">=";
      variable: string;
    }
  | {
      // Corrección post-auditoría (Módulo C, spec_motor_matematico_pendiente.md
      // §4): faltaba el mensaje de worker que conecta el motor ya construido
      // (solveLinearInequalitySystem) con la UI — el motor existía pero nada
      // lo llamaba. Mismo formato de payload que "solveInequality" pero en
      // plural, uno por renglón del sistema.
      type: "linearInequalitySystem";
      requestId: string;
      inequalities: { diffAlgebrite: string; operator: InequalityOperator }[];
      variables: string[];
    }
  | {
      // Fase E (spec_edo_complejos_tooltips.md §2, Módulo E2): la EDO
      // llega YA normalizada (preprocessLatex, ver BasicScientificMode.tsx)
      // pero SIN pasar por parseExpression()/splitEquation -- ese pipeline
      // trataría "y'=2x" como una ecuación de álgebra normal a despejar
      // (splitEquation corta en el primer "=" sin saber que hay una
      // derivada involucrada) y fallaría de forma confusa en tokenize()
      // (la prima "'" no es un token reconocido ahí). Por eso este
      // mensaje lleva el texto crudo (post-preprocessLatex), no
      // left/rightAlgebrite como "solveAlgebra".
      type: "ode";
      requestId: string;
      expression: string;
    }
  | {
      // Fase F (spec_edo_complejos_tooltips.md §3.4, Módulo F3): botón
      // "Graficar" -- evalúa la expresión a un número complejo concreto
      // (re/im) para que la UI la pase al puente de navegación
      // (useArgandBridgeStore.ts) hacia GraphingMode. Reutiliza
      // evaluate()+parseComplex() (mismo motor que tryComplexFunction).
      type: "argandPoint";
      requestId: string;
      expressionAlgebrite: string;
    }
  | { type: "complexResidue"; requestId: string; expressionAlgebrite: string; pointAlgebrite: string }
  | { type: "complexSingularities"; requestId: string; expressionAlgebrite: string };

self.onmessage = (event: MessageEvent<ComputeRequest>) => {
  const msg = event.data;
  const result = handle(msg);
  (self as unknown as Worker).postMessage(result);
};

function handle(msg: ComputeRequest): MathResult {
  switch (msg.type) {
    case "evaluate":
      return handleEvaluate(msg.expressionAlgebrite, msg.requestId);
    case "solveAlgebra":
      return handleSolveAlgebra(msg.leftAlgebrite, msg.rightAlgebrite, msg.variable, msg.requestId);
    case "derivative":
      return runCalculus(msg.requestId, () => calcDerivative(msg.expressionAlgebrite, msg.variable, msg.order));
    case "limit":
      return runCalculus(msg.requestId, () =>
        calcLimit(msg.expressionAlgebrite, msg.variable, msg.pointAlgebrite, msg.pointNumeric, msg.direction),
      );
    case "indefiniteIntegral":
      return runCalculus(msg.requestId, () => calcIndefiniteIntegral(msg.expressionAlgebrite, msg.variable));
    case "definiteIntegral":
      return runCalculus(msg.requestId, () =>
        calcDefiniteIntegral(msg.expressionAlgebrite, msg.variable, msg.lower, msg.upper),
      );
    case "linearSystem":
      return handleLinearSystem(msg.equationsAlgebrite, msg.variables, msg.requestId);
    case "matrixOp":
      return handleMatrixOp(msg, msg.requestId);
    case "matrixExpression":
      return handleMatrixExpression(msg.expression, msg.matrices, msg.requestId);
    case "graph":
      return handleGraph(msg.expressionAlgebrite, msg.variable, msg.view, msg.requestId);
    case "graphPolar":
      return handleGraphPolar(msg.expressionAlgebrite, msg.variable, msg.thetaRange, msg.requestId);
    case "graphParametric":
      return handleGraphParametric(
        msg.xExpressionAlgebrite,
        msg.yExpressionAlgebrite,
        msg.parameter,
        msg.tRange,
        msg.requestId,
      );
    case "graphSurface3D":
      return handleGraphSurface3D(
        msg.expressionAlgebrite,
        msg.varX,
        msg.varY,
        msg.xRange,
        msg.yRange,
        msg.requestId,
      );
    case "solveInequality":
      return handleSolveInequality(msg.diffAlgebrite, msg.operator, msg.variable, msg.requestId);
    case "linearInequalitySystem":
      return handleLinearInequalitySystem(msg.inequalities, msg.variables, msg.requestId);
    case "ode":
      return runCalculus(msg.requestId, () => solveODE(msg.expression));
    case "argandPoint":
      return handleArgandPoint(msg.expressionAlgebrite, msg.requestId);
    case "complexResidue":
      return handleComplexResidue(msg.expressionAlgebrite, msg.pointAlgebrite, msg.requestId);
    case "complexSingularities":
      return handleComplexSingularities(msg.expressionAlgebrite, msg.requestId);
    default: {
      const unknownMsg = msg as { requestId?: string };
      return errorResult(
        ErrorCode.UNSUPPORTED_OPERATION,
        "Tipo de operación desconocido.",
        unknownMsg.requestId ?? makeRequestId(),
      );
    }
  }
}

function handleComplexResidue(
  expressionAlgebrite: string,
  pointAlgebrite: string,
  requestId: string,
): MathResult {
  try {
    const raw = residueAtRational(expressionAlgebrite, pointAlgebrite);
    const isNumeric = /^-?\d+(\.\d+)?$/.test(raw) || /^-?\d+\/\d+$/.test(raw);
    return {
      success: true,
      resultLatex: toLatex(raw),
      fraction: isNumeric ? toFractionResult(raw) : undefined,
      steps: [],
      hasDetailedSteps: false,
      confidence: "SYMBOLIC",
      requestId,
    };
  } catch (err) {
    const appErr = err as AppError;
    return errorResult(appErr.code ?? ClientErrorCode.UNSUPPORTED_OPERATION, appErr.message ?? String(err), requestId);
  }
}

function handleComplexSingularities(expressionAlgebrite: string, requestId: string): MathResult {
  try {
    const points = singularitiesOfRational(expressionAlgebrite);
    const resultLatex = points.length === 0
      ? "\\varnothing"
      : `\\{${points.map((point) => toLatex(point)).join(",\\ ")}\\}`;
    return {
      success: true,
      resultLatex,
      steps: [],
      hasDetailedSteps: false,
      confidence: "SYMBOLIC",
      requestId,
    };
  } catch (err) {
    const appErr = err as AppError;
    return errorResult(appErr.code ?? ClientErrorCode.UNSUPPORTED_OPERATION, appErr.message ?? String(err), requestId);
  }
}
function handleSolveAlgebra(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
  requestId: string,
): MathResult {
  try {
    const { steps, solutionsAlgebrite } = solveAlgebra(leftAlgebrite, rightAlgebrite, variable);
    const allNumeric = solutionsAlgebrite.every(
      (s) => /^-?\d+(\.\d+)?$/.test(s) || /^-?\d+\/\d+$/.test(s),
    );
    // Fase E: mismo fix de handleEvaluate — cada solución se convierte a
    // LaTeX real antes de unirlas, en vez de concatenar sintaxis nativa
    // de Algebrite con un "=" de por medio.
    const resultLatex = solutionsAlgebrite.map((s) => `${variable} = ${toLatex(s)}`).join(",\\ ");
    return {
      success: true,
      resultLatex,
      fraction: allNumeric && solutionsAlgebrite.length === 1 ? toFractionResult(solutionsAlgebrite[0]) : undefined,
      steps,
      hasDetailedSteps: false, // ver stepEngine/algebra.ts: pasos de alto nivel, no aislamiento término a término
      confidence: "SYMBOLIC",
      requestId,
    };
  } catch (err) {
    const appErr = err as AppError;
    return errorResult(
      appErr.code ?? ClientErrorCode.UNSUPPORTED_OPERATION,
      appErr.message ?? String(err),
      requestId,
    );
  }
}

/**
 * Fix (decisión de Carlos, cierre de la suite de paridad de teclado):
 * solver básico de desigualdades — ver engine/inequality.ts para el
 * análisis de signos por intervalos. El resultado es texto plano (ej.
 * "x < 3" o "-2 < x < 2"), no una expresión Algebrite, así que se
 * muestra directamente sin pasar por toLatex()/toFractionResult() (que
 * esperan sintaxis de Algebrite, no una descripción de intervalo).
 */
function handleSolveInequality(
  diffAlgebrite: string,
  operator: "<" | ">" | "<=" | ">=",
  variable: string,
  requestId: string,
): MathResult {
  try {
    const { resultText, steps } = solveInequality(diffAlgebrite, operator, variable);
    return {
      success: true,
      resultLatex: `\\text{${resultText}}`,
      steps,
      hasDetailedSteps: false,
      confidence: "SYMBOLIC",
      requestId,
    };
  } catch (err) {
    const appErr = err as AppError;
    return errorResult(
      appErr.code ?? ClientErrorCode.UNSUPPORTED_OPERATION,
      appErr.message ?? String(err),
      requestId,
    );
  }
}

/**
 * Fase 3: Algebrite nunca evalúa asinh/acosh/atanh/sign a un número —
 * confirmado probando el paquete real, no solo con evaluate() (que ya
 * reintenta con float()) sino incluso llamándolo directo. Si el resultado
 * de evaluate() todavía contiene alguna de estas, se recurre al
 * evaluador numérico propio (engine/numericFallback.ts) como último
 * recurso antes de rendirse.
 */
const ALGEBRITE_UNSUPPORTED_NUMERIC = /\b(asinh|acosh|atanh|sign)\(/;

/**
 * Fase 10 (decisión: resolver Lim inline en Básica/Científica/Álgebra):
 * limit() de Algebrite frecuentemente devuelve la llamada tal cual, sin
 * evaluar (confirmado probando el paquete real — mismo comportamiento que
 * ya maneja symbolicLimit()/calcLimit() en el modo Cálculo). Cuando eso
 * pasa aquí, se recurre al mismo fallback numérico que usa Cálculo
 * (compileNumeric + numericLimit), reconstruyendo cuerpo/variable/punto a
 * partir de la propia llamada sin evaluar.
 */
function tryLimitFallback(raw: string): string | null {
  const match = raw.match(/^limit\((.*)\)$/s);
  if (!match) return null;
  const args = splitTopLevelArgs(match[1]);
  if (args.length !== 3 && args.length !== 4) return null;
  const [body, variable, pointExpr, directionArg] = args;
  try {
    // Fase 2 externa (hueco #4): límite lateral — 4to argumento opcional,
    // 1=derecha, -1=izquierda (ver normalize.ts, sufijo ^+/^- del punto).
    const direction = directionArg === "1" ? "right" : directionArg === "-1" ? "left" : "both";

    // Fase 2 externa (hueco #3): límite al infinito. Para cuando esto se
    // ejecuta, \infty ya se tradujo a "oo" (misma pasada de normalize.ts)
    // — Number("oo") siempre da NaN, así que se compara como string en
    // vez de intentar convertir primero.
    const pointRaw = evaluate(pointExpr);
    if (pointRaw === "oo" || pointRaw === "-oo") {
      const fn = compileNumeric(body, variable);
      const { value, converged } = numericLimitAtInfinity(fn, pointRaw === "oo" ? 1 : -1);
      return Number.isFinite(value) && converged ? String(value) : null;
    }

    const pointNumeric = Number(pointRaw);
    if (!Number.isFinite(pointNumeric)) return null;
    const fn = compileNumeric(body, variable);
    const { value, converged } = numericLimit(fn, pointNumeric, direction);
    return Number.isFinite(value) && converged ? String(value) : null;
  } catch {
    return null;
  }
}

/**
 * Fase 2 externa (integral con límites, inline): "defintegral(cuerpo,a,b)"
 * es un marcador propio (nunca nativo de Algebrite) producido solo por
 * normalize.ts. Se resuelve en DOS llamadas separadas — antiderivada
 * primero, sustituir después — porque envolver integral() sin evaluar
 * dentro de subst() en una sola llamada hace que Algebrite sustituya
 * ANTES de integrar (confirmado con el paquete real: falla con
 * "Stop: integral: sorry, could not find a solution" en casos con
 * límites simbólicos como pi). Mismo motivo por el que
 * calcDefiniteIntegral (stepEngine/calculus.ts) ya lo hacía en dos pasos.
 */
function tryDefiniteIntegral(expr: string): string | null {
  const match = expr.match(/^defintegral\((.*)\)$/s);
  if (!match) return null;
  const args = splitTopLevelArgs(match[1]);
  if (args.length !== 3) return null;
  const [body, lower, upper] = args;
  const antiderivative = evaluate(`integral((${body}),x)`);
  if (/^integral\(/.test(antiderivative)) {
    throw { code: ErrorCode.UNSUPPORTED_OPERATION, message: "Algebrite no pudo resolver esta integral simbólicamente." } as AppError;
  }
  const raw = evaluate(`float(subst(${upper},x,${antiderivative}))-float(subst(${lower},x,${antiderivative}))`);
  // Igual que float() en general (ver hallazgo arriba), el resultado
  // puede traer "..." literal de Algebrite indicando precisión truncada
  // (ej. "2.666667...") — no es válido reinyectarlo en otra llamada a
  // Algebrite (toLatex/toFractionResult lo intentan y da "NaN...").
  return raw.replace(/\.\.\.$/, "");
}

function tryNumericFallback(expr: string): string | null {
  try {
    // Expresión puramente numérica (sin variable libre real que resolver
    // aquí) — se compila con un nombre de variable que no debería
    // aparecer en la expresión, y se evalúa en un punto cualquiera.
    const fn = compileNumeric(expr, "__evaluate_no_var__");
    const value = fn(0);
    return Number.isFinite(value) ? String(value) : null;
  } catch {
    return null;
  }
}

function handleEvaluate(expr: string, requestId: string): MathResult {
  try {
    // S16 REG-005: un entero literal puede exceder Number.MAX_SAFE_INTEGER.
    // No debe pasar por conversiones numéricas de JS/Fraction.js ni por
    // una aproximación que lo corrompa silenciosamente. Para un literal
    // entero, la forma exacta ya es el propio texto normalizado.
    if (/^-?\d+$/.test(expr)) {
      try {
        const exactInteger = BigInt(expr);
        const maxSafe = BigInt(Number.MAX_SAFE_INTEGER);
        if (exactInteger > maxSafe || exactInteger < -maxSafe) {
          return {
            success: true,
            resultLatex: expr,
            fraction: undefined,
            decimalApprox: undefined,
            steps: [],
            hasDetailedSteps: false,
            confidence: "SYMBOLIC",
            requestId,
          };
        }
      } catch {
        // Si BigInt no pudiera interpretar el literal, seguir por la ruta
        // normal para que el parser produzca el error correspondiente.
      }
    }

    // Fase 10: mean/median/mode/stdev/variance/sort/mad/min/max no son
    // nativas de Algebrite (confirmado, ver statFunctions.ts) — se
    // resuelven aparte, antes de intentar el camino normal.
    const statResult = tryStatFunction(expr);
    if (statResult !== null) {
      const isNumericStat = /^-?\d+(\.\d+)?$/.test(statResult);
      return {
        success: true,
        // Fase E: los números planos (mean/median/etc.) ya son LaTeX
        // válido tal cual — pasarlos por toLatex() los trunca a 6 cifras
        // (Algebrite reformatea con su propio float(), con menos
        // precisión que formatNumber() en statFunctions.ts). El único
        // caso que sí lo necesita es "sort" (una lista, ej. "[1,2,3]"),
        // que toLatex() sí convierte a una notación matemática real
        // (bmatrix) en vez del texto plano con corchetes.
        resultLatex: isNumericStat ? statResult : toLatex(statResult),
        fraction: isNumericStat ? toFractionResult(statResult) : undefined,
        steps: [],
        hasDetailedSteps: false,
        confidence: "NUMERIC_FALLBACK",
        requestId,
      };
    }

    // Fase 2 externa: integral con límites (\int_{a}^{b}), reescrita a
    // "defintegral(...)" — se resuelve aparte por el mismo motivo que las
    // funciones de estadística (Algebrite nunca la ve tal cual).
    const definiteIntegralResult = tryDefiniteIntegral(expr);
    if (definiteIntegralResult !== null) {
      return {
        success: true,
        resultLatex: toLatex(definiteIntegralResult),
        fraction: toFractionResult(definiteIntegralResult),
        steps: [],
        hasDetailedSteps: false,
        confidence: "NUMERIC_FALLBACK",
        requestId,
      };
    }

    // P4 (spec v2 §5.1): re/im/arg/conj/topolar — mismo motivo y mismo
    // patrón que las funciones de estadística arriba (no nativas de
    // Algebrite, ver cabecera de complexFunctions.ts sobre por qué se
    // asume eso sin poder confirmarlo en este entorno).
    const complexResult = tryComplexFunction(expr);
    if (complexResult !== null) {
      return {
        success: true,
        resultLatex: toLatex(complexResult),
        fraction: toFractionResult(complexResult),
        steps: [],
        hasDetailedSteps: false,
        confidence: "NUMERIC_FALLBACK",
        requestId,
      };
    }

    validateFiniteSumRange(expr);

    const productResult = tryFiniteProduct(expr);
    if (productResult !== null) {
      return {
        success: true,
        resultLatex: toLatex(productResult),
        fraction: toFractionResult(productResult),
        steps: [],
        hasDetailedSteps: false,
        confidence: "SYMBOLIC",
        requestId,
      };
    }

    // Fix (decisión de Carlos, cierre de la suite de paridad de teclado):
    // ±(expr) — mismo patrón que arriba, Algebrite no conoce "pm". Da las
    // dos ramas como lista de Algebrite (mismo formato que "sort"), que
    // toLatex() ya sabe convertir a una notación matemática real.
    //
    // BUG real encontrado verificando con navegador real (no solo con
    // vitest — el "Invalid argument" solo aparecía en el flujo completo
    // de la app, no llamando a las funciones sueltas): a diferencia de
    // "sort" (arriba, líneas 315-316), acá se llamaba a
    // toFractionResult() incondicionalmente. toFractionResult() envuelve
    // Fraction.js, que espera un número/fracción plano, NO una lista tipo
    // "[5,-5]" — Fraction.js tira "Invalid argument" y quedaba envuelto
    // como PARSE_ERROR genérico. ±() siempre da una lista de 2 elementos
    // (nunca un solo número), así que la pestaña de fracción no aplica
    // — se omite directamente, igual que hace "sort".
    const plusMinusResult = tryPlusMinus(expr);
    if (plusMinusResult !== null) {
      return {
        success: true,
        resultLatex: toLatex(plusMinusResult),
        fraction: undefined,
        steps: [],
        hasDetailedSteps: false,
        confidence: "NUMERIC_FALLBACK",
        requestId,
      };
    }

    // Fix (suite de regresión v1.1, E107/E109-E111): cbrt/sign — ver
    // cabecera de engine/cbrtSign.ts.
    const cbrtSignResult = tryCbrtSign(expr);
    if (cbrtSignResult !== null) {
      return {
        success: true,
        resultLatex: toLatex(cbrtSignResult),
        fraction: toFractionResult(cbrtSignResult),
        steps: [],
        hasDetailedSteps: false,
        confidence: "NUMERIC_FALLBACK",
        requestId,
      };
    }

    // Algebrite can approximate exact poles such as tan(pi/2) or
    // sec(pi/2)=1/cos(pi/2) to huge finite values. Treat exact cosine
    // zeros as domain errors instead of presenting a misleading number.
    const poleMatch = expr.match(/^(?:tan\((.*)\)|\(1\/cos\((.*)\)\))$/s);
    if (poleMatch) {
      const arg = poleMatch[1] ?? poleMatch[2];
      const angle = Number(evaluate(`float(${arg})`));
      if (Number.isFinite(angle) && Math.abs(Math.cos(angle)) < 1e-12) {
        throw { code: ErrorCode.DOMAIN_ERROR, message: "La función no está definida en ese punto." } as AppError;
      }
    }

    let raw = evaluate(expr);
    let confidence: MathResult["confidence"] = "SYMBOLIC";
    if (/^limit\(/.test(raw)) {
      const limitFallback = tryLimitFallback(raw);
      if (limitFallback !== null) {
        raw = limitFallback;
        confidence = "NUMERIC_FALLBACK";
      }
    }
    if (ALGEBRITE_UNSUPPORTED_NUMERIC.test(raw)) {
      const numeric = tryNumericFallback(expr);
      if (numeric !== null) {
        raw = numeric;
        confidence = "NUMERIC_FALLBACK";
      }
    }
    const isNumeric = /^-?\d+(\.\d+)?$/.test(raw) || /^-?\d+\/\d+$/.test(raw);
    const fraction = isNumeric ? toFractionResult(raw) : undefined;

    // Fase E (fix display): "raw" es la sintaxis nativa de Algebrite, no
    // LaTeX — se convierte acá, en el único punto de salida de
    // handleEvaluate, para que HistoryLog/ResultPanel siempre reciban
    // LaTeX válido y puedan renderizarlo con MathLive en vez de mostrarlo
    // como texto plano (bug detectado por comparación visual con
    // ClassCalc — ver algebriteClient.ts para el detalle).
    const resultLatex = toLatex(raw);

    // Si no hay `fraction` (resultado simbólico, ej. sin(pi/4) ->
    // "2^(1/2)/2"), se intenta igual una aproximación decimal vía
    // float() para que la pestaña "dec" de ResultPanel no quede
    // mostrando el mismo string simbólico que "sqrt".
    const decimalApprox = !fraction ? (toDecimalApprox(raw) ?? undefined) : undefined;

    return {
      success: true,
      resultLatex,
      fraction,
      decimalApprox,
      steps: [],
      hasDetailedSteps: false,
      confidence,
      requestId,
    };
  } catch (err) {
    const appErr = err as AppError;
    return errorResult(
      appErr.code ?? ErrorCode.PARSE_ERROR,
      appErr.message ?? String(err),
      requestId,
    );
  }
}

function runCalculus(
  requestId: string,
  fn: () => { resultLatex: string; steps: MathResult["steps"]; confidence: MathResult["confidence"] },
): MathResult {
  try {
    const { resultLatex, steps, confidence } = fn();
    return {
      success: true,
      resultLatex,
      steps,
      hasDetailedSteps: true,
      confidence,
      requestId,
    };
  } catch (err) {
    const appErr = err as AppError;
    return errorResult(
      appErr.code ?? ClientErrorCode.UNSUPPORTED_OPERATION,
      appErr.message ?? String(err),
      requestId,
    );
  }
}

function handleLinearSystem(equationsAlgebrite: string[], variables: string[], requestId: string): MathResult {
  try {
    const solution = solveLinearSystem(equationsAlgebrite, variables);
    if (solution.kind === "none") {
      return errorResult(ErrorCode.UNSUPPORTED_OPERATION, "El sistema no tiene solución (es inconsistente).", requestId);
    }
    if (solution.kind === "infinite") {
      return {
        success: true,
        resultLatex: "Infinitas soluciones (sistema compatible indeterminado).",
        steps: solution.steps,
        hasDetailedSteps: true,
        confidence: "PARTIAL", // no se calcula la parametrización explícita todavía — ver README
        requestId,
      };
    }
    const values = solution.values!;
    return {
      success: true,
      resultLatex: variables.map((v, i) => `${v} = ${fractionToLatex(values[i])}`).join(",\\ "),
      fraction: values.length === 1 ? toFractionResult(values[0].toFraction()) : undefined,
      steps: solution.steps,
      hasDetailedSteps: true,
      confidence: "SYMBOLIC",
      requestId,
    };
  } catch (err) {
    const appErr = err as AppError;
    return errorResult(appErr.code ?? ClientErrorCode.UNSUPPORTED_OPERATION, appErr.message ?? String(err), requestId);
  }
}

/**
 * Corrección post-auditoría (Módulo C): el motor (solveLinearInequalitySystem)
 * estaba completo y verificado de forma aislada pero nunca se llamaba desde
 * ningún flujo real. Traduce InequalitySystemSolution (tipo nuevo, sin valor
 * escalar — cambio contractual ya declarado en el cierre del Módulo C) a un
 * MathResult que ResultPanel/HistoryLog ya saben renderizar como texto.
 */
function handleLinearInequalitySystem(
  inequalities: { diffAlgebrite: string; operator: InequalityOperator }[],
  variables: string[],
  requestId: string,
): MathResult {
  try {
    const solution = solveLinearInequalitySystem(inequalities, variables);
    if (solution.kind === "empty") {
      return errorResult(
        ErrorCode.UNSUPPORTED_OPERATION,
        "El sistema de inecuaciones no tiene solución (la región factible está vacía).",
        requestId,
      );
    }
    const verticesLatex = solution.vertices?.length
      ? `\\{${solution.vertices.map((p) => `(${p.x},\\ ${p.y})`).join(",\\ ")}\\}`
      : "\\text{sin vértices finitos}";
    const resultLatex =
      solution.kind === "unbounded"
        ? `\\text{Región no acotada.\\ Vértices finitos: } ${verticesLatex}`
        : `\\text{Vértices del polígono factible: } ${verticesLatex}`;
    return {
      success: true,
      resultLatex,
      steps: solution.steps,
      hasDetailedSteps: true,
      confidence: "PARTIAL", // frontera abierta/cerrada no distinguida todavía — ver comentario en linearInequalitySystem.ts
      requestId,
    };
  } catch (err) {
    const appErr = err as AppError;
    return errorResult(appErr.code ?? ClientErrorCode.UNSUPPORTED_OPERATION, appErr.message ?? String(err), requestId);
  }
}

function handleMatrixExpression(
  expression: string,
  rawMatrices: Record<"A" | "B" | "C" | "D" | "E" | "F", (string | number)[][]>,
  requestId: string,
): MathResult {
  try {
    const matrices = Object.fromEntries(
      Object.entries(rawMatrices).map(([name, values]) => [name, toFractionMatrix(values)]),
    );
    const value = evaluateMatrixExpression(expression, matrices);
    const resultLatex = matrixExpressionValueToLatex(value);
    return {
      success: true,
      resultLatex,
      fraction:
        value.kind === "scalar"
          ? toFractionResult(value.value.toFraction())
          : undefined,
      steps: [
        {
          id: "matrix-expression",
          latex: resultLatex,
          explanation: `Resultado de la expresión matricial: ${expression}`,
        },
      ],
      hasDetailedSteps: false,
      confidence: "SYMBOLIC",
      requestId,
    };
  } catch (err) {
    const appErr = err as AppError;
    return errorResult(
      appErr.code ?? ClientErrorCode.UNSUPPORTED_OPERATION,
      appErr.message ?? String(err),
      requestId,
    );
  }
}

function handleMatrixOp(
  msg: Extract<ComputeRequest, { type: "matrixOp" }>,
  requestId: string,
): MathResult {
  try {
    const a = toFractionMatrix(msg.a);
    const b = msg.b ? toFractionMatrix(msg.b) : undefined;

    let resultLatex: string;
    let steps: MathResult["steps"];
    let fraction: MathResult["fraction"];
    let confidence: ResultConfidence = "SYMBOLIC";

    switch (msg.op) {
      case "add": {
        const { result, steps: s } = addMatrices(a, b!);
        resultLatex = result.map((row) => row.map((v) => v.toFraction(true)).join(", ")).join(" | ");
        steps = s;
        break;
      }
      case "subtract": {
        const { result, steps: s } = subtractMatrices(a, b!);
        resultLatex = result.map((row) => row.map((v) => v.toFraction(true)).join(", ")).join(" | ");
        steps = s;
        break;
      }
      case "multiply": {
        const { result, steps: s } = multiplyMatrices(a, b!);
        resultLatex = result.map((row) => row.map((v) => v.toFraction(true)).join(", ")).join(" | ");
        steps = s;
        break;
      }
      case "transpose": {
        const { result, steps: s } = transposeMatrix(a);
        resultLatex = result.map((row) => row.map((v) => v.toFraction(true)).join(", ")).join(" | ");
        steps = s;
        break;
      }
      case "determinant": {
        const { value, steps: s } = determinant(a);
        resultLatex = value.toFraction(true);
        fraction = toFractionResult(value.toFraction());
        steps = s;
        break;
      }
      case "inverse": {
        const { result, steps: s } = invertMatrix(a);
        resultLatex = result.map((row) => row.map((v) => v.toFraction(true)).join(", ")).join(" | ");
        steps = s;
        break;
      }
      case "power": {
        const { result, steps: s } = powerMatrix(a, msg.exponent ?? 1);
        resultLatex = result.map((row) => row.map((v) => v.toFraction(true)).join(", ")).join(" | ");
        steps = s;
        break;
      }
      case "ref": {
        const { result, steps: s } = ref(a);
        resultLatex = result.map((row) => row.map((v) => v.toFraction(true)).join(", ")).join(" | ");
        steps = s;
        break;
      }
      case "rref": {
        const { result, steps: s } = rref(a);
        resultLatex = result.map((row) => row.map((v) => v.toFraction(true)).join(", ")).join(" | ");
        steps = s;
        break;
      }
      case "kron": {
        const { result, steps: s } = kroneckerProduct(a, b!);
        resultLatex = result.map((row) => row.map((v) => v.toFraction(true)).join(", ")).join(" | ");
        steps = s;
        break;
      }
      case "dot": {
        const { value, steps: s } = dotProduct(a, b!);
        resultLatex = value.toFraction(true);
        fraction = toFractionResult(value.toFraction());
        steps = s;
        break;
      }
      case "cross": {
        const { result, steps: s } = crossProduct(a, b!);
        resultLatex = result.map((row) => row.map((v) => v.toFraction(true)).join(", ")).join(" | ");
        steps = s;
        break;
      }
      case "norm": {
        const { resultLatex: r, steps: s } = vectorNorm(a);
        resultLatex = r;
        steps = s;
        break;
      }
      case "trace": {
        const { value, steps: s } = trace(a);
        resultLatex = value.toFraction(true);
        fraction = toFractionResult(value.toFraction());
        steps = s;
        break;
      }
      case "rank": {
        const { value, steps: s } = rank(a);
        resultLatex = String(value);
        steps = s;
        break;
      }
      case "eigen": {
        // Módulo K1 (spec_graficacion_matrices_estadistica_unidades.md,
        // sección 3.2, diseño confirmado en K0): resultLatex resume todos
        // los pares (λ, multiplicidad); cada eigenvector, si se pudo
        // calcular (K0: solo para λ reales), se detalla como un Step
        // aparte — mismo patrón usado por gaussJordan para desglosar un
        // resultado compuesto en pasos legibles.
        const { pairs, allExact, characteristicPolynomial } = computeEigenvalues(a);

        const formatComplex = (re: number, im: number) => {
          const r = Math.abs(re) < 1e-9 ? 0 : re;
          const ii = Math.abs(im) < 1e-9 ? 0 : im;
          if (ii === 0) return r.toFixed(4);
          if (r === 0) return `${ii.toFixed(4)}i`;
          return `${r.toFixed(4)}${ii >= 0 ? "+" : ""}${ii.toFixed(4)}i`;
        };

        const vectorForPair = (p: (typeof pairs)[number]) => {
          if (p.isComplex) {
            return p.complexEigenvector
              ? `[${p.complexEigenvector.map((z) => formatComplex(z.re, z.im)).join(", ")}]`
              : "no se pudo calcular";
          }
          return p.eigenvector
            ? `[${p.eigenvector.map((x) => x.toFixed(4)).join(", ")}]`
            : "no se pudo calcular";
        };

        confidence =
          allExact &&
          pairs.every((p) =>
            p.isComplex ? p.complexEigenvector !== null : p.eigenvector !== null,
          )
            ? "SYMBOLIC"
            : "NUMERIC_FALLBACK";

        resultLatex = pairs
          .map((p) => {
            const approxValue =
              Math.abs(p.approxIm) > 1e-9
                ? formatComplex(p.approx, p.approxIm)
                : p.approx.toFixed(6);
            const valueStr = p.exact !== null ? p.exact : approxValue;
            const multStr = p.multiplicity > 1 ? ` (multiplicidad ${p.multiplicity})` : "";
            return `\\lambda = ${valueStr}${multStr}`;
          })
          .join(",\\quad ");

        steps = [
          {
            id: "char-poly",
            latex: `\\det(A-\\lambda I) = ${characteristicPolynomial} = 0`,
            explanation: "Polinomio característico, construido por expansión de cofactores.",
          },
          ...pairs.map((p, i) => {
            const approxValue =
              Math.abs(p.approxIm) > 1e-9
                ? formatComplex(p.approx, p.approxIm)
                : p.approx.toFixed(6);
            const valueStr = p.exact !== null ? p.exact : `${approxValue} (aproximado)`;
            const vectorStr = vectorForPair(p);
            return {
              id: `eigen-${i}`,
              latex: `\\lambda_{${i + 1}} = ${valueStr},\\ v_{${i + 1}} = ${vectorStr}`,
              explanation:
                p.multiplicity > 1
                  ? `Multiplicidad algebraica ${p.multiplicity}. Eigenvector: ${vectorStr}.`
                  : `Eigenvector correspondiente: ${vectorStr}.`,
            };
          }),
        ];
        break;
      }
    }

    return {
      success: true,
      resultLatex,
      fraction,
      steps,
      hasDetailedSteps: true,
      confidence,
      requestId,
    };
  } catch (err) {
    const appErr = err as AppError;
    return errorResult(appErr.code ?? ClientErrorCode.UNSUPPORTED_OPERATION, appErr.message ?? String(err), requestId);
  }
}

function handleGraph(
  exprAlgebrite: string,
  variable: string,
  view: [number, number],
  requestId: string,
): MathResult {
  try {
    const analysis = analyzeGraph(exprAlgebrite, variable, view);
    const summary = [
      `Dominio: ${analysis.domainDescription}`,
      `Rango: ${analysis.rangeDescription}`,
      `Intercepciones en x: ${analysis.xIntercepts.length ? analysis.xIntercepts.map((x) => x.toFixed(3)).join(", ") : "ninguna detectada en el rango visible"}`,
      `Intercepción en y: ${analysis.yIntercept !== null ? analysis.yIntercept.toFixed(3) : "no definida en x=0"}`,
    ].join(" · ");
    return {
      success: true,
      resultLatex: summary,
      steps: [],
      hasDetailedSteps: false,
      confidence: "NUMERIC_FALLBACK",
      requestId,
      graphAnalysis: analysis,
    };
  } catch (err) {
    const appErr = err as AppError;
    return errorResult(appErr.code ?? ClientErrorCode.UNSUPPORTED_OPERATION, appErr.message ?? String(err), requestId);
  }
}

function handleGraphPolar(
  exprAlgebrite: string,
  variable: string,
  thetaRange: [number, number],
  requestId: string,
): MathResult {
  try {
    const analysis = analyzeGraphPolar(exprAlgebrite, variable, thetaRange);
    const summary = [
      `Dominio: ${analysis.domainDescription}`,
      `Rango de r: ${analysis.rangeDescription}`,
    ].join(" · ");
    return {
      success: true,
      resultLatex: summary,
      steps: [],
      hasDetailedSteps: false,
      confidence: "NUMERIC_FALLBACK",
      requestId,
      graphAnalysis: analysis,
    };
  } catch (err) {
    const appErr = err as AppError;
    return errorResult(appErr.code ?? ClientErrorCode.UNSUPPORTED_OPERATION, appErr.message ?? String(err), requestId);
  }
}

function handleGraphParametric(
  xExprAlgebrite: string,
  yExprAlgebrite: string,
  parameter: string,
  tRange: [number, number],
  requestId: string,
): MathResult {
  try {
    const analysis = analyzeGraphParametric(xExprAlgebrite, yExprAlgebrite, parameter, tRange);
    const summary = [
      `Dominio: ${analysis.domainDescription}`,
      `Rango: ${analysis.rangeDescription}`,
    ].join(" · ");
    return {
      success: true,
      resultLatex: summary,
      steps: [],
      hasDetailedSteps: false,
      confidence: "NUMERIC_FALLBACK",
      requestId,
      graphAnalysis: analysis,
    };
  } catch (err) {
    const appErr = err as AppError;
    return errorResult(appErr.code ?? ClientErrorCode.UNSUPPORTED_OPERATION, appErr.message ?? String(err), requestId);
  }
}

function handleGraphSurface3D(
  exprAlgebrite: string,
  varX: string,
  varY: string,
  xRange: [number, number],
  yRange: [number, number],
  requestId: string,
): MathResult {
  try {
    const surface = analyzeGraphSurface3D(exprAlgebrite, varX, varY, xRange, yRange);
    const summary = [
      `Dominio: ${surface.domainDescription}`,
      `Rango: ${surface.rangeDescription}`,
    ].join(" · ");
    return {
      success: true,
      resultLatex: summary,
      steps: [],
      hasDetailedSteps: false,
      confidence: "NUMERIC_FALLBACK",
      requestId,
      graphSurface3D: surface,
    };
  } catch (err) {
    const appErr = err as AppError;
    return errorResult(appErr.code ?? ClientErrorCode.UNSUPPORTED_OPERATION, appErr.message ?? String(err), requestId);
  }
}

function errorResult(code: ErrorCode, message: string, requestId: string): MathResult {
  return {
    success: false,
    errorCode: code,
    errorMessage: message,
    resultLatex: null,
    steps: [],
    hasDetailedSteps: false,
    confidence: "SYMBOLIC",
    requestId,
  };
}

function handleArgandPoint(expr: string, requestId: string): MathResult {
  try {
    const raw = evaluate(expr);
    const { re, im } = parseComplex(raw);
    return {
      success: true,
      resultLatex: toLatex(raw),
      steps: [],
      hasDetailedSteps: false,
      confidence: "SYMBOLIC",
      requestId,
      // Mismo campo (`graphAnalysis: unknown`) que ya usa el Modo
      // Graficación para pasar datos estructurados propios -- acá lleva
      // {re, im} en vez de un GraphAnalysis real; BasicScientificMode.tsx
      // lo castea al consumirlo, mismo criterio que GraphingMode.tsx.
      graphAnalysis: { re, im },
    };
  } catch (err) {
    const appErr = err as { code?: ClientErrorCode; message?: string };
    return errorResult(
      (appErr.code as unknown as ErrorCode) ?? ClientErrorCode.PARSE_ERROR,
      appErr.message ??
        "No se pudo interpretar esta expresión como un número complejo concreto (¿tiene variables sin evaluar?).",
      requestId,
    );
  }
}
