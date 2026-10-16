export type MatrixIntent =
  | { kind: "literal"; matrix: string[][] }
  | { kind: "determinant"; matrix: string[][] }
  | { kind: "inverse"; matrix: string[][] }
  | { kind: "power"; matrix: string[][]; exponent: number }
  | { kind: "transpose"; matrix: string[][] }
  | { kind: "dot"; left: string[][]; right: string[][] }
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
  if (matrix.every(row => row.every(cell => !cell.trim() || /^\\placeholder(?:\{[^{}]*\})?$/.test(cell.trim())))) {
    throw new Error("La matriz no puede estar vacía.");
  }
  // A blank cell inserted by the editor is missing input, not numeric zero.
  if (matrix.some(row => row.some(cell => !cell.trim() || /^\\placeholder(?:\{[^{}]*\})?$/.test(cell.trim())))) {
    throw new Error("Todas las filas de la matriz deben tener la misma longitud; completa las celdas vacías.");
  }
  const width = matrix[0].length;
  if (width === 0 || matrix.some((row) => row.length !== width)) {
    throw new Error("Todas las filas de la matriz deben tener la misma longitud.");
  }
  return matrix;
}

function parseSingleMatrix(text: string): { env: string; matrix: string[][]; rest: string } | null {
  // SY-M-11: angle vectors with paired optional sized delimiters.
  const angle = /^(?:\\langle([\s\S]*?)\\rangle|\\left\\langle([\s\S]*?)\\right\\rangle)/.exec(text.trim());
  if (angle) {
    const cells = (angle[1] ?? angle[2]).split(",").map(cell => cell.trim());
    if (!cells.length || !cells.every(cell => /^[+-]?\d+(?:\.\d+)?(?:\/[+-]?\d+)?$/.test(cell))) {
      throw new Error("El vector entre ángulos requiere componentes numéricas completas.");
    }
    return {env:"angle",matrix:[cells],rest:text.trim().slice(angle[0].length)};
  }
  // SY-M-06: numeric nested lists, including MathLive's sized brackets.
  // This is a data grammar, never JavaScript/JSON code execution.
  const ascii = text.trim().replace(/\\left(?=\[)|\\right(?=\])/g, "");
  const lists = /^\[\s*(\[[^[\]]+\](?:\s*,\s*\[[^[\]]+\])*)\s*\]$/.exec(ascii);
  if (lists) {
    const matrix = [...lists[1].matchAll(/\[([^[\]]+)\]/g)]
      .map(row => row[1].split(",").map(cell => cell.trim()));
    const numeric = /^[+-]?\d+(?:\.\d+)?(?:\/[+-]?\d+)?$/;
    if (!matrix.every(row => row.every(cell => numeric.test(cell)))) return null;
    if (matrix.some(row => row.length !== matrix[0].length)) {
      throw new Error("Todas las filas de la matriz deben tener la misma longitud.");
    }
    return {env: "ascii", matrix, rest: ""};
  }
  // SY-M-05: paired external brackets around a plain matrix environment.
  const wrapped = /^\\left\[\s*\\begin\{matrix\}([\s\S]*?)\\end\{matrix\}\s*\\right\]/.exec(text.trim());
  if (wrapped) {
    return {env: "wrapped", matrix: splitMatrixBody(wrapped[1]), rest: text.trim().slice(wrapped[0].length)};
  }
  // SY-M-04: a simple LaTeX array has one c/l/r alignment per column.
  // Parse it as matrix data; alignment never enters the arithmetic engine.
  const array = /^\\begin\{array\}\s*\{([clr\s]+)\}([\s\S]*?)\\end\{array\}/.exec(text.trim());
  if (array) {
    const matrix = splitMatrixBody(array[2]);
    const columns = array[1].replace(/\s/g, "").length;
    if (matrix[0].length !== columns) {
      throw new Error("La especificación de columnas del array no coincide con la matriz.");
    }
    return {env: "array", matrix, rest: text.trim().slice(array[0].length)};
  }
  const m = new RegExp(`^${ENV}`).exec(text.trim());
  if (!m) return null;
  return { env: m[1], matrix: splitMatrixBody(m[2]), rest: text.trim().slice(m[0].length) };
}

export function detectMatrixIntent(latex: string): MatrixIntent | null {
  // SY-M-12: do not silently interpret coordinate/interval tuples as vectors.
  const tupleText = latex.trim().replace(/\\left(?=\()|\\right(?=\))/g, "");
  if (/^\([^()]*,[^()]*\)\s*\\cdot(?![A-Za-z])\s*\([^()]*,[^()]*\)$/.test(tupleText)) {
    throw new Error("Las tuplas entre paréntesis son ambiguas. Para el producto escalar, escribe vectores entre ángulos, por ejemplo ⟨1,2,3⟩·⟨4,5,6⟩.");
  }
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
  const dot = /^\\cdot(?![A-Za-z])\s*/.exec(suffix);
  if (dot) {
    const second = parseSingleMatrix(suffix.slice(dot[0].length));
    if (!second || second.rest.trim()) return null;
    const length = (matrix:string[][]):number => {
      if (matrix.length === 1) return matrix[0].length;
      if (matrix.every(row => row.length === 1)) return matrix.length;
      throw new Error("El producto escalar requiere vectores fila o columna.");
    };
    if (length(first.matrix) !== length(second.matrix)) {
      throw new Error("El producto escalar requiere vectores de la misma longitud.");
    }
    return {kind: "dot", left:first.matrix, right:second.matrix};
  }
  const power = /^\^\{?(-?\d+)\}?$/.exec(suffix);
  if (power) return { kind: "power", matrix: first.matrix, exponent: Number(power[1]) };

  if (suffix) {
    const second = parseSingleMatrix(suffix);
    if (second && !second.rest.trim()) return { kind: "multiply", left: first.matrix, right: second.matrix };
    return null;
  }

  return { kind: "literal", matrix: first.matrix };
}
