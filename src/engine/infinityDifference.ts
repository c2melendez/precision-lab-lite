/** Preserve literal infinite subtraction before a CAS cancels its symbols. */
export function isIndeterminateInfinityDifference(source: string): boolean {
  const normalized = source.replace(/\\(?:left|right)(?=[()])/g, "")
    .replace(/\\infty\b|∞|\bInfinity\b/g, "oo").replace(/\s/g, "");
  let depth = 0;
  for (const char of normalized) {
    if (char === "(") depth++;
    if (char === ")" && --depth < 0) return false;
  }
  if (depth !== 0) return false;
  const compact = normalized.replace(/[()]/g, "");
  return compact === "oo-oo" || compact === "-oo--oo";
}
