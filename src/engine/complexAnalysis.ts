import { ErrorCode, type AppError } from "../types";
import {
  derivative,
  polynomialRoots,
  rationalDenominator,
  simplifyExpression,
  substituteExact,
} from "./algebriteClient";

const VARIABLE = "z";
const MAX_POLE_ORDER = 12;

function unsupported(message: string): never {
  throw { code: ErrorCode.UNSUPPORTED_OPERATION, message } as AppError;
}

function assertRationalInZ(expression: string): void {
  if (/[A-Za-z_][A-Za-z0-9_]*\s*\(/.test(expression)) {
    unsupported(
      "Res/Sing en Lite cubre funciones racionales de z. Funciones trascendentes o llamadas funcionales no están admitidas en este módulo.",
    );
  }

  const identifiers = expression.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
  const allowed = new Set(["z", "i", "pi", "e"]);
  const unsupportedIds = identifiers.filter((id) => !allowed.has(id));
  if (unsupportedIds.length > 0) {
    unsupported(
      `Res/Sing en Lite solo admite la variable z (más constantes i, pi y e). Identificadores no admitidos: ${[...new Set(unsupportedIds)].join(", ")}.`,
    );
  }
}

function splitRootList(raw: string): string[] {
  const text = raw.trim();
  if (text === "") return [];
  if (!text.startsWith("[") || !text.endsWith("]")) return [text];

  const body = text.slice(1, -1).trim();
  if (body === "") return [];

  const out: string[] = [];
  let start = 0;
  let depth = 0;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    else if (ch === ")" || ch === "]" || ch === "}") depth--;
    else if (ch === "," && depth === 0) {
      out.push(body.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(body.slice(start).trim());
  return out.filter(Boolean);
}

function factorial(n: number): number {
  let result = 1;
  for (let k = 2; k <= n; k++) result *= k;
  return result;
}

function isExactlyZero(expression: string): boolean {
  return simplifyExpression(expression).trim() === "0";
}

export function singularitiesOfRational(expressionAlgebrite: string): string[] {
  assertRationalInZ(expressionAlgebrite);
  const denominator = simplifyExpression(rationalDenominator(expressionAlgebrite));
  if (denominator === "1") return [];

  let rootsRaw: string;
  try {
    rootsRaw = polynomialRoots(denominator, VARIABLE);
  } catch {
    unsupported(
      "No se pudieron determinar de forma simbólica las singularidades de esta función racional.",
    );
  }

  const roots = splitRootList(rootsRaw);
  const unique: string[] = [];
  for (const root of roots) {
    const value = substituteExact(denominator, VARIABLE, root);
    if (isExactlyZero(value) && !unique.includes(root)) unique.push(root);
  }
  return unique;
}

export function residueAtRational(
  expressionAlgebrite: string,
  pointAlgebrite: string,
): string {
  assertRationalInZ(expressionAlgebrite);
  const denominator = simplifyExpression(rationalDenominator(expressionAlgebrite));

  if (denominator === "1") return "0";
  if (!isExactlyZero(substituteExact(denominator, VARIABLE, pointAlgebrite))) return "0";

  let poleOrder: number | null = null;
  for (let order = 1; order <= MAX_POLE_ORDER; order++) {
    const derivativeAtPoint = substituteExact(
      derivative(denominator, VARIABLE, order),
      VARIABLE,
      pointAlgebrite,
    );
    if (!isExactlyZero(derivativeAtPoint)) {
      poleOrder = order;
      break;
    }
  }

  if (poleOrder === null) {
    unsupported(
      `No se pudo determinar el orden del polo (límite actual: ${MAX_POLE_ORDER}).`,
    );
  }

  const cancelled = simplifyExpression(
    `((${expressionAlgebrite})*(${VARIABLE}-(${pointAlgebrite}))^${poleOrder})`,
  );
  const differentiated =
    poleOrder === 1
      ? cancelled
      : derivative(cancelled, VARIABLE, poleOrder - 1);
  const atPoint = substituteExact(differentiated, VARIABLE, pointAlgebrite);
  const divisor = factorial(poleOrder - 1);
  return divisor === 1
    ? simplifyExpression(atPoint)
    : simplifyExpression(`(${atPoint})/${divisor}`);
}
