export type RelationIntent =
  | { kind: "functionDefinition"; latex: string }
  | { kind: "explicitRelation"; latex: string }
  | { kind: "implicitRelation"; latex: string };

export function detectRelationIntent(latex: string): RelationIntent | null {
  const text = latex.trim();
  if (!text || !text.includes("=")) return null;

  // f(x)=... debe conservarse como definición, no resolverse para x.
  if (/^[a-zA-Z]\s*\(\s*[a-zA-Z]\s*\)\s*=/.test(text)) {
    return { kind: "functionDefinition", latex: text };
  }

  // y=... (o ...=y) es relación explícita para graficar.
  if (/^y\s*=/.test(text) || /=\s*y$/.test(text)) {
    return { kind: "explicitRelation", latex: text };
  }

  // Dos o más variables libres en una igualdad ordinaria -> relación implícita.
  const ids = text
    .replace(/\\[a-zA-Z]+/g, "")
    .match(/[a-zA-Z]/g) ?? [];
  const vars = [...new Set(ids.filter((v) => !["e","i"].includes(v.toLowerCase())))];
  if (vars.length >= 2) return { kind: "implicitRelation", latex: text };

  return null;
}
