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
        explanation: "La raíz cuadrada real principal nunca es negativa; el lado derecho es negativo, por lo que no existe solución real.",
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

  let solutions: string[];
  const hasVariable = new RegExp(`\\b${variable}\\b`).test(standardForm);
  if (standardForm.trim() === "0") {
    return { steps, solutionsAlgebrite: [], truth: "identity" };
  }
  if (!hasVariable) {
    return { steps, solutionsAlgebrite: [], truth: "contradiction" };
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
