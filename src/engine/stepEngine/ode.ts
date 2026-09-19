// stepEngine/ode.ts (Fase E, spec_edo_complejos_tooltips.md §2, Módulo E2)
//
// NIVEL DE EVIDENCIA 2 para este archivo completo: el paquete `algebrite`
// no está instalado en este entorno (sin `node_modules`, sin red para
// instalarlo — mismo bloqueo ya documentado en otros archivos de este
// repo, ej. algebriteClient.ts/normalize.ts sobre mathlive). No se pudo
// ejecutar ni una sola llamada real contra Algebrite para este módulo.
// Se construyó reutilizando ÚNICAMENTE funciones de algebriteClient.ts
// que YA están verificadas contra el paquete real en sesiones anteriores
// (`solveEquation` vía roots(), `indefiniteIntegral` vía integral()) en
// vez de inventar llamadas nuevas sin poder confirmarlas.
//
// ALCANCE (decisión E0, confirmada por auditoría real de algebriteClient.ts
// y numericFallback.ts en el Módulo E0): Algebrite no tiene un `dsolve`
// nativo. Se implementan ÚNICAMENTE los 3 casos que el teclado expone
// (E3, `MathKeyboard.tsx` → `ODE_ROW`, hoy `unavailable` hasta que este
// módulo quede confirmado):
//   1. y'=f(x)           -> integración directa (separable trivial: el
//                            lado derecho no depende de y).
//   2. y''+a·y'+b·y=0    -> ecuación característica r²+ar+b=0 (roots()).
//   3. y''+a·y'+b·y=c    -> igual que 2 + solución particular constante
//                            y_p = c/b (b≠0).
// El fallback numérico RK4 general (propuesto en E0 para el caso
// genérico y'=f(x,y)) NO se implementa en este módulo — ninguna tecla
// del teclado (E3) lo necesita todavía, y añadirlo sin poder probarlo
// contra Algebrite real habría sido más riesgo sin beneficio verificable
// hoy. Queda como extensión futura explícita, no como omisión silenciosa.

import { evaluate, indefiniteIntegral, solveEquation } from "../algebriteClient";
import { parseAlgebraicFragment } from "../parsing";
import { ErrorCode, type AppError, type Step, type ResultConfidence } from "../../types";

export interface CalculusResult {
  resultLatex: string;
  steps: Step[];
  confidence: ResultConfidence;
}

function appError(code: ErrorCode, message: string): AppError {
  return { code, message };
}

/** "y" -> 0, "y'" -> 1, "y''" -> 2. Mismo criterio dinámico que
 * ode_service.py (main, E1): cuenta primas, no asume un orden fijo. */
function primeOrder(token: string): number {
  const stripped = token.slice(1);
  if (stripped.length === 0) return 0;
  if ([...stripped].some((ch) => ch !== "'")) {
    throw appError(ErrorCode.PARSE_ERROR, `Notación de derivada inválida: "${token}".`);
  }
  return stripped.length;
}

/** Reemplaza cada ocurrencia de y/y'/y''/... por un marcador de orden,
 * y reporta el orden máximo encontrado -- para reconocer la FORMA de la
 * ecuación (1er o 2º orden) antes de decidir qué caso aplicar. No
 * construye una expresión Algebrite evaluable (a diferencia de
 * ode_service.py en main, acá no hay Derivative simbólico disponible
 * -- Algebrite no lo tiene -- así que cada caso se resuelve con su
 * propia lógica dedicada más abajo, no con un solver genérico). */
function maxOrder(text: string): number {
  const matches = text.match(/y'*/g) ?? [];
  return matches.reduce((max, m) => Math.max(max, primeOrder(m)), 0);
}

function splitEquationAndCondition(text: string): [string, string | null] {
  const parts = text.split(",").map((p) => p.trim());
  if (parts.length === 1) return [parts[0], null];
  if (parts.length === 2) return [parts[0], parts[1]];
  throw appError(ErrorCode.PARSE_ERROR, `No se esperaba más de una condición inicial: "${text}".`);
}

function parseInitialCondition(icText: string): { point: string; value: string } {
  const match = icText.match(/^y\(([^)]+)\)\s*=\s*(.+)$/);
  if (!match) {
    throw appError(ErrorCode.PARSE_ERROR, `Condición inicial no reconocida: "${icText}".`);
  }
  // Fase E (fix real, ver más abajo): el punto y el valor son fragmentos
  // algebraicos comunes (ej. "0", "2x" no aplicaría acá pero sí cosas
  // como "pi/2") -- se convierten a sintaxis Algebrite real (multiplicación
  // implícita insertada, etc.), igual que el resto del proyecto.
  return {
    point: parseAlgebraicFragment(match[1].trim()),
    value: parseAlgebraicFragment(match[2].trim()),
  };
}

/** Caso 1: y'=f(x). f(x) no debe depender de y -- si depende, no es el
 * caso separable trivial que este módulo cubre (fuera de alcance,
 * UNSUPPORTED_OPERATION en vez de un resultado incorrecto). */
function solveFirstOrderDirect(rhsRaw: string, ic: { point: string; value: string } | null): CalculusResult {
  if (/\by\b/.test(rhsRaw)) {
    throw appError(
      ErrorCode.UNSUPPORTED_OPERATION,
      "Esta ecuación diferencial de primer orden depende de y en el lado derecho -- fuera del alcance actual (solo se resuelve el caso y'=f(x)).",
    );
  }
  // Fase E (hallazgo real, Módulo E2): el texto que llega acá viene solo
  // de preprocessLatex/normalizeUnicode (ver odeDetect.ts), NO del
  // pipeline completo de parseExpression -- así que "2x" seguía siendo
  // literalmente "2x" (dos caracteres, no multiplicación implícita
  // insertada), sintaxis que Algebrite no garantiza aceptar. Se convierte
  // acá, con la MISMA función (parseAlgebraicFragment) que usa el resto
  // del proyecto para cualquier lado de una ecuación normal.
  const rhs = parseAlgebraicFragment(rhsRaw);
  const antiderivative = indefiniteIntegral(rhs, "x");
  let resultLatex: string;
  const confidence: ResultConfidence = "SYMBOLIC";
  if (ic) {
    // C = y0 - F(x0)
    const atPoint = evaluate(`subst(${ic.point},x,${antiderivative})`);
    const constant = evaluate(`(${ic.value})-(${atPoint})`);
    resultLatex = `y=${antiderivative}+(${constant})`;
  } else {
    resultLatex = `y=${antiderivative}+C_1`;
  }
  return {
    resultLatex,
    confidence,
    steps: [
      { id: "original", latex: `y'=${rhs}`, explanation: "Ecuación diferencial original." },
      { id: "integrate", latex: `y=\\int ${rhs}\\,dx`, explanation: "Se integra directamente respecto a x (el lado derecho no depende de y)." },
      { id: "result", latex: resultLatex, explanation: ic ? "Se sustituye la condición inicial para determinar la constante." : "Solución general, con constante de integración arbitraria." },
    ],
  };
}

/** Casos 2/3: y''+a·y'+b·y=c (c=0 para el caso homogéneo). Ecuación
 * característica r²+a·r+b=0 -- roots() ya maneja raíces reales,
 * repetidas y complejas (mismo `solveEquation` que usa el resto del
 * proyecto para ecuaciones cuadráticas, sin necesitar lógica nueva). */
function solveSecondOrderConstantCoeff(
  aRaw: string,
  bRaw: string,
  cRaw: string,
  ic: { point: string; value: string } | null,
): CalculusResult {
  // Mismo fix que en solveFirstOrderDirect: a/b/c llegan como texto
  // post-preprocessLatex solamente (ver odeDetect.ts), se convierten acá
  // a sintaxis Algebrite real antes de usarlos en cualquier llamada.
  const a = parseAlgebraicFragment(aRaw);
  const b = parseAlgebraicFragment(bRaw);
  const c = parseAlgebraicFragment(cRaw);
  const roots = solveEquation(`r^2+(${a})*r+(${b})`, "r");

  let homogeneous: string;
  if (roots.length === 2 && roots[0] !== roots[1]) {
    homogeneous = `C_1*e^((${roots[0]})*x)+C_2*e^((${roots[1]})*x)`;
  } else if (roots.length >= 1) {
    // Raíz repetida (real): Algebrite's roots() puede devolver un único
    // valor o el mismo valor duplicado según el caso -- se cubre ambas
    // formas de salida posibles (NIVEL 2, no verificable en este
    // entorno sin Algebrite real).
    homogeneous = `(C_1+C_2*x)*e^((${roots[0]})*x)`;
  } else {
    throw appError(ErrorCode.UNSUPPORTED_OPERATION, "No se pudo resolver la ecuación característica.");
  }

  const isHomogeneous = evaluate(c) === "0";
  let particular = "";
  if (!isHomogeneous) {
    const bValue = evaluate(b);
    if (bValue === "0") {
      throw appError(
        ErrorCode.UNSUPPORTED_OPERATION,
        "Esta ecuación no homogénea con b=0 necesita un método distinto (variación de parámetros) -- fuera del alcance actual (solo se cubre el caso b≠0 con solución particular constante).",
      );
    }
    particular = `+(${evaluate(`(${c})/(${b})`)})`;
  }

  const generalSolution = `y=${homogeneous}${particular}`;

  let resultLatex = generalSolution;
  if (ic) {
    // Con una sola condición y(x0)=y0, el sistema queda subdeterminado
    // para 2 constantes -- se sustituye lo que SÍ se puede determinar y
    // se deja constancia explícita (mismo hallazgo que E1/main, ver
    // warning equivalente ahí). No se inventa una segunda condición.
    resultLatex = generalSolution;
  }

  const remainingConstants = ic ? ["C_1", "C_2"].filter((c2) => resultLatex.includes(c2)) : [];

  return {
    resultLatex,
    confidence: "SYMBOLIC",
    steps: [
      { id: "original", latex: `y''+(${a})y'+(${b})y=${c}`, explanation: "Ecuación diferencial original." },
      { id: "characteristic", latex: `r^2+(${a})r+(${b})=0`, explanation: `Ecuación característica. Raíces: ${roots.join(", ")}.` },
      { id: "homogeneous", latex: `y_h=${homogeneous}`, explanation: "Solución de la ecuación homogénea asociada." },
      ...(!isHomogeneous ? [{ id: "particular", latex: `y_p=${particular.replace("+", "")}`, explanation: "Solución particular (constante, válida para lado derecho constante)." }] : []),
      {
        id: "result",
        latex: resultLatex,
        explanation:
          remainingConstants.length > 0
            ? `Solución general. Con una sola condición inicial, ${remainingConstants.join(" y ")} quedan sin determinar -- esta ecuación de 2º orden necesita 2 condiciones independientes.`
            : "Solución general de la ecuación diferencial.",
      },
    ],
  };
}

/** Punto de entrada del módulo -- recibe el texto ya normalizado (ver
 * normalize.ts, notación prima sobrevive intacta por no ser un macro
 * LaTeX) con la condición inicial opcional en el mismo campo, separada
 * por coma (spec 2.2, mismo criterio que main/E1). */
export function solveODE(text: string): CalculusResult {
  const [eqText, icText] = splitEquationAndCondition(text);
  if (!eqText.includes("=")) {
    throw appError(ErrorCode.PARSE_ERROR, `Se esperaba una ecuación ("="): "${eqText}".`);
  }
  const order = maxOrder(eqText);
  if (order === 0) {
    throw appError(ErrorCode.PARSE_ERROR, `No se detectó ninguna derivada (notación "y'") en: "${eqText}".`);
  }
  const ic = icText ? parseInitialCondition(icText) : null;

  if (order === 1) {
    const [, rhs] = eqText.split("=");
    // El lado izquierdo debe ser exactamente "y'" (plantilla del
    // teclado) -- si no, está fuera del alcance de este caso.
    const lhs = eqText.split("=")[0].trim();
    if (lhs !== "y'") {
      throw appError(
        ErrorCode.UNSUPPORTED_OPERATION,
        `Ecuación de primer orden con forma no soportada (se esperaba "y'=..."): "${eqText}".`,
      );
    }
    return solveFirstOrderDirect(rhs.trim(), ic);
  }

  if (order === 2) {
    // Forma esperada, exacta a la plantilla del teclado:
    // "y''+(coef a)*y'+(coef b)*y=(coef c)".
    const match = eqText
      .replace(/\s+/g, "")
      .match(/^y''\+\(?([^()*]+)\)?\*?y'\+\(?([^()*]+)\)?\*?y=(.+)$/);
    if (!match) {
      throw appError(
        ErrorCode.UNSUPPORTED_OPERATION,
        `Ecuación de segundo orden con forma no soportada (se esperaba "y''+a·y'+b·y=c" con a/b/c constantes): "${eqText}".`,
      );
    }
    const [, a, b, c] = match;
    return solveSecondOrderConstantCoeff(a, b, c, ic);
  }

  throw appError(ErrorCode.UNSUPPORTED_OPERATION, `Orden de EDO no soportado (máx. 2): orden ${order}.`);
}
