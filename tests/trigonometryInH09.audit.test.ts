import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { parseExpression } from '../src/engine/parsing';
import { solveInequality } from '../src/engine/inequality';
describe('IN-H-09',()=>{
 it('anchors source',()=>{const s=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();expect(s).toContain(String.raw`| IN-H-09 | `+'`'+String.raw`\cosh x<1`+'`');});
 it.each(['cosh(x)<1',String.raw`\cosh x<1`])('solves %s',input=>{const p=parseExpression(input,'RAD');const r=solveInequality(p.algebrite,p.inequalityOperator!,'x');expect(r.resultText).toBe('∅');expect(r.steps.at(-1)?.latex).toBe(String.raw`\varnothing`);});
 it('excludes equality',()=>expect(Math.cosh(0)).toBe(1));
});
