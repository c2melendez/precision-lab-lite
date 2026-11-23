import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-HI-07', () => {
  it('anchors the original row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-HI-07 |'));
    expect(row).toContain(String.raw`\lim_{x\to 1^{+}}\frac{\operatorname{arcosh} x}{\sqrt{x-1}}`);
    expect(row).toContain(String.raw`\sqrt{2}`);
  });
  it('computes the right limit in the real domain', () => {
    const result = calcLimit('acosh(x)/sqrt(x-1)', 'x', '1', 1, 'right');
    expect(result.resultLatex).toBe(String.raw`\sqrt{2}`);
    expect(result.confidence).toBe('SYMBOLIC');
    expect(Math.acosh(1.00001)/Math.sqrt(0.00001)).toBeCloseTo(Math.sqrt(2), 4);
  });
});
