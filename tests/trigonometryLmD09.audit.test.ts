import { describe, expect, it } from 'vitest';
import { gunzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { calcLimit } from '../src/engine/stepEngine/calculus';

describe('LM-D-09', () => {
  it('anchors the frozen source row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-D-09 |'));
    expect(row).toContain(String.raw`\lim_{x\to\frac{\pi}{2}^{-}}\tan x`);
    expect(row).toContain(String.raw`+\infty`);
  });
  it('distinguishes both sides of the tangent pole', () => {
    const left = calcLimit('tan(x)', 'x', 'pi/2', Math.PI / 2, 'left');
    const right = calcLimit('tan(x)', 'x', 'pi/2', Math.PI / 2, 'right');
    expect(left.resultLatex).toMatch(/^\+?\\infty$/);
    expect(right.resultLatex).toBe(String.raw`-\infty`);
  });
  it('checks independent samples on both sides', () => {
    for (const delta of [0.01, 0.001]) {
      expect(Math.tan(Math.PI / 2 - delta)).toBeGreaterThan(0);
      expect(Math.tan(Math.PI / 2 + delta)).toBeLessThan(0);
    }
  });
});
