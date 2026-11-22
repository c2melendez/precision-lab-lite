import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-H-09', () => {
  it('anchors the frozen row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-H-09 |'));
    expect(row).toContain(String.raw`\lim_{x\to\infty}\left(\cosh x-\sinh x\right)`);
    expect(row).toContain('`0`');
  });
  it('computes the exact limit', () => {
    const result = calcLimit('cosh(x)-sinh(x)', 'x', 'oo', Infinity, 'both');
    expect(result.resultLatex).toBe('0');
    expect(result.confidence).toBe('SYMBOLIC');
  });
});
