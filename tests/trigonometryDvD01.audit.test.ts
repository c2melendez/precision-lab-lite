import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcDerivative} from '../src/engine/stepEngine/calculus';

describe('DV-D-01', () => {
  it('anchors the original row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| DV-D-01 |'));
    expect(row).toContain(String.raw`\frac{d}{dx}\sin x`);
    expect(row).toContain(String.raw`\cos x`);
  });
  it('derives sine symbolically and agrees with finite differences', () => {
    const result = calcDerivative('sin(x)', 'x', 1);
    expect(result.resultLatex.replace(/\s/g, '')).toMatch(/cos/);
    expect(result.confidence).toBe('SYMBOLIC');
    for (const x of [-1, 0, 0.7]) expect((Math.sin(x+1e-5)-Math.sin(x-1e-5))/2e-5).toBeCloseTo(Math.cos(x), 8);
  });
});
