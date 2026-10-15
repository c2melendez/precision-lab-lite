/** SY-Q-08: strict bounded chained inequality interpreter.
 * This opt-in helper deliberately does not change the legacy one-operator router.
 * Only a single variable between two numeric endpoints is supported.
 */
export interface BoundedChain {
  variable: string;
  lower: number;
  upper: number;
  lowerInclusive: boolean;
  upperInclusive: boolean;
  resultText: string;
}
export function solveBoundedChain(source: string): BoundedChain {
  const text = source.replace(/\\leq?/g, "<=").replace(/\\geq?/g, ">=").replace(/≤/g, "<=").replace(/≥/g, ">=").replace(/\s+/g, "");
  const match = /^([+-]?(?:\d+(?:\.\d+)?|\.\d+))(<=|<)([A-Za-z])(<=|<)([+-]?(?:\d+(?:\.\d+)?|\.\d+))$/.exec(text);
  if (!match) throw new Error("Desigualdad encadenada fuera del alcance lineal acotado.");
  const lower = Number(match[1]), upper = Number(match[5]);
  if (!Number.isFinite(lower) || !Number.isFinite(upper) || lower >= upper)
    throw new Error("Los extremos deben ser finitos y estar estrictamente ordenados.");
  const lowerInclusive = match[2] === "<=", upperInclusive = match[4] === "<=";
  return { variable:match[3], lower,upper,lowerInclusive,upperInclusive,
    resultText:`${lower} ${lowerInclusive ? "<=" : "<"} ${match[3]} ${upperInclusive ? "<=" : "<"} ${upper}` };
}
