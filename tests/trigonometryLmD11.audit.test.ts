import {describe, expect, it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {parseExpression} from '../src/engine/parsing';
import {calcLimit} from '../src/engine/stepEngine/calculus';

describe('LM-D-11', () => {
  it('anchors the frozen row', () => {
    const text = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    const row = text.split('\n').find(line => line.includes('| LM-D-11 |'));
    expect(row).toContain(String.raw`\lim_{x\to\infty}\frac{\sin x}{x}`);
    expect(row).toContain('`0`');
  });
  it('solves exactly using the squeeze bound', () => {
    const result = calcLimit('sin(x)/x', 'x', 'oo', Infinity, 'both');
    expect(result.resultLatex).toBe('0');
    expect(result.confidence).toBe('SYMBOLIC');
  });
  it('connects the parsed matrix body to the engine', () => {
    const parsed = parseExpression(String.raw`\frac{\sin x}{x}`, 'RAD');
    const result = calcLimit(parsed.algebrite, 'x', 'oo', Infinity, 'both');
    expect(result.resultLatex).toBe('0');
    expect(result.confidence).toBe('SYMBOLIC');
  });
  it('obeys the independent magnitude bound', () => {
    for (const x of [10, 100, 1000, 10000]) expect(Math.abs(Math.sin(x)/x)).toBeLessThanOrEqual(1/x);
  });
});
