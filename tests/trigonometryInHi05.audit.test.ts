import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {describe,expect,it} from 'vitest';
import {parseExpression} from '../src/engine/parsing';
import {solveInequality} from '../src/engine/inequality';
describe('IN-HI-05',()=>{
 it('anchors the source',()=>{const s=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();expect(s).toContain(String.raw`| IN-HI-05 | `+'`'+String.raw`\operatorname{artanh} x\ge\frac{1}{2}\ln 3`+'`');});
 it.each(['atanh(x)>=ln(3)/2',String.raw`\operatorname{artanh} x\ge\frac{1}{2}\ln 3`])('solves %s',input=>{const p=parseExpression(input,'RAD');const r=solveInequality(p.algebrite,p.inequalityOperator!,'x');expect(r.resultText).toBe('1/2 <= x < 1');expect(r.steps.at(-1)?.latex).toBe(String.raw`\left[\frac{1}{2},1\right)`);});
 it('checks domain and boundary',()=>{expect(Math.atanh(.5)).toBeCloseTo(Math.log(3)/2,14);expect(Number.isFinite(Math.atanh(1))).toBe(false);});
});
