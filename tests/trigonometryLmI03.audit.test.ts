import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {parseExpression} from '../src/engine/parsing';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-I-03', () => {
  it('anchors the frozen row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-I-03 |'));
    expect(row).toContain(String.raw`\lim_{x\to 0}\frac{\arcsin 3x}{\arctan 2x}`);
    expect(row).toContain(String.raw`\frac{3}{2}`);
  });
  it('computes the exact limit from both sides', () => {
    for (const direction of ['both', 'left', 'right'] as const) {
      const result = calcLimit('arcsin(3*x)/arctan(2*x)', 'x', '0', 0, direction);
      expect(result.resultLatex).toBe(String.raw`\frac{3}{2}`);
      expect(result.confidence).toBe('SYMBOLIC');
    }
  });
  it('connects the parsed matrix body to the engine', () => {
    const parsed = parseExpression(String.raw`\frac{\arcsin 3x}{\arctan 2x}`, 'RAD');
    const result = calcLimit(parsed.algebrite, 'x', '0', 0, 'both');
    expect(result.resultLatex).toBe(String.raw`\frac{3}{2}`);
    expect(result.confidence).toBe('SYMBOLIC');
  });
  it('agrees with independent samples', () => {
    for (const x of [-0.001, -0.0001, 0.0001, 0.001]) expect(Math.asin(3*x)/Math.atan(2*x)).toBeCloseTo(1.5, 4);
  });
});
