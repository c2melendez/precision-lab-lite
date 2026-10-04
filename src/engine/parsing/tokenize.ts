// Etapas 4-5 (spec v9 §3): tokeniza la expresión reconociendo, en orden de
// prioridad: números, identificadores conocidos (multi-letra, constantes,
// funciones) por coincidencia greedy más larga, operadores, y variables de
// una sola letra como fallback. Esto es lo que evita que "theta" se parta
// en "t*h*e*t*a", y lo que hace que "xyz" sin separadores se trate como un
// único identificador de 3 letras si no hay match conocido más largo.

import { ALL_KNOWN_IDENTIFIERS, KNOWN_FUNCTION_NAMES } from "./constants";
import { ErrorCode, type AppError } from "../../types";

export type TokenType = "number" | "identifier" | "function" | "operator" | "lparen" | "rparen" | "comma";

export interface Token {
  type: TokenType;
  value: string;
}

const OPERATORS = new Set(["+", "-", "*", "/", "^", "!", "%"]);

function parseError(message: string): AppError {
  return { code: ErrorCode.PARSE_ERROR, message };
}

export function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    // Número: dígitos con a lo sumo un punto decimal (ya validado en etapa 3)
    if (/[0-9]/.test(ch)) {
      const match = expr.slice(i).match(/^[0-9]+(\.[0-9]+)?/)!;
      tokens.push({ type: "number", value: match[0] });
      i += match[0].length;
      continue;
    }

    if (ch === "(") {
      tokens.push({ type: "lparen", value: "(" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "rparen", value: ")" });
      i++;
      continue;
    }
    if (ch === ",") {
      tokens.push({ type: "comma", value: "," });
      i++;
      continue;
    }
    if (OPERATORS.has(ch)) {
      tokens.push({ type: "operator", value: ch });
      i++;
      continue;
    }

    if (/[a-zA-Z]/.test(ch)) {
      // Greedy match del identificador conocido más largo en esta posición.
      const known = ALL_KNOWN_IDENTIFIERS.find((id) => expr.startsWith(id, i));
      if (known) {
        const isKnownFunction = (KNOWN_FUNCTION_NAMES as string[]).includes(known);
        // Un nombre reservado de función solo es función cuando hay una
        // llamada real. Esto permite variables legítimas como "d" en
        // a/b*c/d sin colisionar con el operador interno d(expr,x).
        const isFunction = isKnownFunction && expr[i + known.length] === "(";
        tokens.push({ type: isFunction ? "function" : "identifier", value: known });
        i += known.length;
        continue;
      }

      // IN625 C10: letras adyacentes desconocidas representan producto de
      // variables de una letra. Los identificadores multi-letra reservados ya
      // fueron capturados arriba. La codificación interna de subíndices
      // (xSUBONE, aSUBiCOMMAj, etc.) sí debe permanecer atómica.
      const subscriptEncoded = expr.slice(i).match(/^[A-Za-z]SUB[A-Za-z]+/);
      if (subscriptEncoded) {
        tokens.push({ type: "identifier", value: subscriptEncoded[0] });
        i += subscriptEncoded[0].length;
        continue;
      }
      tokens.push({ type: "identifier", value: ch });
      i++;
      continue;
    }

    throw parseError(`Carácter no reconocido: "${ch}".`);
  }

  return tokens;
}
