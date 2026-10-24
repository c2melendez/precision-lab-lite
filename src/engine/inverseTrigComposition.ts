/**
 * EV-I-09 / EV-I-10: composiciones inversa↔directa con argumento numérico.
 *
 * Algebrite aplica la cancelación `arcsin(sin(x)) = x` sin comprobar el rango
 * principal: `arcsin(sin(2))` devolvía `2` cuando la rama correcta es
 * `π − 2 ≈ 1.141592654` (fila EV-I-09 de la matriz congelada). También deja
 * sin evaluar las identidades pitagóricas del tipo `sin(arccos(3/5))`, que
 * valen `4/5` (fila EV-I-10).
 *
 * Este módulo reescribe SOLO una composición completa cuyo argumento es
 * numérico (sin variables libres). Las expresiones simbólicas, las sumas y
 * cualquier otra forma se devuelven intactas: no se adivina nada. El
 * resultado se entrega en forma exacta (múltiplos enteros de π y el literal
 * original) para que el motor conserve la representación simbólica; no se
 * emite ningún decimal aproximado.
 *
 * Alcance declarado: la composición debe ocupar la expresión completa. Una
 * composición anidada dentro de una suma mayor no se reescribe aquí.
 */

import { compileNumeric } from "./numericFallback";

const PI = Math.PI;

/** Valor numérico de un argumento sin variables libres, o null. */
function numericValue(text: string): number | null {
  try {
    const value = Number(compileNumeric(text, "__none__")(0));
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

/** Quita paréntesis que envuelven toda la expresión, preservando el resto. */
function unwrapParens(text: string): string {
  let current = text.trim();
  for (;;) {
    if (!current.startsWith("(") || !current.endsWith(")")) return current;
    let depth = 0;
    let wrapsAll = true;
    for (let i = 0; i < current.length; i += 1) {
      if (current[i] === "(") depth += 1;
      else if (current[i] === ")") {
        depth -= 1;
        if (depth === 0 && i !== current.length - 1) {
          wrapsAll = false;
          break;
        }
      }
    }
    if (!wrapsAll) return current;
    current = current.slice(1, -1).trim();
  }
}

/** arg + multiple*pi, en forma exacta. */
function shifted(arg: string, multiple: number): string {
  if (multiple === 0) return `(${arg})`;
  const term = Math.abs(multiple) === 1 ? "pi" : `${Math.abs(multiple)}*pi`;
  return multiple > 0 ? `(${arg})+${term}` : `(${arg})-${term}`;
}

/** multiple*pi - arg, en forma exacta. */
function piMinus(multiple: number, arg: string): string {
  const term = Math.abs(multiple) === 1 ? "pi" : `${Math.abs(multiple)}*pi`;
  return multiple < 0 ? `-${term}-(${arg})` : `${term}-(${arg})`;
}

/**
 * Rama principal de inversa(directa(t)) para t numérico.
 * Devuelve null cuando la forma no está soportada.
 */
function inverseOfDirect(
  inverse: string,
  direct: string,
  arg: string,
): string | null {
  const value = numericValue(arg);
  if (value === null) return null;

  if (inverse === "arcsin" && direct === "sin") {
    // Rango principal [-π/2, π/2]; periodo 2π.
    const turns = Math.floor(value / (2 * PI));
    const reduced = value - 2 * PI * turns; // [0, 2π)
    if (reduced <= PI / 2) return shifted(arg, -2 * turns);
    if (reduced < (3 * PI) / 2) return piMinus(2 * turns + 1, arg);
    return shifted(arg, -2 * (turns + 1));
  }

  if (inverse === "arccos" && direct === "cos") {
    // Rango principal [0, π]; periodo 2π.
    const turns = Math.floor(value / (2 * PI));
    const reduced = value - 2 * PI * turns; // [0, 2π)
    if (reduced <= PI) return shifted(arg, -2 * turns);
    return piMinus(2 * (turns + 1), arg);
  }

  if (inverse === "arctan" && direct === "tan") {
    // Rango principal (-π/2, π/2); periodo π.
    const turns = Math.round(value / PI);
    return shifted(arg, -turns);
  }

  return null;
}

/** Identidades pitagóricas directa(inversa(u)) para u numérico. */
function directOfInverse(
  direct: string,
  inverse: string,
  arg: string,
): string | null {
  const value = numericValue(arg);
  if (value === null) return null;

  const bounded = inverse === "arcsin" || inverse === "arccos";
  if (bounded && Math.abs(value) > 1) return null; // fuera del dominio real

  // sin(arccos u) = cos(arcsin u) = √(1 − u²)
  if ((direct === "sin" && inverse === "arccos") || (direct === "cos" && inverse === "arcsin")) {
    return `sqrt(1-(${arg})^2)`;
  }
  // tan(arcsin u) = u/√(1 − u²), definida para |u| < 1.
  if (direct === "tan" && inverse === "arcsin") {
    if (Math.abs(value) >= 1) return null;
    return `(${arg})/sqrt(1-(${arg})^2)`;
  }
  // tan(arccos u) = √(1 − u²)/u, definida para 0 < |u| ≤ 1.
  if (direct === "tan" && inverse === "arccos") {
    if (value === 0) return null;
    return `sqrt(1-(${arg})^2)/(${arg})`;
  }

  return null;
}

/**
 * Reescribe una composición completa inversa↔directa con argumento numérico.
 * Cualquier otra expresión se devuelve sin cambios.
 */
export function rewriteInverseTrigComposition(expression: string): string {
  const text = expression.trim();

  const outerInverse = /^(arcsin|arccos|arctan)\(\s*(sin|cos|tan)\(([\s\S]*)\)\s*\)$/.exec(text);
  if (outerInverse) {
    const rewritten = inverseOfDirect(outerInverse[1], outerInverse[2], unwrapParens(outerInverse[3]));
    return rewritten ?? expression;
  }

  const outerDirect = /^(sin|cos|tan)\(\s*(arcsin|arccos|arctan)\(([\s\S]*)\)\s*\)$/.exec(text);
  if (outerDirect) {
    const rewritten = directOfInverse(outerDirect[1], outerDirect[2], unwrapParens(outerDirect[3]));
    return rewritten ?? expression;
  }

  return expression;
}
