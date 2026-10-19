import { evaluate } from "./algebriteClient";

// Algebra114 AS-RAD: real n-th root equations (sqrt, cbrt, u^(1/n), n<=4) in one
// variable. Radicals are replaced by symbols y with y^n = u and eliminated one by
// one (each must be linear after reducing y^n -> u). Candidates are the roots of
// the resulting polynomial; each is kept only if back-substitution gives the real
// root value (principal for even n, real for odd n), otherwise it is extraneous.

const ev = (s: string) => evaluate(s).replace(/\s+/g, "");

interface Radical {
  text: string;
  radicand: string;
  index: number;
}

function matchingClose(s: string, open: number): number {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")" && --depth === 0) return i;
  }
  return -1;
}

function matchingOpen(s: string, close: number): number {
  let depth = 0;
  for (let i = close; i >= 0; i--) {
    if (s[i] === ")") depth++;
    else if (s[i] === "(" && --depth === 0) return i;
  }
  return -1;
}

function findRadicals(expr: string): Radical[] | null {
  const found: Radical[] = [];
  const fn = /(sqrt|cbrt)\(/g;
  for (let m = fn.exec(expr); m; m = fn.exec(expr)) {
    const open = m.index + m[1].length;
    const close = matchingClose(expr, open);
    if (close < 0) return null;
    found.push({ text: expr.slice(m.index, close + 1), radicand: expr.slice(open + 1, close), index: m[1] === "sqrt" ? 2 : 3 });
  }
  const pow = /\^\(1\/(\d+)\)/g;
  for (let m = pow.exec(expr); m; m = pow.exec(expr)) {
    let start: number;
    if (expr[m.index - 1] === ")") start = matchingOpen(expr, m.index - 1);
    else {
      start = m.index;
      while (start > 0 && /[A-Za-z0-9_.]/.test(expr[start - 1])) start--;
    }
    if (start < 0 || start === m.index) return null;
    const base = expr.slice(start, m.index);
    found.push({ text: expr.slice(start, m.index + m[0].length), radicand: base, index: Number(m[1]) });
  }
  return found;
}

function splitList(list: string): string[] {
  if (!list.startsWith("[")) return [list];
  const inner = list.slice(1, -1);
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < inner.length; i++) {
    if (inner[i] === "(" || inner[i] === "[") depth++;
    else if (inner[i] === ")" || inner[i] === "]") depth--;
    else if (inner[i] === "," && depth === 0) {
      out.push(inner.slice(start, i));
      start = i + 1;
    }
  }
  out.push(inner.slice(start));
  return out;
}

const hasRadical = (s: string) => /sqrt|cbrt|\^\(1\/|\^\(-1\/|abs/.test(s);

export interface RadicalCasesSolution {
  solutions: string[];
  notes: string[];
}

export function solveRealRadicalEquation(leftAlgebrite: string, rightAlgebrite: string, variable: string): RadicalCasesSolution | null {
  const expr = `(${leftAlgebrite})-(${rightAlgebrite})`.replace(/\s+/g, "");
  if (expr.includes("abs(")) return null;
  const names = new Set((expr.match(/[A-Za-z_]\w*/g) ?? []).filter((n) => n !== "sqrt" && n !== "cbrt"));
  if (names.size !== 1 || !names.has(variable)) return null;
  const found = findRadicals(expr);
  if (found === null || found.length === 0) return null;
  const radicals: Radical[] = [];
  for (const r of found) {
    if (hasRadical(r.radicand) || r.index < 2 || r.index > 4) return null;
    if (!radicals.some((q) => q.text === r.text)) radicals.push(r);
  }
  if (radicals.length > 2) return null;

  const ys = radicals.map((_, i) => `yrad${i + 1}`);
  let p = ev(expr);
  radicals.forEach((r, i) => { p = ev(`subst(${ys[i]},${r.text},${p})`); });
  if (hasRadical(p)) return null;

  const backSub: { a: string; b: string }[] = [];
  for (let i = radicals.length - 1; i >= 0; i--) {
    const { radicand, index } = radicals[i];
    const y = ys[i];
    const degree = Number(ev(`deg(${p},${y})`));
    if (!Number.isInteger(degree)) return null;
    let reduced = "0";
    for (let k = 0; k <= degree; k++) {
      reduced = ev(`(${reduced})+(${ev(`coeff(${p},${y},${k})`)})*(${radicand})^${Math.floor(k / index)}*${y}^${k % index}`);
    }
    if (Number(ev(`deg(${reduced},${y})`)) > 1) return null;
    const a = ev(`coeff(${reduced},${y},0)`);
    const b = ev(`coeff(${reduced},${y},1)`);
    if (b === "0") return null;
    backSub[i] = { a, b };
    p = ev(`(-(${a}))^${index}-(${radicand})*(${b})^${index}`);
  }
  if (p === "0" || hasRadical(p) || p.includes("yrad")) return null;

  let candidates: string[] = [];
  if (ev(`deg(${p},${variable})`) !== "0") {
    const listed = ev(`roots(${p},${variable})`);
    if (listed.includes("roots") || listed === "nil") return null;
    candidates = splitList(listed).filter((c) => ev(`imag(${c})`) === "0");
    candidates.sort((c, d) => parseFloat(ev(`float(${c})`)) - parseFloat(ev(`float(${d})`)));
  }

  const solutions: string[] = [];
  const notes: string[] = [];
  for (const c of candidates) {
    const values: string[] = [];
    let reason: string | null = null;
    for (let i = 0; i < radicals.length && reason === null; i++) {
      let a = ev(`subst(${c},${variable},${backSub[i].a})`);
      let b = ev(`subst(${c},${variable},${backSub[i].b})`);
      values.forEach((v, j) => { a = ev(`subst(${v},${ys[j]},${a})`); b = ev(`subst(${v},${ys[j]},${b})`); });
      if (ev(`simplify(${b})`) === "0") return null;
      const yv = ev(`simplify(-(${a})/(${b}))`);
      const radicandValue = ev(`subst(${c},${variable},${radicals[i].radicand})`);
      const even = radicals[i].index % 2 === 0;
      if (even && parseFloat(ev(`float(${radicandValue})`)) < 0) reason = "radicando negativo en una raíz par";
      else if (ev(`simplify((${yv})^${radicals[i].index}-(${radicandValue}))`) !== "0") reason = "no satisface la ecuación original";
      else if (even && yv !== "0" && parseFloat(ev(`float(${yv})`)) < 0) reason = "la raíz par principal no puede ser negativa";
      values.push(yv);
    }
    if (reason === null) {
      solutions.push(c);
      notes.push(`Candidato ${variable} = ${c}: verifica la ecuación original.`);
    } else {
      notes.push(`Candidato ${variable} = ${c}: ${reason}; se descarta (raíz extraña).`);
    }
  }
  if (candidates.length === 0) notes.push("Al eliminar los radicales no aparece ningún candidato real.");
  return { solutions, notes };
}
