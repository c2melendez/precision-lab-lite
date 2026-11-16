import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { parseExpression } from '../src/engine/parsing';
import { solveInequality } from '../src/engine/inequality';
describe('IN-H-03', () => {
  it('anchors the frozen source', () => {
    const source=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url))).toString();
    expect(source).toContain(String.raw`| IN-H-03 | `+'`'+String.raw`\tanh x\le\frac{1}{2}`+'`');
  });
  it.each(['tanh(x)<=1/2', String.raw`\tanh x\le\frac{1}{2}`])('solves %s', input => {
    const p=parseExpression(input,'RAD');
    const r=solveInequality(p.algebrite,p.inequalityOperator!,'x');
    expect(r.resultText).toBe('x <= log(3)/2');
    expect(r.steps.at(-1)?.latex).toBe(String.raw`\left(-\infty,\frac{\ln 3}{2}\right]`);
  });
  it('includes the boundary',()=>expect(Math.tanh(Math.log(3)/2)).toBeCloseTo(0.5,14));
});
