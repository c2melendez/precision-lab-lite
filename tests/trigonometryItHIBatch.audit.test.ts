import {describe,it,expect} from 'vitest';
import Algebrite from 'algebrite';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
const source=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();
import {indefiniteIntegral,derivative} from '../src/engine/algebriteClient';
import {calcDefiniteIntegral} from '../src/engine/stepEngine/calculus';
import {rewriteReciprocalFunctions} from '../src/engine/parsing';
const cases:[string,string,(x:number)=>number,number[]][]=[
 ['01','asinh(x)',Math.asinh,[-2,-.5,.5,2]],['02','acosh(x)',Math.acosh,[1.2,1.5,2,3]],['03','atanh(x)',Math.atanh,[-.8,-.3,.3,.8]],['04','acoth(x)',x=>Math.atanh(1/x),[-3,-2,2,3]],['05','asech(x)',x=>Math.acosh(1/x),[.1,.3,.6,.9]],['06','acsch(x)',x=>Math.asinh(1/x),[-2,-1,-.2,.2,1,2]],['07','1/sqrt(x^2+1)',x=>1/Math.sqrt(x*x+1),[-2,-.5,.5,2]],['08','1/sqrt(x^2-1)',x=>1/Math.sqrt(x*x-1),[1.2,1.5,2,3]],['09','1/(1-x^2)',x=>1/(1-x*x),[-.8,-.3,.3,.8]],['10','x*asinh(x)',x=>x*Math.asinh(x),[-2,-.5,.5,2]]];
const repaired=new Set(['05','06']);
describe('TR324 IT-HI',()=>{it.each(cases)('matrix contains IT-HI-%s',id=>expect(source.split('\n').some(line=>line.includes(`| IT-HI-${id} |`))).toBe(true));for(const [id,expression,oracle,points] of cases)it(`IT-HI-${id}`,()=>{const primitive=indefiniteIntegral(rewriteReciprocalFunctions(expression),'x');if(repaired.has(id)){checkPrimitive(primitive,'x',oracle,points);return;}const d=derivative(primitive,'x',1);for(const x of points){const raw=Algebrite.run(`float(subst(${x},x,${d}))`).trim();expect(raw).toMatch(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?(?:\.\.\.)?$/i);expect(parseFloat(raw)).toBeCloseTo(oracle(x),5);}},20000)});


describe('IT-HI added primitives',()=>{
 it.each(cases.filter(([id])=>['01','02','03','04','10'].includes(id)))('IT-HI-%s matches numerical differentiation in x and y',(_id,expression,oracle,points)=>{
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
  for(const x of [-1e8,-1e6,1e6,1e8]){
   it(`IT-HI-${id} stays finite and accurate at x=${x}`,()=>{
    const primitive=indefiniteIntegral(expression,'x');
    const raw=Algebrite.run(`float(subst(${x},x,${primitive}))`).trim();
    const value=parseFloat(raw);expect(Number.isFinite(value)).toBe(true);
    expect(Math.abs((value-oracle(x))/oracle(x))).toBeLessThan(1e-9);
   });
  }
  it(`IT-HI-${id} primitive remains exact at zero`,()=>{
   const primitive=indefiniteIntegral(expression,'x');
   const value=parseFloat(Algebrite.run(`float(subst(0,x,${primitive}))`).trim());
   expect(value).toBeCloseTo(oracle(0),12);
  });
 }
 it('IT-HI-01 definite integral across a large negative interval stays finite',()=>{
  const result=calcDefiniteIntegral('asinh(x)','x',-1e8,0);
  const value=parseFloat(result.resultLatex);
  const oracle=-1-(1e8*Math.asinh(1e8)-Math.hypot(1e8,1));
  expect(Number.isFinite(value)).toBe(true);
  expect(Math.abs((value-oracle)/oracle)).toBeLessThan(1e-9);
 });
});

describe('IT-HI-04 literal matrix input',()=>{
 it('parses the source operator and integrates it on both real branches',async()=>{
  const {parseExpression}=await import('../src/engine/parsing');
  const parsed=parseExpression(String.raw`\operatorname{arcoth}\left(x\right)`,'RAD');
  const primitive=indefiniteIntegral(rewriteReciprocalFunctions(parsed.algebrite),'x');
  const h=0.001;
  for(const x of [-3,-2,2,3]){
   const value=(v:number)=>parseFloat(Algebrite.run(`float(subst(${v},x,${primitive}))`));
   expect((value(x+h)-value(x-h))/(2*h)).toBeCloseTo(Math.atanh(1/x),3);
  }
 });
});

function checkPrimitive(primitive:string, variable:string, oracle:(x:number)=>number, points:number[]){
 // Finite differences independently check the returned primitive instead of
 // asking the same CAS to symbolically differentiate its own expression.
 const value=(x:number)=>{
  const raw=Algebrite.run(`float(subst(${x},${variable},${primitive}))`).trim();
  expect(raw).toMatch(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?(?:\.\.\.)?$/i);
  return parseFloat(raw);
 };
 for(const x of points){
  const h=0.002;
  expect((value(x+h)-value(x-h))/(2*h)).toBeCloseTo(oracle(x),3);
 }
}

describe('TR324 reciprocal inverse hyperbolic real branches',()=>{
 it.each(cases.filter(([id])=>repaired.has(id)))('IT-HI-%s selected variable y',(_id,expression,oracle,points)=>{
  checkPrimitive(indefiniteIntegral(rewriteReciprocalFunctions(expression.replace(/\bx\b/g,'y')),'y'),'y',oracle,points);
 });
 it('IT-HI-05 convergent improper lower endpoint',()=>{
  expect(Number(calcDefiniteIntegral('asech(x)','x',0,1).resultLatex)).toBeCloseTo(Math.PI/2,10);
 });
 it('IT-HI-06 split at zero, not a principal value',()=>{
  const F=(t:number)=>t*Math.asinh(1/t)+Math.asinh(Math.abs(t));
  expect(Number(calcDefiniteIntegral('acsch(x)','x',-1,2).resultLatex)).toBeCloseTo(F(2)-F(-1),10);
  expect(Number(calcDefiniteIntegral('acsch(x)','x',2,-1).resultLatex)).toBeCloseTo(F(-1)-F(2),10);
 });
 it.each(['arcsec(x)','arccsc(x)','1/(x*sqrt(x^2-1))','asech(x)'])('rejects nonreal interval for %s',expression=>{
  expect(()=>calcDefiniteIntegral(expression,'x',-2,2)).toThrow(expect.objectContaining({code:'DOMAIN_ERROR'}));
 });
});
