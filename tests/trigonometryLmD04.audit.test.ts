import {describe,expect,it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {parseExpression} from '../src/engine/parsing';
import {calcLimit} from '../src/engine/stepEngine/calculus';
const source=String.raw`\lim_{x\to 0}\frac{\sin 3x}{\sin 5x}`;
describe('LM-D-04',()=>{
 it('anchors the frozen row',()=>{const text=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();const row=text.split('\n').find(x=>x.includes('| LM-D-04 |'));expect(row).toContain(source);expect(row).toContain(String.raw`\frac{3}{5}`);});
 it('parses the literal',()=>{expect(parseExpression(source,'RAD').algebrite.replace(/\s+/g,'')).toContain('limit(');});
 it('computes the limit',()=>{const r=calcLimit('sin(3*x)/sin(5*x)','x','0',0,'both');expect(r.resultLatex).toBe(String.raw`\frac{3}{5}`);expect(r.confidence).toBe('SYMBOLIC');});
 it('connects the parsed source body to the exact engine',()=>{const p=parseExpression(String.raw`\frac{\sin 3x}{\sin 5x}`,'RAD');const r=calcLimit(p.algebrite,'x','0',0,'both');expect(r.resultLatex).toBe(String.raw`\frac{3}{5}`);expect(r.confidence).toBe('SYMBOLIC');});
 it('checks independent samples on both sides',()=>{for(const x of [-.001,-.0001,.0001,.001])expect(Math.sin(3*x)/Math.sin(5*x)).toBeCloseTo(0.6,4);});
});
