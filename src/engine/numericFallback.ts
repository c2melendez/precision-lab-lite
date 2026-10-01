// Evaluador numérico propio (spec v10 §10, enfoque híbrido) — usado como
// fallback cuando el cálculo simbólico con Algebrite falla o no es seguro
// de asumir, y como único método para integrales definidas por Simpson.
//
// Se implementa aparte, en vez de depender de la sustitución numérica de
// Algebrite (`float(subst(...))`), porque no se pudo verificar el formato
// exacto de esa API sin poder compilar contra la librería real (ver
// "Riesgos pendientes" en el README). Este evaluador es un parser
// recursivo-descendente propio sobre la MISMA sintaxis Algebrite que ya
// produce el parser del Módulo 2, así que no depende de Algebrite en
// absoluto — solo de las reglas de precedencia estándar.

import { ErrorCode, type AppError } from "../types";

type Fn = (x: number) => number;

const SINGULAR_EPSILON = 1e-12;

const safeTan = (x: number): number =>
  Math.abs(Math.cos(x)) < SINGULAR_EPSILON ? NaN : Math.tan(x);
const safeSec = (x: number): number =>
  Math.abs(Math.cos(x)) < SINGULAR_EPSILON ? NaN : 1 / Math.cos(x);
const safeCsc = (x: number): number =>
  Math.abs(Math.sin(x)) < SINGULAR_EPSILON ? NaN : 1 / Math.sin(x);
const safeCot = (x: number): number =>
  Math.abs(Math.sin(x)) < SINGULAR_EPSILON ? NaN : Math.cos(x) / Math.sin(x);

const UNARY_FUNCTIONS: Record<string, Fn> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: safeTan,
  arcsin: Math.asin,
  arccos: Math.acos,
  arctan: Math.atan,
  sec: safeSec,
  csc: safeCsc,
  cot: safeCot,
  // Fase 3: sinh/cosh/tanh SÍ los evalúa Algebrite con float(...), pero se
  // incluyen aquí también por si el fallback numérico los recibe desde
  // otra ruta (ej. una integral/límite con una hiperbólica adentro).
  // asinh/acosh/atanh/sign, en cambio, Algebrite NO los evalúa ni con
  // float() (confirmado probando contra el paquete real) — para estos,
  // este fallback es el ÚNICO camino a un valor numérico.
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  asinh: Math.asinh,
  acosh: Math.acosh,
  atanh: Math.atanh,
  exp: Math.exp,
  sign: Math.sign,
  factorial: (x) => {
    if (!Number.isInteger(x) || x < 0) return NaN;
    let result = 1;
    for (let k = 2; k <= x; k++) result *= k;
    return result;
  },
  ln: Math.log,
  log: Math.log10,
  sqrt: Math.sqrt,
  abs: Math.abs,
};

function parseError(message: string): AppError {
  return { code: ErrorCode.DOMAIN_ERROR, message };
}

/** Compila una expresión en sintaxis Algebrite a una función JS evaluable numéricamente. */
export function compileNumeric(expr: string, variable: string): Fn {
  let pos = 0;
  const s = expr;

  function peek(): string {
    return s[pos];
  }
  function eof(): boolean {
    return pos >= s.length;
  }

  function parseExpr(): (x: number) => number {
    let left = parseTerm();
    while (!eof() && (peek() === "+" || peek() === "-")) {
      const op = peek();
      pos++;
      const right = parseTerm();
      const prevLeft = left;
      left = op === "+" ? (x) => prevLeft(x) + right(x) : (x) => prevLeft(x) - right(x);
    }
    return left;
  }

  function parseTerm(): (x: number) => number {
    let left = parseUnary();
    while (!eof() && (peek() === "*" || peek() === "/")) {
      const op = peek();
      pos++;
      const right = parseUnary();
      const prevLeft = left;
      left = op === "*"
        ? (x) => prevLeft(x) * right(x)
        : (x) => {
            const denominator = right(x);
            return Math.abs(denominator) < SINGULAR_EPSILON ? NaN : prevLeft(x) / denominator;
          };
    }
    return left;
  }

  function parseUnary(): (x: number) => number {
    if (peek() === "+") {
      pos++;
      return parseUnary(); // "+" unario es identidad — BUG detectado en revisión: faltaba, solo se manejaba "-"
    }
    if (peek() === "-") {
      pos++;
      const inner = parseUnary();
      return (x) => -inner(x);
    }
    return parsePower();
  }

  function parsePower(): (x: number) => number {
    const base = parseAtom();
    if (!eof() && peek() === "^") {
      pos++;
      const exponent = parseUnary(); // asociatividad simple, suficiente para esta calculadora
      return (x) => Math.pow(base(x), exponent(x));
    }
    return base;
  }

  function parseAtom(): (x: number) => number {
    if (eof()) throw parseError("Expresión numérica incompleta.");

    if (peek() === "(") {
      pos++;
      const inner = parseExpr();
      if (peek() !== ")") throw parseError('Se esperaba ")".');
      pos++;
      return inner;
    }

    if (/[0-9]/.test(peek())) {
      const match = s.slice(pos).match(/^[0-9]+(\.[0-9]+)?/)!;
      pos += match[0].length;
      const value = parseFloat(match[0]);
      return () => value;
    }

    if (/[a-zA-Z]/.test(peek())) {
      const match = s.slice(pos).match(/^[a-zA-Z]+/)!;
      const name = match[0];
      pos += name.length;

      if (name === "pi") return () => Math.PI;
      if (name === "e" && peek() !== "(") return () => Math.E;

      if (UNARY_FUNCTIONS[name]) {
        if (peek() !== "(") throw parseError(`Se esperaba "(" después de "${name}".`);
        pos++;
        const arg = parseExpr();
        if (peek() !== ")") throw parseError('Se esperaba ")".');
        pos++;
        const fn = UNARY_FUNCTIONS[name];
        return (x) => fn(arg(x));
      }

      if (name === variable) return (x) => x;

      throw parseError(`No se puede evaluar numéricamente la variable/función desconocida "${name}".`);
    }

    throw parseError(`Carácter numérico inesperado: "${peek()}".`);
  }

  const compiled = parseExpr();
  if (pos !== s.length) throw parseError("Expresión numérica con caracteres sobrantes al final.");
  return compiled;
}

/**
 * Módulo J2 (spec_graficacion_matrices_estadistica_unidades.md, sección
 * 3.2, decisión de diseño confirmada en J0): compilador numérico DE DOS
 * VARIABLES, para superficies z=f(x,y). Deliberadamente una función
 * NUEVA Y AISLADA — una copia del parser de `compileNumeric` adaptada a
 * `(x,y)=>number`, en vez de generalizar `compileNumeric` para aceptar
 * N variables. `compileNumeric` es compartido por límites, integrales y
 * graficación 2D/polar/paramétrica ya en producción; generalizarlo
 * arriesgaría esa superficie entera por un caso de uso (3D) que es el
 * único que necesita dos variables. Esta duplicación es el precio
 * consciente de cumplir la condición dura de J0 (no romper nada
 * existente) de la forma más segura posible.
 */
export function compileNumeric2D(expr: string, varX: string, varY: string): (x: number, y: number) => number {
  let pos = 0;
  const s = expr;

  function peek(): string {
    return s[pos];
  }
  function eof(): boolean {
    return pos >= s.length;
  }

  function parseExpr(): (x: number, y: number) => number {
    let left = parseTerm();
    while (!eof() && (peek() === "+" || peek() === "-")) {
      const op = peek();
      pos++;
      const right = parseTerm();
      const prevLeft = left;
      left = op === "+" ? (x, y) => prevLeft(x, y) + right(x, y) : (x, y) => prevLeft(x, y) - right(x, y);
    }
    return left;
  }

  function parseTerm(): (x: number, y: number) => number {
    let left = parseUnary();
    while (!eof() && (peek() === "*" || peek() === "/")) {
      const op = peek();
      pos++;
      const right = parseUnary();
      const prevLeft = left;
      left = op === "*"
        ? (x, y) => prevLeft(x, y) * right(x, y)
        : (x, y) => {
            const denominator = right(x, y);
            return Math.abs(denominator) < SINGULAR_EPSILON ? NaN : prevLeft(x, y) / denominator;
          };
    }
    return left;
  }

  function parseUnary(): (x: number, y: number) => number {
    if (peek() === "+") {
      pos++;
      return parseUnary();
    }
    if (peek() === "-") {
      pos++;
      const inner = parseUnary();
      return (x, y) => -inner(x, y);
    }
    return parsePower();
  }

  function parsePower(): (x: number, y: number) => number {
    const base = parseAtom();
    if (!eof() && peek() === "^") {
      pos++;
      const exponent = parseUnary();
      return (x, y) => Math.pow(base(x, y), exponent(x, y));
    }
    return base;
  }

  function parseAtom(): (x: number, y: number) => number {
    if (eof()) throw parseError("Expresión numérica incompleta.");

    if (peek() === "(") {
      pos++;
      const inner = parseExpr();
      if (peek() !== ")") throw parseError('Se esperaba ")".');
      pos++;
      return inner;
    }

    if (/[0-9]/.test(peek())) {
      const match = s.slice(pos).match(/^[0-9]+(\.[0-9]+)?/)!;
      pos += match[0].length;
      const value = parseFloat(match[0]);
      return () => value;
    }

    if (/[a-zA-Z]/.test(peek())) {
      const match = s.slice(pos).match(/^[a-zA-Z]+/)!;
      const name = match[0];
      pos += name.length;

      if (name === "pi") return () => Math.PI;
      if (name === "e" && peek() !== "(") return () => Math.E;

      if (UNARY_FUNCTIONS[name]) {
        if (peek() !== "(") throw parseError(`Se esperaba "(" después de "${name}".`);
        pos++;
        const arg = parseExpr();
        if (peek() !== ")") throw parseError('Se esperaba ")".');
        pos++;
        const fn = UNARY_FUNCTIONS[name];
        return (x, y) => fn(arg(x, y));
      }

      if (name === varX) return (x) => x;
      if (name === varY) return (_x, y) => y;

      throw parseError(`No se puede evaluar numéricamente la variable/función desconocida "${name}".`);
    }

    throw parseError(`Carácter numérico inesperado: "${peek()}".`);
  }

  const compiled = parseExpr();
  if (pos !== s.length) throw parseError("Expresión numérica con caracteres sobrantes al final.");
  return compiled;
}

/** Integración numérica por la regla de Simpson compuesta. */
export function simpsonIntegral(f: Fn, a: number, b: number, n = 1000): number {
  const evenN = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / evenN;
  let sum = f(a) + f(b);
  for (let i = 1; i < evenN; i++) {
    const x = a + i * h;
    sum += (i % 2 === 0 ? 2 : 4) * f(x);
  }
  return (h / 3) * sum;
}

/** Estima un límite por acercamiento numérico desde ambos lados. */
function classifyLimitSequence(values: number[]): { value: number; converged: boolean } {
  if (values.length === 0) return { value: NaN, converged: false };
  if (values.length === 1) return { value: values[0], converged: false };

  const last = values[values.length - 1];
  const prev = values[values.length - 2];
  const scale = Math.max(1, Math.abs(last));
  if (Math.abs(last - prev) <= 1e-5 * scale) {
    return { value: last, converged: true };
  }

  if (values.length >= 3) {
    const prev2 = values[values.length - 3];
    const absLast = Math.abs(last);
    const absPrev = Math.abs(prev);
    const absPrev2 = Math.abs(prev2);

    // Approaching zero: magnitude decays consistently by a meaningful
    // factor as the sample approaches the target.
    if (
      absLast < absPrev
      && absPrev < absPrev2
      && absLast <= 0.5 * absPrev
    ) {
      return { value: 0, converged: true };
    }

    // Diverging to +/-infinity: same sign, increasing magnitude, and the
    // last increment is not damping out relative to the previous one.
    const sameSign = Math.sign(last) === Math.sign(prev) && Math.sign(prev) === Math.sign(prev2);
    const d1 = Math.abs(last - prev);
    const d2 = Math.abs(prev - prev2);
    if (
      sameSign
      && absLast > absPrev
      && absPrev > absPrev2
      && d2 > 0
      && d1 >= 0.8 * d2
    ) {
      return { value: last > 0 ? Infinity : -Infinity, converged: true };
    }
  }

  return { value: last, converged: false };
}

export function numericLimit(
  f: Fn,
  point: number,
  direction: "both" | "left" | "right" = "both",
): { value: number; converged: boolean } {
  const epsilons = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6];
  const evalSide = (sign: 1 | -1) =>
    epsilons.map((eps) => f(point + sign * eps)).filter((v) => Number.isFinite(v));

  const rightVals = direction !== "left" ? evalSide(1) : [];
  const leftVals = direction !== "right" ? evalSide(-1) : [];

  const right = rightVals.length ? classifyLimitSequence(rightVals) : undefined;
  const left = leftVals.length ? classifyLimitSequence(leftVals) : undefined;

  if (right && left) {
    if (right.converged && left.converged) {
      if (right.value === left.value) return right;
      if (Number.isFinite(right.value) && Number.isFinite(left.value)) {
        const close = Math.abs(right.value - left.value) < 1e-3;
        return { value: (right.value + left.value) / 2, converged: close };
      }
    }
    return { value: NaN, converged: false };
  }
  return right ?? left ?? { value: NaN, converged: false };
}

/**
 * Fase 2 externa (hueco #3): límites cuando x tiende a +∞/-∞. No se puede
 * reusar numericLimit (que se acerca al punto con epsilons cada vez más
 * chicos) porque el infinito no admite "sumarle epsilon" — en vez de eso
 * se evalúa en valores cada vez más grandes (magnitud creciente) y se
 * revisa si el resultado converge entre los dos últimos, mismo criterio
 * de convergencia que numericLimit.
 */
export function numericLimitAtInfinity(f: Fn, sign: 1 | -1): { value: number; converged: boolean } {
  // Keep samples below the overflow/catastrophic-cancellation range of
  // sinh/cosh/exp. 8..256 is already asymptotic for the supported
  // transcendental families while remaining finite in IEEE-754.
  const magnitudes = [8, 16, 32, 64, 128, 256];
  const raw = magnitudes.map((m) => f(sign * m));

  const firstInfinite = raw.find((v) => v === Infinity || v === -Infinity);
  if (firstInfinite !== undefined) {
    const finitePrefix = raw.filter((v) => Number.isFinite(v));
    if (
      finitePrefix.length > 0
      && finitePrefix.every((v) => Math.sign(v) === Math.sign(firstInfinite))
    ) {
      return { value: firstInfinite, converged: true };
    }
  }

  const vals = raw.filter((v) => Number.isFinite(v));
  return classifyLimitSequence(vals);
}
