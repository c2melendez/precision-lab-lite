/**
 * Recognize only the bounded, text-wrapped two-ray inequality result emitted
 * by Lite's current inequality solver. This is a UI re-entry adapter, not a
 * general \text{} parser: arbitrary prose remains rejected by preprocessLatex.
 *
 * Example:
 *   \text{x < -2 o x > 2}
 * becomes:
 *   \left(-\infty,-2\right)\cup\left(2,\infty\right)
 *
 * The canonical result is then passed through readRealIntervalUnion, the
 * same strict validator used for interval unions entered directly.
 */
export function readRenderedInequalityUnion(latex: string): string | null {
  const source = latex.trim();
  const match = /^\\text\{\s*([A-Za-z])\s*(<=|<)\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s+o\s+\1\s*(>=|>)\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\}$/.exec(source);
  if (!match) return null;

  const [, , leftOperator, leftBound, rightOperator, rightBound] = match;
  const lower = Number(leftBound);
  const upper = Number(rightBound);
  if (!Number.isFinite(lower) || !Number.isFinite(upper) || lower >= upper) return null;

  const leftInterval = "\\left(-\\infty," + leftBound +
    (leftOperator === "<" ? "\\right)" : "\\right]");
  const rightInterval = (rightOperator === ">" ? "\\left(" : "\\left[") +
    rightBound + ",\\infty\\right)";
  return leftInterval + "\\cup" + rightInterval;
}
