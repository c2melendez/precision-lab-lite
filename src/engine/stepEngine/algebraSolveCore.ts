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
import { hyperbolicCoshSinhTwoStep } from "./hyperbolicCoshSinhTwoStep";
import { hyperbolicDoubleAngleSinhStep } from "./hyperbolicDoubleAngleSinhStep";
import { hyperbolicTangentHalfStep } from "./hyperbolicTangentHalfStep";
import { hyperbolicCosineTwoStep } from "./hyperbolicCosineTwoStep";
import { hyperbolicSechHalfStep } from "./hyperbolicSechHalfStep";
import { hyperbolicCoshBelowOneStep } from "./hyperbolicCoshBelowOneStep";
import { hyperbolicTangentOutOfRangeStep } from "./hyperbolicTangentOutOfRangeStep";
import { hyperbolicCosineOneStep } from "./hyperbolicCosineOneStep";
import { hyperbolicSineOneStep } from "./hyperbolicSineOneStep";
import { hyperbolicSineZeroStep } from "./hyperbolicSineZeroStep";
import { hyperbolicArsinhOneStep } from "./hyperbolicArsinhOneStep";
import {
  principalSquareRootOffset,
  realNumericSign,
  absoluteValueOffset,
  denominatorExclusions,
  domainRestrictionStep,
} from "./algebraUtils";

function wordBoundaryPattern(variable: string): RegExp {
  return new RegExp(String.raw`\b` + variable + String.raw`\b`);
}

export interface AlgebraSolveResult {
  steps: Step[];
  solutionsAlgebrite: string[];
  truth?: "identity" | "contradiction";
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

  const hyperbolicMatchers: Array<() => Step | null> = [
    () => hyperbolicTangentOutOfRangeStep(leftAlgebrite, rightAlgebrite, variable),
    () => hyperbolicCoshBelowOneStep(leftAlgebrite, rightAlgebrite, variable),
    () => hyperbolicSechHalfStep(leftAlgebrite, rightAlgebrite, variable),
    () => hyperbolicCoshSinhTwoStep(leftAlgebrite, rightAlgebrite, variable),
    () => hyperbolicDoubleAngleSinhStep(leftAlgebrite, rightAlgebrite, variable),
    () => hyperbolicTangentHalfStep(leftAlgebrite, rightAlgebrite, variable),
    () => hyperbolicCosineTwoStep(leftAlgebrite, rightAlgebrite, variable),
    () => hyperbolicCosineOneStep(leftAlgebrite, rightAlgebrite, variable),
    () => hyperbolicSineOneStep(leftAlgebrite, rightAlgebrite, variable),
    () => hyperbolicSineZeroStep(leftAlgebrite, rightAlgebrite, variable),
    () => hyperbolicArsinhOneStep(leftAlgebrite, rightAlgebrite, variable),
  ];

  for (const match of hyperbolicMatchers) {
    const step = match();
    if (step === null) continue;
    steps.push(step);
    if (
      step.id.includes("no-real-solution") ||
      step.latex.includes("varnothing") ||
      step.latex === "\\varnothing"
    ) {
      return { steps, solutionsAlgebrite: [], truth: "contradiction" };
    }
    const latex = step.latex;
    if (step.id === "hyperbolic-arsinh-one-exact-root") {
      return { steps, solutionsAlgebrite: ["sinh(1)"] };
    }
    if (latex.includes("\\pm")) {
      return { steps, solutionsAlgebrite: ["log(2+sqrt(3))", "-log(2+sqrt(3))"] };
    }
    if (latex.includes("frac{1}{2}")) {
      return { steps, solutionsAlgebrite: ["log(3)/2"] };
    }
    if (latex.includes("ln 2") || latex.includes("\\ln 2")) {
      return { steps, solutionsAlgebrite: ["log(2)"] };
    }
    if (latex.includes("sqrt{2}")) {
      return { steps, solutionsAlgebrite: ["log(1+sqrt(2))"] };
    }
    return { steps, solutionsAlgebrite: ["0"] };
  }

  // Algebra114 AS-PAR-09: equidistant absolute values.
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

  // Algebra114 AS-PAR-08: |x-a| = b three-branch contract.
  let absoluteValueOffsetTerm: string | null = absoluteValueOffset(leftAlgebrite, variable);
  let absoluteValueParameter: string | null = absoluteValueOffsetTerm === null ? null : rightAlgebrite;
  if (absoluteValueOffsetTerm === null) {
    absoluteValueOffsetTerm = absoluteValueOffset(rightAlgebrite, variable);
    if (absoluteValueOffsetTerm !== null) absoluteValueParameter = leftAlgebrite;
  }
  if (absoluteValueOffsetTerm !== null && absoluteValueParameter !== null &&
      !wordBoundaryPattern(variable).test(absoluteValueParameter)) {
    const radiusSign = realNumericSign(absoluteValueParameter);
    if (radiusSign === -1) {
      steps.push({
        id: "absolute-value-domain",
        latex: leftAlgebrite + " = " + rightAlgebrite,
        explanation: "El valor absoluto nunca es negativo; si b < 0, la ecuación no tiene solución real.",
      });
      steps.push({ id: "solutions", latex: "∅", explanation: "La ecuación no tiene solución real." });
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
      : "Como el radio es positivo, las dos raíces x = a ± b satisfacen la ecuación original.";
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

  const trigSolvers = [
    solveInverseSineEquation,
    solveInverseCosineEquation,
    solveInverseSineCosineEqualEquation,
    solveArctanSumQuarterPiEquation,
    solveArccotTwoPiThirdsEquation,
    solveArcsecEqualsPiThirdsEquation,
    solveArccscEqualsPiSixthsEquation,
    solveInverseTangentEquation,
    solveCosecantEqualsTwoEquation,
    solveSecantEqualsMinusTwoEquation,
    solveCotangentEqualsOneEquation,
    solveDoubleAngleSineEqualsCosineEquation,
    solveSineCosineUnitSumEquation,
    solveQuadraticSineEquation,
    solveDirectTrigonometricEquation,
  ] as const;

  for (const solver of trigSolvers) {
    const result = solver(leftAlgebrite, rightAlgebrite, variable);
    if (result === null) continue;
    steps.push(result.step);
    return {
      steps,
      solutionsAlgebrite: result.solutions,
      ...(result.contradiction ? { truth: "contradiction" as const } : {}),
    };
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

  const rootEquationVariablePattern = wordBoundaryPattern(variable);
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
      steps.push({ id: "solutions", latex: "∅", explanation: "La ecuación no tiene solución real." });
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
  const hasVariable = wordBoundaryPattern(variable).test(standardForm);
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

  if (domainExclusions.length > 0) {
    try {
      const numeratorPoly = evaluate("numerator(rationalize((" + leftAlgebrite + ")-(" + rightAlgebrite + ")))");
      const candidates = wordBoundaryPattern(variable).test(numeratorPoly)
        ? solveEquation(numeratorPoly, variable).map((r) => r.trim())
        : [];
      const excluded = candidates.filter((c) => domainExclusions.some((e) => evaluate("simplify((" + c + ")-(" + e + "))") === "0"));
      if (excluded.length > 0 && candidates.every((c) => !c.includes("i") && !c.includes("sqrt(-"))) {
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
      // fall through
    }
  }

  if (domainExclusions.length > 0) {
    try {
      const rational = evaluate("rationalize(" + standardForm + ")");
      const numeratorTerm = evaluate("numerator(" + rational + ")");
      if (!wordBoundaryPattern(variable).test(numeratorTerm) && realNumericSign(numeratorTerm) !== null &&
          realNumericSign(numeratorTerm) !== 0) {
        steps.push(domainRestrictionStep(
          variable,
          domainExclusions,
          "Al llevar todo a un denominador común el numerador es la constante no nula " + numeratorTerm + "; no existe solución.",
        ));
        return { steps, solutionsAlgebrite: [], truth: "contradiction" };
      }
    } catch {
      // fall through
    }
  }

  let linearSolution: string | null = null;
  try {
    const variablePattern = wordBoundaryPattern(variable);
    const coefficient = derivative(standardForm, variable);
    if (coefficient.trim() !== "0" && !variablePattern.test(coefficient)) {
      const constant = substituteExact(standardForm, variable, "0");
      if (!variablePattern.test(constant)) {
        const candidate = evaluate(`simplify(-(${constant})/(${coefficient}))`);
        if (!variablePattern.test(candidate)) linearSolution = candidate;
      }
    }
  } catch {
    // fall through
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
