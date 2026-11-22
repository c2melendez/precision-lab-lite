import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-HI-01', () => {
  it('anchors the frozen row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-HI-01 |'));
    expect(row).toContain(String.raw`\lim_{x\to 0}\frac{\operatorname{arsinh} x}{x}`);
    expect(row).toContain('`1`');
  });
  it('computes the exact limit from both sides', () => {
    for (const direction of ['both', 'left', 'right'] as const) {
      const result = calcLimit('asinh(x)/x', 'x', '0', 0, direction);
      expect(result.resultLatex).toBe('1');
      expect(result.confidence).toBe('SYMBOLIC');
    }
  });
});
