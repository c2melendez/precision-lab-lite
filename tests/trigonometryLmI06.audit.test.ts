import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-I-06', () => {
  it('anchors the frozen row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-I-06 |'));
    expect(row).toContain(String.raw`\lim_{x\to\infty}\arctan x`);
    expect(row).toContain(String.raw`\frac{\pi}{2}`);
  });
  it('computes the symbolic limit', () => {
    const result = calcLimit('arctan(x)', 'x', 'oo', Infinity, 'both');
    expect(result.resultLatex).toBe(String.raw`\frac{\pi}{2}`);
    expect(result.confidence).toBe('SYMBOLIC');
  });
});
