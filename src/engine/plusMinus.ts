// Fix (decisión de Carlos, cierre de la suite de paridad de teclado v1.0):
// la tecla "±()" (\pm\left(#0\right)) se insertaba sin problema pero no
// tenía ningún cómputo detrás — Algebrite no conoce "pm" nativamente, así
// que quedaba sin evaluar, igual que sec/csc/cot antes de su fix.
//
// Semántica elegida: ±(expr) da las DOS ramas (+expr y -expr), igual que
// "±" significa en cualquier fórmula (ej. la cuadrática). Se devuelven
// como una lista de Algebrite (mismo formato que ya usa "sort" en
// statFunctions.ts — el resto del pipeline ya sabe convertir listas a
// LaTeX), no como dos resultados separados, porque el campo de resultado
// solo puede mostrar un valor.
//
// Alcance (igual que complexFunctions.ts/statFunctions.ts): debe ser la
// expresión COMPLETA ("±(5)" sí, "±(5)+1" no, todavía) — evita inventar
// reglas de precedencia para "±" en medio de una expresión mayor, que la
// spec nunca definió.
//
// Se evalúa con Algebrite (no aritmética de JS) para conservar forma
// exacta: ±(sqrt(2)) da [sqrt(2),-sqrt(2)], no una aproximación decimal.
import { evaluate } from "./algebriteClient";

export function tryPlusMinus(expr: string): string | null {
  const match = expr.match(/^pm\((.*)\)$/s);
  if (!match) return null;
  const inner = evaluate(match[1].trim());
  const negated = evaluate(`-(${inner})`);
  return `[${inner},${negated}]`;
}
