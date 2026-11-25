import {describe,it,expect} from 'vitest';
import Algebrite from 'algebrite';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
const source = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();
import {indefiniteIntegral,derivative} from '../src/engine/algebriteClient';
import {rewriteReciprocalFunctions} from '../src/engine/parsing';
const cases:[string,string,(x:number)=>number][]=[
['01','sinh(x)',Math.sinh],['02','cosh(x)',Math.cosh],['03','tanh(x)',Math.tanh],['04','coth(x)',x=>1/Math.tanh(x)],['05','sech(x)^2',x=>1/Math.cosh(x)**2],['06','csch(x)^2',x=>1/Math.sinh(x)**2],['07','sech(x)',x=>1/Math.cosh(x)],['08','csch(x)',x=>1/Math.sinh(x)],['09','sech(x)*tanh(x)',x=>Math.tanh(x)/Math.cosh(x)],['10','csch(x)*coth(x)',x=>Math.cosh(x)/Math.sinh(x)**2],['11','sinh(x)^2',x=>Math.sinh(x)**2],['12','cosh(x)^2',x=>Math.cosh(x)**2],['13','tanh(x)^2',x=>Math.tanh(x)**2],['14','x*sinh(x)',x=>x*Math.sinh(x)],['15','sinh(x)*cosh(x)',x=>Math.sinh(x)*Math.cosh(x)],['16','exp(x)*cosh(x)',x=>Math.exp(x)*Math.cosh(x)]];
const unresolved = new Set(['04','08']);
describe('IT-H',()=>{it.each(cases)('source contains IT-H-%s',id=>{expect(source.split('\n').some(line=>line.includes(`| IT-H-${id} |`))).toBe(true)});for(const [id,expression,oracle] of cases)(unresolved.has(id) ? it.fails : it)(`IT-H-${id}`,()=>{expect(source.split('\n').some(line=>line.includes(`| IT-H-${id} |`))).toBe(true);const result=indefiniteIntegral(rewriteReciprocalFunctions(expression),'x');const d=derivative(result,'x',1);for(const x of [-1.1,-.6,.6,1.1]){const raw=Algebrite.run(`float(subst(${x},x,${d}))`).trim();expect(raw).toMatch(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?(?:\.\.\.)?$/i);expect(parseFloat(raw)).toBeCloseTo(oracle(x),5)}},20000)});


describe('IT-H elementary rules use the requested variable',()=>{
 const covered = new Set(['05','06','07','09','10','15','16']);
 it.each(cases.filter(([id])=>covered.has(id)))('IT-H-%s variable y',(_id,expression,oracle)=>{
  const input = expression.replace(/\bx\b/g,'y');
  const primitive = indefiniteIntegral(rewriteReciprocalFunctions(input),'y');
  const d = derivative(primitive,'y',1);
  for (const y of [-.7,.7]) {
   const raw = Algebrite.run(`float(subst(${y},y,${d}))`).trim();
   expect(raw).toMatch(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?(?:\.\.\.)?$/i);
   expect(parseFloat(raw)).toBeCloseTo(oracle(y),5);
  }
 });
});
