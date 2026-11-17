import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { parseExpression } from '../src/engine/parsing';
import { solveInequality } from '../src/engine/inequality';
describe('IN-HI-04', () => {
  it('anchors the original exercise', () => {
    const source = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    expect(source).toContain(String.raw`| IN-HI-04 | ` + '`' + String.raw`\operatorname{arcosh} x\ge 0` + '`');
  });
  it.each(['acosh(x)>=0', String.raw`\operatorname{arcosh} x\ge 0`, '0<=acosh(x)'])('solves %s', input => {
    const parsed = parseExpression(input, 'RAD');
    const result = solveInequality(parsed.algebrite, parsed.inequalityOperator!, 'x');
    expect(result.resultText).toBe('x >= 1');
    expect(result.steps.at(-1)?.latex).toBe(String.raw`\left[1,\infty\right)`);
  });
  it('includes the endpoint and excludes values outside the domain', () => {
    expect(Math.acosh(1)).toBe(0);
    expect(Number.isNaN(Math.acosh(0.999))).toBe(true);
    expect(Math.acosh(2)).toBeGreaterThan(0);
  });
});
