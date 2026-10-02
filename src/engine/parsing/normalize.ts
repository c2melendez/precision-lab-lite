// Etapa 1 (spec v9 §3, adaptada a entrada LaTeX de MathLive): convierte los
// macros de LaTeX que produce MathLive a una notación lineal, y normaliza
// los caracteres Unicode que el usuario pudiera pegar directamente.

import { ErrorCode, type AppError } from "../../types";

function parseError(message: string): AppError {
  return { code: ErrorCode.PARSE_ERROR, message };
}

/**
 * Reemplaza \sqrt{...} y \sqrt[n]{...} de forma balanceada (no con regex
 * ingenuo, que rompe con anidamiento — ej. \sqrt{\sqrt{x}}).
 */
/**
 * BUG real (reportado por el usuario con capturas: "5/2" y "√7" escritos
 * a mano en el campo daban PARSE_ERROR "Se esperaba '{' tras \frac" /
 * "Llave de apertura faltante tras \sqrt"). El LaTeX real (y MathLive)
 * acepta que el argumento de \frac/\sqrt sea un grupo {...} O un único
 * token suelto (un dígito, una letra, o un \comando) — es sintaxis TeX
 * estándar, no un caso raro: MathLive serializa fracciones/raíces de un
 * solo carácter así cuando se escriben directo con el teclado físico (no
 * con los botones de plantilla, que sí siempre insertan llaves). El
 * código anterior asumía SIEMPRE llaves inmediatas, rompiendo con
 * cualquier fracción/raíz de un solo dígito escrita a mano.
 */
function readBalancedOrSingleToken(input: string, fromIndex: number, macroLabel: string): [string, number] {
  if (input[fromIndex] === "{") {
    let depth = 1;
    let j = fromIndex + 1;
    while (j < input.length && depth > 0) {
      if (input[j] === "{") depth++;
      else if (input[j] === "}") depth--;
      j++;
    }
    if (depth !== 0) throw parseError(`Llaves sin balancear en ${macroLabel}.`);
    return [input.slice(fromIndex + 1, j - 1), j];
  }
  if (input[fromIndex] === "\\") {
    const m = input.slice(fromIndex).match(/^\\[a-zA-Z]+/);
    if (!m) throw parseError(`Token inválido tras ${macroLabel}.`);
    return [m[0], fromIndex + m[0].length];
  }
  if (fromIndex < input.length && /[0-9a-zA-Z]/.test(input[fromIndex])) {
    return [input[fromIndex], fromIndex + 1];
  }
  throw parseError(`Se esperaba "{" o un token tras ${macroLabel}.`);
}

function replaceBalanced(
  input: string,
  openToken: string,
  transform: (inner: string, index: number) => string,
): string {
  let result = "";
  let i = 0;
  while (i < input.length) {
    if (input.startsWith(openToken, i)) {
      // Antes: buscaba la próxima "{" en CUALQUIER posición hacia
      // adelante (input.indexOf), lo que además de fallar sin llaves,
      // silenciosamente se comía cualquier carácter intermedio si había
      // una "{" más lejos en el string (bug latente, nunca disparado por
      // el caso reportado, pero real). Ahora exige adyacencia inmediata
      // (grupo o token único), sin buscar hacia adelante.
      const [inner, next] = readBalancedOrSingleToken(input, i + openToken.length, `"${openToken}"`);
      result += transform(inner, i);
      i = next;
    } else {
      result += input[i];
      i++;
    }
  }
  return result;
}
function readFunctionArgument(input: string, fromIndex: number, macroLabel: string): [string, number] {
  let cursor = fromIndex;
  while (cursor < input.length && /\s/.test(input[cursor])) cursor++;

  if (input.startsWith("\\left(", cursor)) {
    const start = cursor + "\\left(".length;
    let depth = 1;
    let j = start;
    while (j < input.length) {
      if (input.startsWith("\\left(", j)) { depth++; j += "\\left(".length; continue; }
      if (input.startsWith("\\right)", j)) {
        depth--;
        if (depth === 0) return [input.slice(start, j), j + "\\right)".length];
        j += "\\right)".length;
        continue;
      }
      j++;
    }
    throw parseError("Paréntesis sin cerrar tras " + macroLabel + ".");
  }

  if (input[cursor] === "(") {
    const start = cursor + 1;
    let depth = 1;
    let j = start;
    while (j < input.length && depth > 0) {
      if (input[j] === "(") depth++;
      else if (input[j] === ")") depth--;
      j++;
    }
    if (depth !== 0) throw parseError("Paréntesis sin cerrar tras " + macroLabel + ".");
    return [input.slice(start, j - 1), j];
  }

  return readBalancedOrSingleToken(input, cursor, macroLabel);
}

function rewriteLogBases(input: string): string {
  let out = "";
  let i = 0;
  while (i < input.length) {
    if (!input.startsWith("\\log", i)) { out += input[i++]; continue; }
    let cursor = i + "\\log".length;
    while (cursor < input.length && /\s/.test(input[cursor])) cursor++;
    if (input[cursor] !== "_") { out += "\\log"; i = cursor; continue; }
    cursor++;
    while (cursor < input.length && /\s/.test(input[cursor])) cursor++;

    let base: string;
    try { [base, cursor] = readBalancedOrSingleToken(input, cursor, "base de \\log"); }
    catch { out += "\\log"; i += "\\log".length; continue; }

    let argument: string;
    try { [argument, cursor] = readFunctionArgument(input, cursor, "argumento de \\log"); }
    catch { out += "\\log"; i += "\\log".length; continue; }

    out += "log(" + argument + "," + base + ")";
    i = cursor;
  }
  return out;
}

function rewriteNthRoots(input: string): string {
  let out = "";
  let i = 0;
  while (i < input.length) {
    if (!input.startsWith("\\sqrt[", i)) { out += input[i++]; continue; }
    const indexStart = i + "\\sqrt[".length;
    const close = input.indexOf("]", indexStart);
    if (close === -1) { out += input[i++]; continue; }
    const index = input.slice(indexStart, close).trim();
    let cursor = close + 1;
    while (cursor < input.length && /\s/.test(input[cursor])) cursor++;

    let radicand: string;
    try { [radicand, cursor] = readBalancedOrSingleToken(input, cursor, "radicando de \\sqrt[n]"); }
    catch { out += input[i++]; continue; }

    out += "((" + radicand + ")^(1/(" + index + ")))";
    i = cursor;
  }
  return out;
}
function rewriteGroupedExponents(input: string): string {
  let out = "";
  let i = 0;
  while (i < input.length) {
    if (!input.startsWith("^{", i)) { out += input[i++]; continue; }
    let inner: string;
    let next: number;
    try { [inner, next] = readBalancedOrSingleToken(input, i + 1, "exponente"); }
    catch { out += input[i++]; continue; }
    out += "^(" + rewriteGroupedExponents(inner) + ")";
    i = next;
  }
  return out;
}

function rewriteTrigFunctionPowers(input: string): string {
  const pattern = /(?:\\)?(sin|cos|tan|sec|csc|cot|sinh|cosh|tanh|sech|csch|coth)\s*\^\s*(?:\{(\d+)\}|(\d+))\s*(\\left\(|\()/g;
  let result = "";
  let offset = 0;
  for (const match of input.matchAll(pattern)) {
    const start = match.index;
    if (start < offset) continue;
    const open = start + match[0].length;
    let depth = 1;
    let end = open;
    while (end < input.length && depth > 0) {
      if (input.startsWith("\\left(", end)) { depth++; end += 6; }
      else if (input.startsWith("\\right)", end)) { depth--; end += 7; }
      else if (input[end] === "(") { depth++; end++; }
      else if (input[end] === ")") { depth--; end++; }
      else end++;
    }
    if (depth !== 0) continue;
    const closeLength = input.slice(end - 7, end) === "\\right)" ? 7 : 1;
    const argument = input.slice(open, end - closeLength);
    result += input.slice(offset, start) + `${match[1]}(${argument})^(${match[2] ?? match[3]})`;
    offset = end;
  }
  return result + input.slice(offset);
}

const OPERATOR_NAME_ALIASES: Record<string, string> = {
  arccot: "arccot", arcsec: "arcsec", arccsc: "arccsc",
  arsinh: "asinh", arcosh: "acosh", artanh: "atanh",
  arcsch: "acsch", arsech: "asech", arcoth: "acoth",
};

const BARE_FUNCTION_NAMES = [
  "arccos", "arcsin", "arctan", "arccot", "arcsec", "arccsc",
  "asin", "acos", "atan",
  "asinh", "acosh", "atanh", "acsch", "asech", "acoth",
  "sinh", "cosh", "tanh", "csch", "sech", "coth",
  "sin", "cos", "tan", "csc", "sec", "cot", "sqrt", "abs", "subst", "ln",
].sort((a, b) => b.length - a.length);

function unwrapOperatorNames(input: string): string {
  return input.replace(
    /\\operatorname\{([^{}]+)\}/g,
    // Preserve a lexical boundary on both sides. Without the leading
    // separator, x\\operatorname{arsinh} x collapsed to "xasinh x"
    // before the bare-function pass could recognize arsinh as a function.
    (_match, name: string) => ` ${OPERATOR_NAME_ALIASES[name] ?? name} `,
  );
}

function rewriteDifferentialNumeratorIntegral(input: string): string | null {
  const integralPrefix = input.match(/^\\int\s*/);
  if (!integralPrefix) return null;

  let cursor = integralPrefix[0].length;
  let lower: string | null = null;
  let upper: string | null = null;

  // Definite form: \\int_{a}^{b}\\frac{dx}{f(x)}. Parse bounds before
  // the generic \\frac lowering pass so nested fractions/roots in the
  // denominator remain intact. readBalancedOrSingleToken also accepts
  // MathLive's single-token serialization for 0, 1, \\pi, \\infty, etc.
  if (input[cursor] === "_") {
    cursor += 1;
    while (/\\s/.test(input[cursor] ?? "")) cursor++;
    try {
      [lower, cursor] = readBalancedOrSingleToken(input, cursor, "límite inferior de \\int");
    } catch {
      return null;
    }
    while (/\\s/.test(input[cursor] ?? "")) cursor++;
    if (input[cursor] !== "^") return null;
    cursor += 1;
    while (/\\s/.test(input[cursor] ?? "")) cursor++;
    try {
      [upper, cursor] = readBalancedOrSingleToken(input, cursor, "límite superior de \\int");
    } catch {
      return null;
    }
  }

  while (/\\s/.test(input[cursor] ?? "")) cursor++;
  const differential = input.slice(cursor).match(/^\\frac\{d([a-zA-Z])\}/);
  if (!differential) return null;
  const variable = differential[1];
  cursor += differential[0].length;

  let denominator: string;
  try {
    [denominator, cursor] = readBalancedOrSingleToken(input, cursor, "denominador de \\frac");
  } catch {
    return null;
  }
  denominator = denominator.trim();
  if (!denominator) return null;

  const suffix = input.slice(cursor).trim();
  if (suffix && !/^,\s*(?:\\quad\s*)?(?:\\\s*)?(?:\\lvert\s*[A-Za-z]\s*\\rvert|[A-Za-z])\s*[<>]=?.*$/s.test(suffix)) {
    return null;
  }

  if (lower !== null && upper !== null) {
    return "defintegral(((1)/(" + denominator + "))," + lower + "," + upper + ")";
  }
  return "integral(((1)/(" + denominator + "))," + variable + ")";
}

function insertImplicitMultiplicationBeforeFunctions(input: string): string {
  const names = [...BARE_FUNCTION_NAMES].sort((a, b) => b.length - a.length);
  let out = "";
  let i = 0;
  while (i < input.length) {
    const fn = names.find((name) => input.startsWith(name + "(", i));
    if (!fn) { out += input[i++]; continue; }
    // Function macros may retain harmless whitespace until the end of
    // preprocessing. Look through that whitespace when deciding whether
    // the function follows an operand, otherwise "x asinh(x)" loses the
    // multiplication when spaces are stripped and becomes "xasinh(x)".
    const prev = out.match(/\S(?=\s*$)/)?.[0] ?? "";
    if (/[A-Za-z0-9)]/.test(prev)) out += "*";
    out += fn;
    i += fn.length;
  }
  return out;
}

function rewriteBareFunctionApplications(input: string): string {
  let out = "";
  let i = 0;
  while (i < input.length) {
    const fn = BARE_FUNCTION_NAMES.find((name) => {
      if (!input.startsWith(name, i)) return false;
      const prev = i > 0 ? input[i - 1] : "";
      return !/[A-Za-z]/.test(prev);
    });
    if (!fn) { out += input[i++]; continue; }

    const afterName = i + fn.length;
    let cursor = afterName;
    while (cursor < input.length && /\s/.test(input[cursor])) cursor++;
    const hadWhitespaceAfterName = cursor > afterName;

    let power = "";
    if (input.startsWith("^(", cursor)) {
      let depth = 1;
      let j = cursor + 2;
      while (j < input.length && depth > 0) {
        if (input[j] === "(") depth++;
        else if (input[j] === ")") depth--;
        j++;
      }
      if (depth === 0) {
        power = input.slice(cursor + 2, j - 1);
        cursor = j;
        while (cursor < input.length && /\s/.test(input[cursor])) cursor++;
      }
    }

    // Already a normal function call such as sin(x) or acosh (x).
    if (input[cursor] === "(" && !power) {
      out += fn;
      i = cursor;
      continue;
    }

    // No whitespace is normally a signal that this is not a bare
    // application. Exception: a recognized function may immediately
    // follow another one after LaTeX macro lowering, e.g. \\cos\\sqrt{x}
    // -> cossqrt(x) or \\ln\\lvert x\\rvert -> lnabs(x).
    const startsNestedFunction = BARE_FUNCTION_NAMES.some(
      (name) => input.startsWith(name + "(", cursor),
    );
    if (!hadWhitespaceAfterName && !power && !startsNestedFunction) {
      out += input.slice(i, afterName);
      i = afterName;
      continue;
    }

    const argStart = cursor;
    let depth = 0;
    let seen = false;
    while (cursor < input.length) {
      const ch = input[cursor];
      if (
        depth === 0 &&
        seen &&
        BARE_FUNCTION_NAMES.some((name) => input.startsWith(name, cursor))
      ) break;
      if (ch === "(") { depth++; seen = true; cursor++; continue; }
      if (ch === ")") { if (depth === 0) break; depth--; seen = true; cursor++; continue; }
      if (depth === 0 && seen && /[+,=*\/<>]/.test(ch)) break;
      if (depth === 0 && seen && ch === "-" && cursor > argStart) break;
      if (!/\s/.test(ch)) seen = true;
      cursor++;
    }

    const arg = input.slice(argStart, cursor).trim();
    if (!arg) {
      out += input.slice(i, afterName);
      i = afterName;
      continue;
    }
    const call = fn + "(" + arg + ")";
    out += power ? "(" + call + ")^(" + power + ")" : call;
    i = cursor;
  }
  return out;
}
/** Etapa 1: macros LaTeX -> notación lineal compatible con Algebrite. */
export function preprocessLatex(latex: string): string {
  let expr = latex;

  // B7 stress matrix: natural function definition + evaluation.
  // Example: f(x)=ln(x)/x; f(e) -> subst((e),x,(ln(x)/x)).
  // This is input routing only; both the function body and point go
  // through the same preprocessing pipeline as ordinary expressions.
  {
    const naturalEvaluation = expr.trim().match(
      /^([A-Za-z])\(([A-Za-z])\)\s*=\s*([\s\S]+?)\s*;\s*(?:\\\s*)?\1\(([\s\S]+)\)$/,
    );
    if (naturalEvaluation) {
      const variable = naturalEvaluation[2];
      const body = preprocessLatex(naturalEvaluation[3].trim());
      const point = preprocessLatex(naturalEvaluation[4].trim());
      return `subst((${point}),${variable},(${body}))`;
    }
  }

  // Matrix B7: derivative evaluated at a point,
  // \\left.\\frac{d}{dx}f(x)\\right\\rvert_{x=a}.
  // Normalize the derivative itself through this same pipeline, then
  // substitute the requested point in the resulting derivative.
  const evaluatedDerivative = expr.trim().match(
    /^\\left\.\s*(\\frac\{d(?:\^\{?\d+\}?)?\}\{d([a-zA-Z])(?:\^\{?\d+\}?)?\}\s*.+?)\s*\\right\\rvert_\{\s*\2\s*=\s*(.+)\}$/,
  );
  if (evaluatedDerivative) {
    const derivativeSource = preprocessLatex(evaluatedDerivative[1]);
    const variable = evaluatedDerivative[2];
    const point = preprocessLatex(evaluatedDerivative[3]);
    return `subst((${point}),${variable},(${derivativeSource}))`;
  }

  // Both sin^3(x) and sin(x)^3 denote a power of the function. Rewrite
  // the former before the generic exponent and macro passes; keep -1 as
  // inverse trigonometric notation handled by the existing rules below.
  expr = rewriteTrigFunctionPowers(expr);
  expr = unwrapOperatorNames(expr);

  // S16 REG-008: MathLive serializa la tecla visual ° como ^{\\circ}
  // (y puede usar ^\\circ). Unificarlo con el marcador ° que ya procesa
  // el pipeline de grados/DMS.
  expr = expr
    .replace(/\^\{\\circ\}/g, "°")
    .replace(/\^\\circ/g, "°")
    .replace(/\\degree/g, "°");

  // Módulo D (spec_motor_matematico_pendiente.md §5) — notación de
  // grados. AMBIGUO de la spec ya delegado a mí ("decide tú dónde vive
  // esta lógica"): va acá, mismo lugar que la conversión ya existente de
  // \sqrt[n]{x} con índice variable — es el mismo tipo de paso (regex de
  // preprocesado de texto, antes de tokenizar).
  //
  // Nivel 2 primero (D°M′S″ y D°M′ compuestos) — convierte a un valor
  // decimal de grados TODAVÍA marcado con ° al final (D+M/60+S/3600)°,
  // para que el paso de Nivel 1 (abajo) lo termine de convertir a
  // radianes. Debe ir ANTES que Nivel 1, si no éste consumiría el "D°"
  // suelto antes de que el Nivel 2 pueda ver el M′/S″ que le sigue.
  expr = expr.replace(
    /(-?\d+(?:\.\d+)?)°(\d+(?:\.\d+)?)′(\d+(?:\.\d+)?)″/g,
    "($1+$2/60+$3/3600)°",
  );
  expr = expr.replace(/(-?\d+(?:\.\d+)?)°(\d+(?:\.\d+)?)′/g, "($1+$2/60)°");

  // Nivel 1 — ° solo: ×(π/180), SIEMPRE (independiente de angleMode
  // RAD/GRAD). DECISIÓN DEDUCIBLE, riesgo documentado en el cierre del
  // módulo: "°" es el símbolo universal de grados sexagesimales —
  // "45°" significa 45 grados sin importar en qué modo esté la
  // calculadora, así que esta conversión NO consulta angleMode. Esto es
  // distinto de cómo GRAD ya funciona hoy (envuelve TODO el argumento de
  // una función trig directa en *pi/180 cuando no hay ° explícito) — si
  // "°" apareciera DENTRO del argumento de sin/cos/tan Y angleMode
  // fuera "GRAD" a la vez, el argumento completo se envolvería una
  // SEGUNDA vez en *pi/180 más abajo (applyAngleMode), dando una
  // conversión doble. Caso de uso normal (angleMode RAD, que es el
  // default) no tiene este problema — se documenta como riesgo conocido,
  // no se resuelve en este módulo (requeriría detectar si un literal °
  // vive dentro de un argumento de trig directa, cambio más grande que
  // "primera versión").
  // Primero la forma parentizada (la que deja el Nivel 2 arriba):
  expr = expr.replace(/\(([^()]*)\)°/g, "(($1)*pi/180)");
  // Luego un número suelto seguido de °, uso directo sin DMS:
  expr = expr.replace(/(-?\d+(?:\.\d+)?)°/g, "(($1)*pi/180)");

  // Fase E (spec_edo_complejos_tooltips.md §2.3): "dy/dx" (tecla nueva,
  // notación alternativa de EDO) -> "y'" (prima), ANTES del \frac{d}{dx}
  // de arriba y del bucle \frac genérico de abajo. Debe ir antes de
  // ambos: no matchea el patrón d/dx de arriba (numerador es "dy", no
  // "d" exacto) así que sin este bloque caería al bucle \frac genérico y
  // se convertiría en "(dy)/(dx)" (dos variables sueltas divididas, no
  // lo que se quiere). No hace falta razonar sobre balanceo de
  // paréntesis aquí -- a diferencia de d/dx, "dy/dx" nunca lleva un
  // cuerpo \left(...\right) pegado (es notación suelta, no un operador
  // que envuelve algo), así que un reemplazo simple basta.
  expr = expr.replace(/\\frac\{dy\}\{dx\}/g, "y'");

  // M17 — paridad Plus/Lite: derivada parcial. Lite ya dispone del motor
  // simbólico d(expr,var); faltaba enrutar la notación de teclado ∂/∂x.
  // Se transforma al mismo marcador interno que la derivada ordinaria,
  // manteniendo las demás variables como constantes.
  {
    const partialMatch = expr.match(/\\frac\{\\partial\}\{\\partial\s*([a-zA-Z])\}\\left\(/);
    if (partialMatch) {
      const start = partialMatch.index!;
      const variable = partialMatch[1];
      let depth = 1;
      let j = start + partialMatch[0].length;
      while (j < expr.length && depth > 0) {
        if (expr.startsWith("\\left(", j)) {
          depth++;
          j += 6;
        } else if (expr.startsWith("\\right)", j)) {
          depth--;
          j += 7;
        } else {
          j++;
        }
      }
      if (depth !== 0) {
        throw parseError('Paréntesis sin balancear tras "∂/∂x".');
      }
      const body = expr.slice(start + partialMatch[0].length, j - 7);
      expr = `${expr.slice(0, start)}d((${body}),${variable})${expr.slice(j)}`;
    }
  }
  // d/dx: plantilla "\frac{d}{dx}\left(#0\right)" -> d((cuerpo),x), nativo
  // en Algebrite. Debe ir ANTES que el bucle \frac de abajo — si no, ese
  // bucle ya convirtió "\frac{d}{dx}" a "(d)/(dx)" antes de llegar aquí,
  // y el patrón deja de ser reconocible. A diferencia de ∫/Σ/Lim, esta
  // SÍ puede aparecer en medio de una expresión más grande (ej.
  // "\frac{d}{dx}\left(x^2\right)+1"), así que no se ancla al final del
  // string — se busca el paréntesis \left(...\right) que le corresponde
  // contando anidamiento, igual que replaceBalanced pero para \left(/
  // \right) en vez de llaves.
  //
  // Hallazgo (auditoría Fase 0 v2, decisión de Carlos: resolver inline):
  // antes de este fix, esta tecla no truena como ∫/Σ/Lim — es peor: dado
  // que "d" y "dx" quedaban como símbolos sueltos, el motor SÍ devolvía
  // un resultado, pero matemáticamente incorrecto y sin ningún error que
  // lo señalara (ej. d/dx(x^2) daba "d*x^2/dx" en vez de "2x").
  //
  // Fase 2 externa: también se soporta orden N — \frac{d^2}{dx^2}(...)
  // (sin llaves si N es un solo dígito) o \frac{d^{10}}{dx^{10}}(...)
  // (con llaves si N tiene más de un dígito), no vienen de una tecla del
  // teclado (solo hay una de 1er orden) pero MathLive las acepta si se
  // escriben a mano. d(cuerpo,x,N) es nativo en Algebrite (confirmado
  // probando el paquete real que SÍ soporta un 3er argumento de orden,
  // no solo dos llamadas anidadas).
  {
    const dMatch = expr.match(/\\frac\{d(?:\^\{?(\d+)\}?)?\}\{dx(?:\^\{?\d+\}?)?\}\\left\(/);
    if (dMatch) {
      const idx = dMatch.index!;
      const order = dMatch[1] ? Number(dMatch[1]) : 1;
      let depth = 1;
      let j = idx + dMatch[0].length;
      while (j < expr.length && depth > 0) {
        if (expr.startsWith("\\left(", j)) {
          depth++;
          j += 6;
        } else if (expr.startsWith("\\right)", j)) {
          depth--;
          j += 7;
        } else {
          j++;
        }
      }
      if (depth !== 0) {
        throw parseError('Paréntesis sin balancear tras "d/dx".');
      }
      const body = expr.slice(idx + dMatch[0].length, j - 7);
      const orderArg = order === 1 ? "" : `,${order}`;
      expr = `${expr.slice(0, idx)}d((${body}),x${orderArg})${expr.slice(j)}`;
    }
  }

  // \frac{a}{b} -> ((a)/(b)) — debe ir antes que otros reemplazos porque
  // "a" y "b" pueden contener a su vez otros macros ya procesados de forma
  // recursiva al reprocesar el string completo tras cada pasada balanceada.
  // Matriz trigonométrica: differential numerator before generic frac
  // lowering. Example: \\int\\frac{dx}{1+x^2} -> integral(1/(1+x^2),x).
  {
    const differentialNumerator = rewriteDifferentialNumeratorIntegral(expr);
    if (differentialNumerator !== null) expr = differentialNumerator;
  }

  // Matriz trigonométrica: forma habitual d/dx seguida directamente por
  // una expresión, además del template con \\left(...\\right).
  {
    const dBareMatch = expr.match(/^\\frac\{d(?:\^\{?(\d+)\}?)?\}\{d([a-zA-Z])(?:\^\{?\d+\}?)?\}\s*(.+)$/s);
    if (dBareMatch) {
      const order = dBareMatch[1] ? Number(dBareMatch[1]) : 1;
      const variable = dBareMatch[2];
      const body = dBareMatch[3].trim();
      const orderArg = order === 1 ? "" : `,${order}`;
      expr = `d((${body}),${variable}${orderArg})`;
    }
  }
  let prevLength = -1;
  while (expr.includes("\\frac") && expr.length !== prevLength) {
    prevLength = expr.length;
    expr = replaceFracOnce(expr);
  }

  // \sqrt[n]{x} (raíz enésima, botón ⁿ√) debe procesarse ANTES que el
  // \sqrt{x} genérico de abajo. BUG detectado en revisión: si el orden es
  // al revés, `replaceBalanced` para "\sqrt" encuentra la primera "{" de
  // \sqrt[3]{x} — que es la del radicando, no hay ninguna antes del "[3]" —
  // y consume solo esa parte, descartando el índice "[3]" en silencio y
  // convirtiendo la raíz cúbica en una raíz cuadrada sin ningún error.
  // Fix (suite de paridad de teclado v1.0, hallazgo dinámico nuevo — más
  // serio que un simple error de parseo: da un NÚMERO PLAUSIBLE pero
  // matemáticamente incorrecto, sin avisar). "\sqrt[3]{27}^{2}" (raíz
  // cúbica seguida de la tecla de potencia general) daba 3^(1/3)≈1.44 en
  // vez de 9. Causa: esta conversión producía "(27)^(1/(3))" SIN un
  // paréntesis que envuelva la potencia completa, así que un "^" pegado
  // después ("...^(2)") se combina por asociatividad-derecha de Algebrite
  // como 27^((1/3)^2) en vez de (27^(1/3))^2 — el exponente exterior se
  // "cuela" dentro del exponente de la raíz en vez de aplicarse al
  // resultado. Se envuelve toda la expresión en un paréntesis extra para
  // que cualquier "^" posterior solo pueda aplicarse por fuera.
  expr = rewriteNthRoots(expr);
  // BUG real (preexistente, encontrado al verificar el fix de arriba):
  // una sola pasada de replaceBalanced NO es recursiva — \sqrt{\sqrt{x}}
  // procesaba solo el \sqrt externo, dejando un "\sqrt{x}" literal sin
  // convertir pegado dentro de "sqrt(...)", pese a que el comentario de
  // esta función decía explícitamente que el anidamiento funcionaba.
  // Mismo patrón de loop "hasta estabilizar" que ya usa \frac arriba.
  let prevSqrtLength = -1;
  while (expr.includes("\\sqrt") && expr.length !== prevSqrtLength) {
    prevSqrtLength = expr.length;
    expr = replaceBalanced(expr, "\\sqrt", (inner) => `sqrt(${inner})`);
  }

  // FIX (auditoría Fase 0 v2, Fase 10): \mathrm{nombre} es el macro que
  // MathLive usa para "texto no cursivo" — el teclado Fase A lo usa para
  // TODOS los nombres de función multi-letra del menú Alg/Stat (mod, GCD,
  // LCM, nCr, nPr, mean, median, mode, min, max, range, stdev, var, sort,
  // mad). Nunca se manejó aquí: antes de este fix, cualquiera de esas
  // teclas producía "Carácter no reconocido" en cuanto el usuario
  // presionaba "=" — un error de PARSEO, no solo "sin evaluar" (Algebrite
  // nunca llegaba a verlas). Se desenvuelve de forma balanceada, igual que
  // \sqrt, porque el nombre podría en teoría contener otros macros.
  expr = replaceBalanced(expr, "\\mathrm", (inner) => inner);

  // FIX (auditoría Fase 0 v2 → decisión de Carlos: resolver ∫/Lim/Σ
  // inline en vez de navegar a Cálculo): \int/\lim/\sum tampoco los
  // manejaba preprocessLatex — mismo efecto que \mathrm arriba, error de
  // parseo apenas se presiona "=". Estas 3 teclas están pensadas para ser
  // la expresión COMPLETA (mismo alcance que las funciones de
  // estadística), así que el cuerpo se toma como "el resto del string" —
  // no se soporta anidarlas dentro de algo más grande.
  //
  // ∫: plantilla fija "\int #0\,dx" (siempre respecto a x, sin variable
  // configurable) -> integral((cuerpo),x), nativo en Algebrite.
  //
  // Fase 2 externa: también se soporta la forma con límites,
  // \int_{a}^{b}...\,dx (no viene de una tecla del teclado — el teclado
  // solo tiene la indefinida — pero MathLive la acepta si se escribe a
  // mano con _/^). Se reescribe a un marcador "defintegral(cuerpo,a,b)"
  // que compute.worker.ts resuelve en DOS llamadas separadas a Algebrite
  // (antiderivada primero, después sustituir en el resultado ya
  // evaluado) — hallazgo real: Algebrite sustituye ANTES de resolver la
  // integral si subst() envuelve integral() sin evaluar todavía en la
  // misma llamada ("Stop: integral: sorry, could not find a solution"
  // con límites simbólicos como pi), el mismo motivo por el que
  // calcDefiniteIntegral (stepEngine/calculus.ts) siempre lo hizo en dos
  // pasos — no es solo estilo, es necesario.
  {
    // Las condiciones de dominio escritas después de una coma pertenecen
    // al contexto matemático, no al integrando (ej. ", x>1" o
    // ", |x|<1"). Para el cálculo se separan antes de reconocer la integral.
    const integralSource = expr.startsWith("\\int")
      ? expr.replace(/(?<!\\),\s*(?:\\quad\s*)?(?:\\\s*)?(?:(?:\\lvert)|[0-9A-Za-z]).*$/s, "")
      : expr;

    // También aceptar la forma estándar ∫ dx/f(x), usada repetidamente en
    // la matriz. Se convierte a ∫ 1/f(x) dx sin cambiar la semántica.
    const definiteDifferentialNumerator = integralSource.match(
      /\\int\s*_\s*(?:\{([^{}]+)\}|([a-zA-Z0-9]))\s*\^\s*(?:\{([^{}]+)\}|([a-zA-Z0-9]))\s*\\frac\{d([a-zA-Z])\}\{(.+)\}\s*$/s,
    );
    const indefiniteDifferentialNumerator = integralSource.match(
      /^\\int\s*\\frac\{d([a-zA-Z])\}\{(.+)\}\s*$/s,
    );

    if (definiteDifferentialNumerator) {
      const [, groupedLower, bareLower, groupedUpper, bareUpper, variable, denominator] =
        definiteDifferentialNumerator;
      const lower = groupedLower ?? bareLower;
      const upper = groupedUpper ?? bareUpper;
      expr = `defintegral(((1)/(${denominator})),${lower},${upper})`;
      if (variable !== "x") {
        expr = `defintegral(((1)/(${denominator})),${lower},${upper})`;
      }
    } else if (indefiniteDifferentialNumerator) {
      const [, variable, denominator] = indefiniteDifferentialNumerator;
      expr = `integral(((1)/(${denominator})),${variable})`;
    } else {
      // MathLive may serialize a single-token bound without braces
      // (\int_0^{10}), and pasted LaTeX may use a normal space before dx.
      const definiteMatch = integralSource.match(/\\int\s*_\s*(?:\{([^{}]+)\}|([a-zA-Z0-9]))\s*\^\s*(?:\{([^{}]+)\}|([a-zA-Z0-9]))(.*?)(?:\\,|\s)*d([a-zA-Z])\s*$/s);
      if (definiteMatch) {
        const [, groupedLower, bareLower, groupedUpper, bareUpper, body] = definiteMatch;
        const lower = groupedLower ?? bareLower;
        const upper = groupedUpper ?? bareUpper;
        expr = `defintegral((${body}),${lower},${upper})`;
      } else {
        const intMatch = integralSource.match(/\\int(.*?)(?:\\,|\s)*d([a-zA-Z])\s*$/s);
        if (intMatch) {
          expr = `integral((${intMatch[1]}),${intMatch[2]})`;
        }
      }
    }
  }

  // Σ: plantilla "\sum_{#0}^{#1}#2", #0 tipo "i=1" -> sum((cuerpo),i,1,#1),
  // nativo en Algebrite.
  {
    const sumMatch = expr.match(/\\sum_\{([^{}]*)\}\^\{([^{}]*)\}(.*)$/s);
    if (sumMatch) {
      const [, varStart, end, body] = sumMatch;
      const eqIndex = varStart.indexOf("=");
      if (eqIndex === -1) {
        throw parseError('Σ espera la forma "variable=inicio" (ej. i=1) en el límite inferior.');
      }
      const sumVar = varStart.slice(0, eqIndex);
      const start = varStart.slice(eqIndex + 1);
      expr = `sum((${body}),${sumVar},${start},${end})`;
    }
  }

  // Π: misma sintaxis estructurada que Σ, evaluada por el helper de
  // productoria del worker para conservar forma exacta y límites enteros.
  {
    const productMatch = expr.match(/\\prod_\{([^{}]*)\}\^\{([^{}]*)\}(.*)$/s);
    if (productMatch) {
      const [, varStart, end, body] = productMatch;
      const eqIndex = varStart.indexOf("=");
      if (eqIndex === -1) {
        throw parseError('Π espera la forma "variable=inicio" (ej. i=1) en el límite inferior.');
      }
      const productVar = varStart.slice(0, eqIndex);
      const start = varStart.slice(eqIndex + 1);
      expr = `product((${body}),${productVar},${start},${end})`;
    }
  }

  // S16 REG-004 + B7 stress matrix: normalize base-log notation
  // anywhere in a larger expression, including products/equations.
  {
    let previousLogSource = "";
    while (expr.includes("\\log_") && expr !== previousLogSource) {
      previousLogSource = expr;
      expr = rewriteLogBases(expr);
    }
  }

  // Lim: plantilla "\lim_{#0}#1", #0 tipo "x\to0" -> limit((cuerpo),x,0).
  // A diferencia de integral/sum, limit() de Algebrite frecuentemente NO
  // evalúa (confirmado probando el paquete real) — el fallback numérico
  // para ese caso vive en compute.worker.ts (tryLimitFallback), reusando
  // el mismo evaluador numérico propio de Fase 3/Módulo de límites.
  //
  // Fase 2 externa (huecos #3 y #4): también se soporta el punto al
  // infinito (x\to\infty / x\to-\infty — \infty se traduce a "oo" más
  // abajo en la misma pasada, ya que el reemplazo corre sobre el string
  // completo) y el límite lateral (x\to0^+ / x\to0^-, sufijo ^+/^-
  // pegado al punto). La dirección se codifica como un 4to argumento
  // (1=derecha, -1=izquierda) — Algebrite tolera argumentos de más en
  // limit() sin tronar (los ignora, los devuelve tal cual sin evaluar,
  // que es justo la señal que ya usa tryLimitFallback para intervenir).
  {
    // Fix (suite de paridad de teclado v1.0, hallazgo dinámico nuevo): el
    // límite lateral con signo entre llaves (\lim_{x\to0^{+}}..., que es
    // justo lo que produce la tecla real al completar el placeholder
    // editable — ver comentario de "dirMatch" más abajo) nunca llegaba a
    // esta rama: [^{}]* excluye CUALQUIER llave, así que en cuanto el
    // subíndice contiene el "^{+}" anidado, el match completo falla (no
    // hay error visible acá, simplemente `limMatch` da null) y el \lim
    // queda sin normalizar, tronando más abajo en el tokenizador con
    // "Carácter no reconocido: \\". El manejo de "^{+}" con llaves que ya
    // existía en `dirMatch` (líneas de abajo) nunca se alcanzaba por
    // esto — se ensancha el patrón para tolerar UN nivel de llaves
    // anidadas (el único caso real: el signo del límite lateral).
    const limMatch = expr.match(/\\lim_\{((?:[^{}]|\{[^{}]*\})*)\}(.*)$/s);
    if (limMatch) {
      const [, varTo, body] = limMatch;
      const toIndex = varTo.indexOf("\\to");
      if (toIndex === -1) {
        throw parseError('Lim espera la forma "variable\\to punto" (ej. x\\to0) en el subíndice.');
      }
      const limVar = varTo.slice(0, toIndex);
      let point = varTo.slice(toIndex + "\\to".length);
      let direction = "";
      // P3 (spec v2 §4.3): la tecla combinada lim_{x→a±} inserta el signo
      // como placeholder editable dentro de llaves (^{#2}) para que
      // MathLive lo trate como un átomo editable — al completarlo, el
      // LaTeX resultante es "^{+}"/"^{-}" (con llaves), no "^+"/"^-" como
      // antes. Se acepta ambas formas para no romper el caso viejo.
      const dirMatch = point.match(/\^\{?([+-])\}?$/);
      if (dirMatch) {
        point = point.slice(0, dirMatch.index);
        direction = dirMatch[1] === "+" ? ",1" : ",-1";
      }
      expr = `limit((${body}),${limVar},${point}${direction})`;
    }
  }

  // MathLive serializa el símbolo de porcentaje como \\% en LaTeX.
  // El tokenizador científico espera el operador postfix literal "%".
  expr = expr;

  // Según la posición del placeholder, MathLive puede simplificar
  // \\pm\\left(5\\right) a \\pm 5. Normalizamos también esa forma
  // a la función unaria interna pm(5), preservando las dos ramas.
  expr = expr.replace(/\\pm\s+([A-Za-z0-9.]+)/g, "pm($1)");

  // Normalize absolute-value delimiters BEFORE late adjacency. Otherwise
  // "\\lvert\\sin x\\rvert" exposes the trailing "t" of "\\lvert"
  // to the adjacency regex and becomes "abs(*sin(x))".
  expr = rewriteGroupedExponents(expr);
\n  expr = expr
    .replace(/\\left\|/g, "abs(")
    .replace(/\\right\|/g, ")")
    .replace(/\\lvert/g, "abs(")
    .replace(/\\rvert/g, ")");

  // Matriz trigonométrica: late adjacency normalization.
  // At this point \\int has already been rewritten, so x\\cosh x may
  // safely become x*\\cosh x without corrupting the command \\int.
  expr = expr.replace(
    /([A-Za-z0-9)])\\(sin|cos|tan|csc|sec|cot|sinh|cosh|tanh|csch|sech|coth|arcsin|arccos|arctan)\b/g,
    "$1*\\$2",
  );

  expr = expr
    .replace(/\\left\|/g, "abs(")
    .replace(/\\right\|/g, ")")
    .replace(/\\lvert/g, "abs(")
    .replace(/\\rvert/g, ")")
    .replace(/\\cdot/g, "*")
    .replace(/\\times/g, "*")
    .replace(/\\div/g, "/")
    .replace(/\\%/g, "%")
    .replace(/\\pi/g, "pi")
    .replace(/\\infty/g, "oo")
    .replace(/\\theta/g, "theta")
    .replace(/\\Phi/g, "Phi")
    // FIX (auditoría Fase 0 v2, Fase 10): mismo bug que \mathrm arriba —
    // \gcd/\min/\max son macros LaTeX nativos (no \mathrm{...}) que
    // tampoco se manejaban, con el mismo efecto (error de parseo).
    .replace(/\\gcd/g, "gcd")
    .replace(/\\min/g, "min")
    .replace(/\\max/g, "max")
    // Fix (decisión de Carlos, cierre de la suite de paridad de teclado):
    // ±() no tenía ninguna semántica — \pm ni se despojaba del backslash,
    // así que tronaba igual que csc/sec/cot antes del fix de arriba.
    .replace(/\\pm/g, "pm")
    // Fix (decisión de Carlos, cierre de la suite de paridad de teclado):
    // ≤/≥ insertan los macros LaTeX \le/\ge (ver teclas "≤"/"≥" en
    // MathKeyboard.tsx) — se convierten a <=/>= en ASCII plano, mismo
    // símbolo que < y > (que las teclas insertan ya en texto plano, sin
    // macro). Tiene que pasar ANTES que cualquier otra cosa toque el "="
    // (splitEquation en index.ts), porque "<=" contiene un "=" literal
    // que si no se distingue a tiempo, se partiría como si fuera una
    // ecuación con "<" colgando de un lado.
    .replace(/\\le(?![a-zA-Z])/g, "<=")
    .replace(/\\ge(?![a-zA-Z])/g, ">=")
    .replace(/\\arcsin/g, "arcsin")
    .replace(/\\arccos/g, "arccos")
    .replace(/\\arctan/g, "arctan")
    .replace(/\\sin\^\{-1\}/g, "arcsin")
    .replace(/\\cos\^\{-1\}/g, "arccos")
    .replace(/\\tan\^\{-1\}/g, "arctan")
    // Fix (cierre de la suite de paridad de teclado): \csc^{-1}/\sec^{-1}/
    // \cot^{-1} (inversas de las recíprocas) tampoco tenían regla — se
    // agregan con el mismo criterio que sin/cos/tan. Van ANTES que la
    // regla de \csc/\sec/\cot a secas (más abajo), para no dejar un "^{-1}"
    // colgando sobre "csc" ya convertido.
    .replace(/\\csc\^\{-1\}/g, "arccsc")
    .replace(/\\sec\^\{-1\}/g, "arcsec")
    .replace(/\\cot\^\{-1\}/g, "arccot")
    // Módulo 2 (spec §5.1 — Hiperbólicas inversas): sinh⁻¹/cosh⁻¹/tanh⁻¹
    // se insertan SIN backslash (mismo criterio que sinh/cosh/tanh en
    // "Hiperbólicas", que ya insertan "sinh(#0)" plano, sin "\" — a
    // diferencia de sin/cos/tan que sí usan el macro LaTeX). No existía
    // ninguna regla para el patrón "sinh^{-1}"; sin ella el ^{-1} caería
    // en la conversión genérica de más abajo y produciría "sinh^(-1)(...)",
    // que el motor no reconoce como función. asinh/acosh/atanh YA son
    // computables (numericFallback.ts) — esto es routing puro, ningún
    // cambio de motor. csch⁻¹/sech⁻¹/coth⁻¹ no tienen regla — la tecla se
    // monta `unavailable` (insertLatex vacío), nunca llegan aquí.
    .replace(/sinh\^\{-1\}/g, "asinh")
    .replace(/cosh\^\{-1\}/g, "acosh")
    .replace(/tanh\^\{-1\}/g, "atanh")
    // Módulo A (spec_motor_matematico_pendiente.md §2), activación de
    // tecla pedida por el usuario tras cerrar el módulo de motor: mismo
    // patrón que sinh/cosh/tanh de arriba, ahora para las 3 recíprocas.
    // Destino "acsch/asech/acoth" (Algebrite no los reconoce en sí
    // mismos, pero rewriteReciprocalFunctions en index.ts los reescribe a
    // asinh(1/x)/acosh(1/x)/atanh(1/x) — Módulo A, ya verificado con
    // ejecución real). Orden sin colisión: "csch"/"sech"/"coth" sueltos
    // (Hiperbólicas directas) no llevan "^{-1}" pegado, así que no hay
    // riesgo de que esta regla los capture por error.
    .replace(/csch\^\{-1\}/g, "acsch")
    .replace(/sech\^\{-1\}/g, "asech")
    .replace(/coth\^\{-1\}/g, "acoth")
    .replace(/\\arcsin/g, "arcsin")
    .replace(/\\arccos/g, "arccos")
    .replace(/\\arctan/g, "arctan")
    .replace(/\\sinh/g, "sinh")
    .replace(/\\cosh/g, "cosh")
    .replace(/\\tanh/g, "tanh")
    .replace(/\\csch/g, "csch")
    .replace(/\\sech/g, "sech")
    .replace(/\\coth/g, "coth")
    .replace(/\\sinh/g, "sinh")
    .replace(/\\cosh/g, "cosh")
    .replace(/\\tanh/g, "tanh")
    .replace(/\\csch/g, "csch")
    .replace(/\\sech/g, "sech")
    .replace(/\\coth/g, "coth")
    .replace(/\\sin/g, "sin")
    .replace(/\\cos/g, "cos")
    .replace(/\\tan/g, "tan")
    // Fix (cierre de la suite de paridad de teclado, hallazgo nuevo: ni
    // siquiera \csc(x)/\sec(x)/\cot(x) BÁSICOS —sin inversa— parseaban).
    // La tecla real de "Directas" inserta \csc\left(#0\right) con
    // backslash, pero antes solo sin/cos/tan tenían regla de despojo —
    // csc/sec/cot se quedaban con el "\" crudo y tronaban en el
    // tokenizador. Van DESPUÉS de las reglas de ^{-1} de arriba.
    .replace(/\\csc/g, "csc")
    .replace(/\\sec/g, "sec")
    .replace(/\\cot/g, "cot")
    .replace(/\\ln/g, "ln")
    // S16 REG-002: el macro visual \\log del teclado significa base 10.
    // Se conserva separado de log(...) plano y de ln(...).
    .replace(/\\log/g, "log10")

    .replace(/\\left\(/g, "(")
    .replace(/\\right\)/g, ")")
    .replace(/\\,/g, "")
    .replace(/\\ /g, "")
    ;

  expr = rewriteBareFunctionApplications(expr);
  expr = insertImplicitMultiplicationBeforeFunctions(expr);
  expr = expr.replace(/\s+/g, "");

  return expr;
}

function replaceFracOnce(expr: string): string {
  const start = expr.indexOf("\\frac");
  if (start === -1) return expr;
  const i = start + "\\frac".length;

  const [numerator, afterNum] = readBalancedOrSingleToken(expr, i, "\\frac");
  const [denominator, afterDen] = readBalancedOrSingleToken(expr, afterNum, "\\frac");
  return expr.slice(0, start) + `((${numerator})/(${denominator}))` + expr.slice(afterDen);
}

/**
 * Etapa 2: normalización de caracteres Unicode que el usuario podría pegar
 * directamente (spec v9 §3). `√` envuelve únicamente el siguiente token
 * atómico: número, identificador simple, o paréntesis balanceado.
 */
export function normalizeUnicode(expr: string): string {
  let out = expr.replace(/π/g, "pi").replace(/∞/g, "oo");

  out = out.replace(/√/g, "\u0000SQRT\u0000");
  let result = "";
  let i = 0;
  while (i < out.length) {
    if (out.startsWith("\u0000SQRT\u0000", i)) {
      i += "\u0000SQRT\u0000".length;
      if (out[i] === "(") {
        let depth = 1;
        let j = i + 1;
        while (j < out.length && depth > 0) {
          if (out[j] === "(") depth++;
          else if (out[j] === ")") depth--;
          j++;
        }
        if (depth !== 0) throw parseError("Paréntesis sin balancear tras √.");
        result += `sqrt(${out.slice(i + 1, j - 1)})`;
        i = j;
      } else {
        const match = out.slice(i).match(/^[0-9]+(\.[0-9]+)?|^[a-zA-Z]/);
        if (!match) throw parseError("√ debe preceder a un número, variable o paréntesis.");
        result += `sqrt(${match[0]})`;
        i += match[0].length;
      }
    } else {
      result += out[i];
      i++;
    }
  }
  return result;
}

/**
 * Etapa 3: validación estricta de punto decimal (spec v9 §3). Solo se
 * acepta "dígito.dígito"; se rechazan ".5", "5.", notación científica.
 */
export function validateDecimalPoints(expr: string): void {
  const badLeading = /(?<![0-9])\.[0-9]/;
  const badTrailing = /[0-9]\.(?![0-9])/;
  const scientific = /[0-9]e[+-]?[0-9]/i;
  if (badLeading.test(expr) || badTrailing.test(expr)) {
    throw parseError('Formato decimal inválido: usa "dígito.dígito" (ej. 3.14), no ".5" ni "5.".');
  }
  if (scientific.test(expr)) {
    throw parseError("Notación científica no soportada (ej. 1e5).");
  }
}
