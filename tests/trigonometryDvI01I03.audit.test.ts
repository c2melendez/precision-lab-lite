import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcDerivative} from '../src/engine/stepEngine/calculus';

const rows = [
  ['DV-I-01', 'arcsin(x)', String.raw`\frac{1}{\sqrt{1-x^{2}}}`, String.raw`\frac{1}{\sqrt{-x^2+1}}`],
  ['DV-I-02', 'arccos(x)', String.raw`-\frac{1}{\sqrt{1-x^{2}}}`, String.raw`-\frac{1}{(\sqrt{-x^2+1})}`],
  ['DV-I-03', 'arctan(x)', String.raw`\frac{1}{1+x^{2}}`, String.raw`\frac{1}{x^2+1}`],
] as const;

describe('DV-I-01 through DV-I-03', () => {
  const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
  it.each(rows)('%s', (id, expression, expected, oracle) => {
    const row = text.split('\n').find(line => line.includes(`| ${id} |`));
    expect(row).toContain(expected);
    const result = calcDerivative(expression, 'x', 1);
    expect(result.confidence).toBe('SYMBOLIC');
    expect(result.resultLatex.replace(/\s/g, '')).toBe(oracle);
  });
});
