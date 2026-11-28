import {describe,it,expect} from 'vitest';
import Algebrite from 'algebrite';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcDefiniteIntegral} from '../src/engine/stepEngine/calculus';
import {parseExpression} from '../src/engine/parsing';
type Row = {id:string; literal:string; source_expected:string; expression:string;
 lower:string; upper:string; exact_oracle:string; numeric_oracle:number; capability?:string};
const rows:Row[]=JSON.parse(readFileSync(new URL('../qa/certification/tr324_definite_integrals.json',import.meta.url),'utf8'));
const source=gunzipSync(readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz',import.meta.url))).toString();
const bound=(s:string):number=> {
 const values:Record<string,number>={'pi':Math.PI,'-pi':-Math.PI,'pi/2':Math.PI/2,'pi/3':Math.PI/3,'pi/4':Math.PI/4,'pi/6':Math.PI/6,'1/2':.5,'ln(2)':Math.log(2)};
 return Object.prototype.hasOwnProperty.call(values,s)?values[s]:Number(s);
};
const real=(s:string):number=>{
 const raw=s.trim().replace(/\.\.\.$/,'');
 if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(raw)) return Number(raw);
 const evaluated=Algebrite.run('float('+raw+')').trim().replace(/\.\.\.$/,'');
 expect(evaluated).toMatch(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i);
 return Number(evaluated);
};
function anchor(row:Row){
 const literal=source.split('\n').find(line=>line.startsWith('| '+row.id+' |'));
 const q=String.fromCharCode(96);
 expect(literal).toContain(q+row.literal+q);
 expect(literal).toContain(q+row.source_expected+q);
}
describe('TR324 definite integrals numeric observation',()=>{
 for(const row of rows){
  if(row.capability){
   it(row.id+' [capability-negative] infinite literal bound rejected',()=>{
    anchor(row);
    const operand=parseExpression(row.expression,'RAD').algebrite;
    expect(()=>calcDefiniteIntegral('defintegral('+operand+',0,oo,x)','x',0,1)).toThrow(expect.objectContaining({code:'UNSUPPORTED_OPERATION'}));
   });
  }else{
   it(row.id+' real definite value',()=>{
    anchor(row);
    const operand=parseExpression(row.expression,'RAD').algebrite;
    const result=calcDefiniteIntegral(operand,'x',bound(row.lower),bound(row.upper));
    const v=real(result.resultLatex);
    expect(Number.isFinite(v)).toBe(true);
    expect(Math.abs(v-row.numeric_oracle)).toBeLessThanOrEqual(1e-6);
   },20000);
  }
 }
 it('frozen decimal discrepancy retained',()=>{
  const row=rows.find(r=>r.id==='ID-HI-08')!;
  expect(row.source_expected).toContain('0.307426799');
  expect(row.numeric_oracle).toBeCloseTo(0.30747679967138351,14);
  expect(Math.abs(row.numeric_oracle-0.307426799)).toBeGreaterThan(0.00005);
 });
});

describe('ID-D-12 improper logarithmic integral controls',()=>{
 it('ID-D-12 reversed, full interval and selected variable',()=>{
  const operand=parseExpression('ln(sin(y))','RAD').algebrite;
  expect(real(calcDefiniteIntegral(operand,'y',Math.PI/2,0).resultLatex)).toBeCloseTo(Math.PI*Math.LN2/2,12);
  expect(real(calcDefiniteIntegral(operand,'y',0,Math.PI).resultLatex)).toBeCloseTo(-Math.PI*Math.LN2,12);
  expect(real(calcDefiniteIntegral(operand,'y',Math.PI/2,Math.PI).resultLatex)).toBeCloseTo(-Math.PI*Math.LN2/2,12);
 });
 it('base ten is not the natural-log identity',()=>{
  const operand=parseExpression('log(sin(x))','RAD').algebrite;
  expect(operand).not.toBe(parseExpression('ln(sin(x))','RAD').algebrite);
 });
});
