export type MatrixIntent =
  | { kind: "literal"; matrix: string[][] }
  | { kind: "determinant"; matrix: string[][] }
  | { kind: "inverse"; matrix: string[][] }
  | { kind: "power"; matrix: string[][]; exponent: number }
  | { kind: "transpose"; matrix: string[][] }
  | { kind: "multiply"; left: string[][]; right: string[][] };

const ENV = String.raw`\\begin\{(p|b|v)matrix\}([\s\S]*?)\\end\{\1matrix\}`;

function splitMatrixBody(body: string): string[][] {
  const rows = body.split(/\\\\/).map((r) => r.trim()).filter(Boolean);
  if (rows.length === 0) throw new Error("La matriz no puede estar vacía.");
  // Los resultados de matrices de Plus pueden incluir fracciones LaTeX.
  // Conservarlas como razones exactas para Fraction.js, no como decimales.
  const normalizeCell = (cell: string): string => {
    const trimmed = cell.trim();
    const match = /^([+-]?)\\(?:dfrac|tfrac|frac)\s*\{\s*([+-]?\d+)\s*\}\s*\{\s*([+-]?\d+)\s*\}$/.exec(trimmed);
    if (!match) return trimmed;
    const numerator = Number(match[2]) * (match[1] === "-" ? -1 : 1);
    const denominator = Number(match[3]);
    return `${numerator}/${denominator}`;
  };
  const matrix = rows.map((row) => row.split("&").map(normalizeCell));
  const width = matrix[0].length;
  if (width === 0 || matrix.some((row) => row.length !== width)) {
    throw new Error("Todas las filas de la matriz deben tener la misma longitud.");
  }
  return matrix;
}

function parseSingleMatrix(text: string): { env: string; matrix: string[][]; rest: string } | null {
  const m = new RegExp(`^${ENV}`).exec(text.trim());
  if (!m) return null;
  return { env: m[1], matrix: splitMatrixBody(m[2]), rest: text.trim().slice(m[0].length) };
}

export function detectMatrixIntent(latex: string): MatrixIntent | null {
  let text = latex.trim();
  let explicitDet = false;
  if (text.startsWith("\\det")) {
    explicitDet = true;
    text = text.slice(4).trim();
  }

  const first = parseSingleMatrix(text);
  if (!first) return null;

  if (explicitDet || first.env === "v") {
    if (first.rest.trim()) return null;
    return { kind: "determinant", matrix: first.matrix };
  }

  const suffix = first.rest.trim();
  if (suffix === "^{-1}" || suffix === "^-1") return { kind: "inverse", matrix: first.matrix };
  if (suffix === "^{T}" || suffix === "^T") return { kind: "transpose", matrix: first.matrix };
  const power = /^\^\{?(-?\d+)\}?$/.exec(suffix);
  if (power) return { kind: "power", matrix: first.matrix, exponent: Number(power[1]) };

  if (suffix) {
    const second = parseSingleMatrix(suffix);
    if (second && !second.rest.trim()) return { kind: "multiply", left: first.matrix, right: second.matrix };
    return null;
  }

  return { kind: "literal", matrix: first.matrix };
}
