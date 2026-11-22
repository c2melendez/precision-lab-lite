import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {parseExpression} from '../src/engine/parsing';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-H-04', () => {
  it('anchors the frozen row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-H-04 |'));
    expect(row).toContain(String.raw`\lim_{x\to 0}\frac{\sinh x-x}{x^{3}}`);
    expect(row).toContain(String.raw`\frac{1}{6}`);
  });
  it('computes the exact limit from both sides', () => {
    for (const direction of ['both', 'left', 'right'] as const) {
      const result = calcLimit('(sinh(x)-x)/x^3', 'x', '0', 0, direction);
      expect(result.resultLatex).toBe(String.raw`\frac{1}{6}`);
      expect(result.confidence).toBe('SYMBOLIC');
    }
  });
  it('connects the parsed matrix body to the engine', () => {
    const parsed = parseExpression(String.raw`\frac{\sinh x-x}{x^{3}}`, 'RAD');
    expect(calcLimit(parsed.algebrite, 'x', '0', 0, 'both').resultLatex).toBe(String.raw`\frac{1}{6}`);
  });
});
