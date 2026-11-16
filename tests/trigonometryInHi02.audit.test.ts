import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { parseExpression } from '../src/engine/parsing';
import { solveInequality } from '../src/engine/inequality';
describe('IN-HI-02',()=>{
 it('anchors source',()=>{const s=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();expect(s).toContain(String.raw`| IN-HI-02 | `+'`'+String.raw`\operatorname{arsinh} x\le 0`+'`');});
 it.each(['asinh(x)<=0',String.raw`\operatorname{arsinh} x\le 0`])('solves %s',input=>{const p=parseExpression(input,'RAD');const r=solveInequality(p.algebrite,p.inequalityOperator!,'x');expect(r.resultText).toBe('x <= 0');expect(r.steps.at(-1)?.latex).toBe(String.raw`\left(-\infty,0\right]`);});
 it('includes equality',()=>expect(Math.asinh(0)).toBe(0));
});
