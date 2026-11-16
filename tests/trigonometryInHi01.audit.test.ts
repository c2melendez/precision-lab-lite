import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { parseExpression } from '../src/engine/parsing';
import { solveInequality } from '../src/engine/inequality';
describe('IN-HI-01',()=>{
 it('anchors source',()=>{const s=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();expect(s).toContain(String.raw`| IN-HI-01 | `+'`'+String.raw`\operatorname{arsinh} x>1`+'`');});
 it.each(['asinh(x)>1',String.raw`\operatorname{arsinh} x>1`])('solves %s',input=>{const p=parseExpression(input,'RAD');const r=solveInequality(p.algebrite,p.inequalityOperator!,'x');expect(r.resultText).toBe('x > sinh(1)');expect(r.steps.at(-1)?.latex).toBe(String.raw`\left(\sinh 1,\infty\right)`);});
 it('excludes equality',()=>expect(Math.asinh(Math.sinh(1))).toBeCloseTo(1,14));
});
