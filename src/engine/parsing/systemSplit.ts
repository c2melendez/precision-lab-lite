// Fase 1 (fusión de modos, plan de 3 fases — spec UX estilo ClassCalc):
// detecta si el LaTeX del campo único de BasicScientificMode contiene un
// entorno \begin{cases}...\end{cases} — el que inserta el ícono de
// sistema del teclado (MathKeyboard.tsx, "onSolveSystem") — y lo separa
// en ecuaciones individuales, una por renglón, para que el router de
// BasicScientificMode pueda tratarlo como un sistema en vez de una
// expresión simple.
//
// MathLive soporta el entorno `cases` de forma nativa (confirmado contra
// su changelog público: soporte para agregar/quitar renglones dentro de
// un entorno cases), así que no hace falta ningún parseo LaTeX propio más
// allá de separar por el separador de renglón "\\" — cada renglón se
// vuelve a pasar por parseExpression() tal cual, igual que hace
// LinearSystemsMode.tsx hoy con sus N campos separados.
//
// DEDUCIBLE (fuera de alcance de esta fase, a propósito): un sistema
// escrito a mano sin el entorno cases (ej. "x=1; y=2" con punto y coma)
// es ambiguo — ¿son dos ecuaciones de un sistema o dos afirmaciones
// sueltas que casualmente comparten renglón? Se deja fuera hasta que haya
// una decisión explícita al respecto.

const SYSTEM_PATTERN = /\\begin\{(cases|aligned|array)\}(?:\{[^{}]*\})?([\s\S]*?)\\end\{\1\}/;

/**
 * Devuelve las ecuaciones de un entorno `cases` como LaTeX individual por
 * renglón, o `null` si `latex` no contiene ese entorno (o contiene menos
 * de 2 renglones no vacíos, que no alcanza para un sistema).
 */
export function splitSystemLatex(latex: string): string[] | null {
  const match = SYSTEM_PATTERN.exec(latex);
  if (!match) return null;

  const rows = match[2]
    .split("\\\\")
    .map((row) => row.replace(/&/g, "").trim())
    .filter((row) => row.length > 0);

  return rows.length >= 2 ? rows : null;
}


function looksLikeEquation(row: string): boolean {
  const compact = row.replace(/\s+/g, "");
  const eqCount = (compact.match(/=/g) ?? []).length;
  return eqCount === 1 && !/[<>]/.test(compact);
}

function splitTopLevelComma(text: string): string[] | null {
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    else if (ch === ")" || ch === "]" || ch === "}") depth = Math.max(0, depth - 1);
    else if (ch === "," && depth === 0) {
      const parts = [text.slice(0, i), text.slice(i + 1)].map((s) => s.trim());
      return parts.length === 2 ? parts : null;
    }
  }
  return null;
}

export function splitFreeSystemLatex(latex: string): string[] | null {
  const text = latex.trim();
  if (!text) return null;

  const candidates: string[][] = [];

  if (/\\text\{\s*y\s*\}/i.test(text)) {
    candidates.push(text.split(/\\text\{\s*y\s*\}/i));
  }
  if (text.includes(";")) candidates.push(text.split(";"));
  if (text.includes("\n")) candidates.push(text.split(/\r?\n/));

  // Dos ecuaciones separadas por \\ fuera de un entorno LaTeX.
  if (!/\\begin\{/.test(text) && text.includes("\\\\")) {
    candidates.push(text.split("\\\\"));
  }

  const comma = splitTopLevelComma(text);
  if (comma) candidates.push(comma);

  for (const raw of candidates) {
    const rows = raw.map((r) => r.trim().replace(/^\\\\\s*/, "")).filter(Boolean);
    if (rows.length === 2 && rows.every(looksLikeEquation)) return rows;
  }
  return null;
}
