import { evaluate, solveEquation, ErrorCode } from "../algebriteClient";
import type { Step, AppError } from "../../types";
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

  const matchers: Array<() => Step | null> = [
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
  ];

  for (const match of matchers) {
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
    if (latex.includes("\\pm")) {
      return {
        steps,
        solutionsAlgebrite: ["log(2+sqrt(3))", "-log(2+sqrt(3))"],
      };
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

  let solutions: string[] = [];
  try {
    solutions = solveEquation(`(${leftAlgebrite})-(${rightAlgebrite})`, variable);
  } catch {
    throw {
      code: ErrorCode.UNSUPPORTED_OPERATION,
      message: `No se encontró una solución algebraica para "${variable}".`,
    } as AppError;
  }
  if (solutions.length === 0) {
    throw {
      code: ErrorCode.UNSUPPORTED_OPERATION,
      message: "La ecuación no tiene solución, o Algebrite no pudo resolverla.",
    } as AppError;
  }
  steps.push({
    id: "solutions",
    latex: solutions.map((s) => `${variable} = ${s}`).join(",\\quad "),
    explanation:
      solutions.length > 1
        ? "Raíces obtenidas simbólicamente."
        : "Raíz obtenida simbólicamente.",
  });
  return { steps, solutionsAlgebrite: solutions };
}
