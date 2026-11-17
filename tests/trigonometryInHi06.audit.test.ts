import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {describe,expect,it} from 'vitest';
import {parseExpression} from '../src/engine/parsing';
import {solveInequality} from '../src/engine/inequality';
describe('IN-HI-06',()=>{
 it('anchors the source',()=>{const s=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();expect(s).toContain(String.raw`| IN-HI-06 | `+'`'+String.raw`\operatorname{artanh} x<0`+'`');});
 it.each(['atanh(x)<0',String.raw`\operatorname{artanh} x<0`,'0>atanh(x)'])('solves %s',input=>{const p=parseExpression(input,'RAD');const r=solveInequality(p.algebrite,p.inequalityOperator!,'x');expect(r.resultText).toBe('-1 < x < 0');expect(r.steps.at(-1)?.latex).toBe(String.raw`\left(-1,0\right)`);});
 it('checks strict domain boundaries',()=>{expect(Math.atanh(-.5)).toBeLessThan(0);expect(Math.atanh(0)).toBe(0);expect(Number.isFinite(Math.atanh(-1))).toBe(false);});
});
