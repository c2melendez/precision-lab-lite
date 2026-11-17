import {describe,expect,it} from 'vitest';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {parseExpression} from '../src/engine/parsing';
import {calcLimit} from '../src/engine/stepEngine/calculus';
const source=String.raw`\\lim_{x\\to 0}\\frac{\\tan x}{x}`;
describe('LM-D-03',()=>{
 it('anchors the frozen row',()=>{const text=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();const row=text.split('\\n').find(x=>x.includes('| LM-D-03 |'));expect(row).toContain(source);expect(row).toContain('1');});
 it('parses the literal',()=>{expect(parseExpression(source,'RAD').algebrite.replace(/\\s+/g,'')).toMatch(/^limit\\(/);});
 it('computes the limit',()=>{const r=calcLimit('tan(x)/x','x','0',0,'both');expect(r.resultLatex).toBe('1');expect(r.confidence).toBe('SYMBOLIC');});
 it('connects the parsed source body to the exact engine',()=>{const p=parseExpression(String.raw`\\frac{\\tan x}{x}`,'RAD');const r=calcLimit(p.algebrite,'x','0',0,'both');expect(r.resultLatex).toBe('1');expect(r.confidence).toBe('SYMBOLIC');});
 it('checks the independent small-angle approximation on both sides',()=>{for(const x of [-.1,-.01,.01,.1])expect(Math.tan(x)/x).toBeCloseTo(1,3);});
});
