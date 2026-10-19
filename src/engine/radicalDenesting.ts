/**
 * Denestado exacto de raíces cuadradas anidadas con coeficientes racionales.
 *
 * Caso general cubierto (un nivel de anidamiento, un único radical interno):
 *   sqrt(a + b·√c)  con a > 0, c entero libre de cuadrados (c > 1) y
 *   d = √(a² − b²c) racional. Entonces
 *   sqrt(a + b·√c) = √x + sign(b)·√y,  con x = (a+d)/2 e y = (a−d)/2.
 *
 * Ejemplos: sqrt(2+sqrt(3)) = (sqrt(6)+sqrt(2))/2 ; sqrt(7+4*sqrt(3)) = 2+sqrt(3).
 *
 * No se reescribe nada que no cumpla lo anterior: radicandos con variables,
 * más de un radical distinto, anidamiento de dos niveles o a² − b²c no
 * cuadrado (por ejemplo sqrt(1+sqrt(2))). En esos casos el texto sale igual.
 *
 * Entrada y salida usan la sintaxis que devuelve Algebrite: sqrt(...) y
 * (...)^(1/2), y también n^(1/2) con n entero.
 */
import Fraction from "fraction.js";

/** Elemento r + s·√c. Si s = 0 es racional y c se fija en 1. */
interface RadicalElement {
  r: Fraction;
  s: Fraction;
  c: number;
}

/** Límite para enteros intermedios; por encima se rechaza el caso. */
const MAX_INTEGER = 1e12;
/** Tolerancia de la comprobación numérica del denestado. */
const NUMERIC_TOLERANCE = 1e-12;

function make(r: Fraction, s: Fraction, c: number): RadicalElement {
  return s.equals(0) ? { r, s: new Fraction(0), c: 1 } : { r, s, c };
}

function rational(r: Fraction): RadicalElement {
  return make(r, new Fraction(0), 1);
}

function exactSqrtInt(n: number): number | null {
  if (!Number.isSafeInteger(n) || n < 0) return null;
  const root = Math.round(Math.sqrt(n));
  return root * root === n ? root : null;
}

/** n = t²·m con m libre de cuadrados. */
function squarefreeSplit(n: number): { t: number; m: number } {
  let t = 1;
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    while (m % (p * p) === 0) {
      m /= p * p;
      t *= p;
    }
  }
  return { t, m };
}

/** √q para q racional no negativo, como elemento exacto. */
function sqrtRational(q: Fraction): RadicalElement | null {
  if (q.compare(0) < 0) return null;
  const product = q.n * q.d;
  if (product > MAX_INTEGER) return null;
  // √(n/d) = √(n·d)/d = t·√m / d
  const { t, m } = squarefreeSplit(product);
  if (m === 1) return rational(new Fraction(t, q.d));
  return make(new Fraction(0), new Fraction(t, q.d), m);
}

function add(x: RadicalElement, y: RadicalElement): RadicalElement | null {
  if (x.s.equals(0)) return make(x.r.add(y.r), y.s, y.c);
  if (y.s.equals(0)) return make(x.r.add(y.r), x.s, x.c);
  if (x.c !== y.c) return null;
  return make(x.r.add(y.r), x.s.add(y.s), x.c);
}

function mul(x: RadicalElement, y: RadicalElement): RadicalElement | null {
  if (!x.s.equals(0) && !y.s.equals(0) && x.c !== y.c) return null;
  const c = x.s.equals(0) ? y.c : x.c;
  const r = x.r.mul(y.r).add(x.s.mul(y.s).mul(c));
  const s = x.r.mul(y.s).add(x.s.mul(y.r));
  return make(r, s, c);
}

function inverse(x: RadicalElement): RadicalElement | null {
  if (x.s.equals(0)) return x.r.equals(0) ? null : rational(new Fraction(1).div(x.r));
  const norm = x.r.mul(x.r).sub(x.s.mul(x.s).mul(x.c));
  if (norm.equals(0)) return null;
  return make(x.r.div(norm), x.s.neg().div(norm), x.c);
}

/** Tokens: números, "sqrt", y los operadores + - * / ^ ( ). Cualquier otra cosa (variables) falla. */
function tokenize(src: string): string[] | null {
  const tokens: string[] = [];
  const re = /\s*(\d+(?:\.\d+)?|sqrt|[+\-*/^()])/y;
  let pos = 0;
  while (pos < src.length) {
    re.lastIndex = pos;
    const match = re.exec(src);
    if (!match) return /^\s*$/.test(src.slice(pos)) ? tokens : null;
    tokens.push(match[1]);
    pos = re.lastIndex;
  }
  return tokens;
}

/** Analizador descendente: expr → term → unary → power → atom. */
class Parser {
  private pos = 0;

  constructor(private readonly tokens: string[]) {}

  parseAll(): RadicalElement | null {
    const value = this.expr();
    return value && this.pos === this.tokens.length ? value : null;
  }

  private peek(): string | undefined {
    return this.tokens[this.pos];
  }

  private expect(token: string): boolean {
    if (this.peek() !== token) return false;
    this.pos++;
    return true;
  }

  private expr(): RadicalElement | null {
    let value = this.term();
    while (value && (this.peek() === "+" || this.peek() === "-")) {
      const negate = this.peek() === "-";
      this.pos++;
      const rhs = this.term();
      if (!rhs) return null;
      const signed = negate ? mul(rhs, rational(new Fraction(-1))) : rhs;
      value = signed && add(value, signed);
    }
    return value;
  }

  private term(): RadicalElement | null {
    let value = this.unary();
    while (value && (this.peek() === "*" || this.peek() === "/")) {
      const divide = this.peek() === "/";
      this.pos++;
      const rhs = this.unary();
      if (!rhs) return null;
      const factor = divide ? inverse(rhs) : rhs;
      value = factor && mul(value, factor);
    }
    return value;
  }

  private unary(): RadicalElement | null {
    if (this.expect("-")) {
      const value = this.unary();
      return value && mul(value, rational(new Fraction(-1)));
    }
    if (this.expect("+")) return this.unary();
    return this.power();
  }

  private power(): RadicalElement | null {
    let base = this.atom();
    while (base && this.peek() === "^") {
      this.pos++;
      if (this.tokens.slice(this.pos, this.pos + 5).join("") === "(1/2)") {
        this.pos += 5;
        if (!base.s.equals(0)) return null; // raíz de un radical: anidamiento de dos niveles
        base = sqrtRational(base.r);
      } else {
        const exponent = this.peek();
        if (!exponent || !/^\d+$/.test(exponent) || Number(exponent) > 4) return null;
        this.pos++;
        let product: RadicalElement | null = rational(new Fraction(1));
        for (let i = 0; i < Number(exponent) && product; i++) product = mul(product, base);
        base = product;
      }
    }
    return base;
  }

  private atom(): RadicalElement | null {
    const token = this.peek();
    if (token === undefined) return null;
    if (/^\d/.test(token)) {
      this.pos++;
      return rational(new Fraction(token));
    }
    if (token === "(") {
      this.pos++;
      const value = this.expr();
      return value && this.expect(")") ? value : null;
    }
    if (token === "sqrt") {
      this.pos++;
      if (!this.expect("(")) return null;
      const value = this.expr();
      if (!value || !this.expect(")")) return null;
      // Solo un nivel: la raíz de algo que ya contiene un radical no se maneja.
      return value.s.equals(0) ? sqrtRational(value.r) : null;
    }
    return null;
  }
}

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

interface SqrtTerm {
  coef: Fraction;
  m: number;
}

function termOf(e: RadicalElement): SqrtTerm {
  return e.s.equals(0) ? { coef: e.r, m: 1 } : { coef: e.s, m: e.c };
}

function termText(k: number, m: number): string {
  if (m === 1) return String(k);
  const magnitude = Math.abs(k);
  const radical = magnitude === 1 ? `sqrt(${m})` : `${magnitude}*sqrt(${m})`;
  return k < 0 ? `-${radical}` : radical;
}

/** Denestado de a + s·√c (elemento ya analizado). Devuelve null si no aplica. */
function denestElement(elem: RadicalElement): string | null {
  const a = elem.r;
  const b = elem.s;
  const c = elem.c;
  if (b.equals(0) || a.compare(0) <= 0) return null;

  // d = √(a² − b²c) debe ser racional.
  const disc = a.mul(a).sub(b.mul(b).mul(c));
  if (disc.compare(0) <= 0) return null;
  const dn = exactSqrtInt(disc.n);
  const dd = exactSqrtInt(disc.d);
  if (dn === null || dd === null) return null;
  const d = new Fraction(dn, dd);

  const x = a.add(d).div(2);
  const y = a.sub(d).div(2);
  const sx = sqrtRational(x);
  const sy = sqrtRational(y);
  if (!sx || !sy) return null;

  // √(a + b√c) = √x + sign(b)·√y
  const first = termOf(sx);
  const second = termOf(sy);
  second.coef = second.coef.mul(b.compare(0) > 0 ? 1 : -1);

  const denominator = (first.coef.d * second.coef.d) / gcd(first.coef.d, second.coef.d);
  const k1 = first.coef.mul(denominator);
  const k2 = second.coef.mul(denominator);
  if (k1.d !== 1 || k2.d !== 1) return null;
  const k1n = k1.s * k1.n;
  const k2n = k2.s * k2.n;

  // Comprobación numérica: el denestado debe coincidir con el valor original.
  const original = Math.sqrt(Number(a) + Number(b) * Math.sqrt(c));
  const candidate = (k1n * Math.sqrt(first.m) + k2n * Math.sqrt(second.m)) / denominator;
  if (!(Math.abs(candidate - original) <= NUMERIC_TOLERANCE * Math.max(1, original))) return null;

  const sum =
    termText(k1n, first.m) +
    (k2n < 0 ? `-${termText(-k2n, second.m)}` : `+${termText(k2n, second.m)}`);
  return denominator === 1 ? sum : `(${sum})/${denominator}`;
}

/** Denestado de un radicando escrito en texto. */
function denestRadicand(text: string): string | null {
  const tokens = tokenize(text);
  if (!tokens) return null;
  const elem = new Parser(tokens).parseAll();
  if (!elem || elem.s.equals(0)) return null;
  return denestElement(elem);
}

/** Índice del paréntesis que cierra el que está en `open`, o -1. */
function matchingParen(text: string, open: number): number {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function wrap(replacement: string, whole: boolean): string {
  return whole ? replacement : `(${replacement})`;
}

function rewrite(text: string): string {
  let out = "";
  let i = 0;
  while (i < text.length) {
    if (text.startsWith("sqrt(", i) && !(i > 0 && /[A-Za-z0-9_.]/.test(text[i - 1]))) {
      const open = i + 4;
      const close = matchingParen(text, open);
      if (close < 0) return out + text.slice(i);
      const inner = rewrite(text.slice(open + 1, close));
      const replacement = denestRadicand(inner);
      if (replacement !== null) {
        out += wrap(replacement, i === 0 && close === text.length - 1);
      } else {
        out += `sqrt(${inner})`;
      }
      i = close + 1;
      continue;
    }
    if (text[i] === "(") {
      const close = matchingParen(text, i);
      if (close > 0 && text.startsWith("^(1/2)", close + 1)) {
        const end = close + 7;
        const inner = rewrite(text.slice(i + 1, close));
        const replacement = denestRadicand(inner);
        if (replacement !== null) {
          out += wrap(replacement, i === 0 && end === text.length);
        } else {
          out += `(${inner})^(1/2)`;
        }
        i = end;
        continue;
      }
    }
    out += text[i];
    i++;
  }
  return out;
}

/**
 * Reescribe las raíces cuadradas anidadas con coeficientes racionales que
 * tengan denestado exacto. Cualquier otro texto se devuelve sin cambios.
 */
export function denestConstantRadicals(text: string): string {
  return rewrite(text);
}
