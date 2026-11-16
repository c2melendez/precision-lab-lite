import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { parseExpression } from '../src/engine/parsing';
import { solveInequality } from '../src/engine/inequality';
describe('IN-H-07',()=>{
 it('anchors source row',()=>{const s=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();expect(s).toContain(String.raw`| IN-H-07 | `+'`'+String.raw`\operatorname{sech} x>\frac{1}{2}`+'`');});
 it.each(['sech(x)>1/2',String.raw`\operatorname{sech} x>\frac{1}{2}`])('solves %s', input=>{const p=parseExpression(input,'RAD');const r=solveInequality(p.algebrite,p.inequalityOperator!,'x');expect(r.resultText).toBe('-log(2+sqrt(3)) < x < log(2+sqrt(3))');});
 it('excludes boundaries',()=>{const b=Math.log(2+Math.sqrt(3));expect(1/Math.cosh(b)).toBeCloseTo(.5,14);});
});
