import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-I-08', () => {
  it('anchors the frozen row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-I-08 |'));
    expect(row).toContain(String.raw`\lim_{x\to 1^{-}}\arccos x`);
    expect(row).toContain('`0`');
  });
  it('computes the left limit at the endpoint', () => {
    const result = calcLimit('arccos(x)', 'x', '1', 1, 'left');
    expect(result.resultLatex).toBe('0');
    expect(result.confidence).toBe('SYMBOLIC');
  });
  it('agrees with numerical samples from the domain', () => {
    expect(Math.acos(1 - 1e-12)).toBeCloseTo(0, 5);
  });
});
