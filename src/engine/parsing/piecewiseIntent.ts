export interface PiecewiseBranch {
  expressionLatex: string;
  conditionLatex: string;
}

export interface PiecewiseIntent {
  kind: "piecewise";
  branches: PiecewiseBranch[];
}

const CASES = /\\begin\{cases\}([\s\S]*?)\\end\{cases\}/;

export function detectPiecewiseIntent(latex: string): PiecewiseIntent | null {
  const match = CASES.exec(latex.trim());
  if (!match) return null;

  const rows = match[1]
    .split("\\\\")
    .map((row) => row.trim())
    .filter(Boolean);

  if (rows.length < 2) return null;

  const branches: PiecewiseBranch[] = [];
  for (const row of rows) {
    const amp = row.indexOf("&");
    if (amp <= 0 || amp !== row.lastIndexOf("&")) return null;
    const expressionLatex = row.slice(0, amp).trim();
    const conditionLatex = row.slice(amp + 1).trim();
    if (!expressionLatex || !conditionLatex) return null;
    if (!/[<>]|\\leq|\\geq|\\lt|\\gt/.test(conditionLatex)) return null;
    branches.push({ expressionLatex, conditionLatex });
  }

  return { kind: "piecewise", branches };
}
