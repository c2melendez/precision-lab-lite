// Fix (suite de regresión v1.1, casos E107 y E109-E111): "cbrt" no
// estaba registrada en absoluto, y "sign" SÍ estaba registrada en
// FUNCTION_ARITY (el parser la reconoce como función) pero Algebrite no
// la evalúa nativamente a un número — evaluate("sign(-3)") daba NaN.
// Mismo patrón que sec/csc/cot antes de su fix: hace falta resolverlas
// fuera de Algebrite. A diferencia de sec/csc/cot (que sí tienen una
// identidad puramente simbólica en sin/cos/tan), cbrt necesita elegir la
// RAÍZ REAL para bases negativas (Algebrite da la rama compleja
// principal para cualquier exponente fraccionario, incluida 1/3) y sign
// necesita una condición (positivo/negativo/cero) — ninguna de las dos
// se puede expresar como una simple reescritura algebraica antes de
// evaluar, así que se resuelven acá evaluando el argumento con
// Algebrite y computando el resultado en JS, mismo patrón que ya usan
// plusMinus.ts/complexFunctions.ts.
import { evaluate } from "./algebriteClient";

export function tryCbrtSign(expr: string): string | null {
  const cbrtMatch = expr.match(/^cbrt\((.*)\)$/s);
  if (cbrtMatch) {
    const inner = parseFloat(evaluate(`float(${cbrtMatch[1]})`));
    if (Number.isNaN(inner)) return null;
    const result = Math.sign(inner) * Math.pow(Math.abs(inner), 1 / 3);
    return String(result);
  }
  const signMatch = expr.match(/^sign\((.*)\)$/s);
  if (signMatch) {
    const inner = parseFloat(evaluate(`float(${signMatch[1]})`));
    if (Number.isNaN(inner)) return null;
    return String(Math.sign(inner));
  }
  return null;
}
