import { describe, expect, it } from 'vitest';
import { gunzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { parseExpression } from '../src/engine/parsing';
import { solveInequality } from '../src/engine/inequality';

describe('TRIG-IN-I-07 arcsin(2x-1) >= 0', () => {
  it('anchors the original matrix row', () => {
    const source = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString('utf8');
    const row = source.split(/\r?\n/).find(line => line.includes('| IN-I-07 |'));
    expect(row?.split('|').map(s => s.trim().replace(/^`|`$/g, '')).filter(Boolean)).toEqual(['IN-I-07', String.raw`\arcsin(2x-1)\ge 0`, String.raw`\left[\frac{1}{2},1\right]`]);
  });
  it.each(['asin(2*x-1)>=0', String.raw`\arcsin(2x-1)\ge 0`])('solves %s', input => {
    const parsed = parseExpression(input, 'RAD');
    const result = solveInequality(parsed.algebrite, parsed.inequalityOperator!, 'x');
    expect(result.resultText).toBe('1/2 <= x <= 1');
    expect(result.steps.at(-1)?.latex).toBe(String.raw`\left[\frac{1}{2},1\right]`);
  });
  it('respects domain and closed boundaries', () => {
    // arcsin(y) >= 0 for y in [0,1]
    expect(Math.asin(0)).toBe(0);
    expect(Math.asin(1)).toBeCloseTo(Math.PI / 2, 14);
    expect(Math.asin(-0.1)).toBeLessThan(0);
  });
});
