import { evaluate, toLatex } from "./algebriteClient";

// Algebra114 AS-AVS: univariate rational-linear combinations of |ax+b| are
// rewritten by cases over R with a left-closed partition (-inf,c1),[c1,c2),...,[cn,inf).
export interface AbsPiecewiseBranch {
  expressionAlgebrite: string;
  lower: string | null;
  lowerClosed: boolean;
  upper: string | null;
  upperClosed: boolean;
}

export interface AbsPiecewise {
  variable: string;
  branches: AbsPiecewiseBranch[];
  latex: string;
}

const RATIONAL = /^-?\d+(\/\d+)?$/;
const ev = (s: string) => evaluate(s).replace(/\s+/g, "");
const value = (s: string) => {
  const [p, q = "1"] = s.split("/");
  return Number(p) / Number(q);
};

function mapAbs(expr: string, replace: (inner: string, index: number) => string): string | null {
  let out = "";
  let cursor = 0;
  let index = 0;
  for (let i = expr.indexOf("abs("); i !== -1; i = expr.indexOf("abs(", cursor)) {
    let depth = 0;
    let j = i + 3;
    for (; j < expr.length; j++) {
      if (expr[j] === "(") depth++;
      else if (expr[j] === ")" && --depth === 0) break;
    }
    const inner = expr.slice(i + 4, j);
    if (j >= expr.length || inner.includes("abs(")) return null;
    out += expr.slice(cursor, i) + replace(inner, index++);
    cursor = j + 1;
  }
  return out + expr.slice(cursor);
}

function linear(expr: string, v: string): { a: string; b: string } | null {
  const a = ev(`coeff(${expr},${v},1)`);
  const b = ev(`coeff(${expr},${v},0)`);
  if (!RATIONAL.test(a) || !RATIONAL.test(b)) return null;
  return ev(`simplify((${expr})-(${a})*${v}-(${b}))`) === "0" ? { a, b } : null;
}

const conditionLatex = (v: string, b: AbsPiecewiseBranch) =>
  b.lower === null ? `${v}<${toLatex(b.upper!)}`
    : b.upper === null ? `${v}\\ge ${toLatex(b.lower)}`
      : `${toLatex(b.lower)}\\le ${v}<${toLatex(b.upper)}`;

interface AbsolutePieces {
  variable: string;
  points: string[];
  pieces: { a: string; b: string }[];
}

function absolutePieces(expr: string): AbsolutePieces | null {
  if (!expr.includes("abs(")) return null;
  const names = new Set((expr.match(/[A-Za-z_]\w*/g) ?? []).filter((n) => n !== "abs"));
  if (names.size !== 1) return null;
  const [v] = [...names];
  const args: string[] = [];
  if (mapAbs(expr, (inner) => { args.push(inner); return "0"; }) === null) return null;
  const points: string[] = [];
  for (const arg of args) {
    const line = linear(arg, v);
    if (line === null || line.a === "0") return null;
    const c = ev(`-(${line.b})/(${line.a})`);
    if (!points.some((p) => ev(`(${p})-(${c})`) === "0")) points.push(c);
  }
  points.sort((p, q) => value(p) - value(q));

  const samples = [ev(`(${points[0]})-1`), ...points.slice(1).map((p, i) => ev(`((${points[i]})+(${p}))/2`)), ev(`(${points[points.length - 1]})+1`)];
  const pieces: { a: string; b: string }[] = [];
  for (const sample of samples) {
    const replaced = mapAbs(expr, (inner) => (value(ev(`subst(${sample},${v},${inner})`)) < 0 ? `(-(${inner}))` : `(${inner})`));
    const line = linear(ev(`simplify(${replaced})`), v);
    if (line === null) return null;
    pieces.push(line);
  }
  return { variable: v, points, pieces };
}

export function realAbsolutePiecewise(exprAlgebrite: string): AbsPiecewise | null {
  const expr = exprAlgebrite.replace(/\s+/g, "");
  if (!expr.includes("abs(")) return null;
  const names = new Set((expr.match(/[A-Za-z_]\w*/g) ?? []).filter((n) => n !== "abs"));
  if (names.size !== 1) return null;
  const [v] = [...names];
  if (RATIONAL.test(ev(`simplify((${expr})/abs(${v}))`))) return null;
  const split = absolutePieces(expr);
  if (split === null) return null;
  const { points } = split;
  const pieces = split.pieces.map((line) => ev(`(${line.a})*${v}+(${line.b})`));

  const branches: AbsPiecewiseBranch[] = [];
  pieces.forEach((piece, i) => {
    const last = branches[branches.length - 1];
    if (last && ev(`(${last.expressionAlgebrite})-(${piece})`) === "0") last.upper = points[i] ?? null;
    else branches.push({ expressionAlgebrite: piece, lower: i === 0 ? null : points[i - 1], lowerClosed: i > 0, upper: points[i] ?? null, upperClosed: false });
  });
  if (branches.length < 2) return null;
  const rows = branches.map((b) => `${toLatex(b.expressionAlgebrite)} & ${conditionLatex(v, b)}`);
  return { variable: v, branches, latex: `\\begin{cases}${rows.join("\\\\")}\\end{cases}` };
}

export interface AbsoluteCasesSolution {
  solutions: string[];
  notes: string[];
}

// Algebra114 AS-AVS-07..09: solve (left)-(right)=0 by cases on the same
// left-closed partition; a branch root is kept only inside its own region, so
// roots introduced by squaring are rejected. Identity regions (interval
// solutions) are not handled and return null.
export function solveRealAbsoluteCases(leftAlgebrite: string, rightAlgebrite: string, variable: string): AbsoluteCasesSolution | null {
  const expr = `(${leftAlgebrite})-(${rightAlgebrite})`.replace(/\s+/g, "");
  const split = absolutePieces(expr);
  if (split === null || split.variable !== variable) return null;
  const { points, pieces } = split;
  const sign = (s: string) => Math.sign(value(ev(s)));
  const solutions: string[] = [];
  const notes: string[] = [];
  for (let i = 0; i < pieces.length; i++) {
    const lower = i === 0 ? null : points[i - 1];
    const upper = points[i] ?? null;
    const region = lower === null ? `${variable} < ${upper}` : upper === null ? `${variable} ≥ ${lower}` : `${lower} ≤ ${variable} < ${upper}`;
    const { a, b } = pieces[i];
    if (a === "0") {
      if (b === "0") return null;
      notes.push(`En ${region} la ecuación queda ${b} = 0: sin solución.`);
      continue;
    }
    const root = ev(`-(${b})/(${a})`);
    const inside = (lower === null || sign(`(${root})-(${lower})`) >= 0) && (upper === null || sign(`(${root})-(${upper})`) < 0);
    if (inside) {
      solutions.push(root);
      notes.push(`En ${region}: ${variable} = ${root}, pertenece al tramo y se acepta.`);
    } else {
      notes.push(`En ${region}: ${variable} = ${root} no pertenece al tramo; se descarta (raíz extraña).`);
    }
  }
  return { solutions, notes };
}
