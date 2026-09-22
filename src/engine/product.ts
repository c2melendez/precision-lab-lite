import { evaluate } from "./algebriteClient";
import { splitTopLevelArgs } from "./statFunctions";

/** Evaluate finite product(body,index,lower,upper) emitted by the Π key. */
export function tryFiniteProduct(expr: string): string | null {
  if (!expr.startsWith("product(") || !expr.endsWith(")")) return null;
  const args = splitTopLevelArgs(expr.slice("product(".length, -1));
  if (args.length !== 4) throw new Error("Productoria requiere cuerpo, índice, inicio y fin.");
  const [body, variable, lowerRaw, upperRaw] = args.map((x) => x.trim());
  if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(variable)) throw new Error("Índice inválido en productoria.");
  const lower = Number(evaluate(`float(${lowerRaw})`));
  const upper = Number(evaluate(`float(${upperRaw})`));
  if (!Number.isInteger(lower) || !Number.isInteger(upper)) throw new Error("Los límites de la productoria deben ser enteros.");
  if (Math.abs(upper - lower) > 10000) throw new Error("El rango de la productoria es demasiado grande.");
  let result = "1";
  if (lower <= upper) {
    for (let k = lower; k <= upper; k++) {
      const term = evaluate(`subst(${k},${variable},${body})`);
      result = evaluate(`(${result})*(${term})`);
    }
  }
  return result;
}
