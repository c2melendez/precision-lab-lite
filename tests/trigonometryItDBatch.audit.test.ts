import {describe, expect, it} from 'vitest';
import Algebrite from 'algebrite';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {derivative, indefiniteIntegral} from '../src/engine/algebriteClient';
import {rewriteReciprocalFunctions} from '../src/engine/parsing';

function realNumber(value: string): number {
 const text = value.trim();
 if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?(?:\.\.\.)?$/i.test(text)) throw new Error(`Not a real number: ${text}`);
 return parseFloat(text);
}

const source = gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();
const rows: [string,string,(x:number)=>number][] = [
 ['IT-D-01','sin(x)',Math.sin], ['IT-D-02','cos(x)',Math.cos],
 ['IT-D-03','sec(x)^2',x=>1/Math.cos(x)**2], ['IT-D-04','csc(x)^2',x=>1/Math.sin(x)**2],
 ['IT-D-05','sec(x)*tan(x)',x=>Math.tan(x)/Math.cos(x)], ['IT-D-06','csc(x)*cot(x)',x=>Math.cos(x)/Math.sin(x)**2],
 ['IT-D-07','tan(x)',Math.tan], ['IT-D-08','cot(x)',x=>1/Math.tan(x)],
 ['IT-D-09','sec(x)',x=>1/Math.cos(x)], ['IT-D-10','csc(x)',x=>1/Math.sin(x)],
 ['IT-D-11','sin(x)^2',x=>Math.sin(x)**2], ['IT-D-12','sin(x)^3',x=>Math.sin(x)**3],
 ['IT-D-13','tan(x)^2',x=>Math.tan(x)**2], ['IT-D-14','sec(x)^3',x=>1/Math.cos(x)**3],
 ['IT-D-15','x*cos(x)',x=>x*Math.cos(x)], ['IT-D-16','exp(x)*sin(x)',x=>Math.exp(x)*Math.sin(x)],
 ['IT-D-17','sin(3*x)',x=>Math.sin(3*x)], ['IT-D-18','cos(x)/(1+sin(x)^2)',x=>Math.cos(x)/(1+Math.sin(x)**2)],
];
describe('TR324 IT-D antiderivatives',()=>{
 it.each(['1+2*i', '1+x', '1/0', ''])('rejects a non-real or non-numeric oracle value %s', value => {
  expect(() => realNumber(value)).toThrow();
 });
 const unresolved = new Set<string>([]);
 for(const [id, expression, oracle] of rows) (unresolved.has(id) ? it.fails : it)(`${id} differentiates back to its integrand`, ()=>{
  expect(source.split('\n').some(line=>line.includes(`| ${id} |`))).toBe(true);
  const result = indefiniteIntegral(rewriteReciprocalFunctions(expression),'x');
  const d = derivative(result,'x',1);
  for(const x of [-1.1,-.6,.6,1.1]){
   const value = realNumber(Algebrite.run(`float(subst(${x},x,${d}))`));
   expect(Number.isFinite(value)).toBe(true);
   expect(value).toBeCloseTo(oracle(x),5);
  }
 },20000);
 it.each(rows.filter(([id])=>['IT-D-05','IT-D-13','IT-D-16','IT-D-18'].includes(id)))('%s also supports a different variable', (_id, expression, oracle)=>{
  const yExpression = expression.replace(/\bx\b/g,'y');
  const result = indefiniteIntegral(rewriteReciprocalFunctions(yExpression),'y');
  const d = derivative(result,'y',1);
  for(const y of [-.6,.6]){
   const value = realNumber(Algebrite.run(`float(subst(${y},y,${d}))`));
   expect(value).toBeCloseTo(oracle(y),5);
  }
 });
});
