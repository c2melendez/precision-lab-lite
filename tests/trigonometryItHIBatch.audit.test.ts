import {describe,it,expect} from 'vitest';
import Algebrite from 'algebrite';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
const source=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();
import {indefiniteIntegral,derivative} from '../src/engine/algebriteClient';
import {rewriteReciprocalFunctions} from '../src/engine/parsing';
const cases:[string,string,(x:number)=>number,number[]][]=[
 ['01','asinh(x)',Math.asinh,[-2,-.5,.5,2]],['02','acosh(x)',Math.acosh,[1.2,1.5,2,3]],['03','atanh(x)',Math.atanh,[-.8,-.3,.3,.8]],['04','acoth(x)',x=>Math.atanh(1/x),[-3,-2,2,3]],['05','asech(x)',x=>Math.acosh(1/x),[.1,.3,.6,.9]],['06','acsch(x)',x=>Math.asinh(1/x),[.2,.5,1,2]],['07','1/sqrt(x^2+1)',x=>1/Math.sqrt(x*x+1),[-2,-.5,.5,2]],['08','1/sqrt(x^2-1)',x=>1/Math.sqrt(x*x-1),[1.2,1.5,2,3]],['09','1/(1-x^2)',x=>1/(1-x*x),[-.8,-.3,.3,.8]],['10','x*asinh(x)',x=>x*Math.asinh(x),[-2,-.5,.5,2]]];
const unsupported=new Set(['01','02','03','04','05','06','10']);
describe('TR324 IT-HI',()=>{it.each(cases)('matrix contains IT-HI-%s',id=>expect(source.split('\n').some(line=>line.includes(`| IT-HI-${id} |`))).toBe(true));for(const [id,expression,oracle,points] of cases)it(`IT-HI-${id}`,()=>{if(unsupported.has(id)){try{indefiniteIntegral(rewriteReciprocalFunctions(expression),'x');throw new Error('expected unsupported');}catch(error){expect(error).toMatchObject({code:'UNSUPPORTED_OPERATION'});}return;}const primitive=indefiniteIntegral(rewriteReciprocalFunctions(expression),'x');const d=derivative(primitive,'x',1);for(const x of points){const raw=Algebrite.run(`float(subst(${x},x,${d}))`).trim();expect(raw).toMatch(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?(?:\.\.\.)?$/i);expect(parseFloat(raw)).toBeCloseTo(oracle(x),5);}},20000)});
