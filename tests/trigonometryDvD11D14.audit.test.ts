import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcDerivative} from '../src/engine/stepEngine/calculus';

const rows = [
  ['DV-D-11', 'sin(x)/(1+cos(x))', 1, String.raw`\frac{1}{1+\cos x}`, String.raw`\frac{sin(x)^2}{((1+cos(x))^2)}+\frac{cos(x)}{(1+cos(x))}`],
  ['DV-D-12', 'log(sec(x)+tan(x))', 1, String.raw`\sec x`, String.raw`\frac{1}{(\frac{1}{cos(x)}+tan(x))cos(x)^2}+sin(x)\frac{1}{(\frac{1}{cos(x)}+tan(x))cos(x)^2}`],
  ['DV-D-13', 'tan(x)', 2, String.raw`2\sec^{2}x\tan x`, String.raw`\frac{2sin(x)}{(cos(x)^3)}`],
  ['DV-D-14', 'tan(x)', 1, '`2`', String.raw`\frac{1}{cos(x)^2}`],
] as const;

describe('DV-D-11 through DV-D-14', () => {
  const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
  it.each(rows)('%s', (id, expression, order, expected, oracle) => {
    const row = text.split('\n').find(line => line.includes(`| ${id} |`));
    expect(row).toContain(expected);
    const result = calcDerivative(expression, 'x', order);
    expect(result.confidence).toBe('SYMBOLIC');
    expect(result.resultLatex.replace(/\s/g, '')).toBe(oracle);
  });
});
