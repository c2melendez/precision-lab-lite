import { describe, expect, it } from 'vitest';
import { gunzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { calcLimit } from '../src/engine/stepEngine/calculus';
import { parseExpression } from '../src/engine/parsing';

const source = String.raw`\lim_{x\to\frac{\pi}{2}^{+}}\tan x`;
describe('LM-D-10', () => {
  it('anchors the frozen matrix row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-D-10 |'));
    expect(row).toContain(source);
    expect(row).toContain(String.raw`-\infty`);
  });
  it('parses the original expression', () => {
    expect(parseExpression(source, 'RAD').algebrite).toContain('limit(');
  });
  it('returns negative infinity from the right', () => {
    const result = calcLimit('tan(x)', 'x', 'pi/2', Math.PI / 2, 'right');
    expect(result.resultLatex).toBe(String.raw`-\infty`);
    expect(result.confidence).toBe('SYMBOLIC');
  });
  it('agrees with independent samples approaching from the right', () => {
    const values = [0.1, 0.01, 0.001].map(delta => Math.tan(Math.PI / 2 + delta));
    expect(values[0]).toBeLessThan(0);
    expect(values[1]).toBeLessThan(values[0]);
    expect(values[2]).toBeLessThan(values[1]);
  });
});
