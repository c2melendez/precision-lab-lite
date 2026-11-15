import { describe, expect, it } from 'vitest';
import { gunzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { parseExpression } from '../src/engine/parsing';
import { solveInequality } from '../src/engine/inequality';

describe('TRIG-IN-I-06 principal arccot inequality', () => {
  it('anchors the original matrix row', () => {
    const source = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString('utf8');
    const row = source.split(/\r?\n/).find(line => line.includes('| IN-I-06 |'));
    expect(row?.split('|').map(s => s.trim().replace(/^`|`$/g, '')).filter(Boolean)).toEqual(['IN-I-06', String.raw`\operatorname{arccot} x<\frac{\pi}{4}`, String.raw`(1,\infty)`]);
  });
  it.each(['arccot(x)<pi/4', String.raw`\operatorname{arccot} x<\frac{\pi}{4}`])('solves %s', input => {
    const parsed = parseExpression(input, 'RAD');
    const result = solveInequality(parsed.algebrite, parsed.inequalityOperator!, 'x');
    expect(result.resultText).toBe('x > 1');
    expect(result.steps.at(-1)?.latex).toBe(String.raw`\left(1,\infty\right)`);
  });
  it('uses the principal branch and excludes the boundary', () => {
    const arccot = (x: number) => Math.PI / 2 - Math.atan(x);
    expect(arccot(-1)).toBeGreaterThan(Math.PI/4);
    expect(arccot(0)).toBeGreaterThan(Math.PI/4);
    expect(arccot(1)).toBeCloseTo(Math.PI/4, 14);
    expect(arccot(2)).toBeLessThan(Math.PI/4);
  });
});
