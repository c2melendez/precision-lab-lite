// Exact substitution for two polynomial equations: one affine, one quadratic.
// Other nonlinear systems are rejected explicitly; the linear solver stays separate.
import { evaluate, derivative, expand } from "../algebriteClient";
import { ErrorCode, type AppError } from "../../types";

const unsupported = (): AppError => ({
  code: ErrorCode.UNSUPPORTED_OPERATION,
  message: "Este sistema requiere dos ecuaciones polinómicas de dos variables, una lineal y otra de grado máximo dos.",
});
const rational = (s: string) => /^-?\d+(?:\/[1-9]\d*)?$/.test(s);
const atZero = (s: string, variables: string[]): string =>
  variables.reduce((expr, v) => evaluate(`subst(0,${v},${expr})`), s);

// Bound degree before invoking symbolic expansion, including nested powers.
// Division is limited to constant expressions, so domain holes cannot disappear.
function boundPolynomial(source: string, variables: string[]): void {
  const tokens = source.match(/\d+(?:\.\d+)?|[A-Za-z]+|[()+*/^.-]/g) ?? [];
  if (tokens.length > 250 || tokens.join("") !== source.replace(/\s/g, "")) throw unsupported();
  let pos = 0;
  const capped = (n: number) => { if (n > 2) throw unsupported(); return n; };
  function atom(depth: number): number {
    if (depth > 32) throw unsupported();
    const token = tokens[pos++];
    if (token === "+" || token === "-") return atom(depth + 1);
    if (token === "(") {
      const degree = sum(depth + 1);
      if (tokens[pos++] !== ")") throw unsupported();
      return degree;
    }
    if (/^\d+(?:\.\d+)?$/.test(token ?? "")) return 0;
    if (variables.includes(token)) return 1;
    throw unsupported();
  }
  function power(depth: number): number {
    let degree = atom(depth);
    if (tokens[pos] === "^") {
      pos++;
      // Algebrite syntax emitted by the parser uses integer powers.
      const grouped = tokens[pos] === "(";
      if (grouped) pos++;
      const exponent = tokens[pos++];
      if (!/^[012]$/.test(exponent ?? "")) throw unsupported();
      if (grouped && tokens[pos++] !== ")") throw unsupported();
      degree = capped(degree * Number(exponent));
    }
    return degree;
  }
  function product(depth: number): number {
    let degree = power(depth);
    while (tokens[pos] === "*" || tokens[pos] === "/") {
      const op = tokens[pos++];
      const rhs = power(depth);
      if (op === "/" && rhs !== 0) throw unsupported();
      degree = capped(degree + (op === "*" ? rhs : 0));
    }
    return degree;
  }
  function sum(depth: number): number {
    let degree = product(depth);
    while (tokens[pos] === "+" || tokens[pos] === "-") {
      pos++;
      degree = Math.max(degree, product(depth));
    }
    return degree;
  }
  sum(0);
  if (pos !== tokens.length) throw unsupported();
}

function polynomial(source: string, variables: string[]): string[] {
  if (source.length > 500 || !/^[\d\sA-Za-z+*/^().-]+$/.test(source)) throw unsupported();
  const names = source.match(/[A-Za-z]+/g) ?? [];
  if (names.some(name => !variables.includes(name))) throw unsupported();
  boundPolynomial(source, variables);
  const [x, y] = variables;
  const dx = derivative(source, x);
  const dy = derivative(source, y);
  const c = atZero(source, variables);
  const a = atZero(dx, variables);
  const b = atZero(dy, variables);
  const xx = evaluate(`(${atZero(derivative(dx, x), variables)})/2`);
  const xy = atZero(derivative(dx, y), variables);
  const yy = evaluate(`(${atZero(derivative(dy, y), variables)})/2`);
  const coeffs = [c, a, b, xx, xy, yy];
  if (!coeffs.every(rational)) throw unsupported();
  const reconstructed = `(${c})+(${a})*${x}+(${b})*${y}+(${xx})*${x}^2+(${xy})*${x}*${y}+(${yy})*${y}^2`;
  if (evaluate(expand(`(${source})-(${reconstructed})`)) !== "0") throw unsupported();
  return coeffs;
}

/** null means both equations are linear; caller uses the existing linear solver. */
export function tryQuadraticSystem(equations: string[], variables: string[]): string[][] | null {
  if (equations.length !== 2 || variables.length !== 2) return null;
  if (new Set(variables).size !== 2 || variables.some(v => !/^[a-zA-Z]$/.test(v) || /[eEiI]/.test(v))) throw unsupported();
  const coeffs = equations.map(eq => polynomial(eq, variables));
  const linear = coeffs.map(c => c.slice(3).every(v => v === "0"));
  if (linear.every(Boolean)) return null;
  if (!linear.some(Boolean)) throw unsupported();
  const index = linear[0] ? 0 : 1;
  const [c, a, b] = coeffs[index];
  if (a === "0" && b === "0") throw unsupported();
  const pivot = a !== "0" ? 0 : 1;
  const other = 1 - pivot;
  const v = variables[pivot], t = variables[other];
  const divisor = pivot === 0 ? a : b;
  const slope = pivot === 0 ? b : a;
  const replacement = evaluate(`-((${c})+(${slope})*${t})/(${divisor})`);
  const reduced = expand(evaluate(`subst(${replacement},${v},${equations[1-index]})`));
  const C = atZero(reduced, [t]);
  const B = atZero(derivative(reduced, t), [t]);
  const A = evaluate(`(${atZero(derivative(reduced, t, 2), [t])})/2`);
  if (![A, B, C].every(rational)) throw unsupported();
  let roots: string[];
  if (A === "0") {
    if (B === "0") {
      if (C === "0") throw unsupported(); // positive-dimensional family
      return [];
    }
    roots = [evaluate(`-(${C})/(${B})`)];
  } else {
    const D = evaluate(`(${B})^2-4*(${A})*(${C})`);
    if (!rational(D)) throw unsupported();
    if (D.startsWith("-")) return []; // explicitly real solutions only
    roots = [1, -1].map(sign => evaluate(`(-(${B})+(${sign})*sqrt(${D}))/(2*(${A}))`));
  }
  const distinct = [...new Set(roots)];
  return distinct.map(root => {
    const pair = new Array<string>(2);
    pair[other] = root;
    pair[pivot] = evaluate(`subst(${root},${t},${replacement})`);
    for (const eq of equations) {
      const residual = evaluate(`subst(${pair[1]},${variables[1]},subst(${pair[0]},${variables[0]},${eq}))`);
      if (residual !== "0") throw unsupported(); // never publish an incomplete/unverified root set
    }
    return pair;
  });
}
