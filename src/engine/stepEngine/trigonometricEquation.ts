import { evaluate, solveEquation, toLatex } from "../algebriteClient";
import type { Step } from "../../types";

type DirectTrigFunction = "sin" | "cos" | "tan";

export interface TrigonometricEquationResult {
  solutions: string[];
  step: Step;
  contradiction: boolean;
}

function simplify(expression: string): string {
  return evaluate("simplify(" + expression + ")").replace(/\s+/g, "");
}

function numericValue(expression: string): number | null {
  try {
    const raw = evaluate("float(" + expression + ")")
      .trim()
      .replace(/\.\.\.$/, "");
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(raw)) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function equivalent(left: string, right: string): boolean {
  try {
    return simplify("(" + left + ")-(" + right + ")") === "0";
  } catch {
    return false;
  }
}

function uniqueRoots(values: string[]): string[] {
  const result: string[] = [];
  for (const value of values) {
    if (!result.some((existing) => equivalent(existing, value))) result.push(value);
  }
  return result;
}

/**
 * Solves the bounded polynomial family P(sin(x))=0 when P is quadratic
 * with numeric coefficients. Roots are converted to their exact sine
 * branches in [0, 2*pi), then checked against the original equation.
 * This does not handle mixed trig functions or transformed arguments.
 */
export function solveQuadraticSineEquation(
  left: string,
  right: string,
  variable: string,
): TrigonometricEquationResult | null {
  try {
    const standardForm = simplify("(" + left + ")-(" + right + ")");
    const sinePattern = new RegExp("sin\\(" + variable + "\\)", "g");
    const occurrences = standardForm.match(sinePattern) ?? [];
    if (occurrences.length < 2) return null;

    const polynomial = standardForm.replace(sinePattern, "u");
    if (!/\\bu\\^2\\b/.test(polynomial) || /\\bu\\^[3-9]/.test(polynomial)) return null;
    if (/[A-Za-z]/.test(polynomial.replace(/\\bu\\b/g, ""))) return null;
    if (/\\b(?:cos|tan|sinh|cosh|tanh)\\(/.test(polynomial)) return null;

    const parameterRoots = solveEquation(polynomial, "u");
    if (parameterRoots.length < 1 || parameterRoots.length > 2) return null;

    const candidates: string[] = [];
    for (const parameterRoot of parameterRoots) {
      const target = numericValue(parameterRoot);
      if (target === null) return null;
      if (target < -1 || target > 1) continue;

      const principal = simplify("arcsin(" + parameterRoot + ")");
      const principalValue = numericValue(principal);
      if (principalValue === null) return null;
      const first = principalValue < 0
        ? simplify("2*pi+(" + principal + ")")
        : principal;
      const second = simplify("pi-(" + principal + ")");
      candidates.push(first, second);
    }

    const solutions = uniqueRoots(candidates)
      .filter((root) => {
        const value = numericValue(root);
        return value !== null && value >= 0 && value < 2 * Math.PI;
      })
      .sort((a, b) => (numericValue(a) ?? 0) - (numericValue(b) ?? 0));

    const originalWithCandidate = (root: string) =>
      standardForm.replace(sinePattern, "sin(" + root + ")");
    if (!solutions.every((root) => equivalent(originalWithCandidate(root), "0"))) {
      return null;
    }

    return {
      solutions,
      step: {
        id: "trigonometric-sine-quadratic",
        title: "Reducción polinómica con u = sin(x)",
        rule: "QuadraticSineSubstitution",
        latex:
          variable + "\\in[0,2\\pi):\\quad " +
          solutions.map((root) => variable + "=" + root).join(",\\quad "),
        explanation:
          "Se resuelve el polinomio cuadrático en u=sin(x), se generan ambas ramas reales del seno y se conservan únicamente las raíces distintas dentro de [0, 2π), verificadas en la ecuación original.",
      },
      contradiction: solutions.length === 0,
    };
  } catch {
    return null;
  }
}

/**
 * Resolves direct one-variable trigonometric equations with constant targets.
 * Sine/cosine return roots in [0, 2*pi); tangent returns its complete
 * integer-parameter family because its fundamental period is pi. No
 * compound arguments or transformed functions are handled here.
 */
export function solveDirectTrigonometricEquation(
  left: string,
  right: string,
  variable: string,
): TrigonometricEquationResult | null {
  const compactLeft = left.replace(/\s+/g, "");
  const compactRight = right.replace(/\s+/g, "");
  const directPattern = new RegExp("^(sin|cos|tan)\\(" + variable + "\\)$");
  const leftMatch = compactLeft.match(directPattern);
  const rightMatch = compactRight.match(directPattern);

  if (leftMatch && rightMatch) return null;

  let fn: DirectTrigFunction;
  let constant: string;

  if (leftMatch || rightMatch) {
    fn = (leftMatch?.[1] ?? rightMatch?.[1]) as DirectTrigFunction;
    constant = leftMatch ? right : left;
  } else {
    // Narrow affine form: a*sin(x)+b=0, a*cos(x)+b=0, or a*tan(x)+b=0.
    // Both coefficients must be numeric constants; compound trig expressions,
    // transformed arguments, and multiple trig terms remain on the generic path.
    let standardForm: string;
    try {
      standardForm = simplify("(" + left + ")-(" + right + ")").replace(/\s+/g, "");
    } catch {
      return null;
    }

    const numericLiteral = "(?:\\d+(?:/\\d+)?|\\d*\\.\\d+)";
    const functionFirst = new RegExp(
      "^([+-]?(?:" + numericLiteral + ")?\\*?)(sin|cos|tan)\\(" + variable + "\\)([+-]" + numericLiteral + ")?$",
    ).exec(standardForm);
    const constantFirst = new RegExp(
      "^([+-]?" + numericLiteral + ")([+-](?:" + numericLiteral + ")?\\*?)(sin|cos|tan)\\(" + variable + "\\)$",
    ).exec(standardForm);
    const functionTimesCoefficient = new RegExp(
      "^(sin|cos|tan)\\(" + variable + "\\)\\*([+-]?" + numericLiteral + ")([+-]" + numericLiteral + ")?$",
    ).exec(standardForm);

    let rawCoefficient: string;
    let offset: string;
    if (functionFirst) {
      rawCoefficient = functionFirst[1].replace(/\*$/, "");
      fn = functionFirst[2] as DirectTrigFunction;
      offset = functionFirst[3] ?? "0";
    } else if (constantFirst) {
      offset = constantFirst[1];
      rawCoefficient = constantFirst[2].replace(/\*$/, "");
      fn = constantFirst[3] as DirectTrigFunction;
    } else if (functionTimesCoefficient) {
      fn = functionTimesCoefficient[1] as DirectTrigFunction;
      rawCoefficient = functionTimesCoefficient[2];
      offset = functionTimesCoefficient[3] ?? "0";
    } else {
      return null;
    }

    const coefficient = rawCoefficient === "" || rawCoefficient === "+"
      ? "1"
      : rawCoefficient === "-"
        ? "-1"
        : rawCoefficient;
    const coefficientValue = numericValue(coefficient);
    if (coefficientValue === null || coefficientValue === 0 || numericValue(offset) === null) {
      return null;
    }

    constant = simplify("(0-(" + offset + "))/(" + coefficient + ")");
  }

  const target = numericValue(constant);
  if (target === null) return null;

  if ((fn === "sin" || fn === "cos") && (target < -1 || target > 1)) {
    return {
      solutions: [],
      step: {
        id: "trigonometric-domain",
        latex: "\\varnothing",
        explanation: "El valor está fuera del rango real de " + fn + "; no existen soluciones reales.",
      },
      contradiction: true,
    };
  }

  try {
    const inverse = fn === "sin" ? "arcsin" : fn === "cos" ? "arccos" : "arctan";
    const angle = simplify(inverse + "(" + constant + ")");

    if (fn === "tan") {
      if (!equivalent("tan(" + angle + ")", constant)) return null;
      const family = simplify("(" + angle + ")+k*pi");
      return {
        solutions: [family],
        step: {
          id: "trigonometric-periodic-family",
          title: "Solución general por periodicidad",
          rule: "Periodicidad de la tangente",
          latex: variable + "=" + toLatex(family) + ",\\quad k\\in\\mathbb{Z}",
          explanation:
            "La tangente tiene período fundamental π. La familia completa de soluciones reales es " +
            variable + " = " + family + " con k entero; no se limita a un período principal.",
        },
        contradiction: false,
      };
    }

    let candidates: string[];

    if (fn === "sin") {
      const first = target < 0 ? simplify("2*pi+(" + angle + ")") : angle;
      candidates = [first, simplify("pi-(" + angle + ")")];
    } else if (fn === "cos") {
      candidates = [angle, simplify("2*pi-(" + angle + ")")];
    } else {
      const first = target < 0 ? simplify("2*pi+(" + angle + ")") : angle;
      let second = simplify("(" + first + ")+pi");
      const secondNumeric = numericValue(second);
      if (secondNumeric !== null && secondNumeric >= 2 * Math.PI) {
        second = simplify("(" + second + ")-2*pi");
      }
      candidates = [first, second];
    }

    let solutions = uniqueRoots(candidates);
    // [0, 2*pi) excludes the upper endpoint; the unique angle 2*pi is 0.
    solutions = solutions.map((root) => {
      const value = numericValue(root);
      return value !== null && Math.abs(value - 2 * Math.PI) < 1e-10 ? "0" : root;
    });
    solutions = uniqueRoots(solutions)
      .filter((root) => {
        const value = numericValue(root);
        return value !== null && value >= 0 && value < 2 * Math.PI;
      })
      .sort((a, b) => (numericValue(a) ?? 0) - (numericValue(b) ?? 0));

    if (!solutions.every((root) => equivalent(fn + "(" + root + ")", constant))) {
      return null;
    }

    const rendered = solutions.length ? solutions.join(",\\quad ") : "\\varnothing";
    return {
      solutions,
      step: {
        id: "trigonometric-period",
        title: "Soluciones en un período",
        rule: "Periodicidad trigonométrica",
        latex: variable + "\\in[0,2\\pi):\\quad " + variable + "=" + rendered,
        explanation:
          "Se usa la periodicidad de " + fn +
          " y se enumeran las soluciones reales en el intervalo [0, 2π), sin afirmar que sean las únicas soluciones en toda la recta real.",
      },
      contradiction: solutions.length === 0,
    };
  } catch {
    return null;
  }
}
