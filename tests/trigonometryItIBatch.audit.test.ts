import {describe,it,expect} from 'vitest';
import Algebrite from 'algebrite';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
const source=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();
import {indefiniteIntegral,derivative} from '../src/engine/algebriteClient';
import {rewriteReciprocalFunctions} from '../src/engine/parsing';
const cases:[string,string,(x:number)=>number,number[]][]=[
 ['01','arcsin(x)',Math.asin,[-.8,-.3,.3,.8]],['02','arccos(x)',Math.acos,[-.8,-.3,.3,.8]],['03','arctan(x)',Math.atan,[-.8,-.3,.3,.8]],
 ['04','arccot(x)',x=>Math.PI/2-Math.atan(x),[-.8,-.3,.3,.8]],['05','arcsec(x)',x=>Math.acos(1/x),[1.2,1.5,2,3]],['06','arccsc(x)',x=>Math.asin(1/x),[1.2,1.5,2,3]],
 ['07','x*arctan(x)',x=>x*Math.atan(x),[-.8,-.3,.3,.8]],['08','arcsin(x)/sqrt(1-x^2)',x=>Math.asin(x)/Math.sqrt(1-x*x),[-.8,-.3,.3,.8]],['09','1/(1+x^2)',x=>1/(1+x*x),[-.8,-.3,.3,.8]],['10','1/sqrt(1-x^2)',x=>1/Math.sqrt(1-x*x),[-.8,-.3,.3,.8]],['11','1/(x*sqrt(x^2-1))',x=>1/(x*Math.sqrt(x*x-1)),[1.2,1.5,2,3]]];
const unresolved=new Set(['05','06','11']);
describe('TR324 IT-I',()=>{it.each(cases)('matrix contains IT-I-%s',id=>expect(source.split('\n').some(line=>line.includes(`| IT-I-${id} |`))).toBe(true));for(const [id,expression,oracle,points] of cases)(unresolved.has(id)?it.fails:it)(`IT-I-${id}`,()=>{const primitive=indefiniteIntegral(rewriteReciprocalFunctions(expression),'x');const d=derivative(primitive,'x',1);for(const x of points){const raw=Algebrite.run(`float(subst(${x},x,${d}))`).trim();expect(raw).toMatch(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?(?:\.\.\.)?$/i);expect(parseFloat(raw)).toBeCloseTo(oracle(x),5);}},20000)});

describe('IT-I added rules use the selected variable',()=>{
 it.each(cases.filter(([id])=>['07','08'].includes(id)))('IT-I-%s uses y',(_id,expression,oracle,points)=>{
  const primitive=indefiniteIntegral(rewriteReciprocalFunctions(expression.replace(/\bx\b/g,'y')),'y');
  const d=derivative(primitive,'y',1);
  for(const y of points){const raw=Algebrite.run(`float(subst(${y},y,${d}))`).trim();expect(raw).toMatch(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?(?:\.\.\.)?$/i);expect(parseFloat(raw)).toBeCloseTo(oracle(y),5);}
 });
});
