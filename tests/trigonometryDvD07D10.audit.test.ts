import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcDerivative} from '../src/engine/stepEngine/calculus';

const rows = [
  ['DV-D-07', 'sin(x^2)', String.raw`2x\cos\left(x^{2}\right)`, '2xcos(x^2)'],
  ['DV-D-08', 'tan(3*x)', String.raw`3\sec^{2}(3x)`, String.raw`\frac{3}{(cos(3x)^2)}`],
  ['DV-D-09', 'x*cos(x)', String.raw`\cos x-x\sin x`, 'cos(x)-xsin(x)'],
  ['DV-D-10', 'sin(2*x)^3', String.raw`6\sin^{2}(2x)\cos(2x)`, '6cos(2x)sin(2x)^2'],
] as const;

describe('DV-D-07 through DV-D-10', () => {
  const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
  it.each(rows)('%s', (id, expression, expected, oracle) => {
    const row = text.split('\n').find(line => line.includes(`| ${id} |`));
    expect(row).toContain(expected);
    const result = calcDerivative(expression, 'x', 1);
    expect(result.confidence).toBe('SYMBOLIC');
    expect(result.resultLatex.replace(/\s/g, '')).toBe(oracle);
  });
});
