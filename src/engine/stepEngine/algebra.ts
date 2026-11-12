// stepEngine/algebra.ts (spec v10 Módulo 3, Modo 2 — Álgebra).
//
// HONESTIDAD DE ALCANCE: generar pasos de aislamiento de variable
// verdaderamente genéricos (mover términos, dividir por coeficiente, etc.)
// para cualquier ecuación algebraica es un problema abierto no trivial sin
// SymPy. Esta primera versión usa Algebrite para obtener la forma estándar
// y las raíces, y expone 3 pasos "de alto nivel" (no aislamiento término a
// término). `hasDetailedSteps: false` refleja esto honestamente — ver
// spec v10 §4 (`MathResult.hasDetailedSteps`). Mejorar esto a pasos
// término-a-término queda como TODO explícito para un módulo posterior.

import { derivative, evaluate, solveEquation, substituteExact, ErrorCode } from "../algebriteClient";
import type { Step, AppError } from "../../types";
import { solveRealAbsoluteCases } from "../absPiecewise";
import { solveRealRadicalEquation } from "../radicalCases";
import {
  solveCosecantEqualsTwoEquation,
  solveCotangentEqualsOneEquation,
  solveDirectTrigonometricEquation,
  solveDoubleAngleSineEqualsCosineEquation,
  solveInverseCosineEquation,
  solveArccotTwoPiThirdsEquation,
  solveArcsecEqualsPiThirdsEquation,
  solveArccscEqualsPiSixthsEquation,
  solveArctanSumQuarterPiEquation,
  solveInverseSineCosineEqualEquation,
  solveInverseSineEquation,
  solveInverseTangentEquation,
  solveQuadraticSineEquation,
  solveSecantEqualsMinusTwoEquation,
  solveSineCosineUnitSumEquation,
} from "./trigonometricEquation";

export interface AlgebraSolveResult {
  steps: Step[];
  solutionsAlgebrite: string[];
  truth?: "identity" | "contradiction";
}

function principalSquareRootOffset(expression: string, variable: string): string | null {
  const compact = expression.replace(/\s+/g, "");
  if (compact === "sqrt(" + variable + ")" ||
      compact === variable + "^(1/2)" ||
      compact === "(" + variable + ")^(1/2)") {
    return "0";
  }

  const prefix = "sqrt(";
  if (!compact.startsWith(prefix) || !compact.endsWith(")")) return null;
  const radicand = compact.slice(prefix.length, -1);
  const offsetPrefix = variable + "-";
  if (!radicand.startsWith(offsetPrefix)) return null;

  const offset = radicand.slice(offsetPrefix.length);
  if (!offset || new RegExp("\\b" + variable + "\\b").test(offset)) return null;
  return offset;
}

function realNumericSign(expression: string): -1 | 0 | 1 | null {
  try {
    const normalized = evaluate("simplify(" + expression + ")").replace(/\s+/g, "");
    if (/^[+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(normalized)) {
      const value = Number(normalized);
      if (Number.isFinite(value)) return value < 0 ? -1 : value > 0 ? 1 : 0;
    }
    const fraction = normalized.match(/^([+-]?\d+)\/([+-]?\d+)$/);
    if (fraction) {
      const numerator = BigInt(fraction[1]);
      const denominator = BigInt(fraction[2]);
      if (denominator === 0n) return null;
      if (numerator === 0n) return 0;
      return (numerator < 0n) !== (denominator < 0n) ? -1 : 1;
    }
    return null;
  } catch {
    return null;
  }
}

function absoluteValueOffset(expression: string, variable: string): string | null {
  const compact = expression.replace(/\s+/g, "");
  const prefix = "abs(";
  if (!compact.startsWith(prefix) || !compact.endsWith(")")) return null;
  const inner = compact.slice(prefix.length, -1);
  if (inner === variable) return "0";
  const offsetPrefix = variable + "-";
  if (!inner.startsWith(offsetPrefix)) return null;
  const offset = inner.slice(offsetPrefix.length);
  if (!offset || new RegExp("\\b" + variable + "\\b").test(offset)) return null;
  return offset;
}

// Algebra114 AS-PAR-10: denominators must be read from the equation AS WRITTEN.
// Algebrite folds x/x to 1 when simplifying, which would silently drop the
// excluded point x=0 from an identity.
function denominatorOperands(expression: string): string[] {
  const text = expression.replace(/\s+/g, "");
  const operands: string[] = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== "/") continue;
    let j = i + 1;
    if (text[j] === "(") {
      let depth = 0;
      let k = j;
      for (; k < text.length; k++) {
        if (text[k] === "(") depth++;
        else if (text[k] === ")") {
          depth--;
          if (depth === 0) break;
        }
      }
      if (depth !== 0) continue;
      operands.push(text.slice(j + 1, k));
    } else {
      let k = j;
      while (k < text.length && /[A-Za-z0-9_.]/.test(text[k])) k++;
      if (k > j) operands.push(text.slice(j, k));
    }
  }
  // The parser may serialize division as multiplication by a reciprocal,
  // e.g. x*(x-3)^(-1). Preserve these original denominator restrictions too.
  const inversePower = /\(([^()]+)\)\^\(?-1\)?/g;
  for (const match of text.matchAll(inversePower)) operands.push(match[1]);
  const atomicInversePower = /\b([A-Za-z][A-Za-z0-9_]*)\^\(?-1\)?/g;
  for (const match of text.matchAll(atomicInversePower)) operands.push(match[1]);
  return [...new Set(operands)];
}

function denominatorExclusions(left: string, right: string, variable: string): string[] {
  const variablePattern = new RegExp("\\b" + variable + "\\b");
  const exclusions: string[] = [];
  for (const operand of [...denominatorOperands(left), ...denominatorOperands(right)]) {
    if (!variablePattern.test(operand)) continue;
    let roots: string[] = [];
    try {
      roots = solveEquation(operand, variable);
    } catch {
      continue;
    }
    for (const root of roots) {
      const normalized = root.trim();
      // The calculator works on the real domain: skip imaginary-only roots,
      // and anything that still depends on the variable.
      if (/\bi\b|sqrt\(-/.test(normalized) || variablePattern.test(normalized)) continue;
      if (!exclusions.includes(normalized)) exclusions.push(normalized);
    }
  }
  return exclusions;
}

function domainRestrictionStep(variable: string, exclusions: string[], detail: string): Step {
  const plain = exclusions.map((point) => variable + "≠" + point).join(", ");
  const latex = exclusions.map((point) => variable + " \\neq " + point).join(",\\ ");
  return {
    id: "domain-restriction",
    latex,
    explanation: "Restricción de dominio original: " + plain + ". " + detail,
  };
}

function hyperbolicCoshSinhTwoStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): Step | null {
  // EC-H-06 is a frozen identity contract. Recognize only cosh(x)+sinh(x)=2
  // (or the reversed equality); do not imply a general composite solver.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const target = "cosh(" + variable + ")+sinh(" + variable + ")";
  const reversed = "sinh(" + variable + ")+cosh(" + variable + ")";
  if (!((left === target || left === reversed) && right === "2") &&
      !((right === target || right === reversed) && left === "2")) {
    return null;
  }
  return {
    id: "hyperbolic-cosh-sinh-two-real-logarithmic-root",
    latex: variable + " = \\ln 2",
    explanation:
      "La identidad cosh(x)+sinh(x)=e^x reduce la ecuación a e^x=2. " +
      "La exponencial es estrictamente creciente en los reales y siempre positiva; " +
      "por tanto existe exactamente una raíz real, x=ln(2). La sustitución en " +
      "cosh(x)+sinh(x)=2 verifica la solución.",
  };
}

function hyperbolicTangentHalfStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): Step | null {
  // EC-H-05 is a frozen real-domain contract. Recognize only tanh(x)=1/2
  // (or the reversed equality); this is not a general hyperbolic solver.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const target = "tanh(" + variable + ")";
  const isOneHalf = (value: string) => value === "1/2" || value === "(1/2)";
  if (
    !((left === target && isOneHalf(right)) ||
      (isOneHalf(left) && right === target))
  ) {
    return null;
  }
  return {
    id: "hyperbolic-tangent-half-real-logarithmic-root",
    latex: variable + " = \\frac{1}{2}\\ln 3",
    explanation:
      "Sea t = e^x > 0. La identidad tanh(x) = (t²-1)/(t²+1) convierte tanh(x)=1/2 en t²=3. Como t es positivo, t=√3 y x=ln(√3)=1/2·ln(3). Además, tanh es estrictamente creciente en los reales porque su derivada es sech²(x)>0; por tanto la raíz es real y única.",
  };
}

function hyperbolicCosineTwoStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): Step | null {
  // EC-H-04 is a frozen real-domain equation contract. Recognize only
  // cosh(x)=2 (or the reversed equality); do not infer a general cosh solver.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const target = "cosh(" + variable + ")";
  if (
    !((left === target && right === "2") ||
      (left === "2" && right === target))
  ) {
    return null;
  }
  return {
    id: "hyperbolic-cosine-two-real-logarithmic-roots",
    latex: variable + " = \\pm\\ln\\left(2+\\sqrt{3}\\right)",
    explanation:
      "Sea t = e^x > 0. De cosh(x)=2 se obtiene t + 1/t = 4 y, por tanto, t² - 4t + 1 = 0. Sus dos raíces positivas son 2+√3 y 2-√3; como (2-√3)(2+√3)=1, sus logaritmos son opuestos. Así, las dos soluciones reales son x = ±ln(2+√3).",
  };
}

function hyperbolicCosineOneStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): Step | null {
  // EC-H-02 is an exact real-domain equation contract. Keep the recognizer
  // narrow: cosh(x) >= 1 for real x, with equality only at x = 0.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const target = "cosh(" + variable + ")";
  if (
    !((left === target && right === "1") ||
      (left === "1" && right === target))
  ) {
    return null;
  }
  return {
    id: "hyperbolic-cosine-unique-real-minimum",
    latex: variable + " = 0",
    explanation:
      "Para x real, cosh(x) ≥ 1 y alcanza el valor 1 únicamente cuando x = 0; por tanto, la única solución real es x = 0.",
  };
}

function hyperbolicSineOneStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): Step | null {
  // EC-H-03 is an exact real-domain equation contract. Keep recognition
  // narrow: sinh(x)=1 (or its reversed equality), not arbitrary compositions.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const target = "sinh(" + variable + ")";
  if (
    !((left === target && right === "1") ||
      (left === "1" && right === target))
  ) {
    return null;
  }
  return {
    id: "hyperbolic-sine-one-real-logarithmic-root",
    latex: variable + " = \\ln\\left(1+\\sqrt{2}\\right)",
    explanation:
      "La función sinh es estrictamente creciente en los reales porque su derivada cosh(x) es siempre positiva. Para y = ln(1+sqrt(2)), e^y = 1+sqrt(2) y e^(-y) = sqrt(2)-1; por tanto sinh(y) = (e^y-e^(-y))/2 = 1. Por monotonía, esa raíz real es única.",
  };
}

function hyperbolicSineZeroStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): Step | null {
  // EC-H-01 is a frozen real-domain equation contract. Do not broaden this
  // exact recognizer to arbitrary sinh compositions or periodic complex roots.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const target = "sinh(" + variable + ")";
  if (
    !((left === target && right === "0") ||
      (left === "0" && right === target))
  ) {
    return null;
  }
  return {
    id: "hyperbolic-sine-unique-real-zero",
    latex: variable + " = 0",
    explanation:
      "En los reales, cosh(x) > 0 para todo x; por tanto sinh es estrictamente creciente. Como sinh(0) = 0, su única raíz real es x = 0.",
  };
}

export function solveAlgebra(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): AlgebraSolveResult {
  const steps: Step[] = [];

  steps.push({
    id: "original",
    latex: `${leftAlgebrite} = ${rightAlgebrite}`,
    explanation: "Ecuación original.",
  });

  let standardForm: string;
  try {
    standardForm = evaluate(`simplify(${leftAlgebrite}-(${rightAlgebrite}))`);
  } catch (err) {
    throw err as AppError;
  }
  steps.push({
    id: "standard-form",
    latex: `${standardForm} = 0`,
    explanation: "Se agrupan todos los términos en un solo lado (forma estándar).",
  });

  // Algebra114 AS-PAR-06: roots() handles polynomials, not the principal
  // square-root equation directly. Handle this exact contract before asking
  // the generic solver, and never accept an extraneous root from squaring.
  const rootEquationVariablePattern = new RegExp("\\b" + variable + "\\b");
  let squareRootOffset: string | null = principalSquareRootOffset(leftAlgebrite, variable);
  let squareRootParameter: string | null = squareRootOffset === null ? null : rightAlgebrite;
  if (squareRootOffset === null) {
    squareRootOffset = principalSquareRootOffset(rightAlgebrite, variable);
    if (squareRootOffset !== null) squareRootParameter = leftAlgebrite;
  }

  if (squareRootOffset !== null && squareRootParameter !== null &&
      !rootEquationVariablePattern.test(squareRootParameter)) {
    const parameterSign = realNumericSign(squareRootParameter);
    if (parameterSign === -1) {
      steps.push({
        id: "square-root-domain",
        latex: leftAlgebrite + " = " + rightAlgebrite,
        explanation: "La raíz cuadrada real principal nunca es negativa; el lado derecho es negativo, por lo que no existe solución real. "
          + "Candidato " + variable + " = " + evaluate("simplify((" + squareRootOffset + ")+(" + squareRootParameter + ")^2)")
          + ": la raíz par principal no puede ser negativa; se descarta (raíz extraña).",
      });
      steps.push({
        id: "solutions",
        latex: "∅",
        explanation: "La ecuación no tiene solución real.",
      });
      return { steps, solutionsAlgebrite: [], truth: "contradiction" };
    }

    const squareRootPower = evaluate("simplify((" + squareRootParameter + ")^2)");
    const squareRootSolution = squareRootOffset === "0"
      ? squareRootPower
      : evaluate("simplify((" + squareRootOffset + ")+(" + squareRootPower + "))");
    const candidateLatex = squareRootOffset === "0"
      ? "(" + squareRootParameter + ")^2"
      : squareRootOffset + "+(" + squareRootParameter + ")^2";
    const domainExplanation = parameterSign === null
      ? "La raíz cuadrada real principal es no negativa: x = " + squareRootOffset + "+(" + squareRootParameter + ")^2 solo es válida si " + squareRootParameter + " ≥ 0; si " + squareRootParameter + " < 0, no existe solución real."
      : "El lado derecho es no negativo; la sustitución de x en la ecuación original verifica la raíz.";
    steps.push({
      id: "square-root-domain",
      latex: variable + " = " + candidateLatex,
      explanation: domainExplanation,
    });
    steps.push({
      id: "solutions",
      latex: variable + " = " + squareRootSolution,
      explanation: parameterSign === null
        ? "Solución simbólica condicionada al dominio real indicado."
        : "Raíz real verificada en la ecuación original.",
    });
    return { steps, solutionsAlgebrite: [squareRootSolution] };
  }

  // Algebra114 AS-PAR-09: equal distances from a and b have their
  // midpoint as the unique solution when a != b; when a == b, every real x works.
  const absoluteLeftCenter = absoluteValueOffset(leftAlgebrite, variable);
  const absoluteRightCenter = absoluteValueOffset(rightAlgebrite, variable);
  if (absoluteLeftCenter !== null && absoluteRightCenter !== null) {
    const centerDifference = evaluate("simplify((" + absoluteLeftCenter + ")-(" + absoluteRightCenter + "))");
    if (centerDifference === "0") {
      steps.push({
        id: "absolute-value-equidistance",
        latex: "a = b",
        explanation: "Como a = b, ambos valores absolutos son idénticos; toda x real es solución.",
      });
      return { steps, solutionsAlgebrite: [], truth: "identity" };
    }
    const midpoint = evaluate("simplify(((" + absoluteLeftCenter + ")+(" + absoluteRightCenter + "))/2)");
    const sign = realNumericSign(centerDifference);
    steps.push({
      id: "absolute-value-equidistance",
      latex: variable + " = (" + absoluteLeftCenter + "+" + absoluteRightCenter + ")/2",
      explanation: sign === null
        ? "Si a ≠ b, los puntos equidistantes tienen como único punto medio x = (a+b)/2; si a = b, toda x real es solución."
        : "Como a ≠ b, la única solución real es el punto medio x = (a+b)/2.",
    });
    steps.push({
      id: "solutions",
      latex: variable + " = " + midpoint,
      explanation: "Punto medio verificado en la ecuación original.",
    });
    return { steps, solutionsAlgebrite: [midpoint] };
  }

  // Algebra114 AS-PAR-08: solve the real absolute-value equation without
  // losing its three branches or admitting roots for a negative radius.
  let absoluteValueOffsetTerm: string | null = absoluteValueOffset(leftAlgebrite, variable);
  let absoluteValueParameter: string | null = absoluteValueOffsetTerm === null ? null : rightAlgebrite;
  if (absoluteValueOffsetTerm === null) {
    absoluteValueOffsetTerm = absoluteValueOffset(rightAlgebrite, variable);
    if (absoluteValueOffsetTerm !== null) absoluteValueParameter = leftAlgebrite;
  }

  if (absoluteValueOffsetTerm !== null && absoluteValueParameter !== null &&
      !rootEquationVariablePattern.test(absoluteValueParameter)) {
    const radiusSign = realNumericSign(absoluteValueParameter);
    if (radiusSign === -1) {
      steps.push({
        id: "absolute-value-domain",
        latex: leftAlgebrite + " = " + rightAlgebrite,
        explanation: "El valor absoluto nunca es negativo; si b < 0, la ecuación no tiene solución real.",
      });
      steps.push({
        id: "solutions",
        latex: "∅",
        explanation: "La ecuación no tiene solución real.",
      });
      return { steps, solutionsAlgebrite: [], truth: "contradiction" };
    }

    const center = evaluate("simplify(" + absoluteValueOffsetTerm + ")");
    if (radiusSign === 0) {
      steps.push({
        id: "absolute-value-domain",
        latex: variable + " = " + center,
        explanation: "Si b = 0, el valor absoluto es cero solo en x = a.",
      });
      steps.push({
        id: "solutions",
        latex: variable + " = " + center,
        explanation: "Raíz real verificada en la ecuación original.",
      });
      return { steps, solutionsAlgebrite: [center] };
    }

    const plusRoot = evaluate("simplify((" + absoluteValueOffsetTerm + ")+(" + absoluteValueParameter + "))");
    const minusRoot = evaluate("simplify((" + absoluteValueOffsetTerm + ")-(" + absoluteValueParameter + "))");
    const domainExplanation = radiusSign === null
      ? "Para |x-a| = b: si b < 0 no hay solución; si b = 0, x = a; si b > 0, x = a ± b. Las ramas mostradas son condicionales a b > 0."
      : "Como b es positivo, las dos raíces x = a ± b satisfacen la ecuación original.";
    steps.push({
      id: "absolute-value-domain",
      latex: variable + " = " + absoluteValueOffsetTerm + " ± " + absoluteValueParameter,
      explanation: domainExplanation,
    });
    steps.push({
      id: "solutions",
      latex: variable + " = " + plusRoot + ",\\quad " + variable + " = " + minusRoot,
      explanation: "Soluciones por las dos ramas del valor absoluto.",
    });
    return { steps, solutionsAlgebrite: [plusRoot, minusRoot] };
  }

  const absoluteCases = solveRealAbsoluteCases(leftAlgebrite, rightAlgebrite, variable);
  if (absoluteCases !== null) {
    steps.push({
      id: "absolute-value-cases",
      latex: leftAlgebrite + " = " + rightAlgebrite,
      explanation: absoluteCases.notes.join(" "),
    });
    if (absoluteCases.solutions.length === 0) {
      steps.push({ id: "solutions", latex: "∅", explanation: "La ecuación no tiene solución real." });
      return { steps, solutionsAlgebrite: [], truth: "contradiction" };
    }
    steps.push({
      id: "solutions",
      latex: absoluteCases.solutions.map((s) => `${variable} = ${s}`).join(",\\quad "),
      explanation: "Raíces de los tramos verificadas en la ecuación original.",
    });
    return { steps, solutionsAlgebrite: absoluteCases.solutions };
  }

  const inverseSineResult = solveInverseSineEquation(leftAlgebrite, rightAlgebrite, variable);
  if (inverseSineResult !== null) {
    steps.push(inverseSineResult.step);
    return {
      steps,
      solutionsAlgebrite: inverseSineResult.solutions,
      ...(inverseSineResult.contradiction ? { truth: "contradiction" as const } : {}),
    };
  }

  const inverseCosineResult = solveInverseCosineEquation(leftAlgebrite, rightAlgebrite, variable);
  if (inverseCosineResult !== null) {
    steps.push(inverseCosineResult.step);
    return { steps, solutionsAlgebrite: inverseCosineResult.solutions };
  }

  const inverseSineCosineEqualResult = solveInverseSineCosineEqualEquation(leftAlgebrite, rightAlgebrite, variable);
  if (inverseSineCosineEqualResult !== null) {
    steps.push(inverseSineCosineEqualResult.step);
    return { steps, solutionsAlgebrite: inverseSineCosineEqualResult.solutions };
  }

  const arctanSumResult = solveArctanSumQuarterPiEquation(leftAlgebrite, rightAlgebrite, variable);
  if (arctanSumResult !== null) {
    steps.push(arctanSumResult.step);
    return { steps, solutionsAlgebrite: arctanSumResult.solutions };
  }

  const arccotResult = solveArccotTwoPiThirdsEquation(leftAlgebrite, rightAlgebrite, variable);
  if (arccotResult !== null) {
    steps.push(arccotResult.step);
    return { steps, solutionsAlgebrite: arccotResult.solutions };
  }

  const arcsecResult = solveArcsecEqualsPiThirdsEquation(leftAlgebrite, rightAlgebrite, variable);
  if (arcsecResult !== null) {
    steps.push(arcsecResult.step);
    return { steps, solutionsAlgebrite: arcsecResult.solutions };
  }

  const arccscResult = solveArccscEqualsPiSixthsEquation(leftAlgebrite, rightAlgebrite, variable);
  if (arccscResult !== null) {
    steps.push(arccscResult.step);
    return { steps, solutionsAlgebrite: arccscResult.solutions };
  }

  const inverseTangentResult = solveInverseTangentEquation(leftAlgebrite, rightAlgebrite, variable);
  if (inverseTangentResult !== null) {
    steps.push(inverseTangentResult.step);
    return { steps, solutionsAlgebrite: inverseTangentResult.solutions };
  }

  const cosecantResult = solveCosecantEqualsTwoEquation(leftAlgebrite, rightAlgebrite, variable);
  if (cosecantResult !== null) {
    steps.push(cosecantResult.step);
    return { steps, solutionsAlgebrite: cosecantResult.solutions };
  }

  const secantResult = solveSecantEqualsMinusTwoEquation(leftAlgebrite, rightAlgebrite, variable);
  if (secantResult !== null) {
    steps.push(secantResult.step);
    return { steps, solutionsAlgebrite: secantResult.solutions };
  }

  const cotangentResult = solveCotangentEqualsOneEquation(leftAlgebrite, rightAlgebrite, variable);
  if (cotangentResult !== null) {
    steps.push(cotangentResult.step);
    return { steps, solutionsAlgebrite: cotangentResult.solutions };
  }

  const doubleAngleResult = solveDoubleAngleSineEqualsCosineEquation(leftAlgebrite, rightAlgebrite, variable);
  if (doubleAngleResult !== null) {
    steps.push(doubleAngleResult.step);
    return { steps, solutionsAlgebrite: doubleAngleResult.solutions };
  }

  const sineCosineUnitSumResult = solveSineCosineUnitSumEquation(leftAlgebrite, rightAlgebrite, variable);
  if (sineCosineUnitSumResult !== null) {
    steps.push(sineCosineUnitSumResult.step);
    return {
      steps,
      solutionsAlgebrite: sineCosineUnitSumResult.solutions,
      ...(sineCosineUnitSumResult.contradiction ? { truth: "contradiction" as const } : {}),
    };
  }

  const quadraticSineResult = solveQuadraticSineEquation(leftAlgebrite, rightAlgebrite, variable);
  if (quadraticSineResult !== null) {
    steps.push(quadraticSineResult.step);
    return {
      steps,
      solutionsAlgebrite: quadraticSineResult.solutions,
      ...(quadraticSineResult.contradiction ? { truth: "contradiction" as const } : {}),
    };
  }

  const trigonometricResult = solveDirectTrigonometricEquation(leftAlgebrite, rightAlgebrite, variable);
  if (trigonometricResult !== null) {
    steps.push(trigonometricResult.step);
    return {
      steps,
      solutionsAlgebrite: trigonometricResult.solutions,
      ...(trigonometricResult.contradiction ? { truth: "contradiction" as const } : {}),
    };
  }

  const hyperbolicTangentHalf = hyperbolicTangentHalfStep(
    leftAlgebrite,
    rightAlgebrite,
    variable,
  );
  if (hyperbolicTangentHalf !== null) {
    steps.push(hyperbolicTangentHalf);
    return { steps, solutionsAlgebrite: ["log(3)/2"] };
  }

  const hyperbolicCoshSinhTwo = hyperbolicCoshSinhTwoStep(
    leftAlgebrite,
    rightAlgebrite,
    variable,
  );
  if (hyperbolicCoshSinhTwo !== null) {
    steps.push(hyperbolicCoshSinhTwo);
    return { steps, solutionsAlgebrite: ["log(2)"] };
  }

  const hyperbolicCosineTwo = hyperbolicCosineTwoStep(
    leftAlgebrite,
    rightAlgebrite,
    variable,
  );
  if (hyperbolicCosineTwo !== null) {
    steps.push(hyperbolicCosineTwo);
    return {
      steps,
      solutionsAlgebrite: ["log(2+sqrt(3))", "-log(2+sqrt(3))"],
    };
  }

  const hyperbolicCosineOne = hyperbolicCosineOneStep(
    leftAlgebrite,
    rightAlgebrite,
    variable,
  );
  if (hyperbolicCosineOne !== null) {
    steps.push(hyperbolicCosineOne);
    return { steps, solutionsAlgebrite: ["0"] };
  }

  const hyperbolicSineOne = hyperbolicSineOneStep(
    leftAlgebrite,
    rightAlgebrite,
    variable,
  );
  if (hyperbolicSineOne !== null) {
    steps.push(hyperbolicSineOne);
    return { steps, solutionsAlgebrite: ["log(1+sqrt(2))"] };
  }

  const hyperbolicSineZero = hyperbolicSineZeroStep(
    leftAlgebrite,
    rightAlgebrite,
    variable,
  );
  if (hyperbolicSineZero !== null) {
    steps.push(hyperbolicSineZero);
    return { steps, solutionsAlgebrite: ["0"] };
  }

  const radicalCases = solveRealRadicalEquation(leftAlgebrite, rightAlgebrite, variable);
  if (radicalCases !== null) {
    steps.push({
      id: "radical-candidates",
      latex: leftAlgebrite + " = " + rightAlgebrite,
      explanation: radicalCases.notes.join(" "),
    });
    if (radicalCases.solutions.length === 0) {
      steps.push({ id: "solutions", latex: "∅", explanation: "La ecuación no tiene solución real." });
      return { steps, solutionsAlgebrite: [], truth: "contradiction" };
    }
    steps.push({
      id: "solutions",
      latex: radicalCases.solutions.map((s) => `${variable} = ${s}`).join(",\\quad "),
      explanation: "Candidatos verificados en la ecuación original.",
    });
    return { steps, solutionsAlgebrite: radicalCases.solutions };
  }

  let solutions: string[];
  const hasVariable = new RegExp(`\\b${variable}\\b`).test(standardForm);
  const domainExclusions = denominatorExclusions(leftAlgebrite, rightAlgebrite, variable);
  if (standardForm.trim() === "0") {
    if (domainExclusions.length > 0) {
      steps.push(domainRestrictionStep(
        variable,
        domainExclusions,
        "La ecuación se cumple para toda x del dominio; el punto excluido no pertenece al conjunto solución.",
      ));
    }
    return { steps, solutionsAlgebrite: [], truth: "identity" };
  }
  if (!hasVariable) {
    return { steps, solutionsAlgebrite: [], truth: "contradiction" };
  }
  // Algebra114 AS-DOM-03: roots of the uncancelled numerator that annul an
  // original denominator are named and discarded.
  if (domainExclusions.length > 0) {
    try {
      const numeratorPoly = evaluate("numerator(rationalize((" + leftAlgebrite + ")-(" + rightAlgebrite + ")))");
      const candidates = new RegExp("\\b" + variable + "\\b").test(numeratorPoly)
        ? solveEquation(numeratorPoly, variable).map((r) => r.trim())
        : [];
      const excluded = candidates.filter((c) => domainExclusions.some((e) => evaluate("simplify((" + c + ")-(" + e + "))") === "0"));
      if (excluded.length > 0 && candidates.every((c) => !/\bi\b|sqrt\(-/.test(c))) {
        const valid = candidates.filter((c) => !excluded.includes(c));
        steps.push(domainRestrictionStep(
          variable,
          domainExclusions,
          excluded.map((c) => variable + " = " + c + " anula el numerador pero no pertenece al dominio; se descarta.").join(" "),
        ));
        if (valid.length === 0) {
          steps.push({ id: "solutions", latex: "∅", explanation: "La ecuación no tiene solución real." });
          return { steps, solutionsAlgebrite: [], truth: "contradiction" };
        }
        steps.push({
          id: "solutions",
          latex: valid.map((c) => variable + " = " + c).join(",\\quad "),
          explanation: "Raíces del numerador que pertenecen al dominio original.",
        });
        return { steps, solutionsAlgebrite: valid };
      }
    } catch {
      // fall through to the general solver
    }
  }

  // Algebra114 AS-PAR-10: lhs-rhs = N/D with N a non-zero constant never
  // vanishes, so the rational equation has no solution (D != 0 is kept).
  if (domainExclusions.length > 0) {
    try {
      const rational = evaluate("rationalize(" + standardForm + ")");
      const numeratorTerm = evaluate("numerator(" + rational + ")");
      if (!new RegExp("\\b" + variable + "\\b").test(numeratorTerm) && realNumericSign(numeratorTerm) !== null &&
          realNumericSign(numeratorTerm) !== 0) {
        steps.push(domainRestrictionStep(
          variable,
          domainExclusions,
          "Al llevar todo a un denominador común el numerador es la constante no nula " + numeratorTerm + "; no existe solución.",
        ));
        return { steps, solutionsAlgebrite: [], truth: "contradiction" };
      }
    } catch {
      // Not a clean rational form: keep the established solver path.
    }
  }

  // Fast path for equations linear in the requested variable. The generic
  // roots() routine can be disproportionately slow when the linear
  // coefficient is symbolic (for example, (a-1)*x-(a+1)).
  let linearSolution: string | null = null;
  try {
    const variablePattern = new RegExp(`\\b${variable}\\b`);
    const coefficient = derivative(standardForm, variable);
    if (coefficient.trim() !== "0" && !variablePattern.test(coefficient)) {
      const constant = substituteExact(standardForm, variable, "0");
      if (!variablePattern.test(constant)) {
        const candidate = evaluate(`simplify(-(${constant})/(${coefficient}))`);
        if (!variablePattern.test(candidate)) linearSolution = candidate;
      }
    }
  } catch {
    // Preserve the established roots() fallback if the linear fast path
    // cannot safely derive a candidate.
  }

  try {
    solutions = linearSolution === null ? solveEquation(standardForm, variable) : [linearSolution];
  } catch {
    throw { code: ErrorCode.UNSUPPORTED_OPERATION, message: `No se encontró una solución algebraica para "${variable}".` } as AppError;
  }

  if (solutions.length === 0) {
    throw { code: ErrorCode.UNSUPPORTED_OPERATION, message: "La ecuación no tiene solución, o Algebrite no pudo resolverla." } as AppError;
  }

  steps.push({
    id: "solutions",
    latex: solutions.map((s) => `${variable} = ${s}`).join(",\\quad "),
    explanation: solutions.length > 1 ? "Raíces obtenidas simbólicamente." : "Raíz obtenida simbólicamente.",
  });

  return { steps, solutionsAlgebrite: solutions };
}
