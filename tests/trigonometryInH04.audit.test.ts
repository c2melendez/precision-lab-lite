import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { parseExpression } from '../src/engine/parsing';
import { solveInequality } from '../src/engine/inequality';
describe('IN-H-04', () => {
  it('anchors source',()=>{const s=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();expect(s).toContain(String.raw`| IN-H-04 | `+'`'+String.raw`\sinh x<-1`+'`');});
  it.each(['sinh(x)<-1',String.raw`\sinh x<-1`])('solves %s',input=>{const p=parseExpression(input,'RAD');const r=solveInequality(p.algebrite,p.inequalityOperator!,'x');expect(r.resultText).toBe('x < -log(1+sqrt(2))');expect(r.steps.at(-1)?.latex).toBe(String.raw`\left(-\infty,-\ln(1+\sqrt{2})\right)`);});
  it('excludes boundary',()=>expect(Math.sinh(-Math.log(1+Math.sqrt(2)))).toBeCloseTo(-1,14));
});
