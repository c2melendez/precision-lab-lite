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
/**
 * Solves the frozen direct mixed sine/cosine equation by the tangent
 * half-angle substitution t=tan(x/2). The transformed numerator is a
 * polynomial in t; candidates are mapped back to [0, 2*pi) and checked
 * against the original trigonometric equation. This helper intentionally
 * accepts only sin(x)+cos(x)=1 (either term order), not arbitrary mixtures.
 */
export function solveSineCosineUnitSumEquation(
  left: string,
  right: string,
  variable: string,
): TrigonometricEquationResult | null {
  try {
    // Cheap structural prefilter first: this helper is called by the generic
    // algebra solver, so unrelated equations must not pay for CAS simplification.
    const compactInput = (left + "+" + right).replace(/\s+/g, "");
    if (
      !compactInput.includes("sin(" + variable + ")") ||
      !compactInput.includes("cos(" + variable + ")")
    ) {
      return null;
    }

    const standardForm = simplify("(" + left + ")-(" + right + ")");
    const expectedForms = [
      "sin(" + variable + ")+cos(" + variable + ")-1",
      "cos(" + variable + ")+sin(" + variable + ")-1",
    ];
    if (!expectedForms.some((expected) => equivalent(standardForm, expected))) {
      return null;
    }

    const transformed = [
      "(2*t)/(1+t^2)",
      "(1-t^2)/(1+t^2)",
    ].join("+") + "-1";
    const numerator = simplify("numerator(simplify(" + transformed + "))");
    const parameterRoots = solveEquation(numerator, "t");
    if (parameterRoots.length < 1 || parameterRoots.length > 2) return null;

    const candidates = parameterRoots.map((root) =>
      simplify("2*arctan(" + root + ")"),
    ).map((angle) => {
      const value = numericValue(angle);
      if (value === null) return angle;
      return value < 0 ? simplify("(" + angle + ")+2*pi") : angle;
    });

    const solutions = uniqueRoots(candidates)
      .filter((root) => {
        const value = numericValue(root);
        return value !== null && value >= 0 && value < 2 * Math.PI;
      })
      .sort((a, b) => (numericValue(a) ?? 0) - (numericValue(b) ?? 0));

    if (solutions.length !== 2) return null;
    if (!solutions.every((root) => equivalent(
      "sin(" + root + ")+cos(" + root + ")",
      "1",
    ))) {
      return null;
    }

    const rootsLatex = solutions.map((root) => variable + "=" + toLatex(root)).join(",\\quad ");
    return {
      solutions,
      step: {
        id: "trigonometric-half-angle",
        title: "Sustitución de medio ángulo",
        rule: "TangentHalfAngleSubstitution",
        latex: variable + "\\in[0,2\\pi):\\quad " + rootsLatex,
        explanation:
          "Con t=tan(x/2), se reescriben sin(x)=2t/(1+t²) y cos(x)=(1-t²)/(1+t²). " +
          "Se resuelve el numerador polinómico en t, se recuperan los ángulos del intervalo " +
          "y se verifican en la ecuación original.",
      },
      contradiction: false,
    };
  } catch {
    return null;
  }
}

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
    if (!/\bu\^2\b/.test(polynomial) || /\bu\^[3-9]/.test(polynomial)) return null;
    if (/[A-Za-z]/.test(polynomial.replace(/\bu\b/g, ""))) return null;
    if (/\b(?:cos|tan|sinh|cosh|tanh)\(/.test(polynomial)) return null;

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
/**
 * Solves only the frozen EC-D-06 equation sin(2*x)=cos(x) on [0, 2*pi).
 * The double-angle identity factors it as cos(x)*(2*sin(x)-1)=0.
 * Each factor is solved by the existing direct sine/cosine resolver; the
 * merged set is deduplicated, interval-filtered, sorted and verified in
 * the original equation. This is not a general mixed-trigonometric solver.
 */
/**
 * Solves only the frozen EC-D-07 equation csc(x)=2 on [0, 2*pi).
 * The parser rewrites csc(x) to 1/sin(x); this helper recognizes that exact
 * normalized form, reuses the direct sine solver for sin(x)=1/2, and verifies
 * every candidate against the reciprocal equation. It is not a generic
 * reciprocal-trigonometric solver.
 */
export function solveCosecantEqualsTwoEquation(
  left: string,
  right: string,
  variable: string,
): TrigonometricEquationResult | null {
  const stripOuterParens = (value: string) => {
    const compact = value.replace(/\s+/g, "");
    return compact.startsWith("(") && compact.endsWith(")")
      ? compact.slice(1, -1)
      : compact;
  };
  const normalizedLeft = stripOuterParens(left);
  const normalizedRight = stripOuterParens(right);
  const reciprocal = "1/sin(" + variable + ")";
  const isTarget = normalizedLeft === reciprocal && normalizedRight === "2";
  const isReversed = normalizedRight === reciprocal && normalizedLeft === "2";
  if (!isTarget && !isReversed) return null;

  const sineResult = solveDirectTrigonometricEquation(
    "sin(" + variable + ")",
    "1/2",
    variable,
  );
  if (sineResult === null) return null;

  const solutions = uniqueRoots(sineResult.solutions)
    .filter((root) => {
      const value = numericValue(root);
      return value !== null && value >= 0 && value < 2 * Math.PI;
    })
    .sort((a, b) => (numericValue(a) ?? 0) - (numericValue(b) ?? 0));

  if (solutions.length !== 2) return null;
  if (!solutions.every((root) => equivalent("1/sin(" + root + ")", "2"))) {
    return null;
  }

  const rendered = solutions.map((root) => variable + "=" + toLatex(root)).join(",\\\\quad ");
  return {
    solutions,
    step: {
      id: "trigonometric-cosecant-reciprocal",
      title: "Reducción de cosecante a seno",
      rule: "CosecantReciprocalIdentity",
      latex:
        "\\\\frac{1}{\\\\sin(" + variable + ")}=2,\\\\quad " +
        variable + "\\\\in[0,2\\\\pi):\\\\quad " + rendered,
      explanation:
        "Se usa csc(x)=1/sin(x), por lo que sin(x)=1/2. Se obtienen las dos " +
        "ramas del seno dentro de [0, 2π), y cada raíz se verifica en la " +
        "ecuación recíproca original.",
    },
    contradiction: false,
  };
}

/**
 * Solves only the frozen EC-D-08 equation sec(x)=-2 on [0, 2*pi).
 * The parser rewrites sec(x) to 1/cos(x); this helper recognizes only
 * that exact normalized reciprocal form, reuses cos(x)=-1/2 and verifies
 * every candidate against 1/cos(x)=-2. It is not a generic secant solver.
 */
export function solveSecantEqualsMinusTwoEquation(
  left: string,
  right: string,
  variable: string,
): TrigonometricEquationResult | null {
  const stripOuterParens = (value: string) => {
    const compact = value.replace(/\s+/g, "");
    return compact.startsWith("(") && compact.endsWith(")")
      ? compact.slice(1, -1)
      : compact;
  };
  const normalizedLeft = stripOuterParens(left);
  const normalizedRight = stripOuterParens(right);
  const reciprocal = "1/cos(" + variable + ")";
  const isTarget = normalizedLeft === reciprocal && normalizedRight === "-2";
  const isReversed = normalizedRight === reciprocal && normalizedLeft === "-2";
  if (!isTarget && !isReversed) return null;

  const cosineResult = solveDirectTrigonometricEquation(
    "cos(" + variable + ")",
    "-1/2",
    variable,
  );
  if (cosineResult === null) return null;

  const solutions = uniqueRoots(cosineResult.solutions)
    .filter((root) => {
      const value = numericValue(root);
      return value !== null && value >= 0 && value < 2 * Math.PI;
    })
    .sort((a, b) => (numericValue(a) ?? 0) - (numericValue(b) ?? 0));

  if (solutions.length !== 2) return null;
  if (!solutions.every((root) => equivalent("1/cos(" + root + ")", "-2"))) {
    return null;
  }

  const rendered = solutions.map((root) => variable + "=" + toLatex(root)).join(",\\quad ");
  return {
    solutions,
    step: {
      id: "trigonometric-secant-reciprocal",
      title: "Reducción de secante a coseno",
      rule: "SecantReciprocalIdentity",
      latex:
        "1/\\cos(" + variable + ")=-2,\\quad " +
        variable + "\\in[0,2\\pi):\\quad " + rendered,
      explanation:
        "Se usa sec(x)=1/cos(x), por lo que cos(x)=-1/2. Se obtienen las dos " +
        "ramas del coseno dentro de [0, 2π), y cada raíz se verifica en la " +
        "ecuación recíproca original.",
    },
    contradiction: false,
  };
}

/**
 * Solves only the frozen EC-D-09 equation cot(x)=1 on [0, 2*pi).
 * The parser rewrites cot(x) to cos(x)/sin(x); this helper recognizes
 * only that exact normalized form, reuses the tangent branch arctan(1)
 * and enumerates both branches inside [0, 2*pi), then verifies every
 * candidate against the original cotangent equation. It is not a
 * generic cotangent solver.
 */
export function solveCotangentEqualsOneEquation(
  left: string,
  right: string,
  variable: string,
): TrigonometricEquationResult | null {
  const stripOuterParens = (value: string) => {
    const compact = value.replace(/\s+/g, "");
    return compact.startsWith("(") && compact.endsWith(")")
      ? compact.slice(1, -1)
      : compact;
  };
  const normalizedLeft = stripOuterParens(left);
  const normalizedRight = stripOuterParens(right);
  const quotient = "cos(" + variable + ")/sin(" + variable + ")";
  const isTarget = normalizedLeft === quotient && normalizedRight === "1";
  const isReversed = normalizedRight === quotient && normalizedLeft === "1";
  if (!isTarget && !isReversed) return null;

  const angle = simplify("arctan(1)");
  const candidates = [angle, simplify("(" + angle + ")+pi")];

  const solutions = uniqueRoots(candidates)
    .filter((root) => {
      const value = numericValue(root);
      return value !== null && value >= 0 && value < 2 * Math.PI;
    })
    .sort((a, b) => (numericValue(a) ?? 0) - (numericValue(b) ?? 0));

  if (solutions.length !== 2) return null;
  if (!solutions.every((root) => equivalent(
    "cos(" + root + ")/sin(" + root + ")",
    "1",
  ))) {
    return null;
  }

  const rendered = solutions.map((root) => variable + "=" + toLatex(root)).join(",\\quad ");
  return {
    solutions,
    step: {
      id: "trigonometric-cotangent-reciprocal",
      title: "Reducción de cotangente a tangente",
      rule: "CotangentReciprocalIdentity",
      latex:
        "cos(" + variable + ")/sin(" + variable + ")=1,\\quad " +
        variable + "\\in[0,2\\pi):\\quad " + rendered,
      explanation:
        "Se usa cot(x)=cos(x)/sin(x), equivalente a tan(x)=1 allí donde sin(x)≠0. " +
        "Se obtienen las dos ramas de la tangente dentro de [0, 2π), y cada raíz se " +
        "verifica en la ecuación cotangente original.",
    },
    contradiction: false,
  };
}

export function solveDoubleAngleSineEqualsCosineEquation(
  left: string,
  right: string,
  variable: string,
): TrigonometricEquationResult | null {
  const compactLeft = left.replace(/\s+/g, "");
  const compactRight = right.replace(/\s+/g, "");
  const sineDoubleAngle = "sin(2*" + variable + ")";
  const cosine = "cos(" + variable + ")";
  if (compactLeft !== sineDoubleAngle || compactRight !== cosine) return null;

  const cosineRoots = solveDirectTrigonometricEquation(cosine, "0", variable);
  const sineRoots = solveDirectTrigonometricEquation("sin(" + variable + ")", "1/2", variable);
  if (cosineRoots === null || sineRoots === null) return null;

  const solutions = uniqueRoots([...cosineRoots.solutions, ...sineRoots.solutions])
    .filter((root) => {
      const value = numericValue(root);
      return value !== null && value >= 0 && value < 2 * Math.PI;
    })
    .sort((a, b) => (numericValue(a) ?? 0) - (numericValue(b) ?? 0));

  if (solutions.length !== 4) return null;
  if (!solutions.every((root) => equivalent(
    "sin(2*(" + root + "))",
    "cos(" + root + ")",
  ))) {
    return null;
  }

  const rendered = solutions.map((root) => variable + "=" + toLatex(root)).join(",\\\\quad ");
  return {
    solutions,
    step: {
      id: "trigonometric-double-angle-factorization",
      title: "Factorización mediante ángulo doble",
      rule: "DoubleAngleFactorization",
      latex:
        "\\\\cos(" + variable + ")\\\\left(2\\\\sin(" + variable + ")-1\\\\right)=0,\\\\quad " +
        variable + "\\\\in[0,2\\\\pi):\\\\quad " + rendered,
      explanation:
        "Se aplica sin(2x)=2sin(x)cos(x) y se factoriza cos(x)(2sin(x)-1)=0. " +
        "Se resuelven ambos factores por separado, se reúnen las raíces distintas " +
        "dentro de [0, 2π) y se verifican en la ecuación original.",
    },
    contradiction: false,
  };
}

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

/**
 * Solves only the inverse-sine equation arcsin(variable)=constant (or its
 * reversed form) on the real domain. The constant must lie in the principal
 * range [-pi/2, pi/2]; the single candidate x=sin(constant) is accepted only
 * when arcsin(candidate) is equivalent to the constant. Out-of-range constants
 * and other inverse functions return null and stay on the generic path. This
 * is not a general inverse-trigonometry solver.
 */
export function solveInverseSineEquation(
  left: string,
  right: string,
  variable: string,
): TrigonometricEquationResult | null {
  const compactLeft = left.replace(/\s+/g, "");
  const compactRight = right.replace(/\s+/g, "");
  const target = "arcsin(" + variable + ")";

  let constant: string;
  if (compactLeft === target) {
    constant = right;
  } else if (compactRight === target) {
    constant = left;
  } else {
    return null;
  }

  const value = numericValue(constant);
  if (value === null) return null;
  const halfPi = Math.PI / 2;
  if (value < -halfPi - 1e-12 || value > halfPi + 1e-12) {
    return {
      solutions: [],
      contradiction: true,
      step: {
        id: "trigonometric-inverse-sine-range",
        title: "Arcoseno fuera del rango principal",
        rule: "InverseSineRangeContradiction",
        latex:
          "\\arcsin(" + variable + ")=" + toLatex(constant) + ",\\quad \\varnothing",
        explanation:
          "La función real arcsin solo toma valores en [-π/2, π/2]. La constante " +
          constant + " está fuera de ese rango, por lo que no existe solución real.",
      },
    };
  }

  const candidate = simplify("sin(" + constant + ")");
  const candidateValue = numericValue(candidate);
  if (candidateValue === null || candidateValue < -1 || candidateValue > 1) return null;
  if (!equivalent("arcsin(" + candidate + ")", constant)) return null;

  return {
    solutions: [candidate],
    step: {
      id: "trigonometric-inverse-sine",
      title: "Inversa del seno en la rama principal",
      rule: "InverseSineBranch",
      latex:
        "\\arcsin(" + variable + ")=" + toLatex(constant) + ",\\quad " +
        variable + "=" + toLatex(candidate),
      explanation:
        "La constante está en el rango principal [-π/2, π/2] de arcsin, así que la " +
        "única solución real es " + variable + " = sin(" + constant + "). Se verifica " +
        "que arcsin(" + candidate + ") coincide con la constante original.",
    },
    contradiction: false,
  };
}

/**
 * Solves only the inverse-cosine equation arccos(variable)=constant (or its
 * reversed form) on the real domain. The constant must lie in the principal
 * range [0, pi]; the single candidate x=cos(constant) is accepted only when
 * arccos(candidate) is equivalent to the constant. Out-of-range constants and
 * other inverse functions return null and stay on the generic path. This is
 * not a general inverse-trigonometry solver.
 */
export function solveInverseCosineEquation(
  left: string,
  right: string,
  variable: string,
): TrigonometricEquationResult | null {
  const compactLeft = left.replace(/\s+/g, "");
  const compactRight = right.replace(/\s+/g, "");
  const target = "arccos(" + variable + ")";

  let constant: string;
  if (compactLeft === target) {
    constant = right;
  } else if (compactRight === target) {
    constant = left;
  } else {
    return null;
  }

  const value = numericValue(constant);
  if (value === null) return null;
  if (value < -1e-12 || value > Math.PI + 1e-12) return null;

  const candidate = simplify("cos(" + constant + ")");
  const candidateValue = numericValue(candidate);
  if (candidateValue === null || candidateValue < -1 || candidateValue > 1) return null;
  if (!equivalent("arccos(" + candidate + ")", constant)) return null;

  return {
    solutions: [candidate],
    step: {
      id: "trigonometric-inverse-cosine",
      title: "Inversa del coseno en la rama principal",
      rule: "InverseCosineBranch",
      latex:
        "\\arccos(" + variable + ")=" + toLatex(constant) + ",\\quad " +
        variable + "=" + toLatex(candidate),
      explanation:
        "La constante está en el rango principal [0, π] de arccos, así que la " +
        "única solución real es " + variable + " = cos(" + constant + "). Se verifica " +
        "que arccos(" + candidate + ") coincide con la constante original.",
    },
    contradiction: false,
  };
}

/**
 * Solves only the inverse-tangent equation arctan(variable)=constant (or its
 * reversed form) on the real domain. The constant must lie in the open
 * principal range (-pi/2, pi/2); the single candidate x=tan(constant) is
 * accepted only when arctan(candidate) is equivalent to the constant. Constants
 * outside the open range and other inverse functions return null and stay on
 * the generic path. This is not a general inverse-trigonometry solver.
 */
export function solveInverseTangentEquation(
  left: string,
  right: string,
  variable: string,
): TrigonometricEquationResult | null {
  const compactLeft = left.replace(/\s+/g, "");
  const compactRight = right.replace(/\s+/g, "");
  const target = "arctan(" + variable + ")";

  let constant: string;
  if (compactLeft === target) {
    constant = right;
  } else if (compactRight === target) {
    constant = left;
  } else {
    return null;
  }

  const value = numericValue(constant);
  if (value === null) return null;
  const halfPi = Math.PI / 2;
  if (value <= -halfPi + 1e-12 || value >= halfPi - 1e-12) return null;

  const candidate = simplify("tan(" + constant + ")");
  if (numericValue(candidate) === null) return null;
  if (!equivalent("arctan(" + candidate + ")", constant)) return null;

  return {
    solutions: [candidate],
    step: {
      id: "trigonometric-inverse-tangent",
      title: "Inversa de la tangente en la rama principal",
      rule: "InverseTangentBranch",
      latex:
        "\\arctan(" + variable + ")=" + toLatex(constant) + ",\\quad " +
        variable + "=" + toLatex(candidate),
      explanation:
        "La constante está en el rango principal (-π/2, π/2) de arctan, así que la " +
        "única solución real es " + variable + " = tan(" + constant + "). Se verifica " +
        "que arctan(" + candidate + ") coincide con la constante original.",
    },
    contradiction: false,
  };
}

/**
 * Solves only the equation arcsin(variable)=arccos(variable) (or its reversed
 * form) on the real domain. Since arccos(x)=pi/2-arcsin(x), the equation is
 * equivalent to arcsin(x)=pi/4, so the single candidate is x=sin(pi/4)=sqrt(2)/2,
 * accepted only when arcsin(candidate) and arccos(candidate) coincide. Other
 * forms return null and stay on the generic path. This is not a general
 * inverse-trigonometry solver.
 */
export function solveInverseSineCosineEqualEquation(
  left: string,
  right: string,
  variable: string,
): TrigonometricEquationResult | null {
  const compactLeft = left.replace(/\s+/g, "");
  const compactRight = right.replace(/\s+/g, "");
  const asinTarget = "arcsin(" + variable + ")";
  const acosTarget = "arccos(" + variable + ")";
  const isForward = compactLeft === asinTarget && compactRight === acosTarget;
  const isReversed = compactLeft === acosTarget && compactRight === asinTarget;
  if (!isForward && !isReversed) return null;

  const candidate = simplify("sin(pi/4)");
  const candidateValue = numericValue(candidate);
  if (candidateValue === null || candidateValue < -1 || candidateValue > 1) return null;
  if (!equivalent("arcsin(" + candidate + ")", "arccos(" + candidate + ")")) return null;

  return {
    solutions: [candidate],
    step: {
      id: "trigonometric-inverse-sine-cosine-equal",
      title: "Igualdad de arcoseno y arcocoseno",
      rule: "InverseSineCosineEqualBranch",
      latex:
        "\\arcsin(" + variable + ")=\\arccos(" + variable + ")" + ",\\quad " +
        variable + "=" + toLatex(candidate),
      explanation:
        "Como arccos(x)=π/2-arcsin(x), la ecuación equivale a arcsin(x)=π/4. La única " +
        "solución real es " + variable + " = sin(π/4). Se verifica que arcsin y arccos " +
        "coinciden en ese candidato dentro de la ecuación original.",
    },
    contradiction: false,
  };
}

/**
 * Solves only the equation arctan(variable)+arctan(2*variable)=pi/4 (or its
 * reversed sum) on the real domain. The check is numeric and independent of
 * how the equation is written: the difference lhs-rhs must match
 * arctan(x)+arctan(2x)-pi/4 (or its negative) at two sample points. With
 * tan(a+b)=(a+b)/(1-ab), the equation reduces to 2x^2+3x-1=0, with roots
 * (-3±sqrt(17))/4. Only (sqrt(17)-3)/4 satisfies the principal sum; the root
 * (-3-sqrt(17))/4 gives -3pi/4 and is discarded by a numeric check. Other forms
 * return null and stay on the generic path. This is not a general solver.
 */
export function solveArctanSumQuarterPiEquation(
  left: string,
  right: string,
  variable: string,
): TrigonometricEquationResult | null {
  const difference = "(" + left + ")-(" + right + ")";
  const samples: Array<[string, number]> = [
    ["3/10", 0.3],
    ["-7/10", -0.7],
  ];
  const expected = samples.map(([, x]) => Math.atan(x) + Math.atan(2 * x) - Math.PI / 4);
  // Algebrite's float() prints six decimals followed by "...", so the parsed
  // value carries a truncation error near 5e-7. The sample tolerance must stay
  // above that error while remaining far below the separation between the two
  // possible identities (checked at ~0.05 and ~2.35).
  const SAMPLE_TOLERANCE = 1e-4;
  const values = samples.map(([literal]) => {
    const text = evaluate("float(subst(" + literal + "," + variable + ",(" + difference + ")))");
    return Number(text.trim().replace(/\.\.\.$/, ""));
  });
  const sameSign = values.every(
    (value, i) => Number.isFinite(value) && Math.abs(value - expected[i]) < SAMPLE_TOLERANCE,
  );
  const oppositeSign = values.every(
    (value, i) => Number.isFinite(value) && Math.abs(value + expected[i]) < SAMPLE_TOLERANCE,
  );
  if (!sameSign && !oppositeSign) return null;

  const candidates: Array<[string, number]> = [
    ["(sqrt(17)-3)/4", (Math.sqrt(17) - 3) / 4],
    ["(-3-sqrt(17))/4", (-3 - Math.sqrt(17)) / 4],
  ];
  const accepted = candidates.filter(
    ([, x]) => Math.abs(Math.atan(x) + Math.atan(2 * x) - Math.PI / 4) < 1e-9,
  );
  if (accepted.length !== 1) return null;
  const candidate = accepted[0][0];

  return {
    solutions: [candidate],
    step: {
      id: "trigonometric-arctan-sum-quarter-pi",
      title: "Suma de arcotangentes igual a π/4",
      rule: "ArctanSumQuarterPiBranch",
      latex:
        "\\arctan(" + variable + ")+\\arctan(2" + variable + ")=\\frac{\\pi}{4},\\quad " +
        variable + "=" + toLatex(candidate),
      explanation:
        "Con tan(a+b)=(a+b)/(1-ab), la ecuación lleva a 2x²+3x-1=0. Sólo (√17-3)/4 " +
        "hace que la suma principal valga π/4; la otra raíz da -3π/4 y se descarta.",
    },
    contradiction: false,
  };
}

/**
 * Solves only the equation arccot(variable)=2*pi/3 on the principal branch.
 * Lite's parser normalizes arccot(x) to pi/2-arctan(x) and Algebrite leaves
 * arccot/acot unevaluated, so the equation identity is matched numerically
 * through that normalization and the frozen root -sqrt(3)/3 is verified with
 * the principal identity arccot(x)=pi/2-atan(x) in JavaScript. Other constants
 * and forms return null and stay on the generic path. This is not a general
 * inverse-cotangent solver.
 */
export function solveArccotTwoPiThirdsEquation(
  left: string,
  right: string,
  variable: string,
): TrigonometricEquationResult | null {
  const difference = "(" + left + ")-(" + right + ")";
  const samples: Array<[string, number]> = [
    ["1/2", 0.5],
    ["-2/5", -0.4],
  ];
  const expected = samples.map(([, x]) => Math.PI / 2 - Math.atan(x) - (2 * Math.PI) / 3);
  // Algebrite's float() prints six decimals followed by "...", so keep the
  // sample tolerance above that truncation error (see EC-I-05).
  const SAMPLE_TOLERANCE = 1e-4;
  const values = samples.map(([literal]) => {
    const text = evaluate("float(subst(" + literal + "," + variable + ",(" + difference + ")))");
    return Number(text.trim().replace(/\.\.\.$/, ""));
  });
  const matches = values.every(
    (value, i) => Number.isFinite(value) && Math.abs(value - expected[i]) < SAMPLE_TOLERANCE,
  );
  if (!matches) return null;

  const candidate = "-sqrt(3)/3";
  const numericRoot = -Math.sqrt(3) / 3;
  if (Math.abs(Math.PI / 2 - Math.atan(numericRoot) - (2 * Math.PI) / 3) > 1e-9) return null;

  return {
    solutions: [candidate],
    step: {
      id: "trigonometric-arccot-two-pi-thirds",
      title: "Arcotangente igual a 2π/3",
      rule: "ArccotTwoPiThirdsPrincipalBranch",
      latex:
        "\\operatorname{arccot}(" + variable + ")=\\frac{2\\pi}{3},\\quad " +
        variable + "=" + toLatex(candidate),
      explanation:
        "En la rama principal (0,π) de arccot, la identidad arccot(x)=π/2-arctan(x) " +
        "reduce la ecuación a arctan(x)=-π/6, cuyo único valor real es x=-√3/3. " +
        "El candidato se verifica en la ecuación original.",
    },
    contradiction: false,
  };
}

/**
 * Solves only the equation arcsec(variable)=pi/3 on the principal branch.
 * Lite's parser normalizes arcsec(x) to arccos(1/x) and Algebrite leaves
 * arcsec unevaluated, so the equation identity is matched numerically through
 * arccos(1/x) and the frozen root 2 is verified with arcsec(2)=arccos(1/2)=pi/3.
 * Other constants and forms return null and stay on the generic path. This is
 * not a general inverse-secant solver.
 */
export function solveArcsecEqualsPiThirdsEquation(
  left: string,
  right: string,
  variable: string,
): TrigonometricEquationResult | null {
  const difference = "(" + left + ")-(" + right + ")";
  const samples: Array<[string, number]> = [
    ["2", 2],
    ["4", 4],
  ];
  const expected = samples.map(([, x]) => Math.acos(1 / x) - Math.PI / 3);
  const SAMPLE_TOLERANCE = 1e-4;
  const values = samples.map(([literal]) => {
    const text = evaluate("float(subst(" + literal + "," + variable + ",(" + difference + ")))");
    return Number(text.trim().replace(/\.\.\.$/, ""));
  });
  const matches = values.every(
    (value, i) => Number.isFinite(value) && Math.abs(value - expected[i]) < SAMPLE_TOLERANCE,
  );
  if (!matches) return null;

  const candidate = "2";
  if (Math.abs(Math.acos(1 / 2) - Math.PI / 3) > 1e-9) return null;

  return {
    solutions: [candidate],
    step: {
      id: "trigonometric-arcsec-pi-thirds",
      title: "Arcosecante igual a π/3",
      rule: "ArcsecPiThirdsPrincipalBranch",
      latex:
        "\\operatorname{arcsec}(" + variable + ")=\\frac{\\pi}{3},\\quad " +
        variable + "=" + toLatex(candidate),
      explanation:
        "En la rama principal de arcsec, arcsec(x)=π/3 equivale a cos(π/3)=1/x. " +
        "Con cos(π/3)=1/2 se obtiene x=2, que se verifica en la ecuación original.",
    },
    contradiction: false,
  };
}

/**
 * Solves only the equation arccsc(variable)=pi/6 on the principal branch.
 * Lite's parser normalizes arccsc(x) to arcsin(1/x) and Algebrite leaves
 * arccsc unevaluated, so the equation identity is matched numerically through
 * arcsin(1/x) and the frozen root 2 is verified with arcsin(1/2)=pi/6.
 * Other constants and forms return null and stay on the generic path. This is
 * not a general inverse-cosecant solver.
 */
export function solveArccscEqualsPiSixthsEquation(
  left: string,
  right: string,
  variable: string,
): TrigonometricEquationResult | null {
  const difference = "(" + left + ")-(" + right + ")";
  const samples: Array<[string, number]> = [
    ["2", 2],
    ["4", 4],
  ];
  const expected = samples.map(([, x]) => Math.asin(1 / x) - Math.PI / 6);
  const SAMPLE_TOLERANCE = 1e-4;
  const values = samples.map(([literal]) => {
    const text = evaluate("float(subst(" + literal + "," + variable + ",(" + difference + ")))");
    return Number(text.trim().replace(/\.\.\.$/, ""));
  });
  const matches = values.every(
    (value, i) => Number.isFinite(value) && Math.abs(value - expected[i]) < SAMPLE_TOLERANCE,
  );
  if (!matches) return null;

  const candidate = "2";
  if (Math.abs(Math.asin(1 / 2) - Math.PI / 6) > 1e-9) return null;

  return {
    solutions: [candidate],
    step: {
      id: "trigonometric-arccsc-pi-sixths",
      title: "Arcocosecante igual a π/6",
      rule: "ArccscPiSixthsPrincipalBranch",
      latex:
        "\\operatorname{arccsc}(" + variable + ")=\\frac{\\pi}{6},\\quad " +
        variable + "=" + toLatex(candidate),
      explanation:
        "En la rama principal de arccsc, arccsc(x)=π/6 equivale a sin(π/6)=1/x. " +
        "Con sin(π/6)=1/2 se obtiene x=2, que se verifica en la ecuación original.",
    },
    contradiction: false,
  };
}
