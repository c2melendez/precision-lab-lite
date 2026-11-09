import { evaluate } from "../algebriteClient";
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
 * Resolves a direct one-variable sin/cos/tan equation over one principal
 * period [0, 2*pi). This is intentionally narrow: no compound arguments,
 * transformed functions, or unbounded periodic-set claims.
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
    const affinePattern = new RegExp(
      "^([+-]?(?:" + numericLiteral + ")?\\*?)(sin|cos|tan)\\(" + variable + "\\)([+-]" + numericLiteral + ")?$",
    );
    const affineMatch = standardForm.match(affinePattern);
    if (!affineMatch) return null;

    const rawCoefficient = affineMatch[1].replace(/\*$/, "");
    const coefficient = rawCoefficient === "" || rawCoefficient === "+"
      ? "1"
      : rawCoefficient === "-"
        ? "-1"
        : rawCoefficient;
    const offset = affineMatch[3] ?? "0";
    const coefficientValue = numericValue(coefficient);
    if (coefficientValue === null || coefficientValue === 0 || numericValue(offset) === null) {
      return null;
    }

    fn = affineMatch[2] as DirectTrigFunction;
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
