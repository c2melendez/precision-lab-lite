import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-I-11', () => {
  it('anchors the frozen row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-I-11 |'));
    expect(row).toContain(String.raw`\lim_{x\to-\infty}\operatorname{arccot} x`);
    expect(row).toContain(String.raw`\pi`);
  });
  it('computes the principal-branch limit exactly', () => {
    const result = calcLimit('arccot(x)', 'x', '-oo', -Infinity, 'both');
    expect(result.resultLatex).toBe(String.raw`\pi`);
    expect(result.confidence).toBe('SYMBOLIC');
  });
});
