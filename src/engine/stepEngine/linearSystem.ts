// stepEngine/linearSystem.ts (spec v10 §8, Módulo 5 — Modo Sistemas).
//
// Truco de extracción de coeficientes: para una ecuación LINEAL en forma
// "expr = 0" (ya combinada por el parser), el coeficiente de cada variable
// v es simplemente d(expr, v) evaluado — si el sistema es de verdad lineal,
// esa derivada es una constante (sin variables). El término independiente
// es expr evaluada con todas las variables en 0. Esto evita escribir un
// extractor de coeficientes propio y reutiliza el motor simbólico que ya
// existe (Algebrite `d()`), con una validación explícita de linealidad.

import { evaluate, derivative, ErrorCode, simplifyExpression, solveEquation, substituteExact, toLatex } from "../algebriteClient";
import { gaussJordan, toFractionMatrix, type Matrix, type SystemCase, type SystemSolution } from "../matrixOps";
import type { AppError } from "../../types";
import Fraction from "fraction.js";

function linearError(message: string): AppError {
  return { code: ErrorCode.UNSUPPORTED_OPERATION, message };
}

/** Extrae {coeficientes, constante} de una ecuación combinada ("expr = 0"), validando que sea lineal. */
function extractRow(equationAlgebrite: string, variables: string[]): { coeffs: string[]; constant: string } {
  const coeffs: string[] = [];

  for (const v of variables) {
    const coeff = derivative(equationAlgebrite, v, 1);
    // Validación de linealidad: la derivada respecto a v no debe contener
    // ninguna otra variable del sistema (si las contuviera, el término
    // original tenía un producto de variables, es decir, no es lineal).
    for (const other of variables) {
      if (other !== v && new RegExp(`\\b${other}\\b`).test(coeff)) {
        throw linearError(
          `La ecuación no es lineal (el término con "${v}" y "${other}" está multiplicado entre sí). Este modo solo resuelve sistemas lineales.`,
        );
      }
    }
    coeffs.push(coeff);
  }

  let substituted = equationAlgebrite;
  for (const v of variables) {
    // Fase 1 (fusión de modos): bug preexistente confirmado contra el
    // paquete real de Algebrite — subst() toma (nuevo_valor,
    // variable_vieja, expr), NO (variable_vieja, valor, expr). El orden
    // invertido hacía que la sustitución nunca reemplazara nada, dejando
    // "constant" con variables libres sin evaluar (ej. "5-2*x-y" en vez
    // de un número), lo que rompía toFractionMatrix() para CUALQUIER
    // sistema — no solo casos límite. Este bug ya causaba que
    // tests/linearSystem.test.ts fallara antes de esta fase; ahora que
    // el router de la pantalla única también depende de esta función, se
    // corrige acá en vez de dejarlo pendiente.
    substituted = `subst(0,${v},${substituted})`;
  }
  const constant = evaluate(substituted);

  return { coeffs, constant };
}

function isNumericExpression(value: string): boolean {
  return /^\s*-?\d+(?:\/\d+)?\s*$/.test(value);
}

function collectParameters(rows: { coeffs: string[]; constant: string }[], variables: string[]): string[] {
  const names = (rows.flatMap((row) => [...row.coeffs, row.constant]).join("+").match(/[A-Za-z_]\w*/g) ?? []);
  const excluded = new Set([...variables, "pi", "e", "i"]);
  return [...new Set(names.filter((name) => !excluded.has(name)))].sort();
}

/**
 * Sistemas 2×2 con un único parámetro externo (MV-D-13). Se separa el caso
 * genérico (determinante no nulo) de las raíces del determinante. El caso
 * genérico se resuelve por Cramer y cada raíz se sustituye en el sistema
 * numérico exacto. Es un alcance deliberadamente acotado: no se simula un
 * análisis por casos general para cualquier número de ecuaciones/parámetros.
 */
function solveParametric2x2(
  rows: { coeffs: string[]; constant: string }[],
  variables: string[],
  parameter: string,
): SystemSolution {
  const [[a00, a01], [a10, a11]] = rows.map((row) => row.coeffs);
  const [b0, b1] = rows.map((row) => `-(${row.constant})`);
  const det = simplifyExpression(`(${a00})*(${a11})-(${a01})*(${a10})`);
  if (det === "0") {
    throw linearError(
      "El sistema es singular para todos los valores del parámetro; este analizador solo separa casos cuando el determinante depende del parámetro.",
    );
  }

  const roots = solveEquation(`${det}=0`, parameter)
    .map((root) => simplifyExpression(root))
    .filter((root) => root.length > 0);
  const conditions = roots.map((root) => `${parameter}!=(${root})`);
  const conditionsLatex = roots
    .map((root) => `${parameter} \\neq ${toLatex(root)}`)
    .join("\\ \\text{y}\\ ");

  const xValue = simplifyExpression(`((${b0})*(${a11})-(${a01})*(${b1}))/(${det})`);
  const yValue = simplifyExpression(`((${a00})*(${b1})-(${b0})*(${a10}))/(${det})`);
  const genericCase: SystemCase = {
    conditionAlgebrite: conditions.length > 0 ? conditions.join(" and ") : "1=1",
    conditionLatex: conditions.length > 0 ? conditionsLatex : "\\text{todos los valores de } " + parameter,
    kind: "unique",
    ...(isNumericExpression(xValue) && isNumericExpression(yValue)
      ? { values: [new Fraction(xValue), new Fraction(yValue)] }
      : { symbolicValues: [xValue, yValue] }),
    explanation: "Caso genérico: el determinante no se anula.",
  };

  const cases: SystemCase[] = [genericCase];
  for (const root of roots) {
    const substituted = rows.map((row) => ({
      coeffs: row.coeffs.map((cell) => evaluate(substituteExact(cell, parameter, root))),
      constant: evaluate(substituteExact(row.constant, parameter, root)),
    }));
    let augmented: Matrix;
    try {
      augmented = toFractionMatrix(
        substituted.map((row) => [
          ...row.coeffs,
          evaluate(`-(${row.constant})`),
        ]),
      );
    } catch {
      throw linearError(
        `No se pudo convertir a números exactos el caso ${parameter}=${root} del sistema paramétrico.`,
      );
    }
    const branch = gaussJordan(augmented, variables);
    cases.push({
      conditionAlgebrite: `${parameter}=(${root})`,
      conditionLatex: `${parameter} = ${toLatex(root)}`,
      kind: branch.kind,
      values: branch.values,
      parametric: branch.parametric,
      explanation:
        branch.kind === "infinite"
          ? "Caso especial: el sistema es compatible indeterminado."
          : branch.kind === "none"
            ? "Caso especial: el sistema es incompatible."
            : "Caso especial con solución única.",
    });
  }

  return {
    kind: genericCase.kind,
    values: genericCase.values,
    cases,
    steps: [
      {
        id: "parametric-system",
        latex: `\\Delta = ${toLatex(det)}`,
        explanation:
          roots.length > 0
            ? `El determinante se anula para ${roots.map((root) => `${parameter}=${root}`).join(", ")}; se analizan los casos.`
            : "El determinante no se anula para ningún valor real del parámetro.",
      },
    ],
  };
}

/**
 * Resuelve un sistema lineal (2-4 variables, cualquier número de ecuaciones
 * entre 2 y 6) dado un array de ecuaciones ya combinadas por el parser
 * ("expr = 0" cada una) y el conjunto de variables, en el orden en que se
 * reportan. Los sistemas con un único parámetro externo y forma 2×2 se
 * analizan por casos; el resto debe ser numérico exacto.
 */
export function solveLinearSystem(equationsAlgebrite: string[], variables: string[]): SystemSolution {
  if (equationsAlgebrite.length === 0 || variables.length === 0) {
    throw linearError("El sistema necesita al menos una ecuación y una variable.");
  }
  if (new Set(variables).size !== variables.length) {
    throw linearError("Las variables del sistema no pueden repetirse.");
  }

  const extracted = equationsAlgebrite.map((eq) => extractRow(eq, variables));
  const allNumeric = extracted.every((row) =>
    [...row.coeffs, row.constant].every(isNumericExpression),
  );

  if (!allNumeric) {
    const parameters = collectParameters(extracted, variables);
    if (parameters.length === 1 && variables.length === 2 && extracted.length === 2) {
      return solveParametric2x2(extracted, variables, parameters[0]);
    }
    throw linearError(
      parameters.length === 0
        ? "El sistema contiene coeficientes simbólicos que no se pudieron reducir a números exactos."
        : `Los sistemas con parámetros solo están soportados en forma 2×2 con un parámetro; se encontraron: ${parameters.join(", ")}.`,
    );
  }

  const rows = extracted.map(({ coeffs, constant }) => {
    // expr = sum(coef*var) + constante = 0  =>  sum(coef*var) = -constante
    const rhs = evaluate(`-(${constant})`);
    return [...coeffs, rhs];
  });

  const augmented = toFractionMatrix(rows);
  return gaussJordan(augmented, variables);
}
