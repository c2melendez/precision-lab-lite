import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcDerivative} from '../src/engine/stepEngine/calculus';

const rows = [
  ['DV-D-02', 'cos(x)', String.raw`-\sin x`, '-sin(x)'],
  ['DV-D-03', 'tan(x)', String.raw`\sec^{2}x`, String.raw`\frac{1}{cos(x)^2}`],
  ['DV-D-04', 'csc(x)', String.raw`-\csc x\cot x`, String.raw`-\frac{cos(x)}{(sin(x)^2)}`],
  ['DV-D-05', 'sec(x)', String.raw`\sec x\tan x`, String.raw`\frac{sin(x)}{(cos(x)^2)}`],
  ['DV-D-06', 'cot(x)', String.raw`-\csc^{2}x`, String.raw`-1-\frac{cos(x)^2}{(sin(x)^2)}`],
] as const;

describe('DV-D-02 through DV-D-06', () => {
  const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
  it.each(rows)('%s anchors its source and computes a symbolic derivative', (id, expression, expected, oracle) => {
    const row = text.split('\n').find(line => line.includes(`| ${id} |`));
    expect(row).toContain(expected);
    const result = calcDerivative(expression, 'x', 1);
    expect(result.confidence).toBe('SYMBOLIC');
    expect(result.resultLatex.replace(/\s/g, '')).toBe(oracle);
  });
});
