import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-HI-08', () => {
  it('anchors the original row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-HI-08 |'));
    expect(row).toContain(String.raw`\lim_{x\to\infty}\operatorname{arcoth} x`);
    expect(row).toContain('`0`');
  });
  it('computes the positive-infinity limit', () => {
    const result = calcLimit('acoth(x)', 'x', 'oo', Infinity);
    expect(result.resultLatex).toBe('0');
    expect(result.confidence).toBe('SYMBOLIC');
    expect(Math.atanh(1/100000)).toBeCloseTo(0, 4);
  });
});
