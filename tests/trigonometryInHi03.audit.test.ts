import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { parseExpression } from '../src/engine/parsing';
import { solveInequality } from '../src/engine/inequality';
describe('IN-HI-03',()=>{
 it('anchors source',()=>{const s=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();expect(s).toContain(String.raw`| IN-HI-03 | `+'`'+String.raw`\operatorname{arcosh} x<1`+'`');});
 it.each(['acosh(x)<1',String.raw`\operatorname{arcosh} x<1`])('solves %s',input=>{const p=parseExpression(input,'RAD');const r=solveInequality(p.algebrite,p.inequalityOperator!,'x');expect(r.resultText).toBe('1 <= x < cosh(1)');expect(r.steps.at(-1)?.latex).toBe(String.raw`\left[1,\cosh 1\right)`);});
 it('checks boundaries',()=>{expect(Math.acosh(1)).toBe(0);expect(Math.acosh(Math.cosh(1))).toBeCloseTo(1,14);expect(Number.isNaN(Math.acosh(.9))).toBe(true);});
});
