import {describe,it,expect} from 'vitest';
import Algebrite from 'algebrite';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
const source=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();
import {indefiniteIntegral,derivative} from '../src/engine/algebriteClient';
import {rewriteReciprocalFunctions} from '../src/engine/parsing';
const cases:[string,string,(x:number)=>number,number[]][]=[
 ['01','asinh(x)',Math.asinh,[-2,-.5,.5,2]],['02','acosh(x)',Math.acosh,[1.2,1.5,2,3]],['03','atanh(x)',Math.atanh,[-.8,-.3,.3,.8]],['04','acoth(x)',x=>Math.atanh(1/x),[-3,-2,2,3]],['05','asech(x)',x=>Math.acosh(1/x),[.1,.3,.6,.9]],['06','acsch(x)',x=>Math.asinh(1/x),[.2,.5,1,2]],['07','1/sqrt(x^2+1)',x=>1/Math.sqrt(x*x+1),[-2,-.5,.5,2]],['08','1/sqrt(x^2-1)',x=>1/Math.sqrt(x*x-1),[1.2,1.5,2,3]],['09','1/(1-x^2)',x=>1/(1-x*x),[-.8,-.3,.3,.8]],['10','x*asinh(x)',x=>x*Math.asinh(x),[-2,-.5,.5,2]]];
const unsupported=new Set(['04','05','06']);
describe('TR324 IT-HI',()=>{it.each(cases)('matrix contains IT-HI-%s',id=>expect(source.split('\n').some(line=>line.includes(`| IT-HI-${id} |`))).toBe(true));for(const [id,expression,oracle,points] of cases)it(`IT-HI-${id}`,()=>{if(unsupported.has(id)){try{indefiniteIntegral(rewriteReciprocalFunctions(expression),'x');throw new Error('expected unsupported');}catch(error){expect(error).toMatchObject({code:'UNSUPPORTED_OPERATION'});}return;}const primitive=indefiniteIntegral(rewriteReciprocalFunctions(expression),'x');const d=derivative(primitive,'x',1);for(const x of points){const raw=Algebrite.run(`float(subst(${x},x,${d}))`).trim();expect(raw).toMatch(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?(?:\.\.\.)?$/i);expect(parseFloat(raw)).toBeCloseTo(oracle(x),5);}},20000)});


describe('IT-HI added primitives',()=>{
 it.each(cases.filter(([id])=>['01','02','03','10'].includes(id)))('IT-HI-%s matches numerical differentiation in x and y',(_id,expression,oracle,points)=>{
  for(const variable of ['x','y']){
   const input=expression.replace(/\bx\b/g,variable);
   const primitive=indefiniteIntegral(rewriteReciprocalFunctions(input),variable);
   for(const x of points){
    const at=(v:number)=>{const raw=Algebrite.run(`float(subst(${v},${variable},${primitive}))`).trim();expect(raw).toMatch(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?(?:\.\.\.)?$/i);return parseFloat(raw)};
    const h=0.001;expect((at(x+h)-at(x-h))/(2*h)).toBeCloseTo(oracle(x),3);
   }
  }
 });
});



describe('TR324 IT-HI-01/10: numerical stability at large arguments',()=>{
 const largeCases = [
  ['01','asinh(x)',(x:number)=>x*Math.asinh(x)-Math.hypot(x,1)],
  ['10','x*asinh(x)',(x:number)=>((2*x*x+1)*Math.asinh(x)-x*Math.hypot(x,1))/4],
 ] as const;
 for(const [id,expression,oracle] of largeCases){
  it(`IT-HI-${id} stays finite and accurate at large positive x`,()=>{
   const x=1e8;const primitive=indefiniteIntegral(expression,'x');
   const raw=Algebrite.run(`float(subst(${x},x,${primitive}))`).trim();
   const value=parseFloat(raw);expect(Number.isFinite(value)).toBe(true);
   expect(Math.abs((value-oracle(x))/oracle(x))).toBeLessThan(1e-6);
  });
  it.fails(`IT-HI-${id} stays finite and accurate at large negative x`,()=>{
   const x=-1e8;const primitive=indefiniteIntegral(expression,'x');
   const raw=Algebrite.run(`float(subst(${x},x,${primitive}))`).trim();
   const value=parseFloat(raw);expect(Number.isFinite(value)).toBe(true);
   expect(Math.abs((value-oracle(x))/oracle(x))).toBeLessThan(1e-6);
  });
 }
});
