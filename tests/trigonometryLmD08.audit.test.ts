import {describe,expect,it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {parseExpression} from '../src/engine/parsing';
import {calcLimit} from '../src/engine/stepEngine/calculus';
const source=String.raw`\lim_{x\to 0}x\cot x`;
describe('LM-D-08',()=>{
 it('anchors the frozen row',()=>{const text=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();const row=text.split('\n').find(x=>x.includes('| LM-D-08 |'));expect(row).toContain(source);expect(row).toContain(String.raw`1`);});
 it('parses the literal',()=>{expect(parseExpression(source,'RAD').algebrite.replace(/\s+/g,'')).toContain('limit(');});
 it('computes the limit',()=>{const r=calcLimit('x*cot(x)','x','0',0,'both');expect(r.resultLatex).toBe(String.raw`1`);expect(r.confidence).toBe('SYMBOLIC');});
 it('connects the parsed source body to the exact engine',()=>{const p=parseExpression(String.raw`x\cot x`,'RAD');const r=calcLimit(p.algebrite,'x','0',0,'both');expect(r.resultLatex).toBe(String.raw`1`);expect(r.confidence).toBe('SYMBOLIC');});
 it('checks independent samples on both sides',()=>{for(const x of [-.01,-.001,.001,.01])expect(x*Math.cos(x)/Math.sin(x)).toBeCloseTo(1,3);});
});
