/**
 * EV-R-08: racionalización exacta de `1/(a ± √b)`.
 *
 * Algebrite deja el resultado como `1/(1+2^(1/2))` aunque el valor sea
 * correcto; la fila congelada EV-R-08 exige la forma conjugada `√2−1`.
 *
 * Este módulo reescribe SOLO un resultado completo con esa estructura y
 * radicales numéricos literales, aplicando la identidad exacta
 *
 *   1/(a ± √b) = (√b ∓ a) / (b − a²)
 *
 * y únicamente cuando `|b − a²| = 1`, de modo que el resultado no arrastra
 * denominador. Cualquier otra forma se devuelve intacta: sin aproximación ni
 * heurística.
 */

/** Devuelve la forma racionalizada exacta o el resultado original. */
export function rationalizeUnitConjugate(result: string): string {
  const compact = result.replace(/\s+/g, "");

  // 1/(a ± √b)
  const constantFirst = /^1\/\((-?\d+)([+-])(\d+)\^\(1\/2\)\)$/.exec(compact);
  // 1/(√b ± a)
  const radicalFirst = /^1\/\((\d+)\^\(1\/2\)([+-])(\d+)\)$/.exec(compact);

  let a: number;
  let b: number;
  let operator: string;
  if (constantFirst) {
    a = Number(constantFirst[1]);
    operator = constantFirst[2];
    b = Number(constantFirst[3]);
  } else if (radicalFirst) {
    b = Number(radicalFirst[1]);
    operator = radicalFirst[2];
    a = Number(radicalFirst[3]);
  } else {
    return result;
  }

  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || b <= 0) return result;

  const denominator = b - a * a;
  if (denominator !== 1 && denominator !== -1) return result;

  // 1/(a ± √b) = (√b ∓ a) / (b − a²); con s = +1 para '+' y −1 para '−',
  // el término constante del numerador es −s·a.
  const s = operator === "+" ? 1 : -1;
  const constant = -s * a;

  if (denominator === 1) {
    if (constant === 0) return `${b}^(1/2)`;
    return constant > 0 ? `${b}^(1/2)+${constant}` : `${b}^(1/2)-${Math.abs(constant)}`;
  }

  // denominator === -1 → se invierte el signo de todo el numerador.
  if (constant === 0) return `-${b}^(1/2)`;
  return `${constant}-${b}^(1/2)`;
}
