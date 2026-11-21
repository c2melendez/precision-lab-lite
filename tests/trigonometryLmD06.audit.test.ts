import {describe,expect,it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {parseExpression} from '../src/engine/parsing';
import {calcLimit} from '../src/engine/stepEngine/calculus';
const source=String.raw`\lim_{x\to 0}\frac{\sec x-1}{x^{2}}`;
describe('LM-D-06',()=>{
 it('anchors the frozen row',()=>{const text=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();const row=text.split('\n').find(x=>x.includes('| LM-D-06 |'));expect(row).toContain(source);expect(row).toContain(String.raw`\frac{1}{2}`);});
 it('parses the literal',()=>{expect(parseExpression(source,'RAD').algebrite.replace(/\s+/g,'')).toContain('limit(');});
 it('computes the limit',()=>{const r=calcLimit('(sec(x)-1)/x^2','x','0',0,'both');expect(r.resultLatex).toBe(String.raw`\frac{1}{2}`);expect(r.confidence).toBe('SYMBOLIC');});
 it('connects the parsed source body to the exact engine',()=>{const p=parseExpression(String.raw`\frac{\sec x-1}{x^{2}}`,'RAD');const r=calcLimit(p.algebrite,'x','0',0,'both');expect(r.resultLatex).toBe(String.raw`\frac{1}{2}`);expect(r.confidence).toBe('SYMBOLIC');});
 it('checks independent samples on both sides',()=>{for(const x of [-.01,-.001,.001,.01])expect((1/Math.cos(x)-1)/x**2).toBeCloseTo(0.5,3);});
});
