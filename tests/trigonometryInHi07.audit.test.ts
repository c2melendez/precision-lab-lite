import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {describe,expect,it} from 'vitest';
import {parseExpression} from '../src/engine/parsing';
import {solveInequality} from '../src/engine/inequality';
describe('IN-HI-07',()=>{
 it('anchors source',()=>{const s=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();expect(s).toContain(String.raw`| IN-HI-07 | `+'`'+String.raw`\operatorname{arcoth} x>\ln 2`+'`');});
 it.each(['acoth(x)>ln(2)',String.raw`\operatorname{arcoth} x>\ln 2`])('solves %s',input=>{const p=parseExpression(input,'RAD');const r=solveInequality(p.algebrite,p.inequalityOperator!,'x');expect(r.resultText).toBe('1 < x < 5/3');expect(r.steps.at(-1)?.latex).toBe(String.raw`\left(1,\frac{5}{3}\right)`);});
 it('checks boundaries independently',()=>{expect(Math.atanh(3/5)).toBeCloseTo(Math.log(2),14);expect(Number.isFinite(Math.atanh(1))).toBe(false);expect(Math.atanh(1/1.5)).toBeGreaterThan(Math.log(2));});
});
