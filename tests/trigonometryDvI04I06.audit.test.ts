import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcDerivative} from '../src/engine/stepEngine/calculus';

const rows = [
  ['DV-I-04', 'arccot(x)', String.raw`-\frac{1}{1+x^{2}}`, String.raw`-\frac{1}{(x^2+1)}`],
  ['DV-I-05', 'arcsec(x)', String.raw`\frac{1}{\lvert x\rvert\sqrt{x^{2}-1}}`, String.raw`\frac{1}{x^2\sqrt{1-\frac{1}{(x^2)}}}`],
  ['DV-I-06', 'arccsc(x)', String.raw`-\frac{1}{\lvert x\rvert\sqrt{x^{2}-1}}`, String.raw`-\frac{1}{x^2\sqrt{1-\frac{1}{(x^2)}}}`],
] as const;

describe('DV-I-04 through DV-I-06', () => {
  const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
  it.each(rows)('%s', (id, expression, expected, oracle) => {
    const row = text.split('\n').find(line => line.includes(`| ${id} |`));
    expect(row).toContain(expected);
    const result = calcDerivative(expression, 'x', 1);
    expect(result.confidence).toBe('SYMBOLIC');
    expect(result.resultLatex.replace(/\s/g, '')).toBe(oracle);
  });
});
