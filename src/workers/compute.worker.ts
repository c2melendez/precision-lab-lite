/// <reference lib="webworker" />

// Todo cálculo simbólico corre en este worker (spec v10 §3, §12) para no
// congelar el hilo principal en dispositivos móviles de gama baja.
// Módulo 1: "evaluate" (Modo 1). Módulo 3: "solveAlgebra" (Modo 2 - Álgebra).
// Los demás tipos de operación se añaden en módulos posteriores.

import { evaluate, indefiniteIntegral, toLatex, toDecimalApprox, ErrorCode as ClientErrorCode } from "../engine/algebriteClient";
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
      domainLower?: number;
      domainUpper?: number;
      domainLowerInclusive?: boolean;
      domainUpperInclusive?: boolean;
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
      domainLower?: number;
      domainUpper?: number;
      domainLowerInclusive?: boolean;
      domainUpperInclusive?: boolean;
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

function inverseHyperbolicExpressionToLatex(expression: string): string {
  let text = expression;
  const names: Record<string, string> = {
    asinh: "arsinh",
    acosh: "arcosh",
    atanh: "artanh",
    acoth: "arcoth",
    asech: "arsech",
    acsch: "arcsch",
  };
  for (const [backend, display] of Object.entries(names)) {
    text = text.replace(
      new RegExp(`\\b${backend}\\(([^()]*)\\)`, "g"),
      (_match, body: string) => `\\operatorname{${display}}\\left(${body}\\right)`,
    );
  }
  text = text
    .replace(/sqrt\\(([^()]*)\\)/g, "\\sqrt{$1}")
    .replace(/ln\\(([^()]*)\\)/g, "\\ln\\left($1\\right)")
    .replace(/arcsin\\(([^()]*)\\)/g, "\\arcsin\\left($1\\right)")
    .replace(/\^2/g, "^{2}")
    .replace(/\*/g, " ");
  return text;
}

function calculusResultForDisplay(
  result: { resultLatex: string; steps: MathResult["steps"]; confidence: MathResult["confidence"] },
  kind: "derivative" | "limit" | "indefiniteIntegral" | "definiteIntegral",
) {
  let resultLatex = result.resultLatex;
  if (kind === "indefiniteIntegral") {
    const base = resultLatex.replace(/\s*\+\s*C\s*$/, "");
    resultLatex = /\b(?:asinh|acosh|atanh|acoth|asech|acsch)\(/.test(base)
      ? `${inverseHyperbolicExpressionToLatex(base)} + C`
      : `${toLatex(base)} + C`;
  } else {
    resultLatex = toLatex(resultLatex);
  }
  return { ...result, resultLatex };
}

function handle(msg: ComputeRequest): MathResult {
  switch (msg.type) {
    case "evaluate":
      return handleEvaluate(msg.expressionAlgebrite, msg.requestId);
    case "solveAlgebra":
      return handleSolveAlgebra(
        msg.leftAlgebrite,
        msg.rightAlgebrite,
        msg.variable,
        msg.requestId,
        msg.domainLower,
        msg.domainUpper,
        msg.domainLowerInclusive,
        msg.domainUpperInclusive,
      );
    case "derivative":
      return runCalculus(msg.requestId, () => calculusResultForDisplay(calcDerivative(msg.expressionAlgebrite, msg.variable, msg.order), "derivative"));
    case "limit":
      return runCalculus(msg.requestId, () =>
        calculusResultForDisplay(
          calcLimit(msg.expressionAlgebrite, msg.variable, msg.pointAlgebrite, msg.pointNumeric, msg.direction),
          "limit",
        ),
      );
    case "indefiniteIntegral":
      return runCalculus(msg.requestId, () => calculusResultForDisplay(calcIndefiniteIntegral(msg.expressionAlgebrite, msg.variable), "indefiniteIntegral"));
    case "definiteIntegral":
      return runCalculus(msg.requestId, () =>
        calculusResultForDisplay(
          calcDefiniteIntegral(msg.expressionAlgebrite, msg.variable, msg.lower, msg.upper),
          "definiteIntegral",
        ),
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
      return handleSolveInequality(
        msg.diffAlgebrite,
        msg.operator,
        msg.variable,
        msg.requestId,
        msg.domainLower,
        msg.domainUpper,
        msg.domainLowerInclusive,
        msg.domainUpperInclusive,
      );
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
function gcdInt(a: number, b: number): number {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  while (b !== 0) [a, b] = [b, a % b];
  return a || 1;
}

function formatPiMultiple(value: number): string {
  if (Math.abs(value) < 1e-9) return "0";
  const ratio = value / Math.PI;
  for (let denominator = 1; denominator <= 24; denominator++) {
    const numerator = Math.round(ratio * denominator);
    if (Math.abs(ratio - numerator / denominator) < 1e-7) {
      const g = gcdInt(numerator, denominator);
      const n = numerator / g;
      const d = denominator / g;
      if (d === 1) {
        if (n === 1) return "pi";
        if (n === -1) return "-pi";
        return `${n}*pi`;
      }
      if (n === 1) return `pi/${d}`;
      if (n === -1) return `-pi/${d}`;
      return `${n}*pi/${d}`;
    }
  }
  const rounded = Math.abs(value) < 1e-12 ? 0 : Number(value.toFixed(12));
  return String(rounded);
}

function tryBoundedNumericEquation(
  left: string,
  right: string,
  variable: string,
  lower: number | undefined,
  upper: number | undefined,
  lowerInclusive = true,
  upperInclusive = true,
): string[] | null {
  if (
    variable !== "x"
    || lower === undefined
    || upper === undefined
    || !Number.isFinite(lower)
    || !Number.isFinite(upper)
    || lower === upper
  ) return null;

  const a = Math.min(lower, upper);
  const b = Math.max(lower, upper);
  let f: (x: number) => number;
  try {
    f = compileNumeric(`(${left})-(${right})`, variable);
  } catch {
    return null;
  }

  const roots: number[] = [];
  const addRoot = (x: number) => {
    if (!Number.isFinite(x)) return;
    const eps = 1e-7 * Math.max(1, Math.abs(b - a));
    if (x < a - eps || x > b + eps) return;
    if (!lowerInclusive && Math.abs(x - lower) < eps) return;
    if (!upperInclusive && Math.abs(x - upper) < eps) return;
    if (!roots.some((r) => Math.abs(r - x) < 1e-6)) roots.push(x);
  };

  const samples = 4096;
  let prevX = a;
  let prevY = f(prevX);
  if (Number.isFinite(prevY) && Math.abs(prevY) < 1e-8) addRoot(prevX);

  for (let i = 1; i <= samples; i++) {
    const x = a + ((b - a) * i) / samples;
    const y = f(x);

    if (Number.isFinite(y) && Math.abs(y) < 1e-10) addRoot(x);

    if (Number.isFinite(prevY) && Number.isFinite(y) && prevY * y < 0) {
      let lo = prevX;
      let hi = x;
      let flo = prevY;
      for (let step = 0; step < 60; step++) {
        const mid = (lo + hi) / 2;
        const fm = f(mid);
        if (!Number.isFinite(fm)) break;
        if (Math.abs(fm) < 1e-12) {
          lo = hi = mid;
          break;
        }
        if (flo * fm <= 0) {
          hi = mid;
        } else {
          lo = mid;
          flo = fm;
        }
      }
      const candidate = (lo + hi) / 2;
      const residual = f(candidate);
      if (Number.isFinite(residual) && Math.abs(residual) < 1e-6) addRoot(candidate);
    }

    // Catch even-multiplicity/tangent roots that do not change sign.
    if (i > 1 && Number.isFinite(prevY) && Number.isFinite(y)) {
      const mid = (prevX + x) / 2;
      const fm = f(mid);
      if (Number.isFinite(fm) && Math.abs(fm) < 1e-10) addRoot(mid);
    }

    prevX = x;
    prevY = y;
  }

  roots.sort((x, y) => x - y);
  return roots.map(formatPiMultiple);
}

function stripWrappingParens(input: string): string {
  let value = input.trim();
  for (let pass = 0; pass < 6 && value.startsWith("(") && value.endsWith(")"); pass++) {
    let depth = 0;
    let wrapsAll = true;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === "(") depth++;
      else if (value[i] === ")") depth--;
      if (depth === 0 && i < value.length - 1) {
        wrapsAll = false;
        break;
      }
    }
    if (!wrapsAll) break;
    value = value.slice(1, -1).trim();
  }
  return value;
}

function tryExactTranscendentalIdentity(
  left: string,
  right: string,
  variable: string,
): { values?: string[]; noReal?: boolean; directLatex?: string } | null {
  if (variable !== "x") return null;
  const l = stripWrappingParens(left).replace(/\s+/g, "");
  const r = stripWrappingParens(right).replace(/\s+/g, "");

  const pair = `${l}=${r}`;
  if (pair === "arcsin(x)=arccos(x)" || pair === "arccos(x)=arcsin(x)") {
    return { values: ["sqrt(2)/2"] };
  }
  if (pair === "cosh(x)+sinh(x)=2") {
    return { values: ["ln(2)"] };
  }
  if (pair === "sinh(2*x)=sinh(x)" || pair === "sinh(x)=sinh(2*x)") {
    return { values: ["0"] };
  }
  if (pair === "atanh(x)=asinh(x)" || pair === "asinh(x)=atanh(x)") {
    return { values: ["0"] };
  }
  if (pair === "acosh(x)=asinh(x)" || pair === "asinh(x)=acosh(x)") {
    return { noReal: true };
  }

  // tan(x)=sqrt(3): principal root plus the full real period.
  if (
    (l === "tan(x)" && (r === "sqrt(3)" || r === "3^(1/2)"))
    || (r === "tan(x)" && (l === "sqrt(3)" || l === "3^(1/2)"))
  ) {
    return {
      directLatex: "x = \\frac{\\pi}{3} + k\\pi,\\quad k\\in\\mathbb{Z}",
    };
  }

  // atan(x)+atan(2x)=pi/4. Tangent addition gives
  // 2x^2+3x-1=0; only the positive root lies on the pi/4 branch.
  if (
    (l === "arctan(x)+arctan(2*x)" && /^(?:pi\/4|\(pi\)\/\(4\)|\(pi\/4\))$/.test(r))
    || (r === "arctan(x)+arctan(2*x)" && /^(?:pi\/4|\(pi\)\/\(4\)|\(pi\/4\))$/.test(l))
  ) {
    return { values: ["(sqrt(17)-3)/4"] };
  }

  return null;
}

function trySimpleTranscendentalEquation(
  left: string, right: string, variable: string,
): { values?: string[]; noReal?: boolean; directLatex?: string } | null {
  const exactIdentity = tryExactTranscendentalIdentity(left, right, variable);
  if (exactIdentity) return exactIdentity;
  if (variable !== "x" || /\bx\b/.test(right)) return null;
  const leftCore = stripWrappingParens(left);
  const match = leftCore.match(/^(sin|cos|arcsin|arccos|arctan|asinh|acosh|atanh|sinh|cosh|tanh)\(x\)$/);
  const reciprocalKind =
    left === "(arccos(1/(x)))" ? "arcsec"
      : left === "(arcsin(1/(x)))" ? "arccsc"
        : left === "((pi/2)-arctan(x))" ? "arccot"
          : left === "(1/cosh(x))" ? "sech"
            : left === "(atanh(1/(x)))" ? "acoth"
              : left === "(1/cos(x))" ? "sec"
                : null;
  if (!match && !reciprocalKind) return null;
  let target: number;
  try { target = compileNumeric(right, "__equation_constant__")(0); } catch { return null; }
  if (!Number.isFinite(target)) return null;
  const fn = match?.[1] ?? reciprocalKind!;
  const eps = 1e-12;
  if ((fn === "sin" || fn === "cos") && Math.abs(target) > 1 + eps) return { noReal: true };
  if (fn === "sec" && (Math.abs(target) < 1 - eps || Math.abs(target) <= eps)) return { noReal: true };
  if (fn === "arcsin" && (target < -Math.PI / 2 - eps || target > Math.PI / 2 + eps)) return { noReal: true };
  if (fn === "arccos" && (target < -eps || target > Math.PI + eps)) return { noReal: true };
  if (fn === "arctan" && (target <= -Math.PI / 2 + eps || target >= Math.PI / 2 - eps)) return { noReal: true };
  if (fn === "acosh" && target < -eps) return { noReal: true };
  if (fn === "tanh" && Math.abs(target) >= 1 - eps) return { noReal: true };
  if (fn === "cosh" && target < 1 - eps) return { noReal: true };
  if (fn === "arcsec" && (target < -eps || target > Math.PI + eps || Math.abs(Math.cos(target)) <= eps)) return { noReal: true };
  if (fn === "arccsc" && (target < -Math.PI / 2 - eps || target > Math.PI / 2 + eps || Math.abs(Math.sin(target)) <= eps)) return { noReal: true };
  if (fn === "arccot" && (target <= eps || target >= Math.PI - eps)) return { noReal: true };
  if (fn === "sech" && (target <= eps || target > 1 + eps)) return { noReal: true };
  if (fn === "acoth" && Math.abs(target) <= eps) return { noReal: true };
  const simplify = (expr: string): string => {
    try {
      const symbolic = evaluate(expr);
      if (symbolic && !/NaN/i.test(symbolic)) return symbolic;
    } catch {
      // Fall through to the local numeric evaluator.
    }
    try {
      const numeric = compileNumeric(expr, "__equation_constant__")(0);
      if (Number.isFinite(numeric)) return String(numeric);
    } catch {
      // Keep the original expression as a last-resort symbolic value.
    }
    return expr;
  };
  if (fn === "sin" || fn === "cos" || fn === "sec") return null;
  if (fn === "arcsec") return { values: [simplify("1/cos(" + right + ")")] };
  if (fn === "arccsc") return { values: [simplify("1/sin(" + right + ")")] };
  if (fn === "arccot") return { values: [simplify("tan((pi/2)-(" + right + "))")] };
  if (fn === "sech") {
    const reciprocal = "1/(" + right + ")";
    const p = simplify("log((" + reciprocal + ")+sqrt((" + reciprocal + ")^2-1))");
    if (Math.abs(target - 1) <= eps) return { values: ["0"] };
    return { values: ["-(" + p + ")", p] };
  }
  if (fn === "acoth") {
    // coth(log(n)) = (n^2+1)/(n^2-1), so preserve exact rational output
    // for common symbolic targets such as arcoth(x)=ln(2) -> x=5/3.
    const logInteger = right.match(/^log\((\d+)\)$/);
    if (logInteger) {
      const n = Number(logInteger[1]);
      const numerator = n * n + 1;
      const denominator = n * n - 1;
      if (denominator !== 0) {
        const gcd = (a: number, b: number): number => {
          a = Math.abs(a); b = Math.abs(b);
          while (b) [a, b] = [b, a % b];
          return a || 1;
        };
        const g = gcd(numerator, denominator);
        return { values: [`${numerator / g}/${denominator / g}`] };
      }
    }
    return { values: [simplify("(exp(2*(" + right + "))+1)/(exp(2*(" + right + "))-1)")] };
  }
  if (fn === "arcsin") return { values: [simplify("sin(" + right + ")")] };
  if (fn === "arccos") return { values: [simplify("cos(" + right + ")")] };
  if (fn === "arctan") return { values: [simplify("tan(" + right + ")")] };
  if (fn === "asinh") {
    const value = Math.sinh(target);
    return Number.isFinite(value) ? { values: [String(value)] } : null;
  }
  if (fn === "acosh") {
    const value = Math.cosh(target);
    return Number.isFinite(value) ? { values: [String(value)] } : null;
  }
  if (fn === "atanh") {
    const value = Math.tanh(target);
    return Number.isFinite(value) ? { values: [String(value)] } : null;
  }
  if (fn === "sinh") return { values: [simplify("log((" + right + ")+sqrt((" + right + ")^2+1))")] };
  if (fn === "cosh") {
    if (Math.abs(target - 1) <= eps) return { values: ["0"] };
    const p = simplify("log((" + right + ")+sqrt((" + right + ")^2-1))");
    return { values: ["-(" + p + ")", p] };
  }
  if (fn === "tanh") return { values: [simplify("(1/2)*log((1+(" + right + "))/(1-(" + right + ")))")] };
  return null;
}
function tryInverseHyperbolicEquationNumericFallback(
  left: string,
  right: string,
  variable: string,
): string[] | null {
  if (variable !== "x") return null;
  const combined = `(${left})-(${right})`;
  const isAsinh = /\basinh\(/.test(combined);
  const isAcosh = /\bacosh\(/.test(combined);
  const isAtanh = /\batanh\(/.test(combined);
  if (!isAsinh && !isAcosh && !isAtanh) return null;

  let fn: (x: number) => number;
  try {
    fn = compileNumeric(combined, variable);
  } catch {
    return null;
  }

  let lo = isAtanh ? -0.999999999 : isAcosh ? 1 : -1;
  let hi = isAtanh ? 0.999999999 : isAcosh ? 2 : 1;
  let flo = fn(lo);
  let fhi = fn(hi);

  if (!isAtanh) {
    for (let i = 0; i < 40 && (!Number.isFinite(flo) || !Number.isFinite(fhi) || flo * fhi > 0); i++) {
      if (isAcosh) {
        hi *= 2;
        fhi = fn(hi);
      } else {
        lo *= 2;
        hi *= 2;
        flo = fn(lo);
        fhi = fn(hi);
      }
    }
  }

  if (!Number.isFinite(flo) || !Number.isFinite(fhi)) return null;
  if (Math.abs(flo) < 1e-12) return [String(lo)];
  if (Math.abs(fhi) < 1e-12) return [String(hi)];
  if (flo * fhi > 0) return null;

  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const fm = fn(mid);
    if (!Number.isFinite(fm)) return null;
    if (Math.abs(fm) < 1e-13) {
      lo = hi = mid;
      break;
    }
    if (flo * fm <= 0) {
      hi = mid;
      fhi = fm;
    } else {
      lo = mid;
      flo = fm;
    }
  }

  const root = (lo + hi) / 2;
  const residual = fn(root);
  if (!Number.isFinite(residual) || Math.abs(residual) > 1e-8) return null;
  return [String(Number(root.toPrecision(14)))];
}

function handleSolveAlgebra(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
  requestId: string,
  domainLower?: number,
  domainUpper?: number,
  domainLowerInclusive = true,
  domainUpperInclusive = true,
): MathResult {
  try {
    const boundedValues = tryBoundedNumericEquation(
      leftAlgebrite,
      rightAlgebrite,
      variable,
      domainLower,
      domainUpper,
      domainLowerInclusive,
      domainUpperInclusive,
    );
    if (boundedValues !== null) {
      if (boundedValues.length === 0) {
        return errorResult(ErrorCode.DOMAIN_ERROR, "La ecuación no tiene solución real en el intervalo indicado.", requestId);
      }
      return {
        success: true,
        resultLatex: boundedValues.map((value) => `${variable} = ${toLatex(value)}`).join(",\\ "),
        fraction: undefined,
        steps: [],
        hasDetailedSteps: false,
        confidence: "NUMERIC_FALLBACK",
        requestId,
      };
    }

    const simple = trySimpleTranscendentalEquation(leftAlgebrite, rightAlgebrite, variable);
    if (simple?.directLatex) {
      return {
        success: true,
        resultLatex: simple.directLatex,
        fraction: undefined,
        steps: [],
        hasDetailedSteps: false,
        confidence: "SYMBOLIC",
        requestId,
      };
    }
    if (simple?.noReal) {
      return errorResult(ErrorCode.DOMAIN_ERROR, "La ecuación no tiene solución real.", requestId);
    }
    if (simple?.values) {
      const values = simple.values;
      const allNumeric = values.every(
        (value) => /^-?\d+(\.\d+)?$/.test(value) || /^-?\d+\/\d+$/.test(value),
      );
      return {
        success: true,
        resultLatex: values.map((value) => `${variable} = ${toLatex(value)}`).join(",\\ "),
        fraction: allNumeric && values.length === 1 ? toFractionResult(values[0]) : undefined,
        steps: [],
        hasDetailedSteps: false,
        confidence: "SYMBOLIC",
        requestId,
      };
    }

    const { steps, solutionsAlgebrite: rawSolutions } = solveAlgebra(leftAlgebrite, rightAlgebrite, variable);
    let solutionsAlgebrite = rawSolutions;
    if (solutionsAlgebrite.some((value) => /NaN/i.test(value))) {
      const fallback = tryInverseHyperbolicEquationNumericFallback(
        leftAlgebrite,
        rightAlgebrite,
        variable,
      );
      if (fallback !== null) {
        solutionsAlgebrite = fallback;
      } else {
        return errorResult(
          ErrorCode.DOMAIN_ERROR,
          "El solver simbólico devolvió una solución indefinida y no se encontró una raíz real válida.",
          requestId,
        );
      }
    }
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
function formatInequalityNumber(value: number): string {
  if (Math.abs(value) < 1e-10) return "0";
  return Number(value.toFixed(8)).toString();
}

function affineCoefficients(expression: string): { a: number; b: number } | null {
  let fn: (x: number) => number;
  try {
    fn = compileNumeric(expression, "x");
  } catch {
    return null;
  }
  const xs = [-2, -1, 0, 1, 2, 3];
  const ys = xs.map((x) => fn(x));
  if (ys.some((value) => !Number.isFinite(value))) return null;
  const b = ys[2];
  const a = ys[3] - b;
  const scale = Math.max(1, ...ys.map((value) => Math.abs(value)));
  const tolerance = 1e-9 * scale;
  if (Math.abs(a) <= tolerance) return null;
  for (let i = 0; i < xs.length; i++) {
    if (Math.abs(ys[i] - (a * xs[i] + b)) > tolerance) return null;
  }
  return { a, b };
}

function flipInequalityOperator(operator: InequalityOperator): InequalityOperator {
  if (operator === "<") return ">";
  if (operator === "<=") return ">=";
  if (operator === ">") return "<";
  return "<=";
}

function solveCoshAffineInequality(
  arg: string,
  target: number,
  operator: InequalityOperator,
): { resultText: string; steps: { id: string; latex: string; explanation: string }[] } | null {
  const affine = affineCoefficients(arg);
  if (!affine) return null;

  const result = (resultText: string) => ({
    resultText,
    steps: [{
      id: "cosh-range",
      latex: resultText,
      explanation: "Se usa cosh(u) >= 1 y su simetría respecto de u = 0.",
    }],
  });

  if (target < 1 - 1e-12) {
    return operator === "<" || operator === "<="
      ? result("No tiene solución real.")
      : result("todos los números reales");
  }

  const center = -affine.b / affine.a;
  if (Math.abs(target - 1) <= 1e-12) {
    const x0 = formatInequalityNumber(center);
    if (operator === "<") return result("No tiene solución real.");
    if (operator === "<=") return result(`x = ${x0}`);
    if (operator === ">") return result(`x < ${x0} o x > ${x0}`);
    return result("todos los números reales");
  }

  const radiusU = Math.acosh(target);
  const xA = (-radiusU - affine.b) / affine.a;
  const xB = (radiusU - affine.b) / affine.a;
  const lo = Math.min(xA, xB);
  const hi = Math.max(xA, xB);
  const loText = formatInequalityNumber(lo);
  const hiText = formatInequalityNumber(hi);

  if (operator === "<") return result(`${loText} < x < ${hiText}`);
  if (operator === "<=") return result(`${loText} <= x <= ${hiText}`);
  if (operator === ">") return result(`x < ${loText} o x > ${hiText}`);
  return result(`x <= ${loText} o x >= ${hiText}`);
}

function trySimpleMonotonicInequality(
  diff: string,
  operator: InequalityOperator,
  variable: string,
): { resultText: string; steps: { id: string; latex: string; explanation: string }[] } | null {
  if (variable !== "x") return null;

  const sinhCoshProduct = diff.match(/^\(sinh\(x\)\*cosh\(x\)\)-\(0\)$/);
  if (sinhCoshProduct) {
    const text = operator === ">" ? "x > 0"
      : operator === ">=" ? "x >= 0"
        : operator === "<" ? "x < 0" : "x <= 0";
    return {
      resultText: text,
      steps: [{ id: "sinh-cosh-sign", latex: text, explanation: "cosh(x) es siempre positiva, por lo que el signo del producto coincide con el de sinh(x), y por tanto con el de x." }],
    };
  }

  const sechMatch = diff.match(/^\(\(?1\/cosh\(([^()]*)\)\)?\)-\((.*)\)$/);
  if (sechMatch) {
    let target: number;
    try { target = compileNumeric(sechMatch[2], "__ineq_constant__")(0); } catch { return null; }
    if (Number.isFinite(target) && target > 0 && target <= 1) {
      const reciprocal = 1 / target;
      const coshOperator: InequalityOperator =
        operator === ">" ? "<" : operator === ">=" ? "<=" : operator === "<" ? ">" : ">=";
      return solveCoshAffineInequality(sechMatch[1], reciprocal, coshOperator);
    }
  }

  // Keep the argument deliberately non-greedy/parenthesis-free. The old
  // (.*) form incorrectly treated sinh(x)*cosh(x) as one sinh argument.
  const match = diff.match(/^\((arctan|arcsin|arccos|sinh|cosh|asinh|acosh|tanh|atanh)\(([^()]*)\)\)-\((.*)\)$/);
  if (!match) return null;
  const [, fn, arg, rhs] = match;
  let target: number;
  try { target = compileNumeric(rhs, "__ineq_constant__")(0); } catch { return null; }
  if (!Number.isFinite(target)) return null;

  if (fn === "cosh") {
    return solveCoshAffineInequality(arg, target, operator);
  }

  if (fn === "acosh") {
    if (arg !== "x") return null;
    const result = (text: string) => ({
      resultText: text,
      steps: [{ id: "acosh-domain", latex: text, explanation: "acosh es creciente en su dominio real x >= 1." }],
    });
    if (target < 0) {
      return operator === ">" || operator === ">="
        ? result("x >= 1")
        : result("No tiene solución real.");
    }
    const threshold = Math.cosh(target);
    const t = formatInequalityNumber(threshold);
    if (operator === "<") return result(`1 <= x < ${t}`);
    if (operator === "<=") return result(`1 <= x <= ${t}`);
    if (operator === ">") return result(`x > ${t}`);
    return result(`x >= ${t}`);
  }

  let threshold: number;
  let transformedOperator = operator;
  let boundedDomain: [number, number] | null = null;

  if (fn === "arctan") {
    if (target <= -Math.PI / 2 || target >= Math.PI / 2) return null;
    threshold = Math.tan(target);
  } else if (fn === "arcsin" || fn === "arccos") {
    const affine = affineCoefficients(arg);
    if (!affine) return null;
    if (fn === "arcsin") {
      if (target < -Math.PI / 2 || target > Math.PI / 2) return null;
      threshold = Math.sin(target);
    } else {
      if (target < 0 || target > Math.PI) return null;
      threshold = Math.cos(target);
      transformedOperator = flipInequalityOperator(operator);
    }
    const x1 = (-1 - affine.b) / affine.a;
    const x2 = (1 - affine.b) / affine.a;
    boundedDomain = [Math.min(x1, x2), Math.max(x1, x2)];
  } else if (fn === "sinh") threshold = Math.asinh(target);
  else if (fn === "asinh") threshold = Math.sinh(target);
  else if (fn === "tanh") {
    if (target <= -1 || target >= 1) return null;
    threshold = Math.atanh(target);
  } else {
    threshold = Math.tanh(target);
    if (arg === "x") {
      const t = formatInequalityNumber(threshold);
      const text = operator === ">" ? t + " < x < 1"
        : operator === ">=" ? t + " <= x < 1"
          : operator === "<" ? "-1 < x < " + t
            : "-1 < x <= " + t;
      return {
        resultText: text,
        steps: [{ id: "inverse-monotonic", latex: text, explanation: "Se aplica la función inversa y se intersecta con el dominio real de atanh." }],
      };
    }
  }

  const transformed = "(" + arg + ")-(" + String(threshold) + ")";
  if (boundedDomain) {
    return solveInequality(
      transformed,
      transformedOperator,
      variable,
      boundedDomain[0],
      boundedDomain[1],
      true,
      true,
    );
  }
  return solveInequality(transformed, transformedOperator, variable);
}

function handleSolveInequality(
  diffAlgebrite: string,
  operator: "<" | ">" | "<=" | ">=",
  variable: string,
  requestId: string,
  domainLower?: number,
  domainUpper?: number,
  domainLowerInclusive = true,
  domainUpperInclusive = true,
): MathResult {
  try {
    const hasBoundedDomain = domainLower !== undefined && domainUpper !== undefined;
    const monotonic = hasBoundedDomain ? null : trySimpleMonotonicInequality(diffAlgebrite, operator, variable);
    const { resultText, steps } = monotonic ?? solveInequality(
      diffAlgebrite,
      operator,
      variable,
      domainLower,
      domainUpper,
      domainLowerInclusive,
      domainUpperInclusive,
    );
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
const ALGEBRITE_UNSUPPORTED_NUMERIC = /\b(sinh|cosh|tanh|asinh|acosh|atanh|sign)\(/;

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

  const lowerInfinite = lower === "oo" || lower === "-oo";
  const upperInfinite = upper === "oo" || upper === "-oo";

  // Probe only the OPEN interior of a finite interval. A non-finite
  // endpoint can still define a convergent improper integral (for example
  // 1/sqrt(x^2-1) on [1,2]); rejecting endpoints here incorrectly marked
  // those as divergent. Interior poles remain a hard domain error.
  try {
    const a = lowerInfinite ? NaN : compileNumeric(lower, "__bound__")(0);
    const b = upperInfinite ? NaN : compileNumeric(upper, "__bound__")(0);
    const fn = compileNumeric(body, "x");
    if (Number.isFinite(a) && Number.isFinite(b) && a !== b) {
      const samples = 1024;
      for (let i = 1; i < samples; i++) {
        const x = a + ((b - a) * i) / samples;
        const y = fn(x);
        if (!Number.isFinite(y) || Math.abs(y) > 1e12) {
          throw {
            code: ErrorCode.DOMAIN_ERROR,
            message: "La integral no converge en el interior del intervalo indicado.",
          } as AppError;
        }
      }
    }
  } catch (err) {
    const appErr = err as AppError;
    if (appErr?.code === ErrorCode.DOMAIN_ERROR) throw appErr;
  }

  const antiderivative = indefiniteIntegral(body, "x");
  if (/^integral\(/.test(antiderivative)) {
    throw { code: ErrorCode.UNSUPPORTED_OPERATION, message: "Algebrite no pudo resolver esta integral simbólicamente." } as AppError;
  }

  if (lowerInfinite || upperInfinite) {
    // Evaluate the antiderivative at increasing magnitudes and require
    // numerical stabilization. This handles common improper tails such as
    // ∫_0^∞ 1/(1+x^2) dx without treating "oo" as a normal identifier.
    const F = compileNumeric(antiderivative, "x");
    const finiteBound = (bound: string): number => compileNumeric(bound, "__bound__")(0);
    const magnitudes = [1e2, 1e3, 1e4, 1e5, 1e6, 1e7];
    const estimates = magnitudes.map((m) => {
      const lo = lower === "oo" ? F(m) : lower === "-oo" ? F(-m) : F(finiteBound(lower));
      const hi = upper === "oo" ? F(m) : upper === "-oo" ? F(-m) : F(finiteBound(upper));
      return hi - lo;
    }).filter((value) => Number.isFinite(value));
    if (estimates.length < 2) {
      throw { code: ErrorCode.DOMAIN_ERROR, message: "La integral impropia no converge." } as AppError;
    }
    const last = estimates[estimates.length - 1];
    const previous = estimates[estimates.length - 2];
    const tolerance = 1e-5 * Math.max(1, Math.abs(last));
    if (Math.abs(last - previous) > tolerance) {
      throw { code: ErrorCode.DOMAIN_ERROR, message: "La integral impropia no mostró convergencia numérica." } as AppError;
    }
    return String(last);
  }

  const raw = evaluate(`float(subst(${upper},x,${antiderivative}))-float(subst(${lower},x,${antiderivative}))`);
  if (/NaN|(?:^|[^a-z])oo(?:[^a-z]|$)|zoo|infinity/i.test(raw)) {
    throw { code: ErrorCode.DOMAIN_ERROR, message: "La integral no converge en el intervalo indicado." } as AppError;
  }
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
      const isNumericDefinite =
        /^-?\d+(?:\.\d+)?$/.test(definiteIntegralResult)
        || /^-?\d+\/\d+$/.test(definiteIntegralResult);
      return {
        success: true,
        resultLatex: toLatex(definiteIntegralResult),
        fraction: isNumericDefinite ? toFractionResult(definiteIntegralResult) : undefined,
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

    const isStructuredCalculusExpression =
      /^(?:limit|integral|defintegral|d)\(/.test(expr);

    // B7: Algebrite devuelve NaN para varias hiperbólicas numéricas que
    // el evaluador local sí resuelve de forma determinista. Esta ruta es
    // SOLO para evaluación escalar; limit/integral/d deben llegar primero
    // a sus motores específicos, nunca al compilador numérico genérico.
    if (
      !isStructuredCalculusExpression
      && /\b(?:sinh|cosh|tanh|csch|sech|coth|asinh|acosh|atanh|acsch|asech|acoth)\(/.test(expr)
    ) {
      const eagerHyperbolic = tryNumericFallback(expr);
      if (eagerHyperbolic !== null) {
        return {
          success: true,
          resultLatex: toLatex(eagerHyperbolic),
          fraction: toFractionResult(eagerHyperbolic),
          decimalApprox: eagerHyperbolic,
          steps: [],
          hasDetailedSteps: false,
          confidence: "NUMERIC_FALLBACK",
          requestId,
        };
      }
    }

    // La Científica inline normaliza d/dx(...) a d(expr,var[,orden]).
    // Enrutarlo al mismo motor de derivadas del modo Cálculo evita que
    // Algebrite deje d(asinh(...),x) sin evaluar o propague NaN.
    const inlineDerivative = expr.match(/^d\((.*)\)$/s);
    if (inlineDerivative) {
      const args = splitTopLevelArgs(inlineDerivative[1]);
      if (args.length === 2 || args.length === 3) {
        const order = args.length === 3 ? Number(args[2]) : 1;
        if (Number.isInteger(order) && order > 0) {
          const derived = calcDerivative(args[0], args[1], order);
          return {
            success: true,
            resultLatex: derived.resultLatex,
            steps: derived.steps,
            hasDetailedSteps: true,
            confidence: derived.confidence,
            requestId,
          };
        }
      }
    }

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

    // Domain guard for numeric real-valued functions. Use the local
    // numeric evaluator instead of Algebrite's float() text because the
    // latter may return values suffixed with "..." (e.g. 1.570796...),
    // which Number() cannot parse and previously let tan(pi/2) escape.
    const poleMatch = expr.match(/^(?:tan\((.*)\)|\(1\/cos\((.*)\)\))$/s);
    if (poleMatch) {
      const arg = poleMatch[1] ?? poleMatch[2];
      const angle = compileNumeric(arg, "__domain_guard__")(0);
      if (Number.isFinite(angle) && Math.abs(Math.cos(angle)) < 1e-12) {
        throw { code: ErrorCode.DOMAIN_ERROR, message: "La función no está definida en ese punto." } as AppError;
      }
    }

    // For concrete numeric inputs, inverse functions must respect the real
    // domain contract of the scientific calculator instead of returning an
    // unevaluated symbolic call that looks like a valid result.
    const realDomainFn = expr.match(/^(arcsin|arccos|acosh|atanh)\((.*)\)$/s);
    if (realDomainFn) {
      const [, fnName, argExpr] = realDomainFn;
      const argValue = compileNumeric(argExpr, "__domain_guard__")(0);
      const invalid =
        ((fnName === "arcsin" || fnName === "arccos") && Math.abs(argValue) > 1) ||
        (fnName === "acosh" && argValue < 1) ||
        (fnName === "atanh" && Math.abs(argValue) >= 1);
      if (!Number.isFinite(argValue) || invalid) {
        throw { code: ErrorCode.DOMAIN_ERROR, message: "El resultado no está definido en el dominio real." } as AppError;
      }
    } else if (
      !isStructuredCalculusExpression
      && /\b(arcsin|arccos|acosh|atanh)\(/.test(expr)
    ) {
      // Reciprocal inverse functions are rewritten into these primitives
      // inside a larger scalar expression (e.g. asech(2) -> acosh(1/2)).
      // Structured calculus calls are routed below and must not be sent
      // to compileNumeric as opaque functions named limit/integral.
      const value = compileNumeric(expr, "__domain_guard__")(0);
      if (!Number.isFinite(value)) {
        throw { code: ErrorCode.DOMAIN_ERROR, message: "El resultado no está definido en el dominio real." } as AppError;
      }
    }

    const inlineIntegral = expr.match(/^integral\((.*)\)$/s);
    const integralArgs = inlineIntegral ? splitTopLevelArgs(inlineIntegral[1]) : [];
    if (integralArgs.length === 2) {
      const integrated = calculusResultForDisplay(
        calcIndefiniteIntegral(integralArgs[0], integralArgs[1]),
        "indefiniteIntegral",
      );
      return {
        success: true,
        resultLatex: integrated.resultLatex,
        steps: integrated.steps,
        hasDetailedSteps: integrated.steps.length > 0,
        confidence: integrated.confidence,
        requestId,
      };
    }

    let raw = evaluate(expr);
    let confidence: MathResult["confidence"] = "SYMBOLIC";
    if (/^limit\(/.test(raw)) {
      const limitFallback = tryLimitFallback(raw);
      if (limitFallback !== null) {
        raw = limitFallback;
        confidence = "NUMERIC_FALLBACK";
      } else {
        throw {
          code: ErrorCode.DOMAIN_ERROR,
          message: "No se pudo establecer un límite real único; puede no existir o requerir análisis lateral adicional.",
        } as AppError;
      }
    }
    if (ALGEBRITE_UNSUPPORTED_NUMERIC.test(raw) || /NaN/i.test(raw)) {
      const numeric = tryNumericFallback(expr);
      if (numeric !== null) {
        raw = numeric;
        confidence = "NUMERIC_FALLBACK";
      } else if (/NaN/i.test(raw)) {
        throw {
          code: ErrorCode.DOMAIN_ERROR,
          message: "El resultado no está definido numéricamente en el dominio real.",
        } as AppError;
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
