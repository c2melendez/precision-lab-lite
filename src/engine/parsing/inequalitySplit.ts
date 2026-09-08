// Fix (decisión de Carlos, cierre de la suite de paridad de teclado v1.0):
// <, >, ≤, ≥ se insertaban sin ningún router detrás — mismo patrón que
// equationSplit.ts para "=", pero para desigualdades. Se detecta ANTES
// que splitEquation() toque el string, porque "<="/">=" contienen un "="
// literal que splitEquation partiría mal si no se distingue primero.
//
// Alcance ("solver básico" — decisión de Carlos): una sola desigualdad,
// una sola variable, un solo operador relacional. No se soportan cadenas
// dobles (ej. "1 < x < 5") ni sistemas de desigualdades — no estaban
// pedidos y agregarlos sin que se pidan sería inventar alcance no
// especificado.
import { ErrorCode, type AppError } from "../../types";

function parseError(message: string): AppError {
  return { code: ErrorCode.PARSE_ERROR, message };
}

export type InequalityOperator = "<" | ">" | "<=" | ">=";

export interface InequalitySplit {
  left: string;
  right: string;
  operator: InequalityOperator;
}

/** Devuelve null si `expr` no contiene ningún operador de desigualdad de
 * primer nivel (no es una desigualdad) — quien llama sigue con el camino
 * normal de splitEquation/evaluate. */
export function splitInequality(expr: string): InequalitySplit | null {
  // Los de 2 caracteres van primero: si se buscara "<" antes que "<=", en
  // "x<=5" se partiría como left="x", right="=5" (con el "=" colgando).
  const operators: InequalityOperator[] = ["<=", ">=", "<", ">"];
  for (const op of operators) {
    const idx = expr.indexOf(op);
    if (idx === -1) continue;
    const left = expr.slice(0, idx);
    const right = expr.slice(idx + op.length);
    if (right.includes("<") || right.includes(">") || left.includes("<") || left.includes(">")) {
      throw parseError("Solo se admite una desigualdad simple (una variable, un operador) — no cadenas como \"1 < x < 5\".");
    }
    return { left, right, operator: op };
  }
  return null;
}
