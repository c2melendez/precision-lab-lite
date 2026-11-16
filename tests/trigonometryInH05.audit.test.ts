import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { parseExpression } from '../src/engine/parsing';
import { solveInequality } from '../src/engine/inequality';
describe('IN-H-05',()=>{
  it('anchors source',()=>{const s=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();expect(s).toContain(String.raw`| IN-H-05 | `+'`'+String.raw`\sinh x\cosh x>0`+'`');});
  it.each(['sinh(x)*cosh(x)>0',String.raw`\sinh x\cosh x>0`])('solves %s',input=>{const p=parseExpression(input,'RAD');const r=solveInequality(p.algebrite,p.inequalityOperator!,'x');expect(r.resultText).toBe('x > 0');expect(r.steps.at(-1)?.latex).toBe(String.raw`\left(0,\infty\right)`);});
  it('has the same sign as sinh',()=>{expect(Math.sinh(-1)*Math.cosh(-1)).toBeLessThan(0);expect(Math.sinh(0)*Math.cosh(0)).toBe(0);expect(Math.sinh(1)*Math.cosh(1)).toBeGreaterThan(0);});
});
