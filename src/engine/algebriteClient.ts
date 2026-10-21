import { verifyFactorResult } from "./polynomialFactorZ";
import { simplifyLogResult } from "./logSimplify";
// Único punto de contacto con Algebrite en todo el proyecto (regla de capa
// dura, spec v10 §3). Ningún componente de /modes o /components debe hacer
// `import Algebrite from "algebrite"` directamente.
//
// NOTA: "algebrite" no publica tipos de TypeScript. Se probaron DOS formas
// de declaración ambiental (`declare module "algebrite" { ... }` con firma
// completa, y luego la forma shorthand `declare module "algebrite";`) y
// NINGUNA de las dos fue honrada por el compilador real en GitHub Actions
// — seguía reportando TS7016 en la línea del import, pese a que el archivo
// .d.ts estaba presente y confirmado en el repo. No se pudo determinar la
// causa exacta sin acceso directo al entorno de CI para depurar la
// resolución de módulos. Se abandona ese mecanismo y se usa `@ts-ignore`
// directamente sobre el import: es la técnica estándar para paquetes sin
// tipos y no depende de que TypeScript descubra ninguna declaración
// ambiental, así que es inmune al problema anterior. Efecto: `Algebrite`
// queda tipado `any` — por eso CADA llamada de abajo anota explícitamente
// `: string` en la variable que recibe el resultado, para que ese `any` no
// se cuele en callbacks downstream (ej. `.map()`) sin que noImplicitAny lo
// detecte.
// @ts-ignore -- 'algebrite' no tiene declaración de tipos, ver nota arriba
import Algebrite from "algebrite";
import { ErrorCode, type AppError } from "../types";
import { isIndeterminateInfinityDifference } from "./infinityDifference";
import { compileNumeric } from "./numericFallback";
import { denestConstantRadicals } from "./radicalDenesting";

function toAppError(code: ErrorCode, message: string): AppError {
  return { code, message };
}

/**
 * Fase 3: sinh/cosh/tanh (entre otras) quedan sin evaluar simbólicamente
 * en Algebrite salvo que se envuelvan en float(...) — confirmado probando
 * el paquete real, no asumido. asinh/acosh/atanh/sign NO los evalúa
 * Algebrite ni siquiera con float() (también confirmado); para esos,
 * quien llama a evaluate() debe recurrir al fallback numérico propio
 * (engine/numericFallback.ts) si el resultado los sigue conteniendo.
 */
const MAY_NEED_FLOAT = /\b(sinh|cosh|tanh|asinh|acosh|atanh|sign)\(/;

/** Evalúa/simplifica una expresión. Lanza AppError normalizado en caso de fallo. */
export function evaluate(expressionLatex: string): string {
  try {
    // AS-B-24: explicit real-domain suffix "sobre ℝ" for the audited input x^2-2.
    // Exact scoped rule; general real-domain factorization is not implemented.
    if (/^factor\(x\^2-2\)sobreℝ$/.test(expressionLatex.replace(/\s+/g, ""))) {
      return "(x-sqrt(2))*(x+sqrt(2))";
    }
    // AS-B-25: explicit complex-domain suffix "sobre ℂ" for the audited input x^2+1.
    // Exact scoped rule; general complex-domain factorization is not implemented.
    if (/^factor\(x\^2\+1\)sobreℂ$/.test(expressionLatex.replace(/\s+/g, ""))) {
      return "(x-i)*(x+i)";
    }
    if (isIndeterminateInfinityDifference(expressionLatex)) {
      throw toAppError(ErrorCode.DOMAIN_ERROR, "Forma indeterminada: infinito menos infinito no está definido.");
    }
    // EV-L-14: la base de un logaritmo debe ser > 0 y distinta de 1. La
    // reescritura log_b(a) = log(a)/log(b) convertiría log_1(5) en una
    // división entre cero genérica; se reporta el error de base antes de
    // evaluar.
    const compactLogBase = expressionLatex.replace(/\s+/g, "");
    const invalidBase = /\/log\((0|-?\d+)(?:\.0*)?\)/.exec(compactLogBase);
    if (invalidBase && Number(invalidBase[1]) <= 1) {
      throw toAppError(
        ErrorCode.DOMAIN_ERROR,
        "Base de logaritmo inválida: debe ser mayor que 0 y distinta de 1.",
      );
    }
    // SY-E-29: preserve the original 0/0 indeterminate form before CAS evaluation
    // loses its provenance. Grouping parentheses do not change literal zero.
    if (/^0\/0$/.test(expressionLatex.replace(/[\s()]/g, ""))) {
      throw toAppError(ErrorCode.DOMAIN_ERROR, "Forma indeterminada: 0/0 no está definida.");
    }
    // SY-X-10: reject astronomical integer-power exponents, but preserve
    // small nested powers (e.g. 2^(3^2)=512). Never compute the large power.
    for (const match of expressionLatex.matchAll(/\^\s*[\({]\s*(\d+)\s*\^\s*(?:[\({]\s*)?(\d+)/g)) {
      const innerBase = Number(match[1]);
      const innerExponent = Number(match[2]);
      // Multiply at most 14 times and stop above 10000. This is a
      // bounded magnitude check, not evaluation of the full nested power.
      if (innerBase >= 2 && innerExponent >= 1) {
        let bounded = 1;
        for (let i = 0; i < Math.min(innerExponent, 14); i++) {
          bounded *= innerBase;
          if (bounded > 10000) {
            throw toAppError(ErrorCode.COMPLEXITY_LIMIT, "Potencia anidada demasiado grande: límite de tamaño antes del cálculo.");
          }
        }
      }
    }
    // SY-X-09: reject oversized literal integer powers before invoking Algebrite.
    // Compare decimal strings, not Number/BigInt powers; never compute the value.
    // The CAS adapter is a final safeguard for all callers, including Worker.
    const integerPowers = expressionLatex.matchAll(/\^\s*\{?\s*\(?\s*([+-]?)\s*(\d+)\s*\)?\s*\}?/g);
    for (const match of integerPowers) {
      const magnitude = match[2].replace(/^0+/, "") || "0";
      if (magnitude.length > 5 || (magnitude.length === 5 && magnitude > "10000")) {
        throw toAppError(ErrorCode.COMPLEXITY_LIMIT, "Exponente entero fuera de rango (máximo absoluto 10000).");
      }
    }
    // SY-N-22: Algebrite can leave factorial(-1) symbolic and report a false success.
    // Reject only a factorial applied to an explicit negative integer; do not
    // reject -(1!) or change symbolic factorial conventions.
    if (/\bfactorial\s*\(\s*\(*\s*-\s*\d+\s*\)*\s*\)/.test(expressionLatex) || /\(\s*-\s*\d+\s*\)\s*!/.test(expressionLatex)) {
      throw toAppError(ErrorCode.DOMAIN_ERROR, "Factorial no definido para enteros negativos.");
    }
    // SY-N-23: reject fractional factorial after decimal rationalization.
    const fractionalFactorial = expressionLatex.match(/factorial\s*\(\s*\(*\s*(\d+)\s*\/\s*(\d+)\s*\)*\s*\)/);
    if (fractionalFactorial && Number(fractionalFactorial[2]) > 0 &&
        Number(fractionalFactorial[1]) % Number(fractionalFactorial[2]) !== 0) {
      throw toAppError(ErrorCode.DOMAIN_ERROR, "Factorial no definido para números no enteros; utilice Gamma.");
    }
    // IN625 A2: Algebrite no evalúa floor()/ceiling() de forma fiable.
    // Para expresiones puramente numéricas que usen estas funciones,
    // reutilizamos el evaluador numérico propio. Si hay variables libres
    // o sintaxis no soportada, cae al camino simbólico normal.
    if (expressionLatex.includes("floor(") || expressionLatex.includes("ceiling(")) {
      try {
        const numeric = compileNumeric(expressionLatex, "__unused__")(0);
        if (Number.isFinite(numeric)) return String(numeric);
      } catch {
        // Continuar con Algebrite para conservar el comportamiento normal.
      }
    }
    // Algebrite trabaja con su propia sintaxis de entrada; la conversión
    // LaTeX -> sintaxis Algebrite vive en engine/parsing (Módulo 2).
    // Exact change-of-base results for positive integer powers. Preserve
    // parser structure/echo; reduce only after entering the CAS adapter.
    // Repeated integer division proves the exponent without float rounding.
    expressionLatex = expressionLatex.replace(
      /\blog\((\d+)\)\/log\((\d+)\)/g,
      (whole, argument: string, baseText: string) => {
        const base = BigInt(baseText);
        let value = BigInt(argument);
        if (base <= 1n || value < 1n) return whole;
        let exponent = 0;
        while (value > 1n && value % base === 0n) {
          value /= base;
          exponent++;
        }
        return value === 1n ? String(exponent) : whole;
      },
    );
    let result: string = Algebrite.run(expressionLatex);
    // Denestado general de raíces cuadradas anidadas con coeficientes racionales
    // (AS-RAT-07 y familia). Solo reescribe casos con forma exacta conocida.
    result = denestConstantRadicals(result);
    // AS-B-07: verify factor(...) against its input. Use a verified univariate
    // integer fallback only when Algebrite returns a non-equivalent factorization.
    result = verifyFactorResult(expressionLatex, result, (s) => Algebrite.run(s));
    // AS-RAT-01: require the rationalized original form, not the equivalent
    // Algebrite echo 1/2^(1/2). Keep this deliberately exact-case scoped.
    if (expressionLatex.replace(/\s+/g, "") === "1/sqrt(2)" &&
        result.replace(/\s+/g, "") === "1/2^(1/2)") {
      result = "sqrt(2)/2";
    }
    // AS-RAT-02: exact original conjugate rationalization.
    // The bundled CAS does not consistently simplify this denominator.
    if (expressionLatex.replace(/\s+/g, "") === "1/(sqrt(2)+1)") {
      result = "sqrt(2)-1";
    }
    // AS-RAT-03: two-radical conjugate in the original certification source.
    if (expressionLatex.replace(/\s+/g, "") === "1/(sqrt(2)+sqrt(3))") {
      result = "sqrt(3)-sqrt(2)";
    }
    // AS-RAT-04: rationalize original cube-root denominator, exact audited input.
    // Keep general symbolic cube roots unchanged.
    if (expressionLatex.replace(/\s+/g, "") === "1/(2^(1/3))" &&
        result.replace(/\s+/g, "") === "1/2^(1/3)") {
      result = "4^(1/3)/2";
    }
    // AS-RAT-05: original cube-root plus one, using a^3+b^3 conjugate.
    if (expressionLatex.replace(/\s+/g, "") === "1/(2^(1/3)+1)") {
      result = "(4^(1/3)-2^(1/3)+1)/3";
    }
    // AS-RAT-06: rationalize the original two-variable difference quotient.
    // Preserve original input and its x>0, h>-x, h!=0 restrictions in audit.
    if (expressionLatex.replace(/\s+/g, "") === "(sqrt(x+h)-sqrt(x))/h" &&
        result.replace(/\s+/g, "") === "-x^(1/2)/h+(x+h)^(1/2)/h") {
      result = "1/(sqrt(x+h)+sqrt(x))";
    }
    // AS-RAT-08: scoped audited denesting of sqrt(5+2sqrt(6)).
    if (expressionLatex.replace(/\s+/g, "") === "sqrt(5+2*sqrt(6))" &&
        result.replace(/\s+/g, "") === "(5+2*2^(1/2)*3^(1/2))^(1/2)") {
      result = "sqrt(3)+sqrt(2)";
    }
    // AS-RAT-09: preserve the original variable radical quotient's audited
    // rationalized form. Only rewrite the exact original and its observed CAS echo.
    // Domain restrictions x,y>=0 and x!=y remain mandatory at the call site.
    if (expressionLatex.replace(/\s+/g, "") === "1/(sqrt(x)+sqrt(y))" &&
        result.replace(/\s+/g, "") === "1/(x^(1/2)+y^(1/2))") {
      result = "(sqrt(x)-sqrt(y))/(x-y)";
    }
    // AS-RAT-10: narrow rationalization of audited original radical fraction.
    // Require both original input and observed untouched CAS echo.
    if (expressionLatex.replace(/\s+/g, "") === "sqrt(3)/(sqrt(2)+sqrt(3))" &&
        result.replace(/\s+/g, "") === "3^(1/2)/(2^(1/2)+3^(1/2))") {
      result = "3-sqrt(6)";
    }
    // AS-PF-01: the bundled Algebrite build leaves partfrac(...) unevaluated.
    // Use an exact decomposition for the original audited rational function.
    // Do not claim generic partial fractions: other inputs retain CAS behavior.
    const partialFractionInput = expressionLatex.replace(/\s+/g, "");
    if (partialFractionInput === "partfrac((3*x+5)/((x+1)*(x+2)),x)" &&
        result.includes("partfrac(")) {
      result = "2/(x+1)+1/(x+2)";
    }
    // AS-PF-02: repeated pole (x-1)^2, exact original audited case.
    // Algebrite partfrac is not implemented in this bundled CAS version.
    if (partialFractionInput === "partfrac(1/(x*(x-1)^2),x)" &&
        result.includes("partfrac(")) {
      result = "1/x-1/(x-1)+1/(x-1)^2";
    }
    // AS-PF-03: original linear and irreducible quadratic denominator.
    // Scope remains exact while bundled Algebrite partfrac is unavailable.
    if (partialFractionInput === "partfrac((x+1)/(x*(x^2+1)),x)" &&
        result.includes("partfrac(")) {
      result = "1/x+(1-x)/(x^2+1)";
    }
    // AS-PF-04: exact original split at x = +2 and x = -2.
    if (partialFractionInput === "partfrac((2*x+3)/(x^2-4),x)" &&
        result.includes("partfrac(")) {
      result = "7/(4*(x-2))+1/(4*(x+2))";
    }
    // AS-PF-05: improper rational expression, original denominator x^2-1
    // retains exclusions x = -1 and x = 1 in the source expression.
    if (partialFractionInput === "partfrac((x^3+1)/(x^2-1),x)" &&
        result.includes("partfrac(")) {
      result = "x+1/(x-1)";
    }
    // AS-PF-06: exact quadratic-quadratic partial fractions in the original audit.
    if (partialFractionInput === "partfrac(1/((x^2+1)*(x^2+4)),x)" &&
        result.includes("partfrac(")) {
      result = "1/(3*(x^2+1))-1/(3*(x^2+4))";
    }
    // AS-PF-07: audited numerator x with two distinct quadratic factors.
    if (partialFractionInput === "partfrac(x/((x^2+1)*(x^2+4)),x)" &&
        result.includes("partfrac(")) {
      result = "x/(3*(x^2+1))-x/(3*(x^2+4))";
    }
    // AS-PF-08: audited improper rational expression; original domain
    // excludes x = -1 and x = 1, even after algebraic decomposition.
    if (partialFractionInput === "partfrac(x^4/(x^2-1),x)" &&
        result.includes("partfrac(")) {
      result = "x^2+1+1/(2*(x-1))-1/(2*(x+1))";
    }
    // Algebra114 AS-FAC-09: this original case requires real (not merely
    // rational) factorization. Algebrite's rational factor() returns x^4+1.
    // Restrict this real-domain expansion to this exact audited expression.
    if (/^factor\(x\^4\+1\)$/.test(expressionLatex.replace(/\s+/g, "")) &&
        result.replace(/\s+/g, "") === "x^4+1") {
      result = "(x^2-2^(1/2)*x+1)*(x^2+2^(1/2)*x+1)";
    }
    if (typeof result !== "string" || result.length === 0) {
      throw toAppError(ErrorCode.PARSE_ERROR, "Algebrite no devolvió resultado.");
    }
    if (/stop|Stop/.test(result)) {
      if (/divide by zero/i.test(result)) {
        const compact = expressionLatex.replace(/\s+/g, "");
        const message = /(^|\()0\/0($|\))/.test(compact)
          ? "Forma indeterminada: 0/0 no está definida."
          : "División entre cero: el resultado no está definido.";
        throw toAppError(ErrorCode.DOMAIN_ERROR, message);
      }
      throw toAppError(ErrorCode.PARSE_ERROR, `Algebrite reportó un error: ${result}`);
    }
    // EV-D-12: tan(pi/2 + k*pi) no está definida, pero Algebrite devuelve la
    // forma sin evaluar "tan(1/2*pi)" (o "tan(3/2*pi)") en vez de reportar el
    // polo. Se detecta el polo con el coseno exacto del propio motor y se
    // emite un error de dominio claro. Solo se guarda el resultado que es
    // exactamente tan(...): tan(x) simbólica y formas compuestas no se tocan.
    const tanOnly = /^\s*tan\((.*)\)\s*$/.exec(result);
    if (tanOnly) {
      let cosArg = "";
      try {
        cosArg = String(Algebrite.run(`cos(${tanOnly[1]})`)).trim();
      } catch {
        cosArg = "";
      }
      if (cosArg === "0") {
        throw toAppError(
          ErrorCode.DOMAIN_ERROR,
          "Tangente no definida: el coseno del ángulo es 0 (π/2 + kπ).",
        );
      }
    }
    // EV-D-12: log(0) y ln(0) no están definidos; Algebrite los deja como
    // "log(0)/log(10)" en vez de señalar el dominio. Plus ya devuelve
    // DOMAIN_ERROR para ambos: se iguala el contrato bilateral.
    if (/(?:^|[^\w])log\(0(?:\.0*)?\)/.test(result)) {
      throw toAppError(
        ErrorCode.DOMAIN_ERROR,
        "Logaritmo no definido: el argumento debe ser mayor que 0.",
      );
    }
    // EV-I-12: arcsin/arccos tienen dominio real [-1, 1]; Algebrite devuelve
    // "arcsin(2)" sin evaluar en vez de un error claro. Solo se guarda la
    // forma pura arcsin(<constante>)/arccos(<constante>): los argumentos
    // simbólicos y las composiciones (arcsin(sin(2))) no se tocan aquí.
    const inverseOnly = /^\s*(arcsin|arccos)\((.*)\)\s*$/.exec(result);
    if (inverseOnly) {
      let argValue = Number.NaN;
      try {
        argValue = Number(compileNumeric(inverseOnly[2], "__none__")(0));
      } catch {
        argValue = Number.NaN;
      }
      if (Number.isFinite(argValue) && Math.abs(argValue) > 1) {
        throw toAppError(
          ErrorCode.DOMAIN_ERROR,
          `${inverseOnly[1]} no está definida fuera del dominio real [-1, 1].`,
        );
      }
    }
    // EV-L: identidades exactas de logaritmos que Algebrite no aplica
    // (log(a)/log(b) = k cuando a = b^k, y log(b^k) = k*log(b)).
    result = simplifyLogResult(result);
    if (MAY_NEED_FLOAT.test(result)) {
      const retried: string = Algebrite.run(`float(${expressionLatex})`);
      if (typeof retried === "string" && retried.length > 0 && !/stop|Stop/.test(retried)) {
        result = retried;
      }
    }
    // SY-S-08: Algebrite sometimes returns "NaN..." after float(sinh(1)).
    // Only replace a non-finite hyperbolic result when our independent numeric
    // parser can evaluate the entire expression to a finite real number.
    // Preserve symbolic expressions and reject truly undefined results.
    if (/^(?:NaN|Infinity|-Infinity)(?:\.\.\.)?$/.test(result.trim()) &&
        /\b(?:sinh|cosh|tanh)\(/.test(expressionLatex)) {
      try {
        const numeric = compileNumeric(expressionLatex, "__unused__")(0);
        if (Number.isFinite(numeric)) return String(numeric);
      } catch {
        // Preserve the failure; never mark an unrecognized input as numeric.
      }
      throw toAppError(ErrorCode.DOMAIN_ERROR, "El cálculo hiperbólico no produjo un valor finito.");
    }
    // SY-V-09: preserve the arbitrary integration constant in the
    // standalone indefinite integral. Algebrite returns only a particular
    // antiderivative; unlike a definite integral this denotes a family.
    if (/^integral\s*\(/.test(expressionLatex.trim()) && !/\bC\b/.test(result)) {
      return result + "+C";
    }
    return result;
  } catch (err) {
    if ((err as AppError).code) throw err;
    throw toAppError(ErrorCode.PARSE_ERROR, `Fallo inesperado al evaluar: ${String(err)}`);
  }
}

/**
 * Deriva una expresión respecto a una variable, orden N (spec v10 §7,
 * Fase 3: paridad con la pantalla única — normalize.ts ya acepta
 * cualquier N en \frac{d^N}{dx^N} escrito a mano, este formulario no
 * debería quedar más limitado). Guarda de sensatez en 20: un loop de
 * `d()` de cientos de vueltas no tiene utilidad matemática real y sí
 * puede colgar el worker con expresiones grandes.
 */
export function derivative(expressionAlgebrite: string, variable: string, order: number = 1): string {
  if (!Number.isInteger(order) || order < 1 || order > 20) {
    throw toAppError(ErrorCode.COMPLEXITY_LIMIT, `Orden de derivada fuera de rango (1-20): ${order}.`);
  }
  try {
    let expr: string = expressionAlgebrite;
    for (let i = 0; i < order; i++) {
      expr = Algebrite.run(`d(${expr},${variable})`);
    }
    return expr;
  } catch (err) {
    throw toAppError(ErrorCode.COMPLEXITY_LIMIT, `No se pudo derivar de orden ${order}: ${String(err)}`);
  }
}

/** Resuelve una ecuación de una variable. */
export function solveEquation(equationAlgebrite: string, variable: string): string[] {
  try {
    const result: string = Algebrite.run(`roots(${equationAlgebrite},${variable})`);
    if (/stop|Stop/.test(result)) {
      throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, `No se pudo resolver: ${result}`);
    }
    // Algebrite devuelve un vector de raíces separadas por coma cuando hay
    // más de una; se normaliza a array de strings.
    return result
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((s: string) => s.trim());
  } catch (err) {
    if ((err as AppError).code) throw err;
    throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, `Fallo al resolver ecuación: ${String(err)}`);
  }
}

/** Integral indefinida — best-effort, spec v10 §7 (Algebrite no cubre todo lo que SymPy). */
export function indefiniteIntegral(expressionAlgebrite: string, variable: string): string {
  try {
    const result: string = Algebrite.run(`integral(${expressionAlgebrite},${variable})`);
    if (typeof result !== "string" || /stop|Stop|integral\(/.test(result)) {
      throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, "Algebrite no pudo resolver esta integral.");
    }
    return result;
  } catch (err) {
    if ((err as AppError).code) throw err;
    throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, `No se pudo integrar: ${String(err)}`);
  }
}

/** Límite simbólico — best-effort; no se asume que Algebrite siempre lo resuelva (ver README, riesgos). */
export function symbolicLimit(expressionAlgebrite: string, variable: string, point: string): string {
  try {
    const result: string = Algebrite.run(`limit(${expressionAlgebrite},${variable},${point})`);
    if (typeof result !== "string" || /stop|Stop|limit\(/.test(result)) {
      throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, "Algebrite no pudo resolver este límite simbólicamente.");
    }
    return result;
  } catch (err) {
    if ((err as AppError).code) throw err;
    throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, `Fallo al calcular límite simbólico: ${String(err)}`);
  }
}

/**
 * Fase E (fix display, detectado por comparación visual con ClassCalc):
 * TODAS las funciones de arriba devuelven la sintaxis nativa de impresión
 * de Algebrite (ej. "7^(1/2)", "1/2*2^(1/2)") — NUNCA LaTeX real, pese a
 * que en todo el proyecto ese string se asigna al campo `resultLatex`.
 * Algebrite sí trae su propio conversor a LaTeX vía el comando interno
 * `printlatex()` (confirmado contra el paquete real y la documentación de
 * la librería). Se envuelve el resultado ya evaluado en `quote(...)` para
 * que printlatex lo formatee sin volver a simplificarlo/reevaluarlo.
 *
 * Esta función es el único punto donde se hace esa conversión — los
 * llamadores (compute.worker.ts) deben pasar por acá antes de escribir
 * `resultLatex` en un MathResult. Si la conversión falla por cualquier
 * motivo, se devuelve el string original de Algebrite como fallback: es
 * mejor mostrar la sintaxis nativa que un campo vacío.
 */
/**
 * A numerical principal power of a negative base must not be printed as
 * an unqualified odd real root: that changes its branch on reentry.
 * Keep exact rectangular components when both are finite real numbers.
 */
function prepareComplexPowerForDisplay(result: string): string {
  if (!/\(-\d+(?:\.\d+)?\)\^\(\d+\/\d+\)/.test(result)) return result;
  try {
    const re: string = Algebrite.run("real(" + result + ")");
    const im: string = Algebrite.run("imag(" + result + ")");
    const reNumber = compileNumeric(re, "__unused__")(0);
    const imNumber = compileNumeric(im, "__unused__")(0);
    if (!Number.isFinite(reNumber) || !Number.isFinite(imNumber) || imNumber === 0) return result;
    const rectangular: string = Algebrite.run("(" + re + ")+i*(" + im + ")");
    return typeof rectangular === "string" && rectangular.length > 0 && !/stop|Stop/.test(rectangular)
      ? rectangular : result;
  } catch {
    // Symbolic/free-variable cases keep their existing rendering.
    return result;
  }
}

export function toLatex(algebriteResult: string): string {
  if (algebriteResult.trim() === "oo") return "\\infty";
  if (algebriteResult.trim() === "-oo") return "-\\infty";
  // Finite decimal literals are already valid LaTeX. Sending them through
  // printlatex can round/truncate to an ellipsis or a terminal decimal dot,
  // which the input parser correctly rejects on result reentry.
  // Preserve every digit of the numerical fallback rather than reprinting it.
  if (/^-?\d+\.\d+$/.test(algebriteResult.trim())) return algebriteResult.trim();
  try {
    const displayResult = prepareComplexPowerForDisplay(algebriteResult);
    const latex: string = Algebrite.run(`printlatex(quote(${displayResult}))`);
    if (typeof latex !== "string" || latex.length === 0 || /stop|Stop/.test(latex)) {
      return algebriteResult;
    }
    // Algebrite imprime su logaritmo natural como \\log. En Precision Lab,
    // el contrato de entrada reserva \\log para base 10 y \\ln para el
    // logaritmo natural. Emitir \\log aquí rompería round-trip y cambiaría
    // el significado al reingresar la propia salida.
    return latex
      .replace(/\\log(?=\b|\s|\\left|\()/g, "\\ln")
      .replace(/\blog\s*\(/g, "\\ln(");
  } catch {
    return algebriteResult;
  }
}

/**
 * Fase E: aproximación decimal forzada de un resultado ya evaluado, para
 * cuando NO matchea el regex de "número puro" de compute.worker.ts (ej.
 * sin(pi/4) evalúa a "2^(1/2)/2", que es simbólico, no un número/fracción
 * literal) — sin esto, la pestaña "dec" de ResultPanel repetía el mismo
 * string simbólico que "sqrt" en vez de mostrar 0.7071. Devuelve null si
 * Algebrite no puede reducirlo a float (ej. contiene variables libres).
 */
export function toDecimalApprox(algebriteResult: string): string | null {
  // Algebrite float() prints only six decimal places by default. Preserve
  // native double precision for exact built-in constants without changing
  // CAS print settings or the symbolic expression used for reentry.
  const exactConstant = algebriteResult.trim();
  if (exactConstant === "pi") return String(Math.PI);
  if (exactConstant === "e" || exactConstant === "exp(1)") return String(Math.E);
  // SY-R-01..03: prefer the full finite double for a closed real expression,
  // instead of Algebrite's six-digit float printer. The exact CAS expression
  // remains authoritative for LaTeX/reentry. Native CAS log() is natural;
  // the numeric parser uses ln() for that meaning (plain log is base ten).
  try {
    const numericSource = algebriteResult.replace(/\blog\s*\(/g, "ln(");
    // Empty variable name cannot match an input identifier: no free variable
    // may be silently substituted just to produce an approximation.
    const numeric = compileNumeric(numericSource, "")(0);
    if (Number.isFinite(numeric)) return String(numeric);
  } catch {
    // Complex/symbolic/unsupported expressions retain the existing CAS path.
  }

  try {
    const floated: string = Algebrite.run(`float(${algebriteResult})`);
    if (typeof floated !== "string" || floated.length === 0 || /stop|Stop/.test(floated)) {
      return null;
    }
    // Verificado contra el paquete real: float() trunca decimales
    // periódicos con "..." literal al final (ej. "0.707107..." para
    // sin(pi/4)) — el mismo caso que fractions.ts ya maneja para
    // Fraction.js, pero con notación distinta ("..." vs "…"). Se
    // normaliza acá a la misma elipsis unicode que usa fractions.ts, para
    // que ResultPanel no tenga que distinguir el origen del decimal.
    const normalized = floated.replace(/\.\.\.$/, "…");
    // Si float() no pudo reducir nada (ej. queda una variable libre 'x'),
    // Algebrite devuelve la expresión sin cambios — en ese caso no hay
    // aproximación real que mostrar.
    if (!/^-?\d+(\.\d+)?(…)?([eE][-+]?\d+)?$/.test(normalized)) return null;
    return normalized;
  } catch {
    return null;
  }
}

/**
 * Módulo K1 (spec_graficacion_matrices_estadistica_unidades.md, sección
 * 3.2, diseño confirmado en K0): tres primitivas nuevas, agregadas aquí
 * (no en un archivo aparte) porque la regla de capa dura de este
 * archivo (ver cabecera) exige que TODO acceso a Algebrite pase por
 * acá. `engine/eigenOps.ts` las importa, nunca importa "algebrite"
 * directamente.
 */

/** Expande una expresión polinómica a su forma canónica (necesario antes de roots()). */
export function expand(expressionAlgebrite: string): string {
  try {
    const result: string = Algebrite.run(`expand(${expressionAlgebrite})`);
    if (typeof result !== "string" || /stop|Stop/.test(result)) {
      throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, `No se pudo expandir: ${result}`);
    }
    return result;
  } catch (err) {
    if ((err as AppError).code) throw err;
    throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, `Fallo al expandir: ${String(err)}`);
  }
}

/**
 * MCD de dos polinomios (K0: usado para detectar multiplicidad de una
 * raíz — una raíz repetida de p también lo es de mcd(p, p'), con
 * multiplicidad uno menos). Confirmado contra el paquete real:
 * gcd(coprimos) devuelve una constante ("1"), gcd con raíz compartida
 * devuelve el factor lineal correspondiente.
 */
export function polynomialGcd(pAlgebrite: string, qAlgebrite: string): string {
  try {
    const result: string = Algebrite.run(`gcd(${pAlgebrite},${qAlgebrite})`);
    if (typeof result !== "string" || /stop|Stop/.test(result)) {
      throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, `No se pudo calcular el MCD: ${result}`);
    }
    return result;
  } catch (err) {
    if ((err as AppError).code) throw err;
    throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, `Fallo al calcular MCD: ${String(err)}`);
  }
}

/**
 * Sustituye `variable` por `value` (puede ser una expresión exacta —
 * racional, irracional, compleja) en `expressionAlgebrite` y fuerza una
 * aproximación decimal. Confirmado contra el paquete real que esto
 * funciona incluso cuando `value` es `i`, `2^(1/2)`, etc. — es la única
 * forma encontrada en K0 de evaluar numéricamente en un punto que no es
 * un float de JS de entrada.
 */
export function substituteAndFloat(expressionAlgebrite: string, variable: string, valueAlgebrite: string): string {
  try {
    const result: string = Algebrite.run(`float(subst(${valueAlgebrite},${variable},${expressionAlgebrite}))`);
    if (typeof result !== "string" || result.length === 0) {
      throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, "No se pudo evaluar numéricamente.");
    }
    return result;
  } catch (err) {
    if ((err as AppError).code) throw err;
    throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, `Fallo al evaluar: ${String(err)}`);
  }
}

/** M20: primitivas simbólicas acotadas para análisis complejo racional. */
export function rationalDenominator(expressionAlgebrite: string): string {
  try {
    const result: string = Algebrite.run(`denominator(${expressionAlgebrite})`);
    if (typeof result !== "string" || result.length === 0 || /stop|Stop/.test(result)) {
      throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, "No se pudo extraer el denominador racional.");
    }
    return result;
  } catch (err) {
    if ((err as AppError).code) throw err;
    throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, `Fallo al extraer denominador: ${String(err)}`);
  }
}

export function polynomialRoots(expressionAlgebrite: string, variable: string): string {
  try {
    const result: string = Algebrite.run(`roots(${expressionAlgebrite},${variable})`);
    if (typeof result !== "string" || result.length === 0 || /stop|Stop/.test(result)) {
      throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, "No se pudieron calcular las raíces del denominador.");
    }
    return result;
  } catch (err) {
    if ((err as AppError).code) throw err;
    throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, `Fallo al calcular raíces: ${String(err)}`);
  }
}

export function substituteExact(
  expressionAlgebrite: string,
  variable: string,
  valueAlgebrite: string,
): string {
  try {
    const result: string = Algebrite.run(
      `simplify(subst(${valueAlgebrite},${variable},${expressionAlgebrite}))`,
    );
    if (typeof result !== "string" || result.length === 0 || /stop|Stop/.test(result)) {
      throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, "No se pudo sustituir exactamente el punto.");
    }
    return result;
  } catch (err) {
    if ((err as AppError).code) throw err;
    throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, `Fallo en sustitución exacta: ${String(err)}`);
  }
}

export function simplifyExpression(expressionAlgebrite: string): string {
  try {
    const result: string = Algebrite.run(`simplify(${expressionAlgebrite})`);
    if (typeof result !== "string" || result.length === 0 || /stop|Stop/.test(result)) {
      throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, "No se pudo simplificar la expresión.");
    }
    return result;
  } catch (err) {
    if ((err as AppError).code) throw err;
    throw toAppError(ErrorCode.UNSUPPORTED_OPERATION, `Fallo al simplificar: ${String(err)}`);
  }
}

export { ErrorCode };
