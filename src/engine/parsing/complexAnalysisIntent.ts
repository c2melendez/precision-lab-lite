import { ErrorCode, type AppError } from "../../types";

export type ComplexAnalysisIntent =
  | { kind: "residue"; expressionLatex: string; pointLatex: string }
  | { kind: "singularities"; expressionLatex: string };

function parseError(message: string): never {
  throw { code: ErrorCode.PARSE_ERROR, message } as AppError;
}

function canonicalize(latex: string): string {
  return latex
    .replace(/\s+/g, "")
    .replace(/\\left/g, "")
    .replace(/\\right/g, "")
    .replace(/\\operatorname\{Res\}/g, "Res")
    .replace(/\\operatorname\{Sing\}/g, "Sing")
    .replace(/\\mathrm\{Res\}/g, "Res")
    .replace(/\\mathrm\{Sing\}/g, "Sing");
}

function splitTopLevelComma(text: string): [string, string | null] {
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "(" || ch === "{" || ch === "[") depth++;
    else if (ch === ")" || ch === "}" || ch === "]") depth--;
    else if (ch === "," && depth === 0) {
      return [text.slice(0, i), text.slice(i + 1)];
    }
  }
  return [text, null];
}

export function detectComplexAnalysisIntent(latex: string): ComplexAnalysisIntent | null {
  const text = canonicalize(latex);

  if (text.startsWith("Res(")) {
    if (!text.endsWith(")")) parseError("Res(...) tiene paréntesis incompletos.");
    const inner = text.slice(4, -1);
    const [expressionLatex, pointSpec] = splitTopLevelComma(inner);
    if (!expressionLatex || pointSpec === null) {
      parseError('Res requiere la forma Res(expresión,z=punto).');
    }
    const pointMatch = pointSpec.match(/^z=(.+)$/s);
    if (!pointMatch?.[1]) {
      parseError('El segundo argumento de Res debe tener la forma z=punto.');
    }
    return { kind: "residue", expressionLatex, pointLatex: pointMatch[1] };
  }

  if (text.startsWith("Sing(")) {
    if (!text.endsWith(")")) parseError("Sing(...) tiene paréntesis incompletos.");
    const expressionLatex = text.slice(5, -1);
    if (!expressionLatex) parseError("Sing requiere una expresión racional.");
    return { kind: "singularities", expressionLatex };
  }

  return null;
}
