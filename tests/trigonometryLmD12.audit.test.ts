import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {parseExpression} from '../src/engine/parsing';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-D-12', () => {
  it('anchors the original row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-D-12 |'));
    expect(row).toContain(String.raw`\lim_{x\to 0}x\sin\frac{1}{x}`);
    expect(row).toContain('`0`');
  });
  it('computes the exact limit from either side', () => {
    for (const direction of ['both', 'left', 'right'] as const) {
      const result = calcLimit('x*sin(1/x)', 'x', '0', 0, direction);
      expect(result.resultLatex).toBe('0');
      expect(result.confidence).toBe('SYMBOLIC');
    }
  });
  it('connects the parsed source body to the exact engine', () => {
    const parsed = parseExpression(String.raw`x\sin\frac{1}{x}`, 'RAD');
    const result = calcLimit(parsed.algebrite, 'x', '0', 0, 'both');
    expect(result.resultLatex).toBe('0');
    expect(result.confidence).toBe('SYMBOLIC');
  });
  it('obeys the independent squeeze bound', () => {
    for (const x of [-0.1, -0.01, 0.01, 0.1]) expect(Math.abs(x*Math.sin(1/x))).toBeLessThanOrEqual(Math.abs(x));
  });
});
