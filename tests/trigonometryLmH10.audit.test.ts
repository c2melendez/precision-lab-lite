import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-H-10', () => {
  it('anchors the frozen row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-H-10 |'));
    expect(row).toContain(String.raw`\lim_{x\to 0^{+}}\coth x`);
    expect(row).toContain(String.raw`+\infty`);
  });
  it('computes the right-hand limit', () => {
    const result = calcLimit('coth(x)', 'x', '0', 0, 'right');
    expect(result.resultLatex).toBe(String.raw`+\infty`);
    expect(result.confidence).toBe('SYMBOLIC');
  });
});
