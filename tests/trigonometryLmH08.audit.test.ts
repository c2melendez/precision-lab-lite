import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {parseExpression} from '../src/engine/parsing';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-H-08', () => {
  it('anchors the frozen row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-H-08 |'));
    expect(row).toContain(String.raw`\lim_{x\to\infty}\frac{\cosh x}{\sinh x}`);
    expect(row).toContain('`1`');
  });
  it('computes the exact limit', () => {
    const result = calcLimit('cosh(x)/sinh(x)', 'x', 'oo', Infinity, 'both');
    expect(result.resultLatex).toBe('1');
    expect(result.confidence).toBe('SYMBOLIC');
  });
  it('connects the parsed matrix body to the engine', () => {
    const parsed = parseExpression(String.raw`\frac{\cosh x}{\sinh x}`, 'RAD');
    expect(calcLimit(parsed.algebrite, 'x', 'oo', Infinity, 'both').resultLatex).toBe('1');
  });
});
