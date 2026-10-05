import { preprocessLatex } from "./normalize";

export interface ChainedInequalityIntent {
  leftClause: string;
  rightClause: string;
  variable: string;
}

export function detectChainedInequality(latex: string): ChainedInequalityIntent | null {
  const normalized = preprocessLatex(latex, "RAD").replace(/\s+/g, "");
  const match = /^(.+?)(<=|>=|<|>)([A-Za-z])((?:<=|>=|<|>))(.+)$/.exec(normalized);
  if (!match) return null;
  const [, left, op1, variable, op2, right] = match;
  if (!left || !right) return null;
  if (!["<","<=",">",">="].includes(op1) || !["<","<=",">",">="].includes(op2)) return null;
  return {
    leftClause: `${left}${op1}${variable}`,
    rightClause: `${variable}${op2}${right}`,
    variable,
  };
}
