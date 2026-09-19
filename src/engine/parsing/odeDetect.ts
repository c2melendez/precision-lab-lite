// engine/parsing/odeDetect.ts (Fase E, spec_edo_complejos_tooltips.md §2.2,
// Módulo E2).
//
// Hallazgo real de auditoría (no anticipado por el spec): parseExpression()
// (el pipeline normal que usa BasicScientificMode.tsx) llama a
// splitEquation() sobre CUALQUIER texto con "=", que trataría "y'=2x" como
// una ecuación de álgebra común a despejar -- y tokenize() ni siquiera
// reconoce el carácter "'" como token válido, así que habría fallado con
// un PARSE_ERROR confuso mucho antes de llegar a ningún motor EDO. Por
// eso la detección tiene que vivir ACÁ, en el nivel de UI, ANTES de
// parseExpression -- mismo principio que detectODE/calculusIntent.ts en
// main (main/E1), pero una implementación separada porque el pipeline de
// Lite es estructuralmente distinto (un solo texto lineal vía Algebrite,
// no LaTeX + Compute Engine).

import { preprocessLatex, normalizeUnicode } from "./normalize";

// Mismo criterio que ODE_PRIME_TOKEN en main (calculusIntent.ts):
// requiere que "y" no esté pegada a otra letra antes (evita falso
// positivo con variables de más de una letra).
const ODE_PRIME_TOKEN = /(?:^|[^a-zA-Z])y'+/;

/**
 * Devuelve el texto ya normalizado (preprocessLatex + normalizeUnicode,
 * el mismo primer tramo que usa parseExpression() internamente) si el
 * campo parece una EDO en notación prima, o null si no. Se aplica el
 * preprocesado ANTES de probar el patrón para que la notación
 * alternativa "dy/dx" (que preprocessLatex ya convierte a "y'", ver
 * normalize.ts) también se reconozca, no solo la prima escrita directo.
 *
 * Si el preprocesado falla (braces sin balancear, etc.), se devuelve
 * null en vez de propagar el error acá -- el camino normal
 * (parseExpression, llamado después por BasicScientificMode.tsx) volverá
 * a fallar con el mismo error real y se lo mostrará al usuario tal cual,
 * en vez de que esta detección lo enmascare.
 */
export function detectODE(latex: string): string | null {
  const trimmed = latex.trim();
  if (trimmed.length === 0) return null;

  let normalized: string;
  try {
    normalized = normalizeUnicode(preprocessLatex(trimmed));
  } catch {
    return null;
  }

  if (!ODE_PRIME_TOKEN.test(normalized) || !normalized.includes("=")) return null;
  return normalized;
}
