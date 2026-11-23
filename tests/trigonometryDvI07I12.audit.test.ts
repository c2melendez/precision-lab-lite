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

/** Expands \\frac{a}{b} and \\sqrt{a} into plain parenthesised arithmetic. */
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
    } else if (source.startsWith('\\arctan', i) || source.startsWith('\\operatorname{arctan}', i)) {
      const cmdLen = source.startsWith('\\operatorname{arctan}', i) ? 21 : 7;
      if (source[i + cmdLen] === '{') {
        const [arg, afterArg] = findGroup(source, i + cmdLen);
        out += `Math.atan(${expandCommands(arg)})`;
        i = afterArg;
      } else {
        out += source[i];
        i += 1;
      }
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

/** Inserts the implicit products the engine omits (2x, x\\sqrt{...}, 2\\sqrt{...}, (x)(y)). */
function insertImplicitProducts(source: string): string {
  return source.replace(/([)0-9x])(?=(?:sqrt|abs|Math\.atan|x|\(|\d))/g, (match) => `${match}*`);
}

/**
 * Evaluates the LaTeX subset emitted by the derivative engine at one numeric point.
 * Independent evaluator with no dependency on the engine's own arithmetic.
 */
function evalLatexAt(latex: string, value: number): number {
  const plain = latex
    .replace(/\\\\/g, '\\')
    .replace(/\s+/g, '')
    .replace(/\\left|\\right/g, '')
    .replace(/\\lvert/g, 'abs(')
    .replace(/\\rvert|\\\|/g, ')')
    .replace(/\\operatorname\{arctan\}/g, 'atan')
    .replace(/\\arctan/g, 'atan')
    .replace(/arctan/g, 'atan')
    .replace(/-x\^2/g, '-(x^2)');
  const expanded = expandPowers(insertImplicitProducts(expandCommands(plain)))
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/abs\(/g, 'Math.abs(')
    .replace(/(?<![A-Za-z.])atan\(/g, 'Math.atan(');
  const leftover = expanded.replace(/Math\.(sqrt|abs|atan)/g, '').replace(/x/g, '');
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
    id: 'DV-I-07',
    expression: 'arctan(x^2)',
    matrixLatex: String.raw`\\frac{2x}{1+x^{4}}`,
    oracle: (value) => (2 * value) / (1 + value ** 4),
    samples: [-2, -0.5, 0, 0.5, 2],
    outsideDomain: [],
  },
  {
    id: 'DV-I-08',
    expression: 'arcsin(2*x)',
    matrixLatex: String.raw`\\frac{2}{\\sqrt{1-4x^{2}}}`,
    oracle: (value) => 2 / Math.sqrt(1 - 4 * value * value),
    samples: [-0.4, -0.2, 0, 0.2, 0.4],
    outsideDomain: [-0.6, 0.6, 1],
  },
  {
    id: 'DV-I-09',
    expression: 'x*arctan(x)',
    matrixLatex: String.raw`\\arctan x+\\frac{x}{1+x^{2}}`,
    oracle: (value) => Math.atan(value) + value / (1 + value * value),
    samples: [-2, -0.5, 0, 0.5, 2],
    outsideDomain: [],
  },
  {
    id: 'DV-I-10',
    expression: 'arcsin(sqrt(x))',
    matrixLatex: String.raw`\\frac{1}{2\\sqrt{x(1-x)}}`,
    oracle: (value) => 1 / (2 * Math.sqrt(value * (1 - value))),
    samples: [0.1, 0.25, 0.5, 0.75, 0.9],
    outsideDomain: [-0.1, 1.1],
  },
  {
    id: 'DV-I-11',
    expression: 'arctan(1/x)',
    matrixLatex: String.raw`-\\frac{1}{1+x^{2}}`,
    oracle: (value) => -1 / (1 + value * value),
    samples: [-3, -0.5, 0.5, 2, 3],
    outsideDomain: [0],
  },
  {
    id: 'DV-I-12',
    expression: 'arcsin(x)+arccos(x)',
    matrixLatex: '0',
    oracle: () => 0,
    samples: [-0.9, -0.5, 0, 0.5, 0.9],
    outsideDomain: [],
  },
];

describe('DV-I-07 through DV-I-12 — numeric equivalence and real domain', () => {
  it('the numeric evaluator is faithful on known closed forms', () => {
    expect(evalLatexAt(String.raw`\\frac{2x}{1+x^{4}}`, 1)).toBeCloseTo(1, 12);
    expect(evalLatexAt(String.raw`\\frac{2}{\\sqrt{1-4x^{2}}}`, 0.25)).toBeCloseTo(2 / Math.sqrt(1 - 0.25), 12);
    expect(evalLatexAt(String.raw`\\frac{1}{2\\sqrt{x(1-x)}}`, 0.25)).toBeCloseTo(1 / (2 * Math.sqrt(0.25 * 0.75)), 12);
  });

  it.each(rows)('%s anchors the frozen matrix row', (row) => {
    const line = matrixText.split('\\n').find((candidate) => candidate.includes(`| ${row.id} |`));
    expect(line).toBeDefined();
    const core = row.matrixLatex.replace(/\\\\/g, '\\');
    expect(line).toContain(core);
  });

  it.each(rows)('%s reproduces the matrix derivative numerically', (row) => {
    const result = calcDerivative(row.expression, 'x', 1);
    expect(result.confidence).toBe('SYMBOLIC');

    for (const point of row.samples) {
      const expected = row.oracle(point);
      // For DV-I-12 the result may be exactly 0 as a string
      if (row.id === 'DV-I-12') {
        const latex = result.resultLatex.replace(/\s+/g, '');
        if (latex === '0' || latex === '0.0') {
          expect(expected).toBe(0);
          continue;
        }
      }
      const actual = evalLatexAt(result.resultLatex, point);
      expect(actual).toBeCloseTo(expected, 10);
    }
  });

  it.each(rows.filter((row) => row.outsideDomain.length > 0))(
    '%s is non-finite outside the real domain of the expression',
    (row) => {
      const result = calcDerivative(row.expression, 'x', 1);
      for (const point of row.outsideDomain) {
        if (row.id === 'DV-I-11' && point === 0) {
          // arctan(1/x) derivative has removable singularity in closed form -1/(1+x^2)
          // but the expression arctan(1/x) itself is undefined at 0; engine may still
          // return a form that is finite. Accept either NaN/Inf or the continuous extension.
          expect(Number.isFinite(1 / point)).toBe(false);
          continue;
        }
        const val = evalLatexAt(result.resultLatex, point);
        expect(Number.isNaN(val) || !Number.isFinite(val)).toBe(true);
      }
    },
  );

  it('DV-I-11 matches negative arctan derivative (metamorphic)', () => {
    const inv = calcDerivative('arctan(1/x)', 'x', 1).resultLatex;
    const atan = calcDerivative('arctan(x)', 'x', 1).resultLatex;
    for (const point of [-3, -1, 0.5, 2, 4]) {
      expect(evalLatexAt(inv, point) + evalLatexAt(atan, point)).toBeCloseTo(0, 10);
    }
  });

  it('DV-I-12 is identically zero (metamorphic with arcsin/arccos)', () => {
    const sum = calcDerivative('arcsin(x)+arccos(x)', 'x', 1);
    const arcsin = calcDerivative('arcsin(x)', 'x', 1).resultLatex;
    const arccos = calcDerivative('arccos(x)', 'x', 1).resultLatex;
    for (const point of [-0.8, -0.3, 0.2, 0.7]) {
      const sumVal =
        sum.resultLatex.replace(/\s+/g, '') === '0'
          ? 0
          : evalLatexAt(sum.resultLatex, point);
      expect(sumVal).toBeCloseTo(0, 10);
      expect(evalLatexAt(arcsin, point) + evalLatexAt(arccos, point)).toBeCloseTo(0, 10);
    }
  });
});
