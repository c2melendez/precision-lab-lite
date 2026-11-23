import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-HI-04', () => {
  it('anchors the original row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-HI-04 |'));
    expect(row).toContain(String.raw`\lim_{x\to 1^{-}}\operatorname{artanh} x`);
    expect(row).toContain(String.raw`+\infty`);
  });
  it('computes the left limit in the real domain', () => {
    const result = calcLimit('atanh(x)', 'x', '1', 1, 'left');
    expect(result.resultLatex).toBe(String.raw`+\infty`);
    expect(result.confidence).toBe('SYMBOLIC');
    expect(Math.atanh(0.9999)).toBeGreaterThan(Math.atanh(0.99));
  });
});
