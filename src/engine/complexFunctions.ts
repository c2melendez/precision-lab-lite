// P4 (spec v2 §5.1): Re()/Im()/arg()/conj()/topolar() para números
// complejos.
//
// No pude ejecutar `Algebrite.run("(2+3*i)*(1-i)")` en este entorno (sin
// red, sin node_modules instalados) para confirmar si Algebrite resuelve
// re/im/arg/conjugate nativamente, como pide verificar la spec (§5.1).
// Sin esa confirmación empírica, tomo la ruta de fallback que la propia
// spec describe para el caso "no": JS puro, mismo criterio que
// statFunctions.ts (que SÍ confirmó, probando el paquete real, que
// Algebrite carece de mean/median/etc. — ver su cabecera). Documentado
// como riesgo pendiente en el cierre del P4, no como hecho confirmado —
// si Algebrite sí las soporta nativamente, este módulo sigue funcionando
// igual (nunca le pregunta a Algebrite por re/im/arg directamente, solo
// usa evaluate() para simplificar la expresión de entrada primero).
//
// Alcance (igual que statFunctions.ts): la función debe ser la expresión
// COMPLETA, no anidada dentro de otra (ej. "re(2+3*i)" sí, "re(2+3*i)+1"
// no, todavía).
//
// Limitación conocida: solo reconoce el resultado ya reducido por
// Algebrite a la forma canónica de un término real + un término
// imaginario (ej. "5+3*i", "2-i", "4*i", "7") — no una suma sin combinar
// de varios términos con i. Algebrite normalmente sí combina términos
// semejantes al evaluar, pero no está garantizado para toda expresión de
// entrada; si no puede interpretarlo, lanza un error claro en vez de dar
// un resultado silenciosamente incorrecto.

import { evaluate } from "./algebriteClient";

export const COMPLEX_FUNCTION_NAMES = ["re", "im", "arg", "conj", "topolar", "log", "root"] as const;
export type ComplexFunctionName = (typeof COMPLEX_FUNCTION_NAMES)[number];

function isComplexFunctionName(name: string): name is ComplexFunctionName {
  return (COMPLEX_FUNCTION_NAMES as readonly string[]).includes(name);
}

interface ComplexParts {
  re: number;
  im: number;
}

/** Extrae (re, im) del string ya evaluado por Algebrite. Lanza si no
 * matchea la forma canónica esperada (ver limitación arriba). */
export function parseComplex(algebriteResult: string): ComplexParts {
  const s = algebriteResult.replace(/\s+/g, "");

  // Forma pura real (sin "i" como unidad imaginaria — ojo: esto NO
  // detecta "i" dentro de otro identificador porque Algebrite ya evaluó
  // la expresión a una forma numérica en este punto).
  if (!/i/.test(s)) {
    const n = Number(s);
    if (!Number.isFinite(n)) throw new Error(`No se pudo interpretar "${s}" como número complejo.`);
    return { re: n, im: 0 };
  }

  // Forma pura imaginaria: "i", "-i", "4*i", "-4*i"
  const pureImagMatch = s.match(/^([+-]?\d*\.?\d*)\*?i$/);
  if (pureImagMatch) {
    const coef = pureImagMatch[1];
    const im = coef === "" || coef === "+" ? 1 : coef === "-" ? -1 : Number(coef);
    if (!Number.isFinite(im)) throw new Error(`No se pudo interpretar "${s}" como número complejo.`);
    return { re: 0, im };
  }

  // Forma combinada: "A+B*i" / "A-B*i" / "A+i" / "A-i", A y B numéricos.
  const combined = s.match(/^([+-]?\d+\.?\d*)([+-])(\d*\.?\d*)\*?i$/);
  if (combined) {
    const [, reStr, sign, imMagStr] = combined;
    const re = Number(reStr);
    const imMag = imMagStr === "" ? 1 : Number(imMagStr);
    if (!Number.isFinite(re) || !Number.isFinite(imMag)) {
      throw new Error(`No se pudo interpretar "${s}" como número complejo.`);
    }
    return { re, im: sign === "-" ? -imMag : imMag };
  }

  throw new Error(
    `"${s}" no tiene la forma A+B*i esperada (probablemente Algebrite no lo redujo del todo) — re()/im()/arg()/conj()/topolar() no pueden procesarlo todavía.`,
  );
}

/** Evita basura de flotantes tipo 2.0000000000000004. */
function formatNumber(n: number): string {
  return Number(n.toPrecision(12)).toString();
}

/** Construye "A+B*i" en sintaxis Algebrite a partir de (re, im), mismo
 * formato que produce `conj()` más abajo -- reutilizado por root()/log().
 * "snap" a 0 los componentes despreciables frente a la escala del número
 * (hallazgo real: root(-4,2) da re=1.2246...e-16 en vez de 0 exacto, por
 * ruido de punto flotante de Math.cos/sin -- sin este ajuste se vería
 * "1.22464679915e-16+2*i" en vez de "2*i"). */
function formatComplex(re: number, im: number): string {
  const scale = Math.max(1, Math.hypot(re, im));
  const eps = 1e-9 * scale;
  const reAdj = Math.abs(re) < eps ? 0 : re;
  const imAdj = Math.abs(im) < eps ? 0 : im;
  const reFormatted = formatNumber(reAdj);
  if (imAdj === 0) return reFormatted;
  const imFormatted = formatNumber(Math.abs(imAdj));
  const imTerm = imAdj > 0 ? `${imFormatted}*i` : `-${imFormatted}*i`;
  if (reAdj === 0) return imTerm;
  return imAdj > 0 ? `${reFormatted}+${imTerm}` : `${reFormatted}${imTerm}`;
}

/** Scanner de paréntesis balanceados -- necesario para root(z,n) porque
 * `z` puede a su vez contener comas de otras llamadas a función (ej.
 * "root(root(z,2),3)"). Mismo criterio que el scanner equivalente en
 * `calculusIntent.ts` (main, Fase F). */
function splitTopLevelComma(text: string): [string, string | null] {
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "(" || ch === "{" || ch === "[") depth++;
    else if (ch === ")" || ch === "}" || ch === "]") depth--;
    else if (ch === "," && depth === 0) return [text.slice(0, i), text.slice(i + 1)];
  }
  return [text, null];
}

/**
 * Mismo contrato que tryStatFunction: null si `expr` no es un llamado
 * completo a una de estas funciones (el flujo normal sigue su curso),
 * string con el resultado (sintaxis Algebrite) si sí.
 */
export function tryComplexFunction(expr: string): string | null {
  const match = expr.match(/^([a-zA-Z]+)\((.*)\)$/s);
  if (!match) return null;
  const [, name, argStr] = match;
  if (!isComplexFunctionName(name)) return null;

  // Fase F (spec_edo_complejos_tooltips.md §3.2, Módulo F0/F1): Log(z) y
  // root(z,n) se calculan en JS puro sobre la forma polar (mismo criterio
  // ya establecido arriba para re/im/arg/conj/topolar -- Algebrite nunca
  // se usa para la parte compleja en sí, solo para reducir la expresión
  // de entrada a la forma canónica A+B*i). Rama principal, igual
  // convención que sympy.root() en main (verificado en F0) -- para z
  // real negativo, la raíz devuelta es la compleja principal, no la real.
  if (name === "root") {
    const [exprPart, nPart] = splitTopLevelComma(argStr);
    if (nPart === null) {
      throw new Error('root(z,n) requiere 2 argumentos: la expresión y el índice "n".');
    }
    const { re, im } = parseComplex(evaluate(exprPart.trim()));
    const n = Number(evaluate(nPart.trim()));
    if (!Number.isFinite(n) || n === 0) {
      throw new Error(`Índice de raíz inválido: "${nPart.trim()}".`);
    }
    const r = Math.hypot(re, im);
    const theta = Math.atan2(im, re);
    const rOut = Math.pow(r, 1 / n);
    const thetaOut = theta / n;
    return formatComplex(rOut * Math.cos(thetaOut), rOut * Math.sin(thetaOut));
  }

  const inner = evaluate(argStr.trim());
  const { re, im } = parseComplex(inner);

  if (name === "log") {
    // Hallazgo real de auditoría (Módulo F1/F2): "log" YA es una tecla
    // existente en este repo ("logaritmo base 10", CORE_GRID y Álgebra >
    // Logaritmos) que llega a Algebrite nativo sin pasar por acá -- mismo
    // nombre de función que el "Log(z)" complejo nuevo, porque
    // conceptualmente ES la misma función extendida a dominio complejo.
    // Para no cambiar el comportamiento de "log(5)" (real, positivo) que
    // ya funcionaba antes de este módulo, SOLO se intercepta acá cuando
    // el dominio complejo realmente hace falta (im≠0 o re<0) -- en
    // cualquier otro caso se retorna null y el flujo normal (Algebrite
    // nativo, sin cambios) sigue como siempre.
    if (im === 0 && re >= 0) return null;
    const r = Math.hypot(re, im);
    if (r === 0) {
      throw new Error("log(0) no está definido (el módulo del número complejo es 0).");
    }
    return formatComplex(Math.log(r), Math.atan2(im, re));
  }

  switch (name) {
    case "re":
      return formatNumber(re);
    case "im":
      return formatNumber(im);
    case "conj":
      if (im === 0) return formatNumber(re);
      return im > 0 ? `${formatNumber(re)}-${formatNumber(im)}*i` : `${formatNumber(re)}+${formatNumber(-im)}*i`;
    case "arg":
      return formatNumber(Math.atan2(im, re));
    case "topolar": {
      // Representación r*e^(i*theta) — dirección única (rectangular ->
      // polar); no hay sintaxis de entrada polar en este teclado para la
      // dirección inversa (ver cierre del P4).
      const r = Math.hypot(re, im);
      const theta = Math.atan2(im, re);
      return `${formatNumber(r)}*e^(${formatNumber(theta)}*i)`;
    }
    default:
      return null;
  }
}
