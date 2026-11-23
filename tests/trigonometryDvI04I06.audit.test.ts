import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcDerivative} from '../src/engine/stepEngine/calculus';

const matrixText = gunzipSync(
  readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url)),
).toString();

/** Returns the balanced brace group that starts at `start` (`{`), plus the index after it. */
function findGroup(source: string, start: number): [string, number] {
  let depth = 0;
  for (let i = start; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) return [source.slice(start + 1, i), i + 1];
    }
  }
  throw new Error(`Unbalanced braces in ${source}`);
}

/** Expands \frac{a}{b} and \sqrt{a} into plain parenthesised arithmetic. */
function expandCommands(source: string): string {
  let out = '';
  let i = 0;
  while (i < source.length) {
    if (source.startsWith('\\frac', i)) {
      const [num, afterNum] = findGroup(source, i + 5);
      const [den, afterDen] = findGroup(source, afterNum);
      out += `((${expandCommands(num)})/(${expandCommands(den)}))`;
      i = afterDen;
    } else if (source.startsWith('\\sqrt', i)) {
      const [arg, afterArg] = findGroup(source, i + 5);
      out += `sqrt(${expandCommands(arg)})`;
      i = afterArg;
    } else {
      out += source[i];
      i += 1;
    }
  }
  return out;
}

/** Expands ^{n} / ^n into **n. */
function expandPowers(source: string): string {
  let out = '';
  let i = 0;
  while (i < source.length) {
    if (source[i] === '^') {
      if (source[i + 1] === '{') {
        const [group, after] = findGroup(source, i + 1);
        out += `**(${expandPowers(group)})`;
        i = after;
      } else {
        out += `**${source[i + 1]}`;
        i += 2;
      }
    } else {
      out += source[i];
      i += 1;
    }
  }
  return out;
}

/** Inserts the implicit products the engine omits (2x, x\sqrt{...}, 2\sqrt{...}, (x)(y)). */
function insertImplicitProducts(source: string): string {
  return source.replace(/([)0-9x])(?=(?:sqrt|abs|x|\(|\d))/g, (match) => `${match}*`);
}

/**
 * Evaluates the LaTeX subset emitted by the derivative engine at one numeric point.
 * It exists to turn the engine's symbolic claim into numbers: it is an independent
 * evaluator with no dependency on the engine's own arithmetic.
 */
function evalLatexAt(latex: string, value: number): number {
  const plain = latex
    .replace(/\s+/g, '')
    .replace(/\\left|\\right/g, '')
    .replace(/\\lvert/g, 'abs(')
    .replace(/\\rvert|\\\|/g, ')');
  const expanded = expandPowers(insertImplicitProducts(expandCommands(plain)))
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/abs\(/g, 'Math.abs(');
  const leftover = expanded.replace(/Math\.(sqrt|abs)/g, '').replace(/x/g, '');
  if (/[A-Za-z]/.test(leftover)) throw new Error(`Unsupported LaTeX for numeric evaluation: ${latex}`);
  // eslint-disable-next-line no-new-func
  const fn = new Function('x', `return (${expanded});`) as (x: number) => number;
  return fn(value);
}

type Row = {
  id: string;
  expression: string;
  matrixLatex: string;
  oracle: (value: number) => number;
  samples: number[];
  outsideDomain: number[];
};

const rows: Row[] = [
  {
    id: 'DV-I-04',
    expression: 'arccot(x)',
    matrixLatex: String.raw`-\frac{1}{1+x^{2}}`,
    oracle: (value) => -1 / (1 + value * value),
    samples: [-3, -0.5, 0, 0.5, 3],
    outsideDomain: [],
  },
  {
    id: 'DV-I-05',
    expression: 'arcsec(x)',
    matrixLatex: String.raw`\frac{1}{\lvert x\rvert\sqrt{x^{2}-1}}`,
    oracle: (value) => 1 / (Math.abs(value) * Math.sqrt(value * value - 1)),
    samples: [-3, -2, 2, 3],
    outsideDomain: [-0.5, 0, 0.5],
  },
  {
    id: 'DV-I-06',
    expression: 'arccsc(x)',
    matrixLatex: String.raw`-\frac{1}{\lvert x\rvert\sqrt{x^{2}-1}}`,
    oracle: (value) => -1 / (Math.abs(value) * Math.sqrt(value * value - 1)),
    samples: [-3, -2, 2, 3],
    outsideDomain: [-0.5, 0, 0.5],
  },
];

describe('DV-I-04 through DV-I-06 — numeric equivalence and real domain', () => {
  it('the numeric evaluator is faithful on known closed forms', () => {
    expect(evalLatexAt(String.raw`\frac{1}{1+x^{2}}`, 2)).toBeCloseTo(0.2, 12);
    expect(evalLatexAt(String.raw`\frac{1}{\lvert x\rvert\sqrt{x^{2}-1}}`, 2)).toBeCloseTo(1 / (2 * Math.sqrt(3)), 12);
    expect(evalLatexAt(String.raw`-\frac{1}{x^2\sqrt{1-\frac{1}{(x^2)}}}`, -3)).toBeCloseTo(-1 / (9 * Math.sqrt(1 - 1 / 9)), 12);
  });

  it.each(rows)('%s anchors the frozen matrix row', (row) => {
    const line = matrixText.split('\n').find((candidate) => candidate.includes(`| ${row.id} |`));
    expect(line).toBeDefined();
    expect(line).toContain(row.matrixLatex);
  });

  it.each(rows)('%s reproduces the matrix derivative numerically', (row) => {
    const result = calcDerivative(row.expression, 'x', 1);
    expect(result.confidence).toBe('SYMBOLIC');

    for (const point of row.samples) {
      const expected = row.oracle(point);
      const actual = evalLatexAt(result.resultLatex, point);
      expect(actual).toBeCloseTo(expected, 12);
    }
  });

  it.each(rows.filter((row) => row.outsideDomain.length > 0))(
    '%s stays outside the real domain of arcsec/arccsc',
    (row) => {
      const result = calcDerivative(row.expression, 'x', 1);
      for (const point of row.outsideDomain) {
        expect(Number.isNaN(evalLatexAt(result.resultLatex, point)) || !Number.isFinite(evalLatexAt(result.resultLatex, point))).toBe(true);
      }
    },
  );

  it('arccot and arctan derivatives are exact opposites (metamorphic)', () => {
    const acot = calcDerivative('arccot(x)', 'x', 1).resultLatex;
    const atan = calcDerivative('arctan(x)', 'x', 1).resultLatex;
    for (const point of [-3, -0.5, 0.25, 2, 3]) {
      expect(evalLatexAt(acot, point) + evalLatexAt(atan, point)).toBeCloseTo(0, 12);
    }
  });

  it('arcsec and arccsc derivatives are exact opposites (metamorphic)', () => {
    const asec = calcDerivative('arcsec(x)', 'x', 1).resultLatex;
    const acsc = calcDerivative('arccsc(x)', 'x', 1).resultLatex;
    for (const point of [-3, -2, 2, 3]) {
      expect(evalLatexAt(asec, point) + evalLatexAt(acsc, point)).toBeCloseTo(0, 12);
    }
  });
});
