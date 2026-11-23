import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-HI-06', () => {
  it('anchors the original row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-HI-06 |'));
    expect(row).toContain(String.raw`\lim_{x\to\infty}\left(\operatorname{arcosh} x-\ln x\right)`);
    expect(row).toContain(String.raw`\ln 2`);
  });
  it('returns the exact positive-infinity limit', () => {
    const result = calcLimit('acosh(x)-log(x)', 'x', 'oo', Infinity);
    expect(result.resultLatex).toBe(String.raw`\ln 2`);
    expect(result.confidence).toBe('SYMBOLIC');
    expect(Math.acosh(1000) - Math.log(1000)).toBeCloseTo(Math.log(2), 4);
  });
});
