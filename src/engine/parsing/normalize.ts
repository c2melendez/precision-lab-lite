// Etapa 1 (spec v9 §3, adaptada a entrada LaTeX de MathLive): convierte los
// macros de LaTeX que produce MathLive a una notación lineal, y normaliza
// los caracteres Unicode que el usuario pudiera pegar directamente.

import { ErrorCode, type AppError } from "../../types";

function parseError(message: string): AppError {
  return { code: ErrorCode.PARSE_ERROR, message };
}

function normalizeExternalSyntaxF3c(input: string): string {
  let out = input.trim();

  // SymPy latex aliases. Normalizar nombre + argumento para evitar
  // dejar formas como \\arcsin{...}, que no son aceptadas por todos los
  // parsers/canales de entrada.
  out = out
    .replace(
      /\\operatorname\{(asin|acos|atan)\}\s*\{\\left\(([\s\S]*?)\\right\)\}/g,
      (_m, fn, arg) => {
        const mapped = fn === "asin" ? "arcsin" : fn === "acos" ? "arccos" : "arctan";
        return "\\" + mapped + "\\left(" + arg + "\\right)";
      },
    )
    .replace(
      /\\operatorname\{(asin|acos|atan)\}\s*\{([^{}]+)\}/g,
      (_m, fn, arg) => {
        const mapped = fn === "asin" ? "arcsin" : fn === "acos" ? "arccos" : "arctan";
        return "\\" + mapped + "\\left(" + arg + "\\right)";
      },
    )
    .replace(/\\operatorname\{asin\}/g, "\\arcsin")
    .replace(/\\operatorname\{acos\}/g, "\\arccos")
    .replace(/\\operatorname\{atan\}/g, "\\arctan");

  // Operadores de comparación externos.
  out = out
    .replace(/<>/g, "!=")
    .replace(/==/g, "=");

  // lim(x->a, expr) -> \lim_{x\to a} expr
  const lim = out.match(/^lim\(\s*([A-Za-z])\s*->\s*([^,]+),\s*(.+)\)$/s);
  if (lim) out = `\\lim_{${lim[1]}\\to${lim[2].trim()}}${lim[3].trim()}`;

  return out;
}

function normalizeExternalSyntax(input: string): string {
  let out = input.trim();

  // Excel: un "=" inicial indica fórmula, no ecuación.
  if (/^=[^=]/.test(out)) out = out.slice(1);

  // Python/NumPy conocidos; solo nombres explícitos, nunca eval().
  out = out
    .replace(/\bmath\.sqrt\s*\(/g, "sqrt(")
    .replace(/\bmath\.pi\b/g, "pi")
    .replace(/\bnp\.sin\s*\(/g, "sin(");

  // Wolfram básico permitido por el contrato o error claro.
  out = out
    .replace(/\bSin\[([^\[\]]+)\]/g, "sin($1)")
    .replace(/\bSqrt\[([^\[\]]+)\]/g, "sqrt($1)")
    .replace(/\bLog\[E\]/g, "ln(e)");

  // Excel en español, conjunto mínimo y explícito.
  out = out
    .replace(/\bRAIZ\s*\(/gi, "sqrt(")
    .replace(/\bSENO\s*\(/gi, "sin(")
    .replace(/\bPI\s*\(\s*\)/gi, "pi")
    .replace(/\bPOTENCIA\s*\(([^,()]+),([^()]+)\)/gi, "($1)^($2)")
    .replace(/\bLN\s*\(/g, "ln(")
    .replace(/\bEXP\s*\(/g, "exp(");

  return out;
}

function normalizeUnicodePaste(input: string): string {
  const supers: Record<string, string> = {
    "⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9",
    "⁻":"-",
  };
  const subs: Record<string, string> = {
    "₀":"0","₁":"1","₂":"2","₃":"3","₄":"4","₅":"5","₆":"6","₇":"7","₈":"8","₉":"9",
  };

  let out = input
    // EN-UC-20: invisibles frecuentes en PDF/Word.
    .replace(/[\u200B\uFEFF\u00AD]/g, "")
    // EN-UC-21: homógrafo cirílico x; normalización explícita y segura.
    .replace(/х/g, "x")
    // EN-UC-22/23/24: letras matemáticas y ancho completo frecuentes.
    .replace(/𝑓/g, "f")
    .replace(/𝑥/g, "x")
    .replace(/[！-～]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    .replace(/　/g, " ")
    .replace(/ⅇ/g, "e")
    .replace(/ⅈ/g, "i");

  // EN-UC-25: integral compacta Unicode con límites/sub/superscript.
  out = out.replace(/^∫([₀₁₂₃₄₅₆₇₈₉]+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)(.+)d([A-Za-z])$/, (_m, lowerRun, upperRun, body, variable) => {
    const lower = [...lowerRun].map((ch) => subs[ch] ?? "").join("");
    const upper = [...upperRun].map((ch) => supers[ch] ?? "").join("");
    let normalizedBody = body.replace(/([A-Za-z0-9)]+)([⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)/g, (_m2: string, base: string, run: string) => {
      const decoded = [...run].map((ch) => supers[ch] ?? "").join("");
      return decoded ? `${base}^{${decoded}}` : _m2;
    });
    return `\\int_{${lower}}^{${upper}}${normalizedBody}d${variable}`;
  });

  out = out
    .replace(/[−–—‐‑]/g, "-")
    .replace(/[×·⋅∙∗]/g, "*")
    .replace(/÷/g, "/")
    .replace(/½/g, "(1/2)")
    .replace(/¼/g, "(1/4)")
    .replace(/¾/g, "(3/4)")
    .replace(/π/g, "\\pi")
    .replace(/θ/g, "\\theta")
    .replace(/∞/g, "\\infty")
    .replace(/≤/g, "\\le")
    .replace(/≥/g, "\\ge")
    .replace(/≠/g, "\\ne")
    .replace(/±/g, "\\pm")
    .replace(/[’′]/g, "'")
    .replace(/[\u00A0\u2009\u202F]/g, " ");

  out = out.replace(/([A-Za-z0-9)]+)([⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)/g, (_m, base, run) => {
    const decoded = [...run].map((ch) => supers[ch] ?? "").join("");
    return decoded ? `${base}^{${decoded}}` : _m;
  });

  out = out.replace(/([A-Za-z])([₀₁₂₃₄₅₆₇₈₉]+)/g, (_m, base, run) => {
    const decoded = [...run].map((ch) => subs[ch] ?? "").join("");
    return decoded ? `${base}_{${decoded}}` : _m;
  });

  out = out
    .replace(/∛\s*(\([^)]*\)|[A-Za-z0-9.]+)/g, "\\sqrt[3]{$1}")
    .replace(/∜\s*(\([^)]*\)|[A-Za-z0-9.]+)/g, "\\sqrt[4]{$1}")
    .replace(/√\s*(\([^)]*\)|[A-Za-z0-9.]+)/g, (_m, atom) =>
      atom.startsWith("(") ? `\\sqrt{${atom.slice(1, -1)}}` : `\\sqrt{${atom}}`
    );

  // EN-UC-26: no permitir que texto pictográfico o CJK se degrade a variables.
  const bad = out.match(/[\p{Extended_Pictographic}\p{Script=Han}]/u);
  if (bad) {
    const cp = bad[0].codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0");
    throw new Error(`Carácter inesperado "${bad[0]}" (U+${cp}).`);
  }

  return out;
}

function normalizePastedLatex(input: string): string {
  let out = input.trim();

  // Delimitadores de modo matemático pegados desde Markdown/TeX.
  if (
    out.length >= 4 &&
    out[0] === "$" &&
    out[1] === "$" &&
    out[out.length - 2] === "$" &&
    out[out.length - 1] === "$"
  ) {
    out = out.slice(2, -2).trim();
  } else if (out.startsWith("$") && out.endsWith("$") && out.length >= 2) {
    out = out.slice(1, -1).trim();
  }
  if (out.startsWith("\\(") && out.endsWith("\\)")) out = out.slice(2, -2).trim();
  if (out.startsWith("\\[") && out.endsWith("\\]")) out = out.slice(2, -2).trim();

  // Entornos de ecuación/alineación copiados completos.
  out = out.replace(/^\\begin\{(?:equation\*?|align\*?)\}/, "");
  out = out.replace(/\\end\{(?:equation\*?|align\*?)\}$/, "");

  // Wrapper típico de Wikipedia: {\displaystyle ...}. Debe retirarse
  // antes de borrar el macro de estilo para no dejar llaves externas.
  const displayGroup = out.match(/^\{\s*\\displaystyle\s+([\s\S]*)\}$/);
  if (displayGroup) out = displayGroup[1];

  // Estilos visuales no semánticos.
  out = out
    .replace(/\\(?:displaystyle|textstyle|scriptstyle)\b/g, "")
    .replace(/\\(?:,|;|:|!)(?=\s|$|[^A-Za-z])/g, "")
    .replace(/\\(?:quad|qquad)\b/g, "")
    .replace(/~/g, " ");

  // Numeración/labels editoriales no cambian la expresión.
  out = out
    .replace(/\\tag\{[^{}]*\}/g, "")
    .replace(/\\label\{[^{}]*\}/g, "");

  // Separador de línea sobrante al final.
  out = out.replace(/\\\\\s*$/, "");

  return out.trim();
}


const LOCALIZED_ALIAS_MAP: Record<string, string> = {
  sin: "\\sin", cos: "\\cos", tan: "\\tan", csc: "\\csc", sec: "\\sec", cot: "\\cot",
  ln: "\\ln", log: "\\log", exp: "\\exp", sinh: "\\sinh", cosh: "\\cosh", tanh: "\\tanh",
  sen: "\\sin",
  tg: "\\tan",
  ctg: "\\cot",
  cotg: "\\cot",
  cosec: "\\csc",
  arcsen: "\\arcsin",
  arctg: "\\arctan",
  arcctg: "\\arccot",
  arccotg: "\\arccot",
  arccosec: "\\arccsc",
  senh: "\\sinh",
  tgh: "\\tanh",
  ctgh: "\\coth",
  cotgh: "\\coth",
  cosech: "\\csch",
  argsenh: "\\asinh",
  arcsenh: "\\asinh",
  argcosh: "\\acosh",
  argtgh: "\\atanh",
  arctgh: "\\atanh",
  lg: "\\log",
  raiz: "sqrt",
  "raíz": "sqrt",
  mcd: "gcd",
  mcm: "lcm",
  "máx": "max",
  "mín": "min",
};

function normalizeLocalizedAliases(input: string): string {
  let out = input;
  out = out.replace(/\\,/g, " ");

  out = out.replace(
    /\\(?:operatorname|mathrm|text)\{([^{}]+)\}/g,
    (_m, rawName) => {
      const mapped = LOCALIZED_ALIAS_MAP[String(rawName).toLowerCase()] ?? String(rawName);
      return mapped.startsWith("\\") ? mapped + " " : mapped;
    },
  );

  out = out.replace(
    /\\(sen|tg|ctg|cotg|cosec|arcsen|arctg|arcctg|arccotg|arccosec|senh|tgh|ctgh|cotgh|cosech|argsenh|arcsenh|argcosh|argtgh|arctgh|raiz)(?![A-Za-z])/gi,
    (_m, rawName) => LOCALIZED_ALIAS_MAP[String(rawName).toLowerCase()] ?? String(rawName),
  );

  out = out.replace(
    /(?<![A-Za-zÁÉÍÓÚáéíóúÑñ])(arccosec|arccotg|arcctg|arcsenh|argsenh|argcosh|argtgh|arctgh|arcsen|arctg|cosech|cotgh|ctgh|senh|tgh|cotg|cosec|ctg|sen|tg|lg|raíz|raiz|mcd|mcm|máx|mín)(?![A-Za-zÁÉÍÓÚáéíóúÑñ])/gi,
    (rawName) => LOCALIZED_ALIAS_MAP[String(rawName).toLowerCase()] ?? String(rawName),
  );

  return out;
}

function encodeSubscriptPayload(raw: string): string {
  const digitWords: Record<string, string> = {
    "0": "ZERO", "1": "ONE", "2": "TWO", "3": "THREE", "4": "FOUR",
    "5": "FIVE", "6": "SIX", "7": "SEVEN", "8": "EIGHT", "9": "NINE",
  };
  let out = "";
  for (const ch of raw) {
    if (digitWords[ch]) out += digitWords[ch];
    else if (/[A-Za-z]/.test(ch)) out += ch;
    else if (ch === ",") out += "COMMA";
  }
  return out || "EMPTY";
}

function encodeSubscriptIdentifier(base: string, payload: string): string {
  return base + "SUB" + encodeSubscriptPayload(payload);
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
  while (fromIndex < input.length && /\s/.test(input[fromIndex])) fromIndex++;
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

function readFunctionArgument(input: string, fromIndex: number): [string, number] {
  let i = fromIndex;
  while (i < input.length && /\s/.test(input[i])) i++;
  if (i >= input.length) throw parseError("Falta argumento de función.");

  if (input.startsWith("\\left(", i)) {
    const start = i + "\\left(".length;
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
    throw parseError("Paréntesis sin balancear en argumento de función.");
  }

  if (input[i] === "(") {
    let depth = 1;
    let j = i + 1;
    while (j < input.length && depth > 0) {
      if (input[j] === "(") depth++;
      else if (input[j] === ")") depth--;
      j++;
    }
    if (depth !== 0) throw parseError("Paréntesis sin balancear en argumento de función.");
    return [input.slice(i + 1, j - 1), j];
  }

  // Argumento sin paréntesis: consume un producto/átomo completo (x^2, 3x,
  // pi*x), pero se detiene ante un operador aditivo/división o ante otra
  // función LaTeX al nivel superior.
  let braceDepth = 0;
  let parenDepth = 0;
  let j = i;
  while (j < input.length) {
    if (input[j] === "{") braceDepth++;
    else if (input[j] === "}") braceDepth = Math.max(0, braceDepth - 1);
    else if (input[j] === "(") parenDepth++;
    else if (input[j] === ")") {
      if (parenDepth === 0) break;
      parenDepth--;
    }
    if (braceDepth === 0 && parenDepth === 0) {
      if (/[+\-\/]/.test(input[j])) break;
      if (input[j] === "\\" && /^(?:cdot|times|div)(?![A-Za-z])/.test(input.slice(j + 1))) break;
      if (j > i && input[j] === "\\" && /^(?:sin|cos|tan|csc|sec|cot|ln|log|sinh|cosh|tanh)\b/.test(input.slice(j + 1))) break;
    }
    j++;
  }
  const arg = input.slice(i, j).trim();
  if (!arg) throw parseError("Falta argumento de función.");
  return [arg, j];
}

function normalizeUnparenthesizedFunctions(input: string): string {
  const fnPattern = /\\(arccsc|arccot|arcsec|arcsin|arccos|arctan|asinh|acosh|atanh|sinh|cosh|tanh|csch|sech|coth|sin|cos|tan|csc|sec|cot|log|ln|exp)(?![A-Za-z^])/g;
  let expr = input;
  let guard = 0;

  while (guard++ < 50) {
    fnPattern.lastIndex = 0;
    let changed = false;
    let match: RegExpExecArray | null;

    while ((match = fnPattern.exec(expr)) !== null) {
      const macroEnd = match.index + match[0].length;
      let i = macroEnd;
      while (i < expr.length && /\s/.test(expr[i])) i++;

      // Si ya hay paréntesis explícitos, basta canonizar el nombre y
      // retirar el backslash aquí. Esto también cubre hiperbólicas e
      // inversas que no tienen una regla de despojo al final del pipeline.
      if (expr[i] === "(" || expr.startsWith("\\left(", i)) {
        const canonical = match[1] === "log" ? "log10" : match[1];
        expr = expr.slice(0, match.index) + canonical + expr.slice(macroEnd);
        changed = true;
        break;
      }

      const [arg, next] = readFunctionArgument(expr, macroEnd);
      const canonical = match[1] === "log" ? "log10" : match[1];
      const replacement = `${canonical}(${arg})`;
      expr = expr.slice(0, match.index) + replacement + expr.slice(next);
      changed = true;
      break;
    }

    if (!changed) break;
  }

  return expr;
}

function normalizePoweredFunctions(input: string): string {
  const fnPattern = /\\(sin|cos|tan|csc|sec|cot|ln|log)(?:\^\{([^{}]+)\}|\^(-?\d+))/g;
  let out = "";
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = fnPattern.exec(input)) !== null) {
    out += input.slice(cursor, match.index);
    const fn = match[1];
    const exponent = (match[2] ?? match[3] ?? "").trim();
    const [arg, next] = readFunctionArgument(input, fnPattern.lastIndex);

    if (exponent === "-1" && (fn === "sin" || fn === "cos" || fn === "tan")) {
      const inverse = fn === "sin" ? "arcsin" : fn === "cos" ? "arccos" : "arctan";
      out += `${inverse}(${arg})`;
    } else {
      const mappedFn = fn === "log" ? "log10" : fn;
      out += `(${mappedFn}(${arg}))^(${exponent})`;
    }

    cursor = next;
    fnPattern.lastIndex = next;
  }

  return out + input.slice(cursor);
}

function replaceNthRootOnce(input: string): string {
  const start = input.indexOf("\\sqrt[");
  if (start === -1) return input;
  const indexStart = start + "\\sqrt[".length;
  const close = input.indexOf("]", indexStart);
  if (close === -1) throw parseError('Índice sin cerrar en "\\sqrt[n]".');
  const index = input.slice(indexStart, close).trim();
  if (!index) throw parseError('Índice vacío en "\\sqrt[n]".');

  const [radicand, next] = readBalancedOrSingleToken(input, close + 1, "\\sqrt[n]");
  const numericIndex = /^\d+$/.test(index) ? Number(index) : null;
  const numericNegative = radicand.match(/^\s*-\s*(\d+(?:\.\d+)?)\s*$/);

  let replacement: string;
  if (numericIndex !== null && numericIndex % 2 === 1 && numericNegative) {
    replacement = `-((${numericNegative[1]})^(1/(${index})))`;
  } else {
    replacement = `((${radicand})^(1/(${index})))`;
  }
  return input.slice(0, start) + replacement + input.slice(next);
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

/**
 * IN625 A2 — normalización estructural de delimitadores.
 *
 * Estos macros cambian presentación/agrupación, no la semántica. Se
 * resuelven antes del resto del preprocesado para que el tokenizador no
 * reciba barras invertidas o delimitadores que no conoce.
 */
function normalizeDelimiterSyntax(input: string): string {
  let expr = input
    // MathLive/LaTeX sizing wrappers: solo tamaño visual.
    .replace(/\\(?:bigl|bigr|Bigl|Bigr|biggl|biggr|Biggl|Biggr)/g, "")
    // mathtools puede emitir mleft/mright; semánticamente son left/right.
    .replace(/\\mleft/g, "\\left")
    .replace(/\\mright/g, "\\right")
    // Corchetes usados como agrupación dentro de left/right.
    .replace(/\\left\[/g, "(")
    .replace(/\\right\]/g, ")")
    // Piso/techo: preservar como funciones del CAS.
    .replace(/\\lfloor/g, "floor(")
    .replace(/\\rfloor/g, ")")
    .replace(/\\lceil/g, "ceiling(")
    .replace(/\\rceil/g, ")")
    // Barras LaTeX explícitas. Normalizar left/right antes del scanner.
    .replace(/\\left\|/g, "|")
    .replace(/\\right\|/g, "|")
    // El caso adyacente es producto.
    .replace(/\\rvert\s*\\lvert/g, ")*abs(")
    .replace(/\\lvert/g, "abs(")
    .replace(/\\rvert/g, ")");

  // Barra simple |...|, incluyendo anidamiento como ||x|-1|.
  // Si no hay un absoluto abierto, "|" abre. Si lo hay, abre únicamente
  // cuando aparece en posición de inicio de operando; en otro caso cierra.
  let out = "";
  let depth = 0;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch !== "|") {
      out += ch;
      continue;
    }

    let j = out.length - 1;
    while (j >= 0 && /\s/.test(out[j])) j--;
    const prev = j >= 0 ? out[j] : "";
    const beginsOperand = depth === 0 || prev === "" || "()+-*/^=<>,".includes(prev);

    if (beginsOperand) {
      out += "abs(";
      depth++;
    } else {
      out += ")";
      depth = Math.max(0, depth - 1);
    }
  }
  return out;
}


/**
 * IN625 G3 — validación estructural previa al preprocesado.
 * Evita delegar al CAS errores de edición que podemos explicar de forma
 * determinista y amigable. No evalúa matemáticas; solo valida estructura.
 */
function validateInputStructureG3(input: string): void {
  const raw = input.trim();

  if (!raw) throw parseError("Escriba una expresión antes de calcular.");

  if (/\\placeholder(?:\{\})?/i.test(raw)) {
    throw parseError("Entrada incompleta: complete el marcador pendiente.");
  }

  const unknownCommand = raw.match(/\\([A-Za-z]+)(?:\{|\()/);
  if (unknownCommand) {
    const known = new Set([
      "frac","sqrt","sin","cos","tan","csc","sec","cot","ln","log","exp",
      "left","right","pi","infty","theta","alpha","beta","gamma","lambda",
      "zeta","Delta","Lambda","Phi","gcd","min","max","pm","le","ge","leq",
      "geq","neq","ne","lt","gt","operatorname","mathrm","text","placeholder",
      "lim","int","partial","displaystyle","dfrac","tfrac","cfrac"
    ]);
    if (!known.has(unknownCommand[1])) {
      throw parseError(`Comando desconocido: \\${unknownCommand[1]}.`);
    }
  }

  if (/^\\text\{[\s\S]*\}$/.test(raw)) {
    throw parseError("Texto no matemático: escriba una expresión matemática.");
  }

  if (/^=|=$/.test(raw)) {
    throw parseError("Ecuación incompleta: debe haber una expresión a ambos lados de \"=\".");
  }

  if (/^\s*\^/.test(raw)) {
    throw parseError("Exponente sin base.");
  }
  if (/\^\s*(?:\{\s*\})?\s*$/.test(raw)) {
    throw parseError("Exponente vacío.");
  }

  if (/\\frac\s*\{\s*\}\s*\{/.test(raw)) {
    throw parseError("Fracción incompleta: el numerador está vacío.");
  }
  if (/\\frac\s*\{[^{}]*\}\s*\{\s*\}\s*$/.test(raw) || /\\frac\s*\{[^{}]*\}\s*$/.test(raw)) {
    throw parseError("Fracción incompleta: falta el denominador.");
  }
  if (/\\sqrt\s*\{\s*\}/.test(raw)) {
    throw parseError("Raíz incompleta: el radicando está vacío.");
  }

  if (/\\(?:sin|cos|tan|csc|sec|cot|ln|log|exp)\s*$/.test(raw) ||
      /\\(?:sin|cos|tan|csc|sec|cot|ln|log|exp)\s*\(\s*\)\s*$/.test(raw)) {
    throw parseError("Falta el argumento de la función.");
  }

  if (/\(\s*\)/.test(raw)) {
    throw parseError("Paréntesis vacíos: falta una expresión.");
  }

  if (/\\left\([^]*\\right\]/.test(raw)) {
    throw parseError("Delimitadores incompatibles: se abrió con paréntesis y se cerró con corchete.");
  }
  if (/\\left(?![\s\S]*\\right)/.test(raw)) {
    throw parseError("Delimitador incompleto: falta \\right.");
  }
  if (/\\right/.test(raw) && !/\\left/.test(raw)) {
    throw parseError("Delimitador inválido: aparece \\right sin \\left.");
  }

  let parenDepth = 0;
  for (const ch of raw.replace(/\\left|\\right/g, "")) {
    if (ch === "(") parenDepth++;
    if (ch === ")") {
      parenDepth--;
      if (parenDepth < 0) throw parseError("Paréntesis de cierre sobrante.");
    }
  }
  if (parenDepth > 0) throw parseError("Paréntesis sin cerrar.");

  let braceDepth = 0;
  for (const ch of raw) {
    if (ch === "{") braceDepth++;
    if (ch === "}") {
      braceDepth--;
      if (braceDepth < 0) throw parseError("Llave de cierre sobrante.");
    }
  }
  if (braceDepth > 0) throw parseError("Llave sin cerrar.");

  if (/^[*\/]/.test(raw)) {
    throw parseError("Operador sin primer operando.");
  }
  if (/[+*\/]\s*$/.test(raw)) {
    throw parseError("Operador sin segundo operando.");
  }
  if (/(?:\*\/|\/\*|\+\+|\*\*\/)/.test(raw)) {
    throw parseError("Secuencia de operadores inválida.");
  }
}

/** Etapa 1: macros LaTeX -> notación lineal compatible con Algebrite. */
export function preprocessLatex(latex: string): string {
  validateInputStructureG3(latex);
  latex = normalizeExternalSyntaxF3c(normalizeExternalSyntax(normalizeUnicodePaste(normalizePastedLatex(latex))));
  let expr = normalizeLocalizedAliases(normalizeDelimiterSyntax(latex));

  // IN625 E1b — variantes tipográficas equivalentes de límites.
  expr = expr.replace(/\\displaystyle/g, "").replace(/\\rightarrow/g, "\\to");

  // IN625 D1 — normalización numérica previa a retirar espacios.
  // MathLive representa una coma decimal explícita como {,}; esa forma
  // es inequívocamente decimal y debe funcionar independientemente del modo regional.
  expr = expr.replace(/\{,\}/g, ".");

  // Decimales abreviados aceptados por el contrato: .5, -.5 y 5.
  expr = expr
    .replace(/(^|[+\-*/=(])\.(\d)/g, "$10.$2")
    .replace(/(\d)\.(?=$|[+\-*/)=])/g, "$1");

  // Agrupación de miles por espacio fino/normal. Solo se retira cuando
  // precede exactamente a un grupo de tres dígitos; 3 4 sigue siendo error.
  let previousGrouping = "";
  while (expr !== previousGrouping) {
    previousGrouping = expr;
    expr = expr.replace(/(?<=\d)\s+(?=\d{3}(?:\D|$))/g, "");
  }
  if (/\d\s+\d/.test(expr)) {
    throw parseError("Separación numérica ambigua: parece faltar un operador.");
  }

  // IN625 D2 — notación científica ASCII. Solo se reconoce cuando
  // existe una mantisa numérica completa seguida de e/E y un exponente
  // entero opcionalmente signado. La constante de Euler aislada sigue
  // siendo "e" y no entra en esta regla.
  expr = expr.replace(
    /(^|[^A-Za-z0-9_.])(\d+(?:\.\d+)?)[eE]([+-]?\d+)(?![A-Za-z0-9_])/g,
    (_m, prefix, mantissa, exponent) => `${prefix}(${mantissa}*10^(${exponent}))`,
  );

  // IN625 A3 — operadores/combinatoria y relaciones equivalentes.
  // Normalización general de macros LaTeX al contrato lineal del motor.
  expr = expr
    .replace(/\\binom\{([^{}]+)\}\{([^{}]+)\}/g, "nCr($1,$2)")
    .replace(/\{([^{}]+)\\choose([^{}]+)\}/g, "nCr($1,$2)")
    .replace(/([A-Za-z0-9.]+)\s*\\bmod\s*([A-Za-z0-9.]+)/g, "mod($1,$2)");

  // IN625 A1 — variantes TeX equivalentes de fracción. MathLive suele
  // canonizarlas al editar, pero el parser también debe ser correcto
  // cuando recibe LaTeX pegado/escrito directamente.
  expr = expr.replace(/\\(?:dfrac|tfrac|cfrac)/g, "\\frac");

  // TeX primitivo \\over: el numerador/denominador son los contenidos a
  // izquierda/derecha dentro del grupo actual. Primero resolvemos grupos
  // simples {...\\over...}; después la forma top-level sin llaves
  // (ej. x+1\\over x-1). Esto se hace antes de procesar \\frac.
  let previousOver = "";
  while (expr.includes("\\over") && expr !== previousOver) {
    previousOver = expr;
    expr = expr.replace(/\{([^{}]*)\\over([^{}]*)\}/g, "\\frac{$1}{$2}");
    if (expr.includes("\\over")) {
      let depth = 0;
      let overIndex = -1;
      for (let i = 0; i < expr.length; i++) {
        if (expr[i] === "{") depth++;
        else if (expr[i] === "}") depth--;
        else if (depth === 0 && expr.startsWith("\\over", i)) {
          if (overIndex !== -1) {
            throw parseError('Solo se admite un "\\over" por grupo.');
          }
          overIndex = i;
        }
      }
      if (overIndex !== -1) {
        const left = expr.slice(0, overIndex);
        const right = expr.slice(overIndex + "\\over".length);
        expr = `\\frac{${left}}{${right}}`;
      }
    }
  }

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

  // IN625 E1a — forma canónica sin paréntesis explícitos:
  // \\frac{d}{dx}x^{2}, \\frac{d}{dx}\\sin x.
  // Solo se acepta cuando el operador de derivación inicia la expresión;
  // todo el resto se interpreta como su operando, evitando degradarlo a
  // una fracción algebraica d/(dx).
  {
    const bareDerivative = expr.match(/^\\frac\{d(?:\^\{?(\d+)\}?)?\}\{d([a-zA-Z])(?:\^\{?\d+\}?)?\}(.+)$/s);
    if (bareDerivative && !bareDerivative[3].startsWith("\\left(")) {
      const order = bareDerivative[1] ? Number(bareDerivative[1]) : 1;
      const variable = bareDerivative[2];
      const body = bareDerivative[3].trim();
      if (!body) throw parseError('Falta la expresión a derivar tras "d/dx".');
      const orderArg = order === 1 ? "" : `,${order}`;
      expr = `d((${body}),${variable}${orderArg})`;
    }
  }

  // \frac{a}{b} -> ((a)/(b)) — debe ir antes que otros reemplazos porque
  // "a" y "b" pueden contener a su vez otros macros ya procesados de forma
  // recursiva al reprocesar el string completo tras cada pasada balanceada.
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
  let prevNthRoot = "";
  while (expr.includes("\\sqrt[") && expr !== prevNthRoot) {
    prevNthRoot = expr;
    expr = replaceNthRootOnce(expr);
  }
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
    // IN625 E1c: normaliza el diferencial tipográfico de MathLive y acepta
    // variable de integración arbitraria, además de límites con o sin llaves.
    expr = expr.replace(/\\differentialD\s*/g, "d");
    const definiteMatch = expr.match(
      /\\int_(?:\{([^{}]*)\}|([^\\s^]+))\^(?:\{([^{}]*)\}|([^\\s]+))\s*(.*?)(?:\\,)?d([A-Za-z])$/s,
    );
    if (definiteMatch) {
      const lower = definiteMatch[1] ?? definiteMatch[2];
      const upper = definiteMatch[3] ?? definiteMatch[4];
      const body = definiteMatch[5];
      const variable = definiteMatch[6];
      expr = `defintegral((${body.trim()}),${lower},${upper},${variable})`;
    } else {
      const intMatch = expr.match(/\\int\s*(.*?)(?:\\,)?d([A-Za-z])$/s);
      if (intMatch) {
        expr = `integral((${intMatch[1].trim()}),${intMatch[2]})`;
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

  // S16 REG-004: MathLive puede serializar el subíndice de log con o sin
  // llaves y con \\left(...\\right) o paréntesis simples.
  {
    const logBasePatterns = [
      /\\log\s*_\s*\{([^{}]+)\}\s*\\left\((.*)\\right\)$/s,
      /\\log\s*_\s*\{([^{}]+)\}\s*\((.*)\)$/s,
      /\\log\s*_\s*([0-9a-zA-Z]+)\s*\\left\((.*)\\right\)$/s,
      /\\log\s*_\s*([0-9a-zA-Z]+)\s*\((.*)\)$/s,
      // IN625 B2: argumento sin paréntesis; conserva exponentes del argumento.
      /\\log\s*_\s*\{([^{}]+)\}\s*([A-Za-z0-9.]+(?:\^\{[^{}]+\}|\^[A-Za-z0-9.]+)?)$/s,
      // Sin llaves: una sola cifra/letra como base y el resto como argumento.
      /\\log\s*_\s*([0-9A-Za-z])\s*([A-Za-z0-9.]+(?:\^\{[^{}]+\}|\^[A-Za-z0-9.]+)?)$/s,
    ];
    for (const pattern of logBasePatterns) {
      const match = expr.match(pattern);
      if (match) {
        const [, base, arg] = match;
        expr = `log(${arg},${base})`;
        break;
      }
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

  // IN625 C2 — operatorname trigonométrico.
  expr = expr.replace(
    /\\operatorname\{(sin|cos|tan|csc|sec|cot|ln|exp)\}/g,
    (_m, fn) => "\\" + fn + " ",
  );

  // IN625 C1 — potencia aplicada al nombre de función.
  // Debe resolverse antes de la conversión genérica de exponentes.
  expr = normalizePoweredFunctions(expr);

  // IN625 C2 — funciones sin paréntesis, incluida composición.
  expr = normalizeUnparenthesizedFunctions(expr);

  // IN625 B4 — signos unarios tras operador.
  // Algebrite no acepta de forma consistente secuencias como 2+-3 / 2*-3.
  // Se explicita el signo unario sin alterar 2--3 ni --x.
  expr = expr
    .replace(/([+*/])-([A-Za-z0-9.]+)/g, "$1(-$2)")
    .replace(/\+\+([A-Za-z0-9.]+)/g, "+$1");

  // IN625 B1/B2 — exponentes y subíndices.
  // Los subíndices se codifican internamente con letras solamente para
  // distinguirlos de multiplicación implícita: x_{10} != x2.
  // El eco de entrada conserva el LaTeX original; esta codificación es solo
  // para el parser/motor.
  expr = expr
    // Orden TeX inverso: x^{2}_{1} -> xSUBONE^{2}
    .replace(/([A-Za-z])\^\{([^{}]+)\}_\{(\d+)\}/g,
      (_m, b, exp, sub) => encodeSubscriptIdentifier(String(b), String(sub)) + "^{" + exp + "}")
    .replace(/([A-Za-z])\^\{([^{}]+)\}_(\d+)/g,
      (_m, b, exp, sub) => encodeSubscriptIdentifier(String(b), String(sub)) + "^{" + exp + "}")
    // Texto en subíndice: x_{\text{max}}
    .replace(/([A-Za-z])_\{\\text\{([^{}]+)\}\}/g,
      (_m, b, sub) => encodeSubscriptIdentifier(String(b), String(sub)))
    // Subíndice compuesto: a_{i,j}
    .replace(/([A-Za-z])_\{([A-Za-z]+),([A-Za-z]+)\}/g,
      (_m, b, s1, s2) => encodeSubscriptIdentifier(String(b), String(s1) + "," + String(s2)))
    // Subíndice alfabético simple.
    .replace(/([A-Za-z])_\{([A-Za-z]+)\}/g,
      (_m, b, sub) => encodeSubscriptIdentifier(String(b), String(sub)))
    // Subíndice numérico con/sin llaves.
    .replace(/([A-Za-z])_\{(\d+)\}/g,
      (_m, b, sub) => encodeSubscriptIdentifier(String(b), String(sub)))
    .replace(/([A-Za-z])_(\d+)/g,
      (_m, b, sub) => encodeSubscriptIdentifier(String(b), String(sub)));

  // 2) Exponentes entre llaves, incluido anidamiento: repetir hasta estabilizar.
  let prevExponentGroups = "";
  while (expr !== prevExponentGroups && /\^\{/.test(expr)) {
    prevExponentGroups = expr;
    expr = expr.replace(/\^\{([^{}]*)\}/g, "^($1)");
  }

  // 3) Exponente negativo sin llaves: x^-1, 2^-x -> x^(-1), 2^(-x).
  expr = expr.replace(/\^-([A-Za-z0-9.]+)/g, "^(-$1)");

  // 4) Alias exponencial LaTeX. La forma sin paréntesis consume un átomo.
  expr = expr
    .replace(/\\exp\s+([A-Za-z0-9.]+)/g, "exp($1)")
    .replace(/\\exp(?=\s*\()/g, "exp");

  expr = expr
    .replace(/\\left\|/g, "abs(")
    .replace(/\\right\|/g, ")")
    .replace(/\\cdot/g, "*")
    .replace(/\\ast/g, "*")
    .replace(/\\times/g, "*")
    .replace(/\\div/g, "/")
    .replace(/\\%/g, "%")
    .replace(/\\pi/g, "pi")
    .replace(/\\infty/g, "oo")
    .replace(/\\theta/g, "theta")
    .replace(/\\alpha/g, "alpha")
    .replace(/\\beta/g, "beta")
    .replace(/\\gamma/g, "gamma")
    .replace(/\\lambda/g, "lambda")
    .replace(/\\zeta/g, "zeta")
    .replace(/\\Delta/g, "Delta")
    .replace(/\\Lambda/g, "Lambda")
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
    .replace(/\\leqslant(?![a-zA-Z])/g, "<=")
    .replace(/\\geqslant(?![a-zA-Z])/g, ">=")
    .replace(/\\leq(?![a-zA-Z])/g, "<=")
    .replace(/\\geq(?![a-zA-Z])/g, ">=")
    .replace(/\\le(?![a-zA-Z])/g, "<=")
    .replace(/\\ge(?![a-zA-Z])/g, ">=")
    .replace(/\\neq(?![a-zA-Z])/g, "!=")
    .replace(/\\ne(?![a-zA-Z])/g, "!=")
    .replace(/\\lt(?![a-zA-Z])/g, "<")
    .replace(/\\gt(?![a-zA-Z])/g, ">")
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
    .replace(/\s+/g, "");

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
