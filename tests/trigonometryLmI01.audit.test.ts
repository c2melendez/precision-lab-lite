import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {parseExpression} from '../src/engine/parsing';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-I-01', () => {
  it('anchors the frozen row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-I-01 |'));
    expect(row).toContain(String.raw`\lim_{x\to 0}\frac{\arcsin x}{x}`);
    expect(row).toContain('`1`');
  });
  it('computes the exact limit from both sides', () => {
    for (const direction of ['both', 'left', 'right'] as const) {
      const result = calcLimit('arcsin(x)/x', 'x', '0', 0, direction);
      expect(result.resultLatex).toBe('1');
      expect(result.confidence).toBe('SYMBOLIC');
    }
  });
  it('connects the parsed matrix body to the engine', () => {
    const parsed = parseExpression(String.raw`\frac{\arcsin x}{x}`, 'RAD');
    const result = calcLimit(parsed.algebrite, 'x', '0', 0, 'both');
    expect(result.resultLatex).toBe('1');
    expect(result.confidence).toBe('SYMBOLIC');
  });
  it('agrees with independent samples', () => {
    for (const x of [-0.001, -0.0001, 0.0001, 0.001]) expect(Math.asin(x)/x).toBeCloseTo(1, 6);
  });
});
