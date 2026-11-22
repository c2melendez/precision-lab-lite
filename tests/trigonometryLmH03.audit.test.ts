import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {parseExpression} from '../src/engine/parsing';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-H-03', () => {
  it('anchors the frozen row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-H-03 |'));
    expect(row).toContain(String.raw`\lim_{x\to 0}\frac{\tanh x}{x}`);
    expect(row).toContain('`1`');
  });
  it('computes the exact limit from both sides', () => {
    for (const direction of ['both', 'left', 'right'] as const) {
      const result = calcLimit('tanh(x)/x', 'x', '0', 0, direction);
      expect(result.resultLatex).toBe('1');
      expect(result.confidence).toBe('SYMBOLIC');
    }
  });
  it('connects the parsed matrix body to the engine', () => {
    const parsed = parseExpression(String.raw`\frac{\tanh x}{x}`, 'RAD');
    expect(calcLimit(parsed.algebrite, 'x', '0', 0, 'both').resultLatex).toBe('1');
  });
});
