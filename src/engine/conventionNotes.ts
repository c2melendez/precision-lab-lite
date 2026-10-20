// Algebra114 AS-CONV (sección L): convenciones matemáticas ambiguas.
//
// El contrato exige que el motor DECLARE la convención cuando una expresión
// es ambigua entre ℝ y ℂ, o cuando una identidad depende de supuestos sobre
// las variables. En Plus el canal es `MathResponse.warnings`; en Lite el
// equivalente contractual vigente es `DomainCondition` con kind "domain"
// (tarjetas de contexto del resultado, S26) — no se introduce un campo novo
// en MathResult para no romper paridad de serialización E2E sin contrato.
// Paridad funcional declarada: mismos casos, misma semántica de declaración,
// canal propio de cada arquitectura (ver MANUAL_CAPABILITY_GAPS.md).

import type { DomainCondition } from "../types";

const make = (source: string, text: string, latex: string): DomainCondition => ({
  expressionAlgebrite: source,
  operator: ">=",
  comparisonAlgebrite: "0",
  text,
  latex,
  kind: "domain",
});

// Identificadores de convención por caso — usados tanto para redactar el
// texto como para que los oráculos de prueba detecten la declaración.
const TAG = {
  cbrtReal: "AS-CONV-01",
  rationalPowComplex: "AS-CONV-02",
  zeroPowZero: "AS-CONV-03",
  sqrtNegativeComplex: "AS-CONV-04",
  evenRootAbs: "AS-CONV-05",
  perfectOddRoot: "AS-CONV-06",
  trinomialAbs: "AS-CONV-07",
} as const;

function integerNthRoot(value: number, n: number): number | null {
  for (let c = 0; c <= value; c++) {
    if (Math.pow(c, n) === value) return c;
    if (Math.pow(c, n) > value) return null;
  }
  return null;
}

/** Devuelve las declaraciones de convención que corresponde adjuntar al
 * resultado de evaluar `expr` (sintaxis Algebrite normalizada). Puramente
 * textual/estructural: nunca cambia el valor devuelto por el CAS. */
export function conventionDeclarations(expr: string): DomainCondition[] {
  const compact = expr.replace(/\s+/g, "");
  const out: DomainCondition[] = [];

  // AS-CONV-03: 0^0 debe declararse, no resolverse en silencio.
  if (/(^|[^\d.])0\^0(?![\d])/.test(compact)) {
    out.push(make("0^0",
      `Convención ${TAG.zeroPowZero}: 0^0 se resuelve como 1 (límite combinatorio); es indeterminado en análisis de límites.`,
      "0^{0}=1\\text{ (convención, indeterminado en límites)}"));
  }

  // root(a,n) explícito (función registrada en complexFunctions/constants).
  const rootCall = /^root\((.+),(\d+)\)$/.exec(compact);
  if (rootCall) {
    const radicand = rootCall[1];
    const n = Number(rootCall[2]);
    const negNum = /^\(-([\d.]+)\)$|^-([\d.]+)$/.exec(radicand);
    const positiveNum = /^([\d.]+)$/.exec(radicand);
    if (negNum && n % 2 === 1) {
      const mag = Number(negNum[1] ?? negNum[2]);
      const exact = Number.isInteger(mag) ? integerNthRoot(mag, n) : null;
      if (exact !== null) {
        // AS-CONV-06: raíz impar EXACTA de constante negativa → rama real -k.
        out.push(make(compact,
          `Convención ${TAG.perfectOddRoot}: root(${radicand},${n}) = ${-exact} en ℝ (raíz impar perfecta, rama real elegida sobre la rama principal de ℂ).`,
          `\\sqrt[${n}]{a}=${-exact}\\in\\mathbb{R}`));
      } else {
        // AS-CONV-01: raíz impar no perfecta → rama principal ℂ declarada.
        out.push(make(compact,
          `Convención ${TAG.cbrtReal}: root(${radicand},${n}) sin raíz entera exacta se resuelve en la rama principal de ℂ; la convención real (−∛|a|) daría un valor distinto.`,
          `\\sqrt[${n}]{${radicand}}\\in\\mathbb{C}\\text{ (rama principal)}`));
      }
    } else if (negNum && n % 2 === 0) {
      out.push(make(compact,
        `Convención ${TAG.sqrtNegativeComplex}: raíz par de número negativo se evalúa en ℂ (rama principal); no tiene valor en ℝ.`,
        "\\sqrt{-x}\\in\\mathbb{C}"));
    } else if (positiveNum && n % 2 === 1) {
      // Paridad con Plus: raíz impar de positiva también declara ℝ.
      out.push(make(compact,
        `Convención ${TAG.cbrtReal}: raíz impar de base positiva resuelta en ℝ.`,
        `\\sqrt[${n}]{x}\\in\\mathbb{R}`));
    }
  }

  // AS-CONV-02: potencia racional de base negativa → rama principal ℂ.
  // Hallazgo verificado por sondeo: el CAS devuelve la rama principal
  // (-2+2i√3 para (-8)^(2/3)), NO la convención real 4 que da la rama
  // alternativa; la declaración debe describir lo que realmente se calcula.
  const rationalPow = /^\(-(\d+(?:\.\d+)?)\)\^\((\d+)\/(\d+)\)$/.exec(compact);
  if (rationalPow) {
    out.push(make(compact,
      `Convención ${TAG.rationalPowComplex}: potencia racional de base negativa resuelta en la rama principal de ℂ; la convención real daría un valor distinto.`,
      "a^{m/n}\\;(a<0)\\to\\text{rama principal }\\mathbb{C}"));
  }

  // AS-CONV-04: raíz cuadrada de número negativo → dominio ℂ declarado.
  if (/^sqrt\(-\d/.test(compact) || /(^|[+*\/(,-])sqrt\(-\d[^)]*\)/.test(compact)) {
    out.push(make(compact,
      `Convención ${TAG.sqrtNegativeComplex}: raíz de un número negativo se evalúa en ℂ (rama principal); no tiene valor en ℝ.`,
      "\\sqrt{-x}\\in\\mathbb{C}"));
  }

  // AS-CONV-05: root(x^n, n) con n par → |x| bajo supuesto de variable real.
  const evenRootPower = /^root\(x\^(\d+),(\d+)\)$/.exec(compact);
  if (evenRootPower && Number(evenRootPower[1]) === Number(evenRootPower[2]) && Number(evenRootPower[2]) % 2 === 0) {
    out.push(make(compact,
      `Convención ${TAG.evenRootAbs}: root(x^${evenRootPower[1]},${evenRootPower[2]}) = |x| asumiendo x ∈ ℝ (rama principal ℂ del CAS); en ℂ no existe esta identidad.`,
      "\\sqrt[n]{x^n}=|x|\\;(x\\in\\mathbb{R})"));
  }

  // AS-CONV-07: sqrt(trinomio cuadrado perfecto) → |binomio| bajo supuesto real.
  // Nota de sondeo: el parser normaliza `2*x` a `2x`, por eso el regex admite
  // opcionalmente el operador explícito.
  const tri = /^sqrt\((x\^2)([+-])(\d+)(?:\*)?x(\+)(\d+)\)$/.exec(compact);
  if (tri) {
    const b = Number(tri[3]);
    const c = Number(tri[5]);
    const isPerfectSquare = tri[2] === "-" && c === (b / 2) * (b / 2) && b % 2 === 0;
    if (isPerfectSquare) {
      out.push(make(compact,
        `Convención ${TAG.trinomialAbs}: sqrt(x²−${b}x+${c}) = |x−${b / 2}| asumiendo x ∈ ℝ; el CAS deja la forma radical sin resolver porque √(u²)=|u| exige el supuesto de realidad.`,
        "\\sqrt{x^2-2ax+a^2}=|x-a|\\;(x\\in\\mathbb{R})"));
    }
  }

  return out;
}

/** Reescritura de convenciones numéricas ANTES del CAS: raíz impar exacta de
 * constante negativa → valor entero real (paridad con Plus AS-CONV-01/06 y
 * con la convención de ∛ del parser \\sqrt[n] ya vigente en Lite). Se aplica
 * solo cuando existe raíz entera exacta; en otro caso devuelve null y el
 * flujo normal (rama principal ℂ vía tryComplexFunction) continúa. */
export function realOddRootValue(expr: string): string | null {
  const compact = expr.replace(/\s+/g, "");
  const m = /^root\(-(\d+),([13579])\)$/.exec(compact);
  if (!m) return null;
  const n = Number(m[2]);
  const exact = integerNthRoot(Number(m[1]), n);
  return exact === null ? null : String(-exact);
}
