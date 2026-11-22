import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-H-06', () => {
  it('anchors the frozen row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-H-06 |'));
    expect(row).toContain(String.raw`\lim_{x\to-\infty}\tanh x`);
    expect(row).toContain('`-1`');
  });
  it('computes the exact negative-infinity limit', () => {
    const result = calcLimit('tanh(x)', 'x', '-oo', -Infinity, 'both');
    expect(result.resultLatex).toBe('-1');
    expect(result.confidence).toBe('SYMBOLIC');
  });
  it('agrees with an independent numerical sample', () => {
    expect(Math.tanh(-10)).toBeCloseTo(-1, 7);
  });
});
