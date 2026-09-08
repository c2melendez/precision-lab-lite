// Etapa 9 + orquestador (spec v9 §3, spec v10 Módulo 2). Único punto de
// entrada del parser completo — reemplaza al placeholder
// `modes/BasicScientific/latexToAlgebrite.ts` del Módulo 1.
//
// Pipeline: preprocesar LaTeX -> normalizar Unicode -> validar decimales ->
// tokenizar -> multiplicación implícita -> validar aridad de funciones ->
// ensamblar string Algebrite -> (si es ecuación) aplicar igualdad -> aplicar
// conversión de ángulo RAD/GRAD.

import { preprocessLatex, normalizeUnicode, validateDecimalPoints } from "./normalize";
import { tokenize, type Token } from "./tokenize";
import { insertImplicitMultiplication } from "./implicitMultiplication";
import { validateFunctionArity } from "./functionArity";
import { splitEquation } from "./equationSplit";
import { splitInequality, type InequalityOperator } from "./inequalitySplit";
import { expandPostfixOperators } from "./postfixOperators";
import { KNOWN_FUNCTION_NAMES, CONSTANT_SUBSTITUTIONS } from "./constants";

export interface ParsedExpression {
  /** Cadena lista para pasar a Algebrite. Para ecuaciones, es "(left)-(right)". */
  algebrite: string;
  /** true si la expresión original contenía "=" (es una ecuación). */
  isEquation: boolean;
  /** Variables libres detectadas (para modos que necesitan saber cuál despejar). */
  freeVariables: string[];
  /** Lado izquierdo en sintaxis Algebrite (solo con sentido si isEquation). */
  leftAlgebrite: string;
  /** Lado derecho en sintaxis Algebrite ("0" si no es ecuación). */
  rightAlgebrite: string;
  /** Fix (decisión de Carlos, cierre de la suite de paridad de teclado):
   * true si la expresión original contenía <, >, <= o >= (es una
   * desigualdad) — mutuamente excluyente con isEquation. */
  isInequality: boolean;
  /** Operador detectado, solo con sentido si isInequality. */
  inequalityOperator?: InequalityOperator;
}

// Fix (suite de regresión, casos E019-E021: "asin"/"acos"/"atan" no se
// reconocían como funciones — el parser solo tenía registrado el nombre
// largo "arcsin"/"arccos"/"arctan", así que "asin(1)" se leía como
// multiplicación implícita ("asin" * "(1)") en vez de una llamada a
// función, y quedaba sin evaluar. Se registran como alias reconocidos por
// el parser (evita el falso positivo de multiplicación implícita) y se
// traducen al nombre que Algebrite sí conoce nativamente.
const FUNCTION_NAME_ALIASES: Record<string, string> = {
  asin: "arcsin",
  acos: "arccos",
  atan: "arctan",
};

function tokensToAlgebrite(tokens: Token[]): string {
  return tokens
    .map((t) => {
      if (t.type === "function") return FUNCTION_NAME_ALIASES[t.value] ?? t.value; // el "(" siguiente ya viene en el token de lparen
      // Fase 3: τ/φ no son nativas de Algebrite — se sustituyen por su
      // valor exacto (2π / razón áurea) antes de ensamblar el string.
      if (t.type === "identifier" && t.value in CONSTANT_SUBSTITUTIONS) {
        return CONSTANT_SUBSTITUTIONS[t.value];
      }
      return t.value;
    })
    .join("");
}

/**
 * nPr/nCr no son funciones nativas de Algebrite (confirmado probando
 * contra el paquete real) — se reescriben en términos de factorial, que
 * sí es nativo, antes de enviar la expresión. Mismo patrón de escaneo
 * balanceado que wrapFunctionArgsWithDegToRad, para dos argumentos.
 */
function rewriteBinaryFunction(expr: string, fnName: string, build: (a: string, b: string) => string): string {
  let result = "";
  let i = 0;
  while (i < expr.length) {
    if (expr.startsWith(`${fnName}(`, i)) {
      const start = i + fnName.length;
      let depth = 1;
      let j = start + 1;
      let commaIndex = -1;
      while (j < expr.length && depth > 0) {
        if (expr[j] === "(") depth++;
        else if (expr[j] === ")") depth--;
        else if (expr[j] === "," && depth === 1 && commaIndex === -1) commaIndex = j;
        j++;
      }
      if (commaIndex === -1) {
        // Forma malformada (sin coma en el nivel esperado) — se deja tal
        // cual para que Algebrite reporte el error, en vez de asumir algo.
        result += expr.slice(i, j);
        i = j;
        continue;
      }
      const a = expr.slice(start + 1, commaIndex);
      const b = expr.slice(commaIndex + 1, j - 1);
      result += build(a, b);
      i = j;
    } else {
      result += expr[i];
      i++;
    }
  }
  return result;
}

function rewriteCombinatorics(algebrite: string): string {
  let result = algebrite;
  result = rewriteBinaryFunction(result, "nPr", (n, r) => `(factorial(${n})/factorial((${n})-(${r})))`);
  result = rewriteBinaryFunction(result, "nCr", (n, r) => `(factorial(${n})/(factorial(${r})*factorial((${n})-(${r}))))`);
  return result;
}

/**
 * Fix (suite de regresión, caso E014: "log(8,2)" daba ln(8) en vez de
 * log base 2 de 8). `log` con 2 argumentos ya se parseaba bien (arity
 * [1,2] en constants.ts), pero el `log()` nativo de Algebrite solo conoce
 * la forma de 1 argumento (natural) — el segundo argumento se descartaba
 * en silencio. Mismo patrón que nPr/nCr: se reescribe a la identidad de
 * cambio de base (log(a)/log(b)) antes de mandarlo a Algebrite. `log(x)`
 * de 1 argumento no tiene coma, así que `rewriteBinaryFunction` lo deja
 * intacto (ver su rama de "forma malformada" arriba).
 */
function rewriteLogBase(algebrite: string): string {
  return rewriteBinaryFunction(algebrite, "log", (a, b) => `(log(${a})/log(${b}))`);
}

// Fix (cierre de la suite de paridad de teclado v1.0): ni sec/csc/cot,
// ni sus hiperbólicas recíprocas (csch/sech/coth), ni sus inversas
// (arcsec/arccsc/arccot) tienen cómputo nativo en Algebrite — cualquier
// evaluate/derivada/integral/límite sobre ellas quedaba sin resolver.
// Se reescriben a la identidad equivalente en sin/cos/tan/sinh/cosh/tanh
// ANTES de tocar Algebrite, con el mismo criterio que log-con-base y
// nPr/nCr (parser SÍ las reconoce como funciones — ver FUNCTION_ARITY —
// pero el cómputo real ocurre en la forma reescrita).
//
// Límite conocido y documentado de la identidad arccot(x)=arctan(1/x):
// en x=0 matemáticamente arccot(0)=π/2, pero arctan(1/0) es indefinido —
// mismo comportamiento que usan la mayoría de calculadoras con esta
// convención; no se resuelve el caso especial x=0 para no introducir
// lógica condicional en tiempo de reescritura simbólica (antes de
// conocer el valor numérico).
export function rewriteReciprocalFunctions(expr: string): string {
  let result = expr;
  // Orden importante: "arcsec"/"arccsc"/"arccot" contienen "sec"/"csc"/
  // "cot" como substring (arcSEC, arcCSC, arcCOT) — si se reescribieran
  // primero las cortas, el escaneo caracter-por-caracter de
  // rewriteUnaryFunction encontraría "sec(" a mitad de "arcsec(" antes de
  // completar el nombre largo. Reescribiendo las inversas PRIMERO, el
  // texto reemplazado ya no contiene "sec(" suelto y no hay colisión.
  result = rewriteUnaryFunction(result, "arcsec", (a) => `(arccos(1/(${a})))`);
  result = rewriteUnaryFunction(result, "arccsc", (a) => `(arcsin(1/(${a})))`);
  result = rewriteUnaryFunction(result, "arccot", (a) => `(arctan(1/(${a})))`);
  result = rewriteUnaryFunction(result, "sec", (a) => `(1/cos(${a}))`);
  result = rewriteUnaryFunction(result, "csc", (a) => `(1/sin(${a}))`);
  result = rewriteUnaryFunction(result, "cot", (a) => `(1/tan(${a}))`);
  result = rewriteUnaryFunction(result, "sech", (a) => `(1/cosh(${a}))`);
  result = rewriteUnaryFunction(result, "csch", (a) => `(1/sinh(${a}))`);
  result = rewriteUnaryFunction(result, "coth", (a) => `(1/tanh(${a}))`);
  return result;
}

function rewriteUnaryFunction(expr: string, fnName: string, build: (a: string) => string): string {
  let result = "";
  let i = 0;
  while (i < expr.length) {
    if (expr.startsWith(`${fnName}(`, i)) {
      const start = i + fnName.length;
      let depth = 1;
      let j = start + 1;
      while (j < expr.length && depth > 0) {
        if (expr[j] === "(") depth++;
        else if (expr[j] === ")") depth--;
        j++;
      }
      const arg = expr.slice(start + 1, j - 1);
      result += build(rewriteUnaryFunction(arg, fnName, build));
      i = j;
    } else {
      result += expr[i];
      i++;
    }
  }
  return result;
}

function extractFreeVariables(tokens: Token[]): string[] {
  const vars = new Set<string>();
  for (const t of tokens) {
    if (t.type === "identifier") vars.add(t.value);
  }
  return [...vars];
}

/** Convierte los argumentos de trig DIRECTAS (sin/cos/tan) de grados a radianes cuando angleMode === "GRAD" (spec v10 §5: alcance exacto de angle_unit). "GRAD" es una decisión deliberada del proyecto para significar grados sexagesimales, no gradianes — ver spec_calculadora_v10_sin_backend.md. */
function applyAngleMode(algebrite: string, angleMode: "RAD" | "GRAD"): string {
  if (angleMode === "RAD") return algebrite;
  const directTrig = ["sin", "cos", "tan"];
  let result = algebrite;
  for (const fn of directTrig) {
    result = wrapFunctionArgsWithDegToRad(result, fn);
  }
  return result;
}

/** Envuelve balanceadamente el argumento de fn(...) en (arg*pi/180) — reemplaza el enfoque de regex frágil del Módulo 1. */
function wrapFunctionArgsWithDegToRad(expr: string, fnName: string): string {
  let result = "";
  let i = 0;
  while (i < expr.length) {
    if (expr.startsWith(`${fnName}(`, i)) {
      const start = i + fnName.length;
      let depth = 1;
      let j = start + 1;
      while (j < expr.length && depth > 0) {
        if (expr[j] === "(") depth++;
        else if (expr[j] === ")") depth--;
        j++;
      }
      const arg = expr.slice(start + 1, j - 1);
      result += `${fnName}((${arg})*pi/180)`;
      i = j;
    } else {
      result += expr[i];
      i++;
    }
  }
  return result;
}

/**
 * Parser completo de sintaxis de entrada (Módulo 2). Lanza AppError con
 * ErrorCode.PARSE_ERROR ante cualquier violación de las reglas de la spec.
 */
export function parseExpression(
  latex: string,
  angleMode: "RAD" | "GRAD" = "RAD",
): ParsedExpression {
  const preprocessed = preprocessLatex(latex);
  const unicodeNormalized = normalizeUnicode(preprocessed);
  validateDecimalPoints(unicodeNormalized);

  function pipelineOneSide(side: string): { algebrite: string; tokens: Token[] } {
    const tokens = expandPostfixOperators(tokenize(side));
    validateFunctionArity(tokens);
    const withImplicitMul = insertImplicitMultiplication(tokens);
    const algebrite = rewriteReciprocalFunctions(rewriteLogBase(rewriteCombinatorics(applyAngleMode(tokensToAlgebrite(withImplicitMul), angleMode))));
    return { algebrite, tokens: withImplicitMul };
  }

  // Fix (decisión de Carlos, cierre de la suite de paridad de teclado):
  // se revisa desigualdad ANTES que "=" — "<="/">=" contienen un "="
  // literal que splitEquation partiría mal si no se distingue primero.
  const inequalitySplit = splitInequality(unicodeNormalized);
  if (inequalitySplit) {
    const leftResult = pipelineOneSide(inequalitySplit.left);
    const rightResult = pipelineOneSide(inequalitySplit.right);
    const freeVariables = [
      ...new Set([...extractFreeVariables(leftResult.tokens), ...extractFreeVariables(rightResult.tokens)]),
    ];
    return {
      algebrite: `(${leftResult.algebrite})-(${rightResult.algebrite})`,
      isEquation: false,
      isInequality: true,
      inequalityOperator: inequalitySplit.operator,
      freeVariables,
      leftAlgebrite: leftResult.algebrite,
      rightAlgebrite: rightResult.algebrite,
    };
  }

  const { left, right, isEquation } = splitEquation(unicodeNormalized);

  const leftResult = pipelineOneSide(left);
  const freeVariables = extractFreeVariables(leftResult.tokens);

  if (!isEquation) {
    return {
      algebrite: leftResult.algebrite,
      isEquation: false,
      isInequality: false,
      freeVariables,
      leftAlgebrite: leftResult.algebrite,
      rightAlgebrite: "0",
    };
  }

  const rightResult = pipelineOneSide(right);
  for (const v of extractFreeVariables(rightResult.tokens)) freeVariables.push(v);

  return {
    algebrite: `(${leftResult.algebrite})-(${rightResult.algebrite})`,
    isEquation: true,
    isInequality: false,
    freeVariables: [...new Set(freeVariables)],
    leftAlgebrite: leftResult.algebrite,
    rightAlgebrite: rightResult.algebrite,
  };
}

export { KNOWN_FUNCTION_NAMES };
