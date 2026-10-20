/**
 * Respaldo verificado para factor(...) sobre polinomios univariados con
 * coeficientes enteros. Algebrite puede devolver una factorización que no es
 * equivalente al original (p. ej. x^6-1). Este módulo factoriza por el método
 * de Kronecker sobre ℤ. El llamador debe comprobar la equivalencia antes de
 * aceptar un resultado alternativo.
 */

type Coeffs = bigint[]; // de menor a mayor grado
type Rat = { n: bigint; d: bigint };

const SAMPLE_COUNT = 13; // x = 0..12
const MAX_SAMPLE_DEGREE = 10;
const MAX_DIVISOR_VALUE = 10n ** 12n;
const MAX_POINT = 500n;

function abs(v: bigint): bigint {
  return v < 0n ? -v : v;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    [x, y] = [y, x % y];
  }
  return x;
}

function ratNorm(n: bigint, d: bigint): Rat {
  if (d === 0n) throw new Error("denominador cero");
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  return g === 0n ? { n: 0n, d: 1n } : { n: n / g, d: d / g };
}

function ratAdd(a: Rat, b: Rat): Rat {
  return ratNorm(a.n * b.d + b.n * a.d, a.d * b.d);
}

function ratMul(a: Rat, b: Rat): Rat {
  return ratNorm(a.n * b.n, a.d * b.d);
}

function trim(p: Coeffs): Coeffs {
  let end = p.length;
  while (end > 1 && p[end - 1] === 0n) end--;
  return p.slice(0, end);
}

function evalAt(p: Coeffs, x: bigint): bigint {
  let acc = 0n;
  for (let k = p.length - 1; k >= 0; k--) acc = acc * x + p[k];
  return acc;
}

/** Interpolación de Lagrange exacta sobre racionales (de menor a mayor grado). */
function interpolate(xs: bigint[], ys: bigint[]): Rat[] {
  const m = xs.length;
  const out: Rat[] = Array.from({ length: m }, () => ({ n: 0n, d: 1n }));
  for (let i = 0; i < m; i++) {
    let basis: Rat[] = [{ n: 1n, d: 1n }];
    let denom = 1n;
    for (let j = 0; j < m; j++) {
      if (j === i) continue;
      const next: Rat[] = Array.from({ length: basis.length + 1 }, () => ({ n: 0n, d: 1n }));
      basis.forEach((c, k) => {
        next[k + 1] = ratAdd(next[k + 1], c);
        next[k] = ratAdd(next[k], ratMul(c, { n: -xs[j], d: 1n }));
      });
      basis = next;
      denom *= xs[i] - xs[j];
    }
    const scale = ratNorm(ys[i], denom);
    basis.forEach((c, k) => {
      out[k] = ratAdd(out[k], ratMul(c, scale));
    });
  }
  return out;
}

function toIntegers(r: Rat[]): Coeffs | null {
  if (r.some((c) => c.d !== 1n)) return null;
  return trim(r.map((c) => c.n));
}

/** División exacta en ℤ[x]; null si no es exacta. */
function divExact(p: Coeffs, g: Coeffs): Coeffs | null {
  const dg = g.length - 1;
  const lead = g[dg];
  if (lead === 0n || p.length - 1 < dg) return null;
  const rem = [...p];
  const q: Coeffs = new Array(p.length - dg).fill(0n);
  for (let k = rem.length - 1; k >= dg; k--) {
    const c = rem[k];
    if (c === 0n) continue;
    if (c % lead !== 0n) return null;
    const qk = c / lead;
    q[k - dg] = qk;
    for (let j = 0; j <= dg; j++) rem[k - dg + j] -= qk * g[j];
  }
  for (let k = 0; k < dg; k++) {
    if (rem[k] !== 0n) return null;
  }
  return trim(q);
}

function signedDivisors(v: bigint): bigint[] | null {
  const a = abs(v);
  if (a === 0n || a > MAX_DIVISOR_VALUE) return null;
  const positive: bigint[] = [];
  for (let i = 1n; i * i <= a; i++) {
    if (a % i === 0n) {
      positive.push(i);
      if (i * i !== a) positive.push(a / i);
    }
  }
  return positive.flatMap((d) => [d, -d]);
}

/** Búsqueda exhaustiva de un factor de grado d por combinaciones de divisores (Kronecker). */
function searchFactor(
  p: Coeffs,
  d: number,
  xs: bigint[],
  options: bigint[][],
): { g: Coeffs; q: Coeffs } | null {
  const chosen: bigint[] = new Array(options.length).fill(0n);
  const walk = (idx: number): { g: Coeffs; q: Coeffs } | null => {
    if (idx === options.length) {
      const g = toIntegers(interpolate(xs, chosen));
      if (!g || g.length - 1 !== d) return null;
      const q = divExact(p, g);
      return q ? { g, q } : null;
    }
    for (const w of options[idx]) {
      chosen[idx] = w;
      const hit = walk(idx + 1);
      if (hit) return hit;
    }
    return null;
  };
  return walk(0);
}

/** Devuelve factores cuyo producto exacto es p, o null si no se puede decidir. */
function factorPrimitive(input: Coeffs): Coeffs[] | null {
  const p = trim(input);
  const deg = p.length - 1;
  if (deg <= 1) return [p];
  for (let d = 1; d <= Math.floor(deg / 2); d++) {
    const xs: bigint[] = [];
    const vals: bigint[] = [];
    for (let x = 2n; xs.length < d + 1; x++) {
      if (x > MAX_POINT) return null;
      const v = evalAt(p, x);
      if (v !== 0n) {
        xs.push(x);
        vals.push(v);
      }
    }
    const options: bigint[][] = [];
    for (const v of vals) {
      const ds = signedDivisors(v);
      if (!ds) return null;
      options.push(ds);
    }
    const hit = searchFactor(p, d, xs, options);
    if (hit) {
      const left = factorPrimitive(hit.g);
      const right = factorPrimitive(hit.q);
      if (!left || !right) return null;
      return [...left, ...right];
    }
  }
  return [p];
}

/** Entero exacto de polinomio a partir de muestras en x = 0..12 (grado <= 10). */
function integerPolynomialFromSamples(vals: bigint[]): Coeffs | null {
  for (let n = 0; n <= MAX_SAMPLE_DEGREE; n++) {
    const xs = Array.from({ length: n + 1 }, (_, i) => BigInt(i));
    const coeffs = toIntegers(interpolate(xs, vals.slice(0, n + 1)));
    if (!coeffs) continue;
    if (vals.every((v, k) => evalAt(coeffs, BigInt(k)) === v)) return coeffs;
  }
  return null;
}

function sampleValues(text: string, run: (s: string) => string): bigint[] | null {
  const vals: bigint[] = [];
  for (let k = 0; k < SAMPLE_COUNT; k++) {
    const out = run(text.replace(/x/g, `(${k})`)).replace(/\s+/g, "");
    if (!/^-?\d+$/.test(out)) return null;
    vals.push(BigInt(out));
  }
  return vals;
}

function formatFactor(a: Coeffs): string {
  const terms: string[] = [];
  for (let k = a.length - 1; k >= 0; k--) {
    const c = a[k];
    if (c === 0n) continue;
    const m = abs(c);
    let body: string;
    if (k === 0) body = m.toString();
    else if (k === 1) body = m === 1n ? "x" : `${m}*x`;
    else body = m === 1n ? `x^${k}` : `${m}*x^${k}`;
    if (terms.length === 0) terms.push(c < 0n ? `-${body}` : body);
    else terms.push(c < 0n ? `-${body}` : `+${body}`);
  }
  return terms.length ? terms.join("") : "0";
}

/**
 * Factorización univariada sobre ℤ de un texto en sintaxis Algebrite con solo
 * x, enteros y operadores + - * ^ ( ). Devuelve null si el texto no es un
 * polinomio entero de grado <= 10 o si la factorización no puede decidirse.
 */
export function factorUnivariateIntegerText(text: string, run: (s: string) => string): string | null {
  const t = text.trim();
  if (!/^[0-9x+\-*^() ]+$/.test(t) || !t.includes("x")) return null;
  const vals = sampleValues(t, run);
  if (!vals) return null;
  const poly = integerPolynomialFromSamples(vals);
  if (!poly) return null;
  const factors = factorPrimitive(poly);
  if (!factors) return null;
  return factors.map((f) => `(${formatFactor(f)})`).join("*");
}

/** Devuelve el contenido de factor(...) si la entrada es exactamente una llamada. */
function unwrapFactorCall(input: string): string | null {
  const s = input.trim();
  const head = /^factor\s*\(/.exec(s);
  if (!head) return null;
  const open = head[0].length - 1;
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")") {
      depth--;
      if (depth === 0) return i === s.length - 1 ? s.slice(open + 1, i) : null;
    }
  }
  return null;
}

/**
 * AS-B-16: identidades de suma/diferencia de cubos para un binomio a^3 ± b^3
 * con variables de una letra. Devuelve null si la entrada no tiene esa forma.
 */
export function cubeBinomialCandidate(inner: string): string | null {
  const m = inner.trim().match(/^([a-z])\^3\s*([+-])\s*([a-z])\^3$/);
  if (!m) return null;
  const [, a, op, b] = m;
  if (a === b) return null;
  return op === "-"
    ? `(${a}-${b})*(${a}^2+${a}*${b}+${b}^2)`
    : `(${a}+${b})*(${a}^2-${a}*${b}+${b}^2)`;
}

/**
 * Verifica que el resultado de factor(...) sea equivalente a su entrada.
 * Si Algebrite devuelve algo no equivalente, usa la factorización univariada
 * entera cuando esta sí es verificable. Si no, conserva el resultado original.
 */
export function verifyFactorResult(input: string, result: string, run: (s: string) => string): string {
  const inner = unwrapFactorCall(input);
  if (inner === null) return result;
  // AS-B-16: Algebrite can return a difference/sum of cubes unchanged. Replace it
  // only with the standard identity when the identity is verified equivalent.
  const cube = cubeBinomialCandidate(inner);
  if (cube !== null && !/[()*]/.test(result)) {
    try {
      if (run(`(${cube})-(${inner})`).replace(/\s+/g, "") === "0") return cube;
    } catch {
      return result;
    }
  }
  // Only integer-polynomial results are candidates for replacement. Results with
  // radicals, fractions or complex parts (e.g. real factors of x^4+1) are kept.
  if (!/^[0-9x+\-*^() ]+$/.test(result.trim())) return result;
  try {
    const equivalent = (candidate: string) => run(`(${candidate})-(${inner})`).replace(/\s+/g, "") === "0";
    if (equivalent(result)) return result;
    const alternative = factorUnivariateIntegerText(inner, run);
    if (alternative !== null && equivalent(alternative)) return alternative;
    return result;
  } catch {
    return result;
  }
}
